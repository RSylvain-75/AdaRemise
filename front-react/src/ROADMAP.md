# Roadmap — AdaRemise V1

## Domaine A — Consulter le stock (Yanis)

### Livré
- `GET /objets` (filtres `statut` et `categorie_id`, combinables)
- `GET /objets/:id`
- `POST /objets` (validation complète des champs)
- `PATCH /objets/:id/statut` (normalement domaine C, ajouté ici après accord de l'équipe)
- `DELETE /objets/:id` (suppression, utile pour nettoyer les objets de test)
- `GET /benevoles`, `GET /benevoles/:id` (manquantes côté back, ajoutées pour corriger l'identification des bénévoles sur "Qui es-tu ?")
- Écran liste des objets, connecté à l'API, filtrable (statut + catégorie, combinables), avec réinitialisation des filtres
- Écran fiche détaillée d'un objet, réutilisable en page (`/objets/:id`) et en popup (depuis la liste)
- Navigation contextuelle : "Retour au dépôt" ou "Retour à la liste" selon l'origine (via `location.state`)
- Changement de statut directement depuis la fiche objet
- Suppression d'un objet, avec confirmation
- Formulaire d'ajout d'objet, route `/objets/nouveau/:depotId` : le dépôt est connu automatiquement via l'URL, plus besoin de saisie manuelle
- Affichage du prix (si présent) et formatage des dates en JJ/MM/AAAA
- Gestion des états chargement / erreur sur tous les écrans et appels API, avec vérification systématique de `response.ok`
- Synchronisation entre la popup et le tableau (via une fonction passée en prop) après modification ou suppression d'un objet
- Tests manuels (Thunder Client) sur les cas valides et les cas d'erreur de chaque route

### Non livré / à améliorer
- Pas d'indicateur visuel de chargement lors d'un changement de filtre (seul le tout premier chargement de la page l'affiche)

### Pistes pour la prochaine version
- Vue publique du catalogue, sans authentification, limitée aux objets en rayon avec leur prix (V2, brief)
- Recherche par mot-clé et pagination de la liste des objets (V3, brief)
- Alerte "objet en rayon depuis plus de 6 mois" (V3, brief)
- Rafraîchir l'indicateur de chargement au changement de filtre
- Une commande unique pour lancer back et front ensemble (ex: `concurrently`)
- Généraliser l'affichage en popup à `Fiche_depot.jsx` (domaine B), pour une navigation cohérente partout
- Popup de confirmation avant modification du statut ou suppression d'un objet, dans `FicheObjet`
- Alertes automatiques pour signaler un ou plusieurs objets `en_rayon` depuis plus de 6 mois
- Un fichier `CataloguePublic.jsx`, avec tri et filtre par catégorie, pour la clientèle

---

## Domaine B — Faire entrer les objets (à compléter par le binôme concerné)

### Livré


### Non livré / à améliorer


### Pistes pour la prochaine version


---

## Domaine C — Suivre la vie d'un objet (à compléter par le binôme concerné)

### Livré


### Non livré / à améliorer


### Pistes pour la prochaine version


---

## Domaine D — Sortir les chiffres (à compléter par le binôme concerné)

### Livré


### Non livré / à améliorer


### Pistes pour la prochaine version