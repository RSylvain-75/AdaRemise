import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import "./FicheObjet.css";

const FicheObjet = ({ id: idProp, onModification, onSuppression }) => {
  const { id: idUrl } = useParams();
  // id vient soit d'une prop (popup, appelé depuis ListeObjets), soit de l'URL (page /objets/:id)
  const id = idProp || idUrl;
  // location.state permet de recevoir des infos "invisibles" dans l'URL, passées par le composant
  // qui a déclenché la navigation (ici : Fiche_depot, via navigate(url, { state: { depotId } })).
  // Ne survit pas à un rechargement de page ni à un accès direct à l'URL : dans ces cas,
  // depotIdOrigine vaut undefined et le lien retombe sur "/" (voir plus bas)
  const location = useLocation();
  const depotIdOrigine = location.state?.depotId;

  // objet complet reçu de l'API ; null tant qu'il n'est pas encore chargé
  const [stockageObjet, setStockageObjet] = useState(null);
  const [chargement, setChargement] = useState(true);
  // erreur de CHARGEMENT INITIAL uniquement : déclenche les deux if ci-dessous,
  // qui remplacent toute la fiche par un message
  const [erreur, setErreur] = useState(null);
  const [nouveauStatut, setNouveauStatut] = useState("");
  // erreur liée au changement de statut OU à la suppression, séparée de "erreur" :
  // s'affiche localement à côté du bouton, sans faire disparaître toute la fiche
  const [erreurStatut, setErreurStatut] = useState("");

  // se relance à chaque fois que "id" change, pour aller chercher les détails de l'objet correspondant
  useEffect(() => {
    const recupererObjet = async () => {
      try {
        const reponse = await fetch(`http://localhost:3000/api/objets/${id}`);
        // fetch() ne considère pas un 404/500 comme une erreur JS : sans ce throw,
        // le code continuerait et afficherait un objet vide/incomplet à l'écran
        if (!reponse.ok) {
          throw new Error("Impossible de charger les détails de l'objet.");
        }
        const donnees = await reponse.json();
        setStockageObjet(donnees);
        setChargement(false);
      } catch (err) {
        console.error(err);
        setErreur("Impossible de charger les détails de l'objet.");
        setChargement(false);
      }
    };
    recupererObjet();
  }, [id]);

  // envoie le nouveau statut au back (PATCH), déclenché au clic sur "Mettre à jour"
  const modifierStatut = async () => {
    if (!nouveauStatut) {
      setErreurStatut("Choisis un statut avant de valider.");
      return;
    }
    setErreurStatut("");
    try {
      const response = await fetch(
        `http://localhost:3000/api/objets/${id}/statut`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ statut: nouveauStatut }),
        },
      );
      if (!response.ok) {
        throw new Error("Impossible de mettre à jour le statut.");
      }
      const donnees = await response.json();
      // PATCH /:id/statut fait un RETURNING * sur la table "objet" seule : donnees contient
      // le bon statut mais PAS "categorie" (qui vient d'un JOIN, absent de cette route).
      // On fusionne avec l'ancien objet plutôt que de le remplacer, pour garder "categorie"
      // tout en mettant à jour "statut" (et les autres champs présents dans donnees)
      setStockageObjet((ancienObjet) => ({ ...ancienObjet, ...donnees }));
      // onModification n'existe QUE si FicheObjet est utilisé en popup (voir ListeObjets) ;
      // en mode page (/objets/:id), cette prop n'existe pas
      if (onModification) {
        onModification(donnees);
      }
    } catch (err) {
      setErreurStatut("Impossible de mettre à jour le statut.");
    }
  };

  // supprime l'objet (DELETE), déclenché au clic sur "Supprimer", avec confirmation
  const supprimerObjet = async () => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer cet objet ?",
    );
    if (!confirmation) return;

    try {
      const response = await fetch(`http://localhost:3000/api/objets/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Impossible de supprimer l'objet.");
      }
      // prévient ListeObjets pour qu'il retire l'objet du tableau et ferme la popup
      // (même piège que onModification : cette prop n'existe qu'en mode popup)
      if (onSuppression) {
        onSuppression(id);
      }
    } catch (err) {
      setErreurStatut("Impossible de supprimer l'objet.");
    }
  };

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
    <div className="page-fiche-objet">
      {/* pas de lien de retour en mode popup (idProp présent) : la fermeture se fait
          via le bouton ✕ de ListeObjets, pas par navigation */}
      {!idProp && (
        <Link
          to={depotIdOrigine ? `/depot/${depotIdOrigine}` : "/"}
          className="lien-retour"
        >
          {depotIdOrigine ? "← Retour au dépôt" : "← Retour à la liste"}
        </Link>
      )}

      <h1>Objet #{stockageObjet.id}</h1>

      <div className="fiche-contenu">
        <div className="fiche-image-placeholder">
          <span>Pas d'image</span>
        </div>

        <div className="fiche-infos">
          <div className="fiche-ligne">
            <span>Nom</span>
            <span>{stockageObjet.libelle}</span>
          </div>
          <div className="fiche-ligne">
            <span>Catégorie</span>
            <span>{stockageObjet.categorie}</span>
          </div>
          <div className="fiche-ligne">
            <span>État d'arrivée</span>
            <span>{stockageObjet.etat_arrivee}</span>
          </div>
          <div className="fiche-ligne">
            <span>Statut actuel</span>
            {/* classe construite dynamiquement pour que chaque statut ait sa couleur */}
            <span className={`badge badge-${stockageObjet.statut}`}>
              {stockageObjet.statut}
            </span>
          </div>
          {/* prix affiché uniquement s'il existe (objet en_rayon ou vendu) : le brief
              précise que le prix n'a de sens que pour ces deux statuts, pas pour tous */}
          {stockageObjet.prix && (
            <div className="fiche-ligne">
              <span>Prix</span>
              <span>{stockageObjet.prix} €</span>
            </div>
          )}
          <div className="fiche-ligne">
            <span>Poids</span>
            <span>{stockageObjet.poids_kg} kg</span>
          </div>
          <div className="fiche-ligne">
            <span>Date d'arrivée</span>
            <span>{formaterDate(stockageObjet.date_depot)}</span>
          </div>
          <div className="fiche-ligne">
            <span>Dépôt</span>
            <span>#{stockageObjet.depot_id}</span>
          </div>
        </div>
      </div>

      {/* changement de statut : fonctionnalité normalement du domaine C,
          ajoutée ici après accord de l'équipe */}
      <div className="fiche-modif-statut">
        <h2>Modifier le statut</h2>
        <div className="fiche-modif-champ">
          <select
            value={nouveauStatut}
            onChange={(e) => setNouveauStatut(e.target.value)}
          >
            <option value="">Choisir un statut</option>
            <option value="arrive">Arrivé</option>
            <option value="en_reparation">En réparation</option>
            <option value="en_rayon">En rayon</option>
            <option value="vendu">Vendu</option>
            <option value="recycle">Recyclé</option>
          </select>
          <button className="bouton-primaire" onClick={modifierStatut}>
            Mettre à jour
          </button>
          {erreurStatut && <p className="message-erreur">{erreurStatut}</p>}
        </div>
      </div>

      {/* suppression de l'objet, avec confirmation avant l'appel API */}
      <button className="bouton-supprimer" onClick={supprimerObjet}>
        🗑️ Supprimer
      </button>
    </div>
  );
};

export default FicheObjet;
