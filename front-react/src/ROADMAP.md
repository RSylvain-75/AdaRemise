# Roadmap — Domaine A : Consulter le stock

## Livré en V1

- `GET /objets` avec filtres `statut` et `categorie_id`, combinables
- `GET /objets/:id`
- `POST /objets` (création d'un objet, avec validation complète des champs)
- `PATCH /objets/:id/statut` (changement de statut, normalement domaine C, ajouté ici après accord de l'équipe)
- `DELETE /objets/:id` (suppression, utile pour nettoyer les objets de test)
- `GET /benevoles` et `GET /benevoles/:id` (manquantes côté back, ajoutées pour corriger l'identification des bénévoles sur "Qui es-tu ?")
- Écran liste des objets, connecté à l'API
- Filtres statut + catégorie, en `<select>`, combinables sans rechargement de page
- Bouton de réinitialisation des filtres
- Écran fiche détaillée d'un objet, réutilisable en page (`/objets/:id`) et en popup (depuis la liste)
- Navigation contextuelle : "Retour au dépôt" ou "Retour à la liste" selon l'origine (via `location.state`)
- Formulaire d'ajout d'objet, route `/objets/nouveau/:depotId` : le dépôt est connu automatiquement via l'URL, plus besoin de saisie manuelle
- Affichage du prix (si présent) et formatage des dates en JJ/MM/AAAA
- Gestion des états chargement / erreur sur tous les écrans et appels API, avec vérification systématique de `response.ok`
- Synchronisation entre la popup et le tableau (via une fonction passée en prop) après modification ou suppression d'un objet
- Tests manuels (Thunder Client) sur les cas valides et les cas d'erreur de chaque route

## Non livré en V1

- Pas d'indicateur visuel de chargement lors d'un changement de filtre (seul le tout premier chargement de la page l'affiche) — la liste reste affichée telle quelle pendant le refetch.
- Le lien "+ Nouveau dépôt" et le formulaire de dépôt (domaine B) restent perfectibles : historique complet du donateur affiché sur la fiche dépôt, mais pas de liste des dépôts existante encore.

## Pistes pour la prochaine version

- **Vue publique du catalogue** : une variante de la liste des objets, sans authentification, limitée aux objets en rayon avec leur prix (mentionné pour la V2 dans le brief).
- **Recherche par mot-clé** et **pagination** de la liste des objets, utile dès que le volume d'objets grandit (prévu en V3 dans le brief).
- **Alerte "objet en rayon depuis plus de 6 mois"**, en lien avec la fiche objet (prévu en V3 dans le brief).
- Rafraîchir l'indicateur de chargement au changement de filtre, pas seulement au premier affichage.
- Une commande unique pour lancer back et front ensemble (ex: `concurrently`, avec un `package.json` racine dédié), au lieu de deux terminaux séparés.
- Généraliser l'affichage en popup à `Fiche_depot.jsx` (domaine B), pour une navigation cohérente partout dans l'application.



Parcours bénévole et suivi des objets
## Tâches réalisées

1. Identification du bénévole
Création de la récupération des personnes depuis l’API.
Mise en place de la route GET /api/personnes.
Récupération des données depuis PostgreSQL.
Affichage de la liste des personnes dans l’interface React.
Création du composant QuiEsTu.jsx.
Sélection d’un bénévole depuis l’interface.
Conservation et transmission de la personne sélectionnée.
Fichiers concernés :
back/server/routes/personnes.js
front-react/src/components/QuiEsTu.jsx
2. Navigation de l’application
Mise en place de React Router.
Création du parcours entre la page principale et la page « Qui es-tu ? ».
Utilisation de BrowserRouter, Routes, Route et navigate().
Fichiers concernés lors de la mise en place :
front-react/src/main.jsx
front-react/src/routes/AppRoutes.jsx
L’architecture du routing a ensuite évolué avec les modifications intégrées au travail collectif.
3. Suivi du statut des objets
Mise en place de la modification du statut d’un objet.
Création/utilisation de la route PATCH /api/objets/:id/statut.
Vérification du statut envoyé par l’application.
Mise à jour du statut dans PostgreSQL.
Intégration de la modification du statut côté React.
Fichiers concernés :
back/server/routes/objets.js
composants React concernés par l’affichage et la modification du statut.

## État final
Le travail réalisé suit le parcours suivant :
Identification du bénévole
GET /api/personnes
Sélection dans « Qui es-tu ? »
Navigation dans l'application
Consultation des objets
Modification du statut
PATCH /api/objets/:id/statut
Mise à jour en base PostgreSQL


## Objectif du travail réalisé
Permettre au bénévole de s’identifier dans l’application et de participer au suivi de l’évolution des objets grâce à la modification de leur statut.

## piste pour les prochaines versions

- Ajouter une barre de recherche permettant de trouver rapidement un bénévole par nom ou prénom, au lieu de parcourir toute la liste.

- Afficher le profil du bénévole
Après sélection, afficher un petit résumé :
prénom + nom ;
éventuellement ses compétences ;
son rôle ou ses informations utiles.