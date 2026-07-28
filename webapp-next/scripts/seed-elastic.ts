/**
 * Injection de données de test dans l'index `cm2d_certificate` via l'API _bulk.
 *
 * Génère des certificats de décès synthétiques (mêmes listes de valeurs que
 * faker/main.py) couvrant TOUS les départements — métropole, Corse (2A/2B) et
 * DROM (971…976) — afin que la carte et la stratification par région soient
 * peuplées partout.
 *
 * Usage :
 *   yarn seed:elastic                 # 1 000 000 documents (défaut)
 *   yarn seed:elastic --count 50000   # nombre personnalisé
 *   yarn seed:elastic --reset         # vide l'index avant de réinjecter
 *
 * Prérequis : `yarn setup:elastic` (l'index et son mapping doivent exister).
 *
 * Différences volontaires avec faker/main.py :
 *  - Les catégories sont indexées en TABLEAUX (un token par cause) et non en
 *    chaîne "a; b; c". L'app filtre via `terms`/`match` exacts sur ces keyword ;
 *    seuls des tableaux font correspondre chaque cause individuellement.
 *  - Ajout de `@timestamp` (dérivé de `date`), requis par les transforms continus.
 *  - Départements tirés de REGIONS (source unique), DROM inclus.
 */
import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';
import path from 'path';
import { REGIONS } from '../utils/regions';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const ELASTIC_HOST = process.env.ELASTIC_HOST || 'https://localhost:9200';
const ELASTIC_USERNAME = process.env.ELASTIC_USERNAME || 'elastic';
const ELASTIC_PASSWORD = process.env.ELASTIC_PASSWORD || 'elastic_password';
const INDEX = 'cm2d_certificate';
const BATCH_SIZE = 5000;

const argValue = (name: string, fallback: string): string => {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};
const COUNT = parseInt(argValue('--count', '1000000'), 10);
const RESET = process.argv.includes('--reset');

const client = new Client({
  node: ELASTIC_HOST,
  auth: { username: ELASTIC_USERNAME, password: ELASTIC_PASSWORD },
  tls: { rejectUnauthorized: false },
});

// --- Listes de valeurs (portées depuis faker/main.py) ----------------------

// Tous les codes département (métropole + Corse + DROM), dédupliqués depuis la
// source unique des régions. Couvre l'intégralité de la carte.
const DEPARTMENTS: string[] = Array.from(
  new Set(REGIONS.flatMap((r) => r.value))
);

// Populations approximatives (milliers d'habitants) par département. Sert de
// poids au tirage : les volumes de décès simulés varient donc de façon
// réaliste (Paris/Nord/Rhône élevés, Lozère/Creuse faibles), ce qui donne une
// carte contrastée avec la colorimétrie ancrée sur la médiane. Valeurs
// approximatives (données de test), non des chiffres officiels.
const DEPARTMENT_POPULATION: { [code: string]: number } = {
  '01': 657, '02': 526, '03': 335, '04': 165, '05': 141, '06': 1094,
  '07': 328, '08': 268, '09': 153, '10': 310, '11': 375, '12': 279,
  '13': 2043, '14': 694, '15': 145, '16': 352, '17': 651, '18': 302,
  '19': 240, '2A': 158, '2B': 186, '21': 534, '22': 599, '23': 116,
  '24': 413, '25': 543, '26': 516, '27': 601, '28': 431, '29': 915,
  '30': 748, '31': 1400, '32': 191, '33': 1623, '34': 1175, '35': 1073,
  '36': 217, '37': 610, '38': 1263, '39': 259, '40': 413, '41': 329,
  '42': 762, '43': 227, '44': 1429, '45': 680, '46': 174, '47': 332,
  '48': 76, '49': 813, '50': 496, '51': 568, '52': 172, '53': 307,
  '54': 733, '55': 184, '56': 755, '57': 1043, '58': 204, '59': 2605,
  '60': 829, '61': 279, '62': 1465, '63': 660, '64': 683, '65': 229,
  '66': 480, '67': 1140, '68': 764, '69': 1876, '70': 235, '71': 551,
  '72': 566, '73': 436, '74': 826, '75': 2140, '76': 1256, '77': 1421,
  '78': 1441, '79': 374, '80': 570, '81': 388, '82': 260, '83': 1076,
  '84': 561, '85': 685, '86': 438, '87': 372, '88': 364, '89': 337,
  '90': 141, '91': 1305, '92': 1624, '93': 1655, '94': 1408, '95': 1249,
  '971': 384, '972': 361, '973': 282, '974': 861, '976': 279,
};

// Tirage pondéré par population : table cumulée + recherche binaire.
const DEPT_WEIGHTS = DEPARTMENTS.map((d) => DEPARTMENT_POPULATION[d] ?? 1);
const DEPT_CUMULATIVE: number[] = [];
let cumulativeWeight = 0;
for (const w of DEPT_WEIGHTS) {
  cumulativeWeight += w;
  DEPT_CUMULATIVE.push(cumulativeWeight);
}
const DEPT_WEIGHT_TOTAL = cumulativeWeight;

function pickDepartment(): string {
  const r = Math.random() * DEPT_WEIGHT_TOTAL;
  let lo = 0;
  let hi = DEPT_CUMULATIVE.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (DEPT_CUMULATIVE[mid] <= r) lo = mid + 1;
    else hi = mid;
  }
  return DEPARTMENTS[lo];
}

const CATEGORY_1 = ['suicide', 'avc', 'cancer', 'tuberculose', 'thrombose'];
const CATEGORY_2 = ['vih', 'tuberculose', 'diabete', 'avc', 'cancer'];
const CATEGORY_ASSOCIATE = [
  'Maladies infectieuses intestinales à l’exception de la diarrhée',
  'Diarrhée et gastro-entérite d’origine infectieuse présumée',
  'Tuberculose',
  'Septicémie',
  'Maladie au virus de l’immunodéficience humaine [VIH]',
  "Cancer du colon, du rectum ou de l'anus",
  'Cancer de la trachée, des bonches ou des poumons',
  'Cancer de la peau',
  'Cancer du sein',
  "Cancer de l'utérus",
  'Cancer des ovaires',
  'Cancer de la prostate',
  'Cancer de la vessie',
  'Cancer primitif inconnu',
  'Diabète',
  'Hypercholestérolémie',
  'Démence',
  "Troubles mentaux et du comportement liés à l'utilisation d'alcool",
  "Troubles mentaux et du comportement liés à l'utilisation de substances psychoactives",
  'Schizophrénie, troubles schizotypiques et délirants',
  "Troubles de l'humeur [affectifs]",
  "Maladie d'Alzheimer",
  'Sclérose en plaques',
  'Epilepsie',
  'Accidents ischémiques cérébraux transitoires et syndromes apparentés',
  'Maladies hypertensives',
  'Coronaropathie chronique',
  'Infarctus du myocarde',
  'Affections cardiopulmonaires dont les embolies pulmonaires',
  'Troubles de la conduction et arythmies cardiaques',
  'Insuffisance cardiaque',
  'Maladies cérébrovasculaires dont les avc',
  'Athérosclérose dont les aomi',
  'Insuffisance veineuse des membres inférieurs',
  'Infections aiguës des voies respiratoires supérieures et grippe',
  'Pneumonie',
  'Maladie pulmonaire obstructive chronique et bronchectasie, dont BPCO',
  'Asthme',
  'Covid',
  "Maladies de l'appendice",
  'Maladie de Crohn et rectocolite hémorragique',
  'Iléus paralytique et occlusion intestinale sans hernie',
  'Maladie alcoolique du foie',
  'Lithiase biliaire',
  'Maladies du pancréas',
  'Avortement médicamenteux',
  'Complications de la grossesse principalement dans la période prénatale',
  "Complications de la grossesse principalement pendant le travail et l'accouchement",
  'Accouchement spontané',
  'Complications principalement liées à la puerpéralité',
  'Troubles liés à une gestation courte et à un faible poids à la naissance',
  'Malformations congénitales, déformations et anomalies chromosomiques',
  'Douleurs abdominales et pelviennes',
  'Cause de décès inconnue',
  'Blessure intracrânienne',
  'Fracture du fémur',
  'Intoxications par des drogues, des médicaments et des substances biologiques et effets toxiques de substances principalement non médicinales quant à leur origine',
  'Complications des soins chirurgicaux et médicaux, non classées ailleurs',
  "Séquelles de blessures, d'empoisonnement et d'autres conséquences de causes externes",
];
const DEATH_LOCATIONS = [
  'Domicile',
  'EHPAD, Maison de retraite',
  'Voie publique',
  'Etablissement de santé public',
  'Etablissement de santé privé',
  'Etablissement pénitentiaire',
  'Autre lieu ou indéterminé',
];
const SEXES = ['homme', 'femme', 'indéterminé'];
const KINDS = ['Electronique', 'Papier'];

