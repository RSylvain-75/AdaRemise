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
  // objet cliqué dans la liste (infos partielles, celles déjà connues de listeObjets) ; null = popup fermée
  const [objetSelectionne, setObjetSelectionne] = useState(null);
  // détails complets de l'objet sélectionné, récupérés via un fetch séparé ; null tant que non chargés
  const [objetDetail, setObjetDetail] = useState(null);

  // récupère les objets, relancé à chaque changement de filtre (statut ou catégorie)
  useEffect(() => {
    const recupererObjets = async () => {
      try {
        const params = new URLSearchParams();
        if (statutFiltre) {
          params.append("statut", statutFiltre);
        }
        if (typeCategories) {
          params.append("categorie_id", typeCategories);
        }
        const url = `http://localhost:3000/api/objets?${params.toString()}`;

        const response = await fetch(url);
        const donnees = await response.json();
        setListeObjets(donnees);
        setChargement(false);
      } catch (err) {
        setErreur(err);
        setChargement(false);
      }
    };
    recupererObjets();
  }, [statutFiltre, typeCategories]);

  // récupère les catégories une seule fois, au montage
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

  // récupère les détails complets de l'objet sélectionné, à chaque changement de sélection
  useEffect(() => {
    if (!objetSelectionne) {
      setObjetDetail(null);
      return;
    }
    const recupererDetailObjet = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/objets/${objetSelectionne.id}`);
        const donnees = await response.json();
        setObjetDetail(donnees);
      } catch (err) {
        setErreur(err);
      }
    };
    recupererDetailObjet();
  }, [objetSelectionne]);

  // convertit une date ISO (ex: "2026-07-23T22:00:00.000Z") en format lisible JJ/MM/AAAA
  // renvoie "-" si la date est absente (objet encore "arrivé", pas encore mis en rayon)
  const formaterDate = (dateIso) => {
    if (!dateIso) return "-";
    const date = new Date(dateIso);
    return date.toLocaleDateString("fr-FR");
  };

  if (chargement) {
    return <p className="page-message"> Chargement... </p>;
  }
  if (erreur) {
    return <p className="page-message"> Echec du chargement </p>;
  }

  return (
    <div className="page-objets">
      <div className="page-objets-header">
        <h1>Objets</h1>
        {/* TODO: route /depots/nouveau à créer par B (domaine "faire entrer les objets") */}
        <Link to="/depots/nouveau" className="bouton-primaire">
          + Nouveau dépôt
        </Link>
      </div>

      <div className="barre-filtres">
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

      {/* liste vide -> message "Aucun objet trouvé" ; sinon -> le tableau */}
      {listeObjets.length === 0 ? (
        <div className="etat-vide">
          <p>Aucun objet trouvé</p>
          <p className="etat-vide-sous-texte">Essayez d'ajuster vos filtres.</p>
        </div>
      ) : (
        <table className="table-objets">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Statut</th>
              <th>Poids (kg)</th>
              <th>Date de mise en rayon</th>
            </tr>
          </thead>
          <tbody>
            {listeObjets.map((objet) => (
              <tr key={objet.id} onClick={() => setObjetSelectionne(objet)}>
                <td>{objet.id}</td>
                <td>{objet.libelle}</td>
                <td>{objet.categorie}</td>
                <td>
                  <span className={`badge badge-${objet.statut}`}>
                    {objet.statut}
                  </span>
                </td>
                <td>{objet.poids_kg}</td>
                <td>{formaterDate(objet.date_mise_rayon)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {objetSelectionne && (
        <div className="popup-overlay" onClick={() => setObjetSelectionne(null)}>
          <div className="popup-carte" onClick={(e) => e.stopPropagation()}>
            <div className="popup-entete">
              <h2>Objet #{objetSelectionne.id}</h2>
              <button className="bouton-fermer" onClick={() => setObjetSelectionne(null)}>
                ✕
              </button>
            </div>
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