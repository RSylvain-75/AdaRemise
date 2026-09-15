# ♻️ AdaRemise

AdaRemise est une application web de gestion destinée à une **ressourcerie**.

Le projet a été réalisé dans le cadre de la formation **Ada Tech School** afin de mettre en pratique le développement d'une application full-stack avec **React**, **Node.js**, **Express** et **PostgreSQL**.

L'application permet aux bénévoles de gérer les dépôts effectués par les donateurs, les objets reçus et leur évolution au sein de la ressourcerie.

---

## 📖 Présentation du projet

Une ressourcerie collecte des objets afin de leur donner une seconde vie.

Lorsqu'une personne effectue un dépôt, plusieurs informations doivent pouvoir être enregistrées :

- le donateur ;
- la date du dépôt ;
- le type de dépôt ;
- les objets déposés ;
- leur catégorie ;
- leur poids ;
- leur état à l'arrivée ;
- leur statut actuel.

AdaRemise permet de centraliser ces informations dans une application unique.

L'objectif est également de pouvoir suivre le parcours d'un objet après son arrivée : réparation, mise en rayon, vente ou recyclage.

---

## ✨ Fonctionnalités

### 👤 Identification du bénévole

À l'ouverture de l'application, l'utilisateur sélectionne le bénévole qui utilise actuellement AdaRemise.

L'identifiant du bénévole sélectionné est conservé dans le navigateur afin de maintenir la session pendant la navigation dans l'application.

---

### 📦 Gestion des dépôts

L'application permet de :

- créer un dépôt ;
- consulter un dépôt ;
- associer un donateur au dépôt ;
- enregistrer le type du dépôt ;
- consulter les objets appartenant au dépôt ;
- ajouter directement un nouvel objet au dépôt.

---

### 🪑 Gestion des objets

Chaque objet peut contenir différentes informations :

- identifiant ;
- libellé ;
- catégorie ;
- poids ;
- état à l'arrivée ;
- statut ;
- prix ;
- dépôt associé.

Une fiche détaillée permet de consulter les informations d'un objet.

---

### 🔄 Suivi du statut des objets

Un objet peut évoluer au cours de son parcours dans la ressourcerie.

Les différents statuts actuellement gérés sont notamment :

```text
arrive
en_reparation
en_rayon
vendu
recycle
```

Le backend dispose d'une route permettant de modifier le statut d'un objet.

---

### 👥 Gestion des donateurs

Les personnes ayant effectué un dépôt sont associées aux dépôts enregistrés dans l'application.

Depuis une fiche dépôt, les informations du donateur peuvent être consultées.

---

### 📚 Historique du donateur

AdaRemise permet également de retrouver **l'ensemble des objets précédemment déposés par un donateur**.

Deux notions sont volontairement séparées sur la fiche d'un dépôt :

#### Objets du dépôt

Cette partie contient uniquement les objets associés au dépôt actuellement consulté.

#### Historique du donateur

Cette partie contient tous les objets déposés par cette personne, y compris ceux provenant de dépôts précédents.

Cette séparation permet de conserver l'historique complet d'un donateur sans mélanger les objets de plusieurs dépôts.

---

## 🛠️ Technologies utilisées

### Frontend

- React
- React Router
- JavaScript
- CSS
- Vite

### Backend

- Node.js
- Express
- PostgreSQL
- API REST

### Base de données

- PostgreSQL
- SQL

### Outils de développement

- Git
- GitHub
- VS Code
- Docker
- Docker Compose
- ESLint

---

## 🏗️ Architecture

AdaRemise utilise une architecture séparant le frontend, le backend et la base de données.

```text
┌───────────────────────┐
│                       │
│     React / Vite      │
│       Frontend        │
│                       │
└───────────┬───────────┘
            │
            │ HTTP / JSON
            │
            ▼
┌───────────────────────┐
│                       │
│   Node.js / Express   │
│       API REST        │
│                       │
└───────────┬───────────┘
            │
            │ SQL
            │
            ▼
┌───────────────────────┐
│                       │
│      PostgreSQL       │
│    Base de données    │
│                       │
└───────────────────────┘
```

Le frontend communique avec le backend grâce à des requêtes HTTP utilisant notamment `fetch()`.

Le backend interroge ensuite PostgreSQL et retourne les données au format JSON.

---

## 📁 Structure du projet

