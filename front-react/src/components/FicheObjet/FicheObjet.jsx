import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import "./FicheObjet.css";

// Associe chaque catégorie de la BDD à son image générique.
// Les images sont stockées dans public/images/categories.
const imagesCategories = {
  Mobilier: "/images/categories/mobilier.png",
  Électroménager: "/images/categories/electromenager.png",
  Vaisselle: "/images/categories/vaisselle.png",
  Textile: "/images/categories/textile.png",
  Livres: "/images/categories/livres.png",
  Jouets: "/images/categories/jouets.png",
  Outillage: "/images/categories/outillage.png",
  Décoration: "/images/categories/decoration.png",
};

const FicheObjet = ({ id: idProp }) => {
  const { id: idUrl } = useParams();
  // id vient soit d'une prop (popup, appelé depuis ListeObjets), soit de l'URL (page /objets/:id)
  const id = idProp || idUrl;
  // location.state permet de recevoir des infos "invisibles" dans l'URL, passées par le composant
  // qui a déclenché la navigation (ici : Fiche_depot, via navigate(url, { state: { depotId } })).
  // Attention : cette info ne survit PAS à un rechargement de page (F5) ni à un accès direct
  // à l'URL — dans ces cas, location.state vaut undefined, et le lien retombe sur "/" (comportement
  // normal, géré par le ?. et le ternaire juste en dessous)
  const location = useLocation();
  // optional chaining (?.) : si on arrive ici sans state (ex: popup, ou lien direct), pas d'erreur,
  // depotIdOrigine vaut simplement undefined
  const depotIdOrigine = location.state?.depotId;

  // objet complet reçu de l'API ; null tant qu'il n'est pas encore chargé
  const [stockageObjet, setStockageObjet] = useState(null);
  // true tant que le fetch n'est pas terminé
  const [chargement, setChargement] = useState(true);
  // contient l'erreur si le CHARGEMENT INITIAL échoue, sinon null ; déclenche les deux if
  // ci-dessous, qui remplacent toute la fiche par un message — normal pour ce cas précis
  const [erreur, setErreur] = useState(null);
  // statut choisi dans le menu déroulant, avant validation ; vide tant que rien n'est sélectionné
  const [nouveauStatut, setNouveauStatut] = useState("");
  // erreur liée au changement de statut, séparée de "erreur" : contrairement à "erreur",
  // celle-ci s'affiche localement à côté du bouton, sans faire disparaître toute la fiche
  // (même piège que celui déjà rencontré dans FormulaireObjet)
  const [erreurStatut, setErreurStatut] = useState("");

  // se relance à chaque fois que "id" change, pour aller chercher les détails de l'objet correspondant
  useEffect(() => {
    const recupererObjet = async () => {
      try {
        const reponse = await fetch(`http://localhost:3000/api/objets/${id}`);
        if (!reponse.ok) {
          // throw arrête immédiatement l'exécution de cette fonction et fait directement
          // "sauter" au bloc catch ci-dessous, comme si une vraie erreur réseau s'était produite.
          // Nécessaire ici car fetch() ne considère PAS un 404/500 comme une erreur : sans ce throw,
          // le code continuerait normalement et afficherait un objet vide/incomplet à l'écran.
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
    // validation avant envoi : évite un appel API inutile si rien n'est sélectionné
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
      // même piège que pour le chargement initial : fetch() ne considère pas un 400
      // comme une erreur, donc sans ce throw, un statut invalide écraserait stockageObjet
      // avec l'objet d'erreur renvoyé par le back ({ error: "statut invalide" })
      if (!response.ok) {
        throw new Error("Impossible de mettre à jour le statut.");
      }
      const donnees = await response.json();
      // la route back fait un RETURNING *, donc "donnees" contient déjà l'objet à jour :
      // on remplace directement stockageObjet, pas besoin de refaire un fetch séparé
      setStockageObjet(donnees);
    } catch {
      setErreurStatut("Impossible de mettre à jour le statut.");
    }
  };

  // trois écrans possibles : chargement, erreur, ou la fiche normale
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
       
       {/* L'image affichée dépend de la catégorie de l'objet. */}
        <div className="fiche-image-placeholder">
          <img
            src={imagesCategories[stockageObjet.categorie]}
            alt={`Catégorie ${stockageObjet.categorie}`}
            className="fiche-image"
          />
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

      {/* changement de statut : menu déroulant + bouton, connecté à PATCH /objets/:id/statut.
          Fonctionnalité normalement du domaine C, ajoutée ici après accord de l'équipe */}
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
          {/* affichage conditionnel : ce message n'apparaît que si erreurStatut contient un texte */}
          {erreurStatut && <p className="message-erreur">{erreurStatut}</p>}
        </div>
      </div>
    </div>
  );
};

export default FicheObjet;