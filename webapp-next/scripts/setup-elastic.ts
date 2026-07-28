/**
 * Initialisation automatique de l'environnement Elasticsearch CM2D.
 *
 * Provisionne, de façon idempotente, tout ce que le README décrivait
 * manuellement (Dev Tools + interface Kibana) :
 *   1. Index `cm2d_certificate` (mapping de référence, department = keyword)
 *   2. Index `cm2d_users`
 *   3. Les 19 rôles de région (source : utils/regions.ts)
 *   4. Les 5 transforms continus (créés puis démarrés)
 *   5. Le mot de passe de l'utilisateur `kibana_system`
 *   6. La copie du certificat ca.crt vers webapp-next/certs/ca (best-effort)
 *
 * Usage :
 *   yarn setup:elastic            # crée ce qui manque, laisse l'existant
 *   yarn setup:elastic --reset    # SUPPRIME puis recrée tout (données incluses)
 *
 * Connexion : ELASTIC_HOST / ELASTIC_USERNAME / ELASTIC_PASSWORD (+ KIBANA_PASSWORD)
 * lus depuis webapp-next/.env puis ../.env. TLS auto-signé accepté
 * (rejectUnauthorized: false), aucun certificat requis pour ce script.
 */
import { Client } from '@elastic/elasticsearch';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { ALL_REGION_ROLES } from '../utils/regions';

// --- Configuration ---------------------------------------------------------

// Charge d'abord le .env de la webapp (source des ELASTIC_*), puis celui de la
// racine (source de KIBANA_PASSWORD). dotenv n'écrase pas les variables déjà
// définies : le premier fichier chargé a donc la priorité.
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const ELASTIC_HOST = process.env.ELASTIC_HOST || 'https://localhost:9200';
const ELASTIC_USERNAME = process.env.ELASTIC_USERNAME || 'elastic';
const ELASTIC_PASSWORD = process.env.ELASTIC_PASSWORD || 'elastic_password';
const KIBANA_PASSWORD = process.env.KIBANA_PASSWORD || 'kibana_password';
const ES_CONTAINER = process.env.ES_CONTAINER || 'elasticsearch';

const RESET = process.argv.includes('--reset');

const CERTIFICATE_INDEX = 'cm2d_certificate';
const USERS_INDEX = 'cm2d_users';

// Utilisateur de test (DEV/LOCAL uniquement) pour se connecter à l'application.
// username == email : requis par pages/api/auth/user.ts qui indexe les rôles
// par email. Rôles : `viewer` (lecture des index cm2d_*) + `region-france-entiere`
// (accès national/toutes régions dans l'UI).
const TEST_USER = 'user@test.loc';
const TEST_PASSWORD = 'user123';
const TEST_USER_ROLES = ['viewer', 'region-france-entiere'];

const client = new Client({
  node: ELASTIC_HOST,
  auth: { username: ELASTIC_USERNAME, password: ELASTIC_PASSWORD },
  tls: { rejectUnauthorized: false },
});

// --- Définitions -----------------------------------------------------------

// Mapping de référence pour cm2d_certificate. `department` / `home_department`
// sont des `keyword` (codes non numériques : DROM "971", Corse "2A"/"2B",
// zéro initial "02"). `@timestamp` est requis par les transforms continus.
const CERTIFICATE_MAPPING = {
  _meta: { created_by: 'cm2d-setup-script' },
  properties: {
    '@timestamp': { type: 'date' },
    date: { type: 'date', format: 'iso8601' },
    age: { type: 'long' },
    sex: { type: 'keyword' },
    kind: { type: 'keyword' },
    death_location: { type: 'keyword' },
    department: { type: 'keyword' },
    home_department: { type: 'keyword' },
    categories_level_1: { type: 'keyword' },
    categories_level_2: { type: 'keyword' },
    categories_associate: { type: 'keyword' },
    home_location: { type: 'keyword' },
    coordinates: { type: 'keyword' },
  },
} as const;

const USERS_MAPPING = {
  properties: {
    username: { type: 'text' },
    versionCGU: { type: 'text' },
  },
} as const;

// Les 5 transforms continus décrits dans le README.
// `pivot` : agrégation par catégorie. `latest` : dernière valeur par clé.
const SYNC = { time: { field: '@timestamp', delay: '60s' } };

type TransformDef = {
  id: string;
  description: string;
  dest: string;
  body: Record<string, any>;
};

const pivotCount = (id: string, description: string, field: string): TransformDef => ({
  id,
  description,
  dest: id,
  body: {
    source: { index: CERTIFICATE_INDEX },
    dest: { index: id },
    pivot: {
      group_by: { [field]: { terms: { field } } },
      aggregations: { '@timestamp.value_count': { value_count: { field: '@timestamp' } } },
    },
    sync: SYNC,
    description,
  },
});

const latestBy = (id: string, description: string, key: string): TransformDef => ({
  id,
  description,
  dest: id,
  body: {
    source: { index: CERTIFICATE_INDEX },
    dest: { index: id },
    latest: { unique_key: [key], sort: 'date' },
    sync: SYNC,
    description,
  },
});

const TRANSFORMS: TransformDef[] = [
  pivotCount('cm2d_level_1_categories', 'Available causes', 'categories_level_1'),
  pivotCount('cm2d_associate_categories', 'Available associate causes', 'categories_associate'),
  latestBy('cm2d_death_locations', 'Available death locations', 'death_location'),
  latestBy('cm2d_sexes', 'Available sexes', 'sex'),
  latestBy('cm2d_departments', 'Available departments', 'department'),
];

// --- Utilitaires -----------------------------------------------------------

const log = (msg: string) => console.log(msg);
const ok = (msg: string) => console.log(`  ✓ ${msg}`);
const skip = (msg: string) => console.log(`  – ${msg} (existe déjà)`);
const warn = (msg: string) => console.warn(`  ⚠ ${msg}`);

function is404(err: any): boolean {
  return err?.meta?.statusCode === 404 || err?.statusCode === 404;
}

async function indexExists(index: string): Promise<boolean> {
  return client.indices.exists({ index });
}

async function roleExists(name: string): Promise<boolean> {
  try {
    await client.security.getRole({ name });
    return true;
  } catch (err) {
    if (is404(err)) return false;
    throw err;
  }
}

async function userExists(username: string): Promise<boolean> {
  try {
    await client.security.getUser({ username });
    return true;
  } catch (err) {
    if (is404(err)) return false;
    throw err;
  }
}

async function transformExists(id: string): Promise<boolean> {
  try {
    await client.transform.getTransform({ transform_id: id });
    return true;
  } catch (err) {
    if (is404(err)) return false;
    throw err;
  }
}

// --- Étapes ----------------------------------------------------------------

async function reset() {
  log('\n[--reset] Suppression des ressources existantes…');

  // Transforms : arrêter (force) puis supprimer. Leurs index de destination
  // aussi, pour repartir d'un état propre.
  for (const t of TRANSFORMS) {
    try {
      await client.transform.stopTransform({
        transform_id: t.id,
        force: true,
        wait_for_completion: true,
      });
    } catch (err) {
      if (!is404(err)) warn(`stop ${t.id}: ${(err as Error).message}`);
    }
    try {
      await client.transform.deleteTransform({ transform_id: t.id, force: true });
      ok(`transform supprimé : ${t.id}`);
    } catch (err) {
      if (!is404(err)) warn(`delete transform ${t.id}: ${(err as Error).message}`);
    }
    try {
      await client.indices.delete({ index: t.dest });
    } catch (err) {
      if (!is404(err)) warn(`delete index ${t.dest}: ${(err as Error).message}`);
    }
  }

  for (const index of [CERTIFICATE_INDEX, USERS_INDEX]) {
    try {
      await client.indices.delete({ index });
      ok(`index supprimé : ${index}`);
    } catch (err) {
      if (!is404(err)) warn(`delete index ${index}: ${(err as Error).message}`);
    }
  }

  for (const name of ALL_REGION_ROLES) {
    try {
      await client.security.deleteRole({ name });
    } catch (err) {
      if (!is404(err)) warn(`delete role ${name}: ${(err as Error).message}`);
    }
  }
  ok(`${ALL_REGION_ROLES.length} rôles supprimés`);

  try {
    await client.security.deleteUser({ username: TEST_USER });
    ok(`utilisateur de test supprimé : ${TEST_USER}`);
  } catch (err) {
    if (!is404(err)) warn(`delete user ${TEST_USER}: ${(err as Error).message}`);
  }
}

