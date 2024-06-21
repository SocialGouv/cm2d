# Causes médicales de décès

![CI Workflow](https://github.com/SocialGouv/cm2d/actions/workflows/build.yml/badge.svg)

L'application qui permet aux agents des ARS d’évaluer et d’orienter leurs actions en facilitant l’accès et l’interprétation des données de mortalité.

## Démarrage de l'application

Pour initialiser les variables d'environnement ELK

```
cp .env.example .env
```

Pour démarrer la suite ELK localement :

```
docker compose up -d
```

Au premier run ELK, lancez cette suite de commande

```
cd webapp-next
mkdir -p certs/ca
docker cp elasticsearch:/usr/share/elasticsearch/config/certs/ca/ca.crt ./certs/ca/ca.crt
```

Pour initialiser les variables d'environnement NextJS

```
cd webapp-next
cp .env.example .env
```

Au premier run ELK, lancez cette commande pour initialiser le mot de passe du user "kibana_system" (remplacer {ELASTIC_PASSWORD} et {KIBANA_PASSWORD} par les mots de passe de votre environnement) :

```
docker exec elasticsearch curl -s -X POST --cacert config/certs/ca/ca.crt -u "elastic:{ELASTIC_PASSWORD}" -H "Content-Type: application/json" https://elasticsearch:9200/_security/user/kibana_system/_password -d "{\"password\":\"{KIBANA_PASSWORD}\"}"
```

Pour démarrer le frontend NextJS localement :

```
cd webapp-next
yarn
yarn dev
```

Vous pouvez accéder à la suite ELK via l'URL http://localhost:5601/. Les identifiants de connexion par défaut sont les suivants, à moins qu'ils n'aient été modifiés dans le fichier .env :

```
Identifiant: elastic
Mot de passe: elastic_password
```

Ces mêmes identifiants sont valables pour se connecter à l'application. Si vous souhaitez créer un nouvel utilisateur, veuillez suivre la procédure décrite ci-après.

## Création d'un utilisateur CM2D

Dans le menu principal d'Elastic, sélectionnez "Management" en bas. Dans le sous-menu de "Management", choisissez "Users" qui se trouve sous la section "Security". Astuce : vous pouvez accéder directement à cette section en saisissant "users" dans la barre de recherche.

Pour filtrer et voir uniquement les utilisateurs de l'application, il suffit de décocher l'option "Show reserved users".

Pour créer un nouvel utilisateur, cliquez sur "Create user".

Dans le formulaire de création, utilisez l'adresse email à la fois pour le champ "username" et pour le champ "email". Dans "Full name", indiquez le nom et le prénom de l'utilisateur.

Définissez un mot de passe approprié dans le champ correspondant. Pour le champ "roles", attribuez le rôle "viewer". Si vous souhaitez créer un administrateur elastic, sélectionnez le rôle "superuser".

Il est maintenant possible de se connecter en utilisant l'adresse email et le mot de passe que vous avez définis précédemment.

## Les variables d'environnement ELK

| Nom de la variable | Description                                                   |
| ------------------ | ------------------------------------------------------------- |
| ELASTIC_PASSWORD   | Le mot de passe à utiliser pour se connecter à Elasticsearch. |
| KIBANA_PASSWORD    | Le mot de passe à utiliser pour se connecter à Kibana.        |
| CLUSTER_NAME       | Le nom du cluster ELK                                         |

## Les variables d'environnement NextJS

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

## Initialisation de l'environnement ELK

### Indexation des certificats et des utilisateurs (auto avec docker)

```
docker run --net=host --rm -ti -e NODE_TLS_REJECT_UNAUTHORIZED=0 -v ./default-indexes:/tmp --entrypoint multielasticdump elasticdump/elasticsearch-dump \
  --direction=load \
  --input=./tmp \
  --output="https://elastic:${ELASTIC_PASSWORD}@localhost:9200" \
  --tlsAuth
```

### Indexation des certificats (manuelle)

Création de l'index principal destiné à rassembler les informations relatives aux certificats.

Rendez-vous dans "Management" > "Dev Tools" et lancez la requête suivante :

```
PUT /cm2d_certificate
{
  "mappings": {
    "_meta": {
      "created_by": "cm2d-admin"
    },
    "properties": {
      "@timestamp": {
        "type": "date"
      },
      "age": {
        "type": "long"
      },
      "categories_level_1": {
        "type": "keyword"
      },
      "categories_associate": {
        "type": "keyword"
      },
      "nnc": {
        "type": "keyword"
      },
      "date": {
        "type": "date",
        "format": "iso8601"
      },
      "death_location": {
        "type": "keyword"
      },
      "department": {
        "type": "long"
      },
      "home_location": {
        "type": "keyword"
      },
      "kind": {
        "type": "keyword"
      },
      "sex": {
        "type": "keyword"
      }
    }
  }
}'
```

### Index pour les attributs supplémentaires des utilisateurs (manuelle)

Pour stocker des informations supplémentaires concernant les utilisateurs CM2D, nous devons créer un index dédié.

Rendez-vous dans "Management" > "Dev Tools" et lancez la requête suivante :

```
PUT /cm2d_users
{
  "mappings": {
    "properties": {
      "username": { "type": "text" },
      "versionCGU": { "type": "text" }
    }
  }
}
```

### Mise en place des rôles

En utilisant l'interface ELK, naviguez jusqu'à Stack Management > Security > Roles, et créez les rôles suivants (sans configuration particulière) :

- region-france-entiere
- region-ile-de-france
- region-normandie
- region-nouvelle-aquitaine
- region-hauts-de-france
- region-auverge-rhone-alpes
- region-bourgogne-franche-comte
- region-centre-val-de-loire
- region-corse
- region-grand-est
- region-occitanie
- region-pays-de-la-loire
- region-provence-alpes-cote-dazur
- region-bretagne

### Mise en place des transformations

En utilisant l'interface ELK, naviguez jusqu'à Stack Management > Transform, et installez les indices de transformation suivants :

##### 1. Compilation des causes

Transform à partir de l'index : `cm2d_certificate`

Type de transform : `Pivot`

Group by : `categories_level_1`
Aggregation : `@timestamp.value_count`

Transform ID : `cm2d_level_1_categories`
Transform description : `Available causes`
Destination Index : `cm2d_level_1_categories`

Continous mode
Date field for continous mode : `@timestamp`
Delay : `60s`

##### 2. Compilation des causes associées

Transform à partir de l'index : `cm2d_certificate`

Type de transform : `Pivot`

Group by : `categories_associate`
Aggregation : `@timestamp.value_count`

Transform ID : `cm2d_associate_categories`
Transform description : `Available associate causes`
Destination Index : `cm2d_associate_categories`

Continous mode
Date field for continous mode : `@timestamp`
Delay : `60s`

##### 3. Compilation des lieux institutionnels de décès

Transform à partir de l'index : `cm2d_certificate`

Type de transform : `Latest`

Unique keys : `death_location`
Sort field : `date`

Transform ID : `cm2d_death_locations`
Transform description : `Available death locations`
Destination Index : `cm2d_death_locations`

Continous mode
Date field for continous mode : `@timestamp`
Delay : `60s`

##### 4. Compilation des sexes

Transform à partir de l'index : `cm2d_certificate`

Type de transform : `Latest`

Unique keys : `sex`
Sort field : `date`

Transform ID : `cm2d_sexes`
Transform description : `Available sexes`
Destination Index : `cm2d_sexes`

Continous mode
Date field for continous mode : `@timestamp`
Delay : `60s`

##### 5. Compilation des départements

Transform à partir de l'index : `cm2d_certificate`

Type de transform : `Latest`

Unique keys : `department`
Sort field : `date`

Transform ID : `cm2d_departments`
Transform description : `Available departments`
Destination Index : `cm2d_departments`

Continous mode
Date field for continous mode : `@timestamp`
Delay : `60s`

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
