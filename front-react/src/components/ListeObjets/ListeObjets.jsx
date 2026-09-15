import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FicheObjet from "../FicheObjet/FicheObjet";
import "./ListeObjets.css";

const ListeObjets = () => {
  const [listeObjets, setListeObjets] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  // statut actuellement sélectionné dans le filtre ("" = tous)
  const [statutFiltre, setStatutFiltre] = useState("");
  const [listeCategories, setListeCategories] = useState([]);
  // catégorie actuellement sélectionnée dans le filtre ("" = toutes)
  const [typeCategories, setTypeCategories] = useState("");
  // objet cliqué dans la liste ; null = popup fermée.
  // FicheObjet se charge lui-même de récupérer et d'afficher le détail complet,
  // donc pas de deuxième fetch à gérer ici
  const [objetSelectionne, setObjetSelectionne] = useState(null);

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
        if (!response.ok) {
          throw new Error("Impossible de charger les objets.");
        }
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
        if (!response.ok) {
          throw new Error("Impossible de charger les catégories.");
        }
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

  // convertit une date ISO en JJ/MM/AAAA ; "-" si absente (objet encore "arrivé")
  const formaterDate = (dateIso) => {
    if (!dateIso) return "-";
    const date = new Date(dateIso);
    return date.toLocaleDateString("fr-FR");
  };

  // met à jour UN SEUL objet dans listeObjets (celui dont le statut vient de changer),
  // sans refaire de fetch. Fusionne avec l'ancien objet (via {...objet, ...objetModifie})
  // plutôt que de le remplacer, car objetModifie (venu de PATCH /:id/statut) n'a pas
  // le champ "categorie" — le remplacement entier ferait disparaître ce champ à l'écran
  const mettreAJourObjet = (objetModifie) => {
    setListeObjets((ancienneListe) =>
      ancienneListe.map((objet) =>
        objet.id === objetModifie.id ? { ...objet, ...objetModifie } : objet
      )
    );
  };

  const supprimerDeLaListe = (idSupprime) => {
  setListeObjets((ancienneListe) =>
    ancienneListe.filter((objet) => objet.id !== idSupprime)
  );
  setObjetSelectionne(null);
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

      {/* la popup réutilise directement FicheObjet, en lui passant id et onModification */}
      {objetSelectionne && (
        <div className="popup-overlay" onClick={() => setObjetSelectionne(null)}>
          {/* stopPropagation empêche un clic dans la carte de fermer la popup par erreur */}
          <div className="popup-carte" onClick={(e) => e.stopPropagation()}>
            <button className="bouton-fermer" onClick={() => setObjetSelectionne(null)}>
              ✕
            </button>
            {/* onModification permet à FicheObjet de "prévenir" ListeObjets quand le statut
                change, pour que le tableau reflète le changement après fermeture de la popup */}
            <FicheObjet id={objetSelectionne.id} onModification={mettreAJourObjet} onSuppression={supprimerDeLaListe} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeObjets;