# Causes médicales de décès

L'application qui permet aux agents des ARS d’évaluer et d’orienter leurs actions en facilitant l’accès et l’interprétation des données de mortalité.

## Démarrage de l'application

Pour démarrer la suite ELK localement :

```
docker compose up -d
```

Pour initialiser les variables d'environnement

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

Définissez un mot de passe approprié dans le champ correspondant. Pour le champ "roles", attribuez le rôle "superuser".

Il est maintenant possible de se connecter en utilisant l'adresse email et le mot de passe que vous avez définis précédemment.

## Les variables d'environnement

| Nom de la variable    | Description                                                             |
| --------------------- | ----------------------------------------------------------------------- |
| ELASTIC_HOST          | L'URL du serveur Elasticsearch, ici configuré pour une instance locale. |
| ELASTIC_PASSWORD      | Le mot de passe à utiliser pour se connecter à Elasticsearch.           |
| AWS_ACCESS_KEY_ID     | Votre ID de clé d'accès AWS pour AWS SES.                               |
| AWS_SECRET_ACCESS_KEY | Votre clé d'accès secrète AWS pour AWS SES.                             |
| AWS_REGION            | La région AWS dans laquelle AWS SES est configuré.                      |
| EMAIL_SOURCE          | L'adresse e-mail utilisée pour envoyer les e-mails.                     |

## Initialisation de l'environnement ELK

### Indexation des certificats et des utilisateurs

```
docker run --net=host --rm -ti -e NODE_TLS_REJECT_UNAUTHORIZED=0 -v ./default-indexes:/tmp --entrypoint multielasticdump elasticdump/elasticsearch-dump \
  --direction=load \
  --input=./tmp \
  --output="https://elastic:${ELASTIC_PASSWORD}@localhost:9200" \
  --tlsAuth
```

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

##### 2. Compilation des comorbidités

Transform à partir de l'index : `cm2d_certificate`

Type de transform : `Pivot`

Group by : `categories_level_2`
Aggregation : `@timestamp.value_count`

Transform ID : `cm2d_level_2_categories`
Transform description : `Available causes`
Destination Index : `cm2d_level_2_categories`

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



### Docker production

## Créer les images docker
```
docker build -t cm2d-elasticsearch docker/elasticsearch
docker build -t cm2d-kibana docker/kibana
docker build --build-arg NEXT_PUBLIC_ELASTIC_API_KEY_NAME=${NEXT_PUBLIC_ELASTIC_API_KEY_NAME} -t cm2d-webapp webapp-next
```

## Créer les réseaux docker
```
docker network create elastic
docker network create webapp
```

## Elasticsearch
```
docker run -d -p 9200:9200 -p 9300:9300 --net elastic -v es_data:/usr/share/elasticsearch/data -v certs:/usr/share/elasticsearch/config/certs -e ELASTIC_PASSWORD=${ELASTIC_PASSWORD} --name elasticsearch cm2d-elasticsearch
```

## Attacher le réseau webapp à Elasticsearch
```
docker network connect webapp elasticsearch
```

## Kibana
```
docker run -d -p 5601:5601 --net elastic -v kibana_data:/usr/share/kibana/data -v certs:/usr/share/kibana/config/certs -e ELASTICSEARCH_PASSWORD=${KIBANA_PASSWORD} --name kibana cm2d-kibana
```

## Webapp
```
docker run -d -p 3000:3000 --net webapp -v certs:/app/certs --env-file ${path_fichier_environnement} --name webapp cm2d-webapp
```