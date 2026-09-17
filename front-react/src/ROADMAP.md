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
<<<<<<< HEAD
- **Un Popup generaliser** : créer des popups de confirmation de modication de status dans `Ficheobjet` on pourrais aussi le faire pour confirmer une supression.
- **Créer des alertes automatique** pour nous informer d'un objet ou plusieur `en_rayon`depuis plus de 6 mois.
- **Créer un catalogue** un fichier `CataloguePublic.jsx` pour la clientele avec un tri et un filtre par categorie pour effectuer des achats.
=======

# Roadmap — Domaine D : Tableau de bord et statistiques

## Livré en V1

- `GET /api/stats` pour récupérer les statistiques générales de la ressourcerie
- Calcul côté back du nombre total d'objets par statut
- Calcul du poids total reçu
- Calcul du nombre d'objets actuellement en rayon
- Écran Dashboard connecté à `/api/stats`
- Affichage des 3 indicateurs principaux : total d'objets, poids total reçu et objets en rayon
- Création d'un composant `StatCard` réutilisable pour afficher les indicateurs
- Affichage de la répartition des objets par statut : arrivé, en réparation, en rayon, vendu et recyclé
- Calcul des pourcentages de chaque statut côté front
- Graphique circulaire dynamique réalisé avec `conic-gradient`, sans bibliothèque graphique externe
- Légende associée au graphique avec le nombre d'objets pour chaque statut
- Gestion de l'état de chargement pendant l'appel à `/api/stats`
- Gestion des erreurs avec vérification de `response.ok` et affichage d'un message utilisateur
- Refonte visuelle du Dashboard avec cartes, illustrations et harmonisation des couleurs des statuts
- Intégration du Dashboard dans la navigation principale de l'application
- Mise en place d'une sidebar avec `NavLink` et indication visuelle de la page active
- Récupération du bénévole connecté à partir du `benevoleId` enregistré dans le `localStorage`
- Affichage du nom et des initiales du bénévole dans la barre de navigation
- Harmonisation de l'interface avec l'identité visuelle de La Remise
- Tests manuels de `/api/stats` et vérification de l'affichage des données dans le Dashboard

## Non livré en V1

- Pas de filtre des statistiques par période (jour, semaine, mois ou année)
- Pas d'historique permettant de comparer l'évolution des statistiques dans le temps
- Pas de graphique d'évolution des entrées, ventes ou recyclages
- Les statistiques du Dashboard sont chargées à l'ouverture de la page mais ne sont pas mises à jour automatiquement en temps réel
- Pas d'export des statistiques en CSV ou PDF
- Pas encore d'indicateurs d'impact environnemental, comme le poids d'objets réemployés ou la quantité de déchets évités
- L'identification du bénévole repose encore sur le `localStorage` et ne constitue pas une authentification sécurisée
- Les URL de l'API utilisent encore `localhost` et ne sont pas centralisées dans une variable d'environnement

## Pistes pour la prochaine version

- **Statistiques par période** : permettre de sélectionner une période pour analyser l'activité de la ressourcerie
- **Évolution dans le temps** : ajouter des graphiques pour visualiser les dépôts, ventes et recyclages par semaine ou par mois
- **Indicateurs environnementaux** : afficher le poids réemployé, le poids recyclé et une estimation des déchets évités
- **Statistiques sur les catégories** : identifier les catégories d'objets les plus déposées, vendues ou recyclées
- **Export des données** : permettre l'export des statistiques en CSV ou PDF
- **Rafraîchissement du Dashboard** : actualiser les statistiques après une modification importante sans avoir besoin de recharger la page
- **Centralisation de l'API** : déplacer l'URL du backend dans une variable d'environnement pour faciliter le déploiement
- **Authentification des bénévoles** : remplacer l'identification actuelle par un système d'authentification plus sécurisé
- **Tests automatisés** : compléter les tests manuels par des tests unitaires et d'intégration sur `/api/stats` et le Dashboard

>>>>>>> 102ae6c (docs: ajout roadmap et commentaires du code)
