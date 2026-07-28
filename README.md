# Causes médicales de décès

![CI Workflow](https://github.com/SocialGouv/cm2d/actions/workflows/build.yml/badge.svg)

L'application qui permet aux agents des ARS d’évaluer et d’orienter leurs actions en facilitant l’accès et l’interprétation des données de mortalité.

## Prérequis

- Docker et Docker Compose
- Node.js et Yarn

## Démarrage (local)

### 1. Variables d'environnement

```
cp .env.example .env                            # racine (suite ELK)
cp webapp-next/.env.example webapp-next/.env    # frontend + scripts
```

### 2. Démarrer la suite ELK

```
docker compose up -d
```

### 3. Dépendances + initialisation d'Elasticsearch

```
cd webapp-next
yarn
yarn setup:elastic
```

`yarn setup:elastic` provisionne **de façon idempotente** tout l'environnement
Elasticsearch : index, rôles, transforms, mot de passe `kibana_system`, utilisateur
de test et certificat `ca.crt` (détails plus bas). Ajoutez `--reset` pour tout
supprimer et recréer (⚠️ **données incluses**).

> **`ca.crt`** — si la copie automatique échoue (droits docker), la commande affiche
> la ligne `docker cp …` à relancer manuellement (préfixez avec `sudo` si votre
> utilisateur n'est pas dans le groupe `docker`). Ce certificat est requis pour se
> connecter à l'application.

### 4. Données de test (optionnel)

```
yarn seed:elastic              # 1 000 000 certificats (métropole + DROM)
yarn seed:elastic --count 50000    # volume personnalisé
yarn seed:elastic --reset      # vide cm2d_certificate puis réinjecte
```

Les transforms se mettent à jour à leur checkpoint suivant (~60 s).

### 5. Lancer le frontend

```
yarn dev
```

## Se connecter

| Cible                          | Identifiant     | Mot de passe       |
| ------------------------------ | --------------- | ------------------ |
| Kibana / ELK (localhost:5601)  | `elastic`       | `elastic_password` |
| Application (dev/local)        | `user@test.loc` | `user123`          |

L'utilisateur `user@test.loc` (rôles `viewer` + `region-france-entiere`, accès
national) est créé automatiquement par `yarn setup:elastic`. Identifiants par défaut,
modifiables dans les fichiers `.env`. Pour créer un autre utilisateur, voir plus bas.

## Variables d'environnement

### ELK (racine)

| Nom de la variable | Description                                                   |
| ------------------ | ------------------------------------------------------------- |
| ELASTIC_PASSWORD   | Le mot de passe à utiliser pour se connecter à Elasticsearch. |
| KIBANA_PASSWORD    | Le mot de passe à utiliser pour se connecter à Kibana.        |
| CLUSTER_NAME       | Le nom du cluster ELK                                         |

### NextJS (`webapp-next`)

| Nom de la variable  | Description                                                                  |
| ------------------- | ---------------------------------------------------------------------------- |
| ELASTIC_HOST        | L'URL du serveur Elasticsearch, ici configuré pour une instance locale.      |
| ELASTIC_PASSWORD    | Le mot de passe à utiliser pour se connecter à Elasticsearch.                |
| NODEMAILER_HOST     | Le host domain pour se connecter au SMTP.                                    |
| NODEMAILER_PORT     | Le port pour se connecter au SMTP.                                           |
| NODEMAILER_USER     | Identifiant pour l'authentification au SMTP.                                 |
| NODEMAILER_PASSWORD | Mot de passe pour l'authentification au SMTP.                                |
| NODEMAILER_FROM     | L'adresse e-mail utilisée pour envoyer les e-mails.                          |
| NODEMAILER_BASEURL  | L'URL courante de l'application pour construire les liens envoyés par email. |

## Détails

<details>
<summary><b>Ce que provisionne <code>yarn setup:elastic</code></b> (source : <code>webapp-next/scripts/setup-elastic.ts</code>)</summary>

- **Index** `cm2d_certificate` (certificats de décès) et `cm2d_users` (attributs
  applicatifs). `department` / `home_department` sont des `keyword` (codes non
  numériques : DROM `971`, Corse `2A`/`2B`).
- **19 rôles de région** (`region-france-entiere` + un par région, DROM inclus),
  issus de la source unique `webapp-next/utils/regions.ts` (aucune dérive avec le
  front). Les noms sont en ASCII (ex. `region-bourgogne-franche-comte`, sans accent).
- **5 transforms continus**, créés et démarrés, alimentés par `cm2d_certificate` :

  | Transform ID                | Type   | Clé / groupe           |
  | --------------------------- | ------ | ---------------------- |
  | `cm2d_level_1_categories`   | Pivot  | `categories_level_1`   |
  | `cm2d_associate_categories` | Pivot  | `categories_associate` |
  | `cm2d_death_locations`      | Latest | `death_location`       |
  | `cm2d_sexes`                | Latest | `sex`                  |
  | `cm2d_departments`          | Latest | `department`           |

  Leurs index de destination alimentent les listes de valeurs de l'application
  (causes, lieux, sexes, départements).
- **Mot de passe `kibana_system`** (depuis `KIBANA_PASSWORD`).
- **Utilisateur de test** `user@test.loc` / `user123` (dev/local uniquement).
- **Certificat `ca.crt`** copié vers `webapp-next/certs/ca/`.

</details>

<details>
<summary><b>Créer un utilisateur manuellement (via Kibana)</b></summary>

Dans Kibana, allez dans **Management → Users** (section Security ; tapez « users »
dans la barre de recherche pour y accéder directement). Décochez « Show reserved
users » pour ne voir que les utilisateurs de l'application, puis **Create user**.

Utilisez l'adresse email **à la fois** comme `username` et comme `email` (convention
requise par l'application, qui indexe les rôles par email). Attribuez le rôle
`viewer` (utilisateur standard) ou `superuser` (administrateur), plus un rôle de
région pour l'accès aux données.

</details>

## Docker production

### Créer les images docker

```
docker build -t cm2d-elasticsearch docker/elasticsearch
docker build -t cm2d-kibana docker/kibana
docker build --build-arg NEXT_PUBLIC_ELASTIC_API_KEY_NAME=${NEXT_PUBLIC_ELASTIC_API_KEY_NAME} -t cm2d-webapp webapp-next
```

### Créer les réseaux docker

```
docker network create elastic
docker network create webapp
```

### Elasticsearch

```
docker run -d -p 9200:9200 -p 9300:9300 --net elastic -v es_data:/usr/share/elasticsearch/data -v certs:/usr/share/elasticsearch/config/certs -e ELASTIC_PASSWORD=${ELASTIC_PASSWORD} --name elasticsearch cm2d-elasticsearch
```

### Attacher le réseau webapp à Elasticsearch

```
docker network connect webapp elasticsearch
```

### Kibana

```
docker run -d -p 5601:5601 --net elastic -v kibana_data:/usr/share/kibana/data -v certs:/usr/share/kibana/config/certs -e ELASTICSEARCH_PASSWORD=${KIBANA_PASSWORD} --name kibana cm2d-kibana
```

### Webapp

```
docker run -d -p 3000:3000 --net webapp -v certs:/app/certs --env-file ${path_fichier_environnement} --name webapp cm2d-webapp
```
