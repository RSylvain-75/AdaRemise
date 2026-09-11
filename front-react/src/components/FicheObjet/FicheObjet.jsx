import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./FicheObjet.css";

const FicheObjet = () => {
  // récupère la valeur ":id" depuis l'URL (ex: /objets/12 -> id = "12")
  const { id } = useParams();
  // objet complet reçu de l'API ; null tant qu'il n'est pas encore chargé
  const [stockageObjet, setStockageObjet] = useState(null);
  // true tant que le fetch n'est pas terminé
  const [chargement, setChargement] = useState(true);
  // contient l'erreur si le fetch échoue, sinon null
  const [erreur, setErreur] = useState(null);

  // se relance à chaque fois que "id" change, pour aller chercher les détails de l'objet correspondant
  useEffect(() => {
    const recupererObjet = async () => {
      try {
        const reponse = await fetch(`http://localhost:3000/api/objets/${id}`);
        //fetch() ne considère pas un 404 comme une erreur JavaScript. 
        // Donc actuellement, si /api/objets/${id} renvoie 404, 
        // ton catch ne sera pas forcément déclenché.
        const donnees = await reponse.json();
        setStockageObjet(donnees);
        setChargement(false);
      } catch (err) {
        console.error(err)
        setErreur("Impossible de charger les détails de l'objet.");
        setChargement(false);
      }
    };
    recupererObjet();
  }, [id]);

  // trois écrans possibles : chargement, erreur, ou la fiche normale
  if (chargement) {
    return <p className="page-message"> Chargement... </p>;
  }
  if (erreur) {
    return <p className="page-message"> Echec du chargement </p>;
  }

  return (
    <div className="page-fiche-objet">
      {/* lien de retour vers la liste */}
      <Link to="/" className="lien-retour">
        ← Retour à la liste
      </Link>

      <h1>Objet #{stockageObjet.id}</h1>

      <div className="fiche-contenu">
        {/* emplacement image, non fonctionnel pour l'instant (pas de gestion de photo en V1) */}
        <div className="fiche-image-placeholder">
          <span>Pas d'image</span>
        </div>

        {/* bloc des infos texte, une ligne label/valeur par information */}
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
          <div className="fiche-ligne">
            <span>Poids</span>
            <span>{stockageObjet.poids_kg} kg</span>
          </div>
          <div className="fiche-ligne">
            <span>Date d'arrivée</span>
            <span>{stockageObjet.date_depot}</span>
          </div>
          <div className="fiche-ligne">
            <span>Dépôt</span>
            <span>#{stockageObjet.depot_id}</span>
          </div>
        </div>
      </div>

      {/* TODO: domaine C ajoutera ici le changement de statut (PATCH /objets/:id/statut) */}
    </div>
  );
};

export default FicheObjet;