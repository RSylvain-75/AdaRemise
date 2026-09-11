import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ListeObjets.css";

const ListeObjets = () => {
  // liste des objets reçus de l'API
  const [listeObjets, setListeObjets] = useState([]);
  // true tant que le tout premier fetch n'est pas terminé
  const [chargement, setChargement] = useState(true);
  // contient l'erreur si un fetch échoue, sinon null
  const [erreur, setErreur] = useState(null);
  // statut actuellement sélectionné dans le filtre ("" = tous)
  const [statutFiltre, setStatutFiltre] = useState("");
  // liste des catégories reçues de l'API, pour peupler le <select>
  const [listeCategories, setListeCategories] = useState([]);
  // catégorie actuellement sélectionnée dans le filtre ("" = toutes)
  const [typeCategories, setTypeCategories] = useState("");

  // ===== ÉTATS LIÉS À LA POPUP =====
  // objetSelectionne stocke l'objet cliqué (infos déjà connues de listeObjets) ; null = popup fermée
  const [objetSelectionne, setObjetSelectionne] = useState(null);
  // objetDetail stocke les infos complètes, récupérées séparément via un fetch ; null tant que non chargées
  const [objetDetail, setObjetDetail] = useState(null);

  // récupère les objets, relancé à chaque changement de filtre (statut ou catégorie)
  useEffect(() => {
    const recupererObjets = async () => {
      try {
        // construit les query params de l'URL, un paramètre par filtre actif
        const params = new URLSearchParams();
        if (statutFiltre) {
          params.append("statut", statutFiltre);
        }
        if (typeCategories) {
          params.append("categorie_id", typeCategories);
        }
        // assemble l'URL finale ; si params est vide, ça donne juste "...objets?" (sans danger)
        const url = `http://localhost:3000/api/objets?${params.toString()}`;

        const response = await fetch(url);
        const donnees = await response.json();
        setListeObjets(donnees);
        setChargement(false);
      } catch (err) {
        // en cas d'échec réseau ou serveur, on arrête le chargement et on stocke l'erreur
        setErreur(err);
        setChargement(false);
      }
    };
    recupererObjets();
  }, [statutFiltre, typeCategories]);

  // récupère les catégories une seule fois, au montage (elles ne dépendent d'aucun filtre)
  useEffect(() => {
    const recupererCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/categories");
        const donnees = await response.json();
        setListeCategories(donnees);
      } catch (err) {
        setErreur(err);
      }
    };
    recupererCategories();
  }, []);

  const reinitialiserFiltres = () => {
    setStatutFiltre("");
    setTypeCategories("");
  };

  // ===== useEffect QUI PILOTE LE CONTENU DE LA POPUP =====
  // se relance à chaque fois que objetSelectionne change : ouverture, changement d'objet, fermeture
  useEffect(() => {
    // popup fermée (aucun objet sélectionné) : pas de fetch, on vide juste le détail
    if (!objetSelectionne) {
      setObjetDetail(null);
      return;
    }
    const recupererDetailObjet = async () => {
      try {
        // on utilise l'id de l'objet stocké dans l'état (pas un id venant de l'URL)
        const response = await fetch(`http://localhost:3000/api/objets/${objetSelectionne.id}`);
        const donnees = await response.json();
        setObjetDetail(donnees);
      } catch (err) {
        setErreur(err);
      }
    };
    recupererDetailObjet();
  }, [objetSelectionne]);

  // trois écrans possibles : chargement, erreur, ou la liste normale
  if (chargement) {
    return <p className="page-message"> Chargement... </p>;
  }
  if (erreur) {
    return <p className="page-message"> Echec du chargement </p>;
  }

  return (
    <div className="page-objets">
      {/* en-tête de la page : titre + bouton vers la création de dépôt */}
      <div className="page-objets-header">
        <h1>Objets</h1>
        {/* TODO: route /depots/nouveau à créer par B (domaine "faire entrer les objets") */}
        <Link to="/depots/nouveau" className="bouton-primaire">
          + Nouveau dépôt
        </Link>
      </div>

      {/* barre de filtres : catégorie, statut, et réinitialisation */}
      <div className="barre-filtres">
        {/* filtre par catégorie, options générées dynamiquement depuis l'API */}
        <div className="filtre-champ">
          <label>Catégorie</label>
          <select
            value={typeCategories}
            onChange={(e) => setTypeCategories(e.target.value)}
          >
            <option value="">Toutes</option>
            {listeCategories.map((categorie) => (
              <option key={categorie.id} value={categorie.id}>
                {categorie.libelle}
              </option>
            ))}
          </select>
        </div>

        {/* filtre par statut, liste fixe écrite en dur */}
        <div className="filtre-champ">
          <label>Statut</label>
          <select
            value={statutFiltre}
            onChange={(e) => setStatutFiltre(e.target.value)}
          >
            <option value="">Tous</option>
            <option value="arrive">Arrivé</option>
            <option value="en_reparation">En reparation</option>
            <option value="en_rayon">En rayon</option>
            <option value="vendu">Vendu</option>
            <option value="recycle">Recyclé</option>
          </select>
        </div>

        <button className="bouton-secondaire" onClick={reinitialiserFiltres}>
          Réinitialiser
        </button>
      </div>

      {/* liste des objets déjà filtrés côté back, affichée en tableau */}
      <table className="table-objets">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Catégorie</th>
            <th>Statut</th>
            <th>Poids (kg)</th>
          </tr>
        </thead>
        <tbody>
          {listeObjets.map((objet) => (
            // ===== DÉCLENCHEUR DE LA POPUP =====
            // un clic sur cette ligne stocke son objet dans l'état, ce qui :
            // 1. fait re-rendre le composant
            // 2. déclenche le useEffect ci-dessus (objetSelectionne a changé)
            // 3. fait apparaître le bloc {objetSelectionne && (...)} plus bas
            <tr key={objet.id} onClick={() => setObjetSelectionne(objet)}>
              <td>{objet.id}</td>
              <td>{objet.libelle}</td>
              <td>{objet.categorie}</td>
              <td>
                {/* classe construite dynamiquement (ex: "badge badge-en_rayon"),
                    pour que chaque statut ait sa propre couleur définie en CSS */}
                <span className={`badge badge-${objet.statut}`}>
                  {objet.statut}
                </span>
              </td>
              <td>{objet.poids_kg}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===== BLOC DE LA POPUP ===== */}
      {/* affichage conditionnel : si objetSelectionne est null, ce bloc entier n'est pas rendu */}
      {objetSelectionne && (
        // popup-overlay : couvre tout l'écran (position fixed + fond assombri, voir CSS)
        // cliquer ICI (en dehors de la carte) ferme la popup
        <div className="popup-overlay" onClick={() => setObjetSelectionne(null)}>
          {/* popup-carte : la carte blanche, centrée par le CSS du parent
              stopPropagation empêche un clic À L'INTÉRIEUR de la carte de remonter
              jusqu'à l'overlay et de fermer la popup par erreur */}
          <div className="popup-carte" onClick={(e) => e.stopPropagation()}>
            <div className="popup-entete">
              <h2>Objet #{objetSelectionne.id}</h2>
              <button className="bouton-fermer" onClick={() => setObjetSelectionne(null)}>
                ✕
              </button>
            </div>
            {/* second niveau de condition : objetSelectionne peut être rempli avant que
                objetDetail le soit (le fetch prend quelques millisecondes) */}
            {objetDetail && (
              <div className="popup-infos">
                <div className="popup-ligne">
                  <span>Nom</span>
                  <span>{objetDetail.libelle}</span>
                </div>
                <div className="popup-ligne">
                  <span>Catégorie</span>
                  <span>{objetDetail.categorie}</span>
                </div>
                <div className="popup-ligne">
                  <span>État d'arrivée</span>
                  <span>{objetDetail.etat_arrivee}</span>
                </div>
                <div className="popup-ligne">
                  <span>Statut actuel</span>
                  <span className={`badge badge-${objetDetail.statut}`}>
                    {objetDetail.statut}
                  </span>
                </div>
                <div className="popup-ligne">
                  <span>Poids</span>
                  <span>{objetDetail.poids_kg} kg</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeObjets;