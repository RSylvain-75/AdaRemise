# Roadmap — Domaine A : Consulter le stock

## Livré en V1

- `GET /objets` avec filtres `statut` et `categorie_id`, combinables
- `GET /objets/:id`
- `POST /objets` (création d'un objet, avec validation complète des champs)
- Écran liste des objets, connecté à l'API
- Filtres statut + catégorie, en `<select>`, combinables sans rechargement de page
- Écran fiche détaillée d'un objet
- Navigation entre liste et fiche objet (React Router)
- Formulaire d'ajout d'objet, avec remise à zéro automatique et message de confirmation après création
- Gestion des états chargement / erreur sur tous les écrans et appels API
- Tests manuels (Thunder Client) sur les cas valides et les cas d'erreur de chaque route

## Non livré en V1

- Le champ `depot_id` du formulaire d'ajout d'objet est saisi manuellement (`<input type="number">`), faute d'une route `GET /depots` disponible côté back au moment du développement. Un `<select>` listant les dépôts existants est prévu dès que cette route sera disponible.
- Le lien "+ Nouveau dépôt" sur la liste des objets pointe vers une route à confirmer avec le domaine B (formulaire de dépôt).
- Pas d'indicateur visuel de chargement lors d'un changement de filtre (seul le tout premier chargement de la page l'affiche) — la liste reste affichée telle quelle pendant le refetch.

## Pistes pour la prochaine version

- **Vue publique du catalogue** : une variante de la liste des objets, sans authentification, limitée aux objets en rayon avec leur prix (mentionné pour la V2 dans le brief).
- **Recherche par mot-clé** et **pagination** de la liste des objets, utile dès que le volume d'objets grandit (prévu en V3 dans le brief).
- **Affichage en popup** plutôt qu'en pages séparées pour la fiche objet et le formulaire d'ajout, pour éviter les changements d'écran complets et fluidifier la navigation.
- **Alerte "objet en rayon depuis plus de 6 mois"**, en lien avec la fiche objet (prévu en V3 dans le brief).
- Rafraîchir l'indicateur de chargement au changement de filtre, pas seulement au premier affichage.
- Une commande unique pour lancer back et front ensemble (ex: `concurrently`, avec un `package.json` racine dédié), au lieu de deux terminaux séparés.