```text
adapi/
│
├── back/
│   │
│   ├── server/
│   │   ├── index.js
│   │   ├── db.js
│   │   │
│   │   └── routes/
│   │       ├── objets.js
│   │       ├── personnes.js
│   │       └── depots.js
│   │
│   ├── db/
│   ├── requetes/
│   └── package.json
│
├── front-react/
│   │
│   ├── src/
│   │   ├── components/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── wireframes/
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

# 🚀 Installation du projet

## 1. Prérequis

Pour lancer le projet localement, il faut disposer de :

- Git
- Node.js
- npm
- PostgreSQL

Docker peut également être utilisé pour les services configurés dans le projet.

---

## 2. Cloner le dépôt

```bash
git clone https://github.com/RSylvain-75/AdaRemise.git
```

Puis entrer dans le projet :

```bash
cd AdaRemise
```

---

## 3. Installer le backend

Se placer dans le dossier backend :

```bash
cd back
```

Installer les dépendances :

```bash
npm install
```

---

## 4. Installer le frontend

Depuis la racine du projet :

```bash
cd front-react
```

Installer les dépendances :

```bash
npm install
```

---

# 🗄️ Base de données

AdaRemise utilise **PostgreSQL** pour stocker les données de l'application.

La connexion entre Express et PostgreSQL est gérée dans :

```text
back/server/db.js
```

Le projet contient également :

```text
docker-compose.yml
```

pour la configuration des services Docker utilisés par le projet.

---

## Principales données manipulées

La base permet notamment de gérer :

### Personnes

Les personnes enregistrées dans l'application peuvent être liées aux différents dépôts.

### Dépôts

Un dépôt contient notamment :

- un identifiant ;
- une date ;
- un type ;
- une personne associée.

### Objets

Un objet contient notamment :

- un identifiant ;
- un libellé ;
- un poids ;
- un état à l'arrivée ;
- un statut ;
- une catégorie ;
- un dépôt associé.

### Catégories

Les objets sont associés à une catégorie permettant de les classifier.

---

# ▶️ Lancer le projet

Le frontend et le backend doivent être lancés séparément.

## Backend

Dans un terminal :

```bash
cd back
npm run dev
```

L'API est accessible par défaut sur :

```text
http://localhost:3000
```

---

## Frontend

Dans un deuxième terminal :

```bash
cd front-react
npm run dev
```

Vite affiche ensuite dans le terminal l'adresse locale permettant d'ouvrir l'application dans le navigateur.

---

# 🔌 API REST

Le backend expose une API REST utilisée par l'application React.

Les principales ressources sont :

```text
/api/personnes
/api/depots
/api/objets
```

---

## 👤 Personnes

### Récupérer les personnes

```http
GET /api/personnes
```

---

### Récupérer l'historique des objets d'une personne

```http
GET /api/personnes/:id/objets
```

Cette route permet de récupérer tous les objets déposés par une personne.

Elle est notamment utilisée sur la fiche d'un dépôt afin d'afficher l'historique complet du donateur.

Exemple :

```text
GET /api/personnes/6/objets
```

La réponse peut notamment contenir :

```json
[
  {
    "id": 75,
    "libelle": "Ventilateur sur pied",
    "poids_kg": "14.10",
    "etat_arrivee": "hors_service",
    "statut": "vendu",
    "categorie_libelle": "Électroménager",
    "depot_id": 15,
    "date_depot": "2026-04-18T22:00:00.000Z"
  }
]
```

---

## 📦 Dépôts

### Récupérer un dépôt

```http
GET /api/depots/:id
```

Exemple :

```text
GET /api/depots/15
```

Cette route permet de récupérer les informations d'un dépôt ainsi que les objets qui lui sont directement associés.

---

## 🪑 Objets

### Récupérer un objet

```http
GET /api/objets/:id
```

Exemple :

```text
GET /api/objets/75
```

---

### Modifier le statut d'un objet

```http
PATCH /api/objets/:id/statut
```

Cette route permet de faire évoluer le statut d'un objet au cours de son parcours dans la ressourcerie.

Les statuts pris en charge sont notamment :

```text
arrive
en_reparation
en_rayon
vendu
recycle
```

---

# 🧭 Navigation

L'application utilise **React Router** pour gérer la navigation entre les différentes pages.

Elle permet notamment de naviguer entre :

- l'identification du bénévole ;
- la liste des objets ;
- les fiches objets ;
- les dépôts ;
- les formulaires de création.

Lorsqu'un objet est ouvert depuis un dépôt, l'application peut conserver l'information du dépôt d'origine afin de faciliter le retour vers celui-ci.

---

# 🧪 Vérification du projet

## ESLint

Pour analyser le code du frontend :

```bash
cd front-react
npm run lint
```

ESLint permet notamment de détecter :

- les variables inutilisées ;
- certaines erreurs JavaScript ;
- les problèmes de qualité du code.

---

## Build de production

Pour vérifier que le frontend peut être compilé :

```bash
npm run build
```

Vite génère alors la version de production dans le dossier :

```text
dist/
```

---

# 🌿 Git et GitHub

Le projet est développé en équipe avec **Git** et **GitHub**.

La branche principale est :

```text
main
```

Les nouvelles fonctionnalités sont développées sur des branches séparées.

---

## Créer une branche

Avant de commencer une nouvelle fonctionnalité :

```bash
git switch main
git pull origin main
```

Puis :

```bash
git switch -c nom-de-la-branche
```

Exemple :

```bash
git switch -c historique-donateur
```

---

## Enregistrer les modifications

```bash
git status
```

Puis ajouter uniquement les fichiers concernés :

```bash
git add chemin/du/fichier
```

Créer ensuite le commit :

```bash
git commit -m "feat: description de la fonctionnalité"
```

---

## Envoyer la branche sur GitHub

```bash
git push -u origin nom-de-la-branche
```

Une **Pull Request** peut ensuite être créée sur GitHub afin de vérifier et intégrer la fonctionnalité dans `main`.

---

## Mettre une branche à jour avec main

Avant de terminer une fonctionnalité, il est recommandé de récupérer les dernières modifications de l'équipe.

```bash
git switch main
git pull origin main
```

Puis revenir sur la branche :

```bash
git switch nom-de-la-branche
git merge main
```

En cas de conflit, les fichiers doivent être vérifiés et fusionnés avant le commit final.

---

# 📌 Exemple de parcours utilisateur

Un parcours typique dans AdaRemise peut être :

```text
Sélection du bénévole
        ↓
