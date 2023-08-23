# Causes médicales de décès

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
mkdir certificates
docker cp elasticsearch:/usr/share/elasticsearch/config/certs/ca/ca.crt ./certificates/ca.crt
```

Pour initialiser les variables d'environnement NextJS

```
cd webapp-next
cp .env.example .env
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

## Les variables d'environnement ELK

| Nom de la variable | Description                                                   |
| ------------------ | ------------------------------------------------------------- |
| ELASTIC_PASSWORD   | Le mot de passe à utiliser pour se connecter à Elasticsearch. |
| KIBANA_PASSWORD    | Le mot de passe à utiliser pour se connecter à Kibana.        |
| CLUSTER_NAME       | Le nom du cluster ELK                                         |

## Les variables d'environnement NextJS

| Nom de la variable    | Description                                                             |
| --------------------- | ----------------------------------------------------------------------- |
| ELASTIC_HOST          | L'URL du serveur Elasticsearch, ici configuré pour une instance locale. |
| ELASTIC_PASSWORD      | Le mot de passe à utiliser pour se connecter à Elasticsearch.           |
| AWS_ACCESS_KEY_ID     | Votre ID de clé d'accès AWS pour AWS SES.                               |
| AWS_SECRET_ACCESS_KEY | Votre clé d'accès secrète AWS pour AWS SES.                             |
| AWS_REGION            | La région AWS dans laquelle AWS SES est configuré.                      |
| EMAIL_SOURCE          | L'adresse e-mail utilisée pour envoyer les e-mails.                     |

## Initialisation de l'environnement ELK

### Indexation des certificats

Création de l'index principal destiné à rassembler les informations relatives aux certificats.

Rendez-vous dans "Management" > "Dev Tools" et lancez la requête suivante :

```
PUT /cm2d_certificate
{
  "mappings": {
    "_meta": {
      "created_by": "curl-user"
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
      "categories_level_2": {
        "type": "keyword"
      },
      "coordinates": {
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

### Index pour les attributs supplémentaires des utilisateurs

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