// --- Générateurs -----------------------------------------------------------

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Reprend get_multiple_values : 20 % une seule valeur, sinon 2 à 5 valeurs
// distinctes. Renvoie un TABLEAU (indexé tel quel dans un champ keyword).
function multiValues(arr: string[]): string[] {
  if (Math.random() < 0.2) return [pick(arr)];
  const n = Math.min(randInt(2, 5), arr.length);
  const pool = [...arr];
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return out;
}

const START = new Date('2021-01-01').getTime();
// Borne haute EXCLUSIVE : Math.random() ne l'atteint jamais, donc 2026-01-01
// permet de couvrir jusqu'au 2025-12-31 inclus.
const END = new Date('2026-01-01').getTime();

function makeDoc() {
  const t = START + Math.random() * (END - START);
  const day = new Date(t);
  const date = day.toISOString().slice(0, 10); // YYYY-MM-DD (format iso8601)
  return {
    // @timestamp = instant d'indexation (et NON la date de décès). Les
    // transforms continus sont démarrés par setup:elastic sur un index vide :
    // leur filigrane temporel est déjà ~maintenant. Un @timestamp dans le passé
    // passerait sous ce filigrane et ne serait jamais traité ; l'instant présent
    // (postérieur au démarrage) est détecté au checkpoint suivant. L'app ne lit
    // jamais @timestamp, seul son rôle de champ de synchro compte.
    '@timestamp': new Date().toISOString(),
    date,
    age: randInt(0, 100),
    sex: pick(SEXES),
    kind: pick(KINDS),
    death_location: pick(DEATH_LOCATIONS),
    department: pickDepartment(),
    home_department: pickDepartment(),
    categories_level_1: multiValues(CATEGORY_1),
    categories_level_2: multiValues(CATEGORY_2),
    categories_associate: multiValues(CATEGORY_ASSOCIATE),
    home_location: `Commune ${randInt(1, 300)}`,
    coordinates: `${(Math.random() * 180 - 90).toFixed(6)}, ${(Math.random() * 360 - 180).toFixed(6)}`,
  };
}

// --- Main ------------------------------------------------------------------

async function main() {
  console.log(`CM2D — seed de ${COUNT} certificats dans ${INDEX}`);
  console.log(`  hôte : ${ELASTIC_HOST}  |  départements couverts : ${DEPARTMENTS.length}`);

  if (!(await client.indices.exists({ index: INDEX }))) {
    console.error(`\n✗ L'index ${INDEX} n'existe pas. Lancez d'abord : yarn setup:elastic`);
    process.exit(1);
  }

  if (RESET) {
    console.log('\n[--reset] Vidage de l’index…');
    await client.deleteByQuery({ index: INDEX, query: { match_all: {} }, refresh: true, conflicts: 'proceed' });
    console.log('  ✓ index vidé');
  }

  let indexed = 0;
  while (indexed < COUNT) {
    const size = Math.min(BATCH_SIZE, COUNT - indexed);
    const operations: any[] = [];
    for (let i = 0; i < size; i++) {
      operations.push({ index: { _index: INDEX } });
      operations.push(makeDoc());
    }
    const resp = await client.bulk({ operations });
    if (resp.errors) {
      const firstError = resp.items.find((it: any) => it.index?.error)?.index?.error;
      console.error('\n✗ Erreur bulk :', firstError);
      process.exit(1);
    }
    indexed += size;
    process.stdout.write(`\r  indexés : ${indexed}/${COUNT}`);
  }

  await client.indices.refresh({ index: INDEX });
  console.log(`\n✓ Terminé. ${indexed} documents indexés dans ${INDEX}.`);
  console.log('  Les transforms se mettront à jour au prochain checkpoint (délai 60s).');
}

main().catch((err) => {
  console.error('\n✗ Échec :', err?.meta?.body ?? err);
  process.exit(1);
});
