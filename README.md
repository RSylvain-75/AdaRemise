# Adapi - La Remise

API REST réalisée avec **Node.js**, **Express** et **PostgreSQL**.

Ce projet permet de gérer les données de La Remise : les catégories, les objets, les dépôts et les personnes.  
L'API permet également de consulter différentes statistiques sur les objets.

## Technologies utilisées

- Node.js
- Express
- PostgreSQL
- pg
- dotenv
- Swagger

## Installation

Installer les dépendances :

```bash
npm install
```

Créer un fichier `.env` à partir du fichier `.env.example` et renseigner les informations nécessaires à la connexion PostgreSQL.

Exemple :

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=nom_de_la_base
DB_USER=utilisateur
DB_PASSWORD=mot_de_passe
```

Importer ensuite la base de données à partir des fichiers SQL présents dans le dossier `db/`.

## Lancer le projet

Pour démarrer le serveur en mode développement :

```bash
npm run dev
```

Le serveur est accessible par défaut à l'adresse :

```text
http://localhost:3000
```

## Routes de l'API

### Catégories

#### GET `/api/categories`

Retourne la liste de toutes les catégories.

---

### Objets

#### GET `/api/objets`

Retourne la liste des objets avec leur catégorie.

Des filtres optionnels peuvent être utilisés :

```text
GET /api/objets?statut=en_rayon
GET /api/objets?categorie_id=1
GET /api/objets?statut=en_rayon&categorie_id=1
```

#### GET `/api/objets/:id`

Retourne un objet avec sa catégorie, son dépôt et les informations de sa donatrice.

Si l'objet n'existe pas, l'API retourne une erreur `404`.

#### PATCH `/api/objets/:id/statut`

Permet de modifier le statut d'un objet.

Exemple de body :

```json
{
  "statut": "en_reparation"
}
```

Un prix peut également être fourni de manière optionnelle :

```json
{
  "statut": "vendu",
  "prix": 25
}

Les statuts autorisés sont :

- `arrive`
- `en_reparation`
- `en_rayon`
- `vendu`
- `recycle`

Une valeur invalide retourne une erreur `400`.

---

### Dépôts

#### GET `/api/depots/:id`

Retourne un dépôt, les informations de sa donatrice et les objets associés au dépôt.

Si le dépôt n'existe pas, l'API retourne une erreur `404`.

#### POST `/api/depots`

Permet de créer un nouveau dépôt.

Exemple :

```json
{
  "date_depot": "2026-09-03",
  "type": "boutique",
  "personne_id": 25
}
```

Les types de dépôt autorisés sont :

- `boutique`
- `domicile`

#### POST `/api/depots/:id/objets`

Permet d'ajouter un objet à un dépôt.

Exemple :

```json
{
  "libelle": "Chaise en bois",
  "poids_kg": 4.5,
  "etat_arrivee": "bon_etat",
  "categorie_id": 1
}
```

Les états d'arrivée autorisés sont :

- `bon_etat`
- `a_reparer`
- `hors_service`

Le statut initial de l'objet est automatiquement défini à `arrive` par la base de données.

---

### Personnes

#### POST `/api/personnes`

Permet de créer une nouvelle personne.

`nom` et `prenom` sont obligatoires.

`telephone` et `adherente` sont optionnels.

Exemple :

```json
{
  "nom": "Martin",
  "prenom": "Paul"
}
```

Exemple avec les champs optionnels :

```json
{
  "nom": "Martin",
  "prenom": "Paul",
  "telephone": "0102030405",
  "adherente": true
}
```

---

### Statistiques

#### GET `/api/stats`

Retourne plusieurs statistiques sur les objets :

- le nombre d'objets par statut ;
- le poids total reçu ;
- le poids détourné de la déchetterie.

## Codes HTTP utilisés

L'API utilise notamment les codes HTTP suivants :

- `200` : requête réussie
- `201` : ressource créée
- `400` : données envoyées invalides ou incomplètes
- `404` : ressource introuvable
- `500` : erreur interne du serveur

## Tester l'API

Les requêtes permettant de tester l'API se trouvent dans :

```text
server/routes/requetes/
```

Ce dossier contient des fichiers `.http` pour tester les différentes ressources :

```text
categories.http
depots.http
objets.http
personnes.http
stats.http
```

Les tests comprennent des cas qui fonctionnent ainsi que des cas d'erreur, par exemple :

- identifiant inexistant ;
- champs obligatoires manquants ;
- valeur d'enum invalide ;
- type de donnée invalide.

Les requêtes peuvent être exécutées directement depuis un client HTTP dans VS Code.

## Documentation Swagger

Une documentation Swagger est également disponible lorsque le serveur est lancé :

```text
http://localhost:3000/api-docs
```

## Variables d'environnement

Le fichier `.env` contient les informations de connexion à la base de données et ne doit pas être versionné.

Un fichier `.env.example` est fourni afin d'indiquer les variables nécessaires au fonctionnement du projet.