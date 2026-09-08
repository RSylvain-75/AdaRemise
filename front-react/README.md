# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



## Suivi de la vie d'un objet

### Fonctionnalité développée

Cette partie permet de suivre et de modifier le statut d'un objet dans l'application AdaRemise.

L'utilisateur peut :

* sélectionner son identité parmi les volontaires ;
* consulter la liste des objets ;
* voir le statut actuel de chaque objet ;
* choisir un nouveau statut ;
* modifier le statut d'un objet depuis l'interface React.

### Statuts disponibles

* `arrive`
* `en_reparation`
* `en_rayon`
* `vendu`
* `recycle`

### Frontend

La fonctionnalité a été développée dans :

`front-react/src/App.jsx`

React récupère les objets depuis l'API et les affiche dynamiquement.

La modification du statut utilise une requête `PATCH` avec l'ID de l'objet sélectionné.

### Backend

La route utilisée est :

PATCH /api/objets/:id/statut


Exemple :

PATCH http://localhost:3000/api/objets/1/statut

Avec :

{
  "statut": "en_rayon"
}

La route vérifie le statut reçu puis modifie uniquement le statut de l'objet concerné.

### Communication Frontend / Backend

CORS a été ajouté afin de permettre la communication entre :

React : http://localhost:5173
API :   http://localhost:3000


### Tests

Les routes ont été testées avec Thunder Client.

Tests principaux :

* `GET /api/objets`
* `GET /api/objets/1`
* `PATCH /api/objets/1/statut`

La modification du statut a également été testée directement depuis l'interface React.

### Problème rencontré et correction

Lors du développement, le bouton de modification envoyait initialement un `SyntheticBaseEvent` au lieu de l'ID de l'objet.

Cela provoquait une valeur `NaN` côté backend et une erreur `500`.

Le problème a été corrigé en transmettant explicitement l'ID :

<button onClick={() => modifierStatut(objet.id)}>
  Modifier le statut
</button>


Cette correction permet désormais de modifier dynamiquement le statut de l'objet sélectionné.