async function setupIndices() {
  log('\nIndex…');
  for (const [index, mappings] of [
    [CERTIFICATE_INDEX, CERTIFICATE_MAPPING],
    [USERS_INDEX, USERS_MAPPING],
  ] as const) {
    if (await indexExists(index)) {
      skip(`index ${index}`);
      continue;
    }
    await client.indices.create({ index, mappings: mappings as any });
    ok(`index créé : ${index}`);
  }
}

async function setupRoles() {
  log('\nRôles de région…');
  let created = 0;
  for (const name of ALL_REGION_ROLES) {
    if (await roleExists(name)) {
      skip(`rôle ${name}`);
      continue;
    }
    // Rôle "vide" (aucun privilège) : ES exige tout de même un corps de requête.
    await client.security.putRole({ name, cluster: [] });
    created++;
  }
  ok(`${created} rôle(s) créé(s), ${ALL_REGION_ROLES.length} au total`);
}

async function setupTestUser() {
  log('\nUtilisateur de test (dev/local)…');
  const existed = await userExists(TEST_USER);
  // putUser fait un upsert : on garantit ainsi que les identifiants documentés
  // restent valides à chaque exécution.
  await client.security.putUser({
    username: TEST_USER,
    password: TEST_PASSWORD,
    roles: TEST_USER_ROLES,
    full_name: 'Utilisateur de test',
    email: TEST_USER,
  });
  ok(
    `${existed ? 'utilisateur mis à jour' : 'utilisateur créé'} : ${TEST_USER} ` +
      `(mot de passe : ${TEST_PASSWORD}, rôles : ${TEST_USER_ROLES.join(', ')})`,
  );
}

async function setupTransforms() {
  log('\nTransforms…');
  for (const t of TRANSFORMS) {
    if (await transformExists(t.id)) {
      skip(`transform ${t.id}`);
    } else {
      await client.transform.putTransform({ transform_id: t.id, ...(t.body as any) });
      ok(`transform créé : ${t.id}`);
    }
    // Démarrage (idempotent : on ignore l'erreur "déjà démarré").
    try {
      await client.transform.startTransform({ transform_id: t.id });
      ok(`transform démarré : ${t.id}`);
    } catch (err) {
      const msg = (err as Error).message || '';
      if (/already started|has been started/i.test(msg)) {
        skip(`démarrage ${t.id}`);
      } else {
        warn(`start ${t.id}: ${msg}`);
      }
    }
  }
}

async function setKibanaPassword() {
  log('\nMot de passe kibana_system…');
  try {
    await client.security.changePassword({ username: 'kibana_system', password: KIBANA_PASSWORD });
    ok('mot de passe kibana_system défini');
  } catch (err) {
    warn(`kibana_system: ${(err as Error).message}`);
  }
}

function copyCaCert() {
  log('\nCertificat ca.crt…');
  const destDir = path.resolve(process.cwd(), 'certs/ca');
  const destFile = path.join(destDir, 'ca.crt');
  if (fs.existsSync(destFile) && !RESET) {
    skip('certs/ca/ca.crt');
    return;
  }
  fs.mkdirSync(destDir, { recursive: true });
  const cmd = `docker cp ${ES_CONTAINER}:/usr/share/elasticsearch/config/certs/ca/ca.crt ${destFile}`;
  try {
    execSync(cmd, { stdio: 'pipe' });
    ok('ca.crt copié vers certs/ca/ca.crt');
  } catch (err) {
    warn('copie automatique impossible (droits docker manquants ?). Lancez manuellement :');
    console.warn(`      ${cmd}`);
    console.warn(`   ou, si docker requiert les droits root :`);
    console.warn(`      sudo ${cmd}`);
  }
}

// --- Main ------------------------------------------------------------------

async function main() {
  log(`CM2D — initialisation Elasticsearch\n  hôte : ${ELASTIC_HOST}  (user: ${ELASTIC_USERNAME})`);

  try {
    await client.info();
  } catch (err) {
    console.error(`\n✗ Connexion à Elasticsearch impossible sur ${ELASTIC_HOST}`);
    console.error(`  ${(err as Error).message}`);
    process.exit(1);
  }

  if (RESET) await reset();

  await setupIndices();
  await setupRoles();
  await setupTestUser();
  await setupTransforms();
  await setKibanaPassword();
  copyCaCert();

  log('\n✓ Terminé.');
}

main().catch((err) => {
  console.error('\n✗ Échec :', err?.meta?.body ?? err);
  process.exit(1);
});
