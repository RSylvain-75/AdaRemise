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
- **Un Popup generaliser** : créer des popups de confirmation de modication de status dans `Ficheobjet` on pourrais aussi le faire pour confirmer une supression.
- **Créer des alertes automatique** pour nous informer d'un objet ou plusieur `en_rayon`depuis plus de 6 mois.
- **Créer un catalogue** un fichier `CataloguePublic.jsx` pour la clientele avec un tri et un filtre par categorie pour effectuer des achats.