Création / consultation d'un dépôt
        ↓
Identification du donateur
        ↓
Ajout des objets
        ↓
Consultation des fiches objets
        ↓
Modification du statut
        ↓
Réparation / mise en rayon
        ↓
Vente ou recyclage
```

Depuis la fiche du dépôt, le bénévole peut également consulter :

```text
Donateur
   │
   ├── Dépôt actuel
   │     ├── Objet A
   │     └── Objet B
   │
   └── Historique
         ├── Ancien objet C
         ├── Ancien objet D
         └── Objet du dépôt actuel
```

---

# 🎯 Objectifs pédagogiques

Ce projet permet de travailler plusieurs compétences du développement web.

### Frontend

- création de composants React ;
- gestion du state ;
- utilisation de `useEffect` ;
- appels API avec `fetch` ;
- navigation avec React Router ;
- affichage dynamique de données.

### Backend

- création d'une API REST ;
- organisation des routes Express ;
- gestion des paramètres d'URL ;
- gestion des erreurs HTTP ;
- communication avec PostgreSQL.

### Base de données

- modélisation relationnelle ;
- requêtes SQL ;
- jointures ;
- relations entre les différentes tables ;
- récupération de données liées.

### Travail en équipe

- utilisation de Git ;
- branches de fonctionnalités ;
- résolution de conflits ;
- Pull Requests ;
- revue des modifications ;
- synchronisation avec `main`.

---

# 🔮 Évolutions possibles

Plusieurs améliorations peuvent encore être apportées à AdaRemise.

Par exemple :

- ajouter une image générique pour chaque catégorie d'objet ;
- améliorer l'affichage des dates ;
- améliorer l'interface et le responsive design ;
- enrichir la gestion des statuts ;
- améliorer la recherche et le filtrage des objets ;
- ajouter davantage de contrôles dans les formulaires ;
- améliorer les messages d'erreur et de confirmation ;
- renforcer la gestion des bénévoles et des donateurs.

---

# 👥 Équipe

Projet réalisé en équipe dans le cadre de la formation **Ada Tech School**.

---

# 📚 Compétences mises en pratique

AdaRemise nous permet de mettre en pratique :

- React ;
- JavaScript ;
- Node.js ;
- Express ;
- PostgreSQL ;
- SQL ;
- API REST ;
- Git ;
- GitHub ;
- Docker ;
- développement frontend ;
- développement backend ;
- travail collaboratif.

---

# ♻️ AdaRemise

**Donner une seconde vie aux objets grâce à une gestion simple et centralisée des dépôts d'une ressourcerie.**