// useState permet de stocker et modifier des données dans le composant.
// useEffect permet d'exécuter une action au chargement du composant.
import { useEffect, useState } from "react";

// useNavigate vient de React Router.
// Il permet de changer de page directement depuis du JavaScript.
import { useNavigate } from "react-router-dom";

// Import du CSS spécifique à la page d'identification.
import "./QuiEsTu.css";


function QuiEsTu() {

  // Tableau qui contiendra la liste des bénévoles
  // récupérée depuis notre API.
  //
  // Au départ le tableau est vide car la requête
  // vers le backend n'a pas encore été effectuée.
  const [personnes, setPersonnes] = useState([]);


  // Permet de savoir si la récupération des bénévoles
  // est toujours en cours.
  //
  // true au départ car la requête va être lancée
  // dès l'ouverture de la page.
  const [chargement, setChargement] = useState(true);


  // Permet de stocker un éventuel message d'erreur.
  //
  // null signifie qu'aucune erreur n'est présente au départ.
  const [erreur, setErreur] = useState(null);


  // useNavigate nous donne une fonction permettant
  // de rediriger l'utilisateur vers une autre route.
  //
  // Exemple :
  // navigate("/liste")
  const navigate = useNavigate();


  // useEffect est exécuté après le premier affichage
  // du composant QuiEsTu.
  useEffect(() => {

    // Fonction asynchrone permettant de récupérer
    // la liste des bénévoles depuis le backend.
    const recupererPersonnes = async () => {

      try {

        // Appel GET vers la route /api/benevoles
        // de notre API Express.
        //
        // await attend que le serveur réponde
        // avant de continuer l'exécution.
        const response = await fetch(
          "http://localhost:3000/api/benevoles"
        );


        // fetch ne considère pas automatiquement
        // une réponse HTTP 404 ou 500 comme une erreur.
        //
        // response.ok vaut true pour une réponse HTTP
        // comprise entre 200 et 299.
        if (!response.ok) {
          throw new Error(
            "Erreur lors du chargement des bénévoles"
          );
        }


        // Transformation de la réponse JSON
        // envoyée par l'API en données JavaScript.
        const data = await response.json();


        // On vérifie que l'API nous a bien renvoyé un tableau.
        //
        // C'est important car personnes.map() utilisé plus bas
        // ne fonctionnerait pas si data était par exemple un objet.
        if (!Array.isArray(data)) {
          throw new Error("Format de données invalide");
        }


        // Si tout s'est correctement passé,
        // on stocke la liste des bénévoles dans le state.
        //
        // React va ensuite automatiquement refaire le rendu
        // du composant avec les nouvelles données.
        setPersonnes(data);

      } catch (error) {

        // Si une erreur se produit dans le try,
        // elle est récupérée ici.
        //
        // On affiche d'abord l'erreur technique dans la console.
        console.error(error);


        // Puis on enregistre un message plus compréhensible
        // destiné à l'utilisateur.
        setErreur(
          "Impossible de charger la liste des bénévoles."
        );

      } finally {

        // finally est exécuté dans tous les cas :
        // que la requête réussisse ou échoue.
        //
        // On indique donc que le chargement est terminé.
        setChargement(false);
      }
    };


    // Exécution de la fonction qui vient d'être créée.
    recupererPersonnes();


  // Le tableau de dépendances est vide [].
  //
  // Cela signifie que ce useEffect est exécuté
  // une seule fois lors du montage du composant.
  }, []);


  // Fonction appelée lorsque l'utilisateur
  // clique sur un bénévole.
  const selectionnerBenevole = (personne) => {

    // On enregistre l'identifiant du bénévole sélectionné
    // dans le localStorage du navigateur.
    //
    // Cela permet aux autres composants de savoir
    // quel bénévole utilise actuellement l'application.
    //
    // Exemple :
    // benevoleId = 3
    localStorage.setItem("benevoleId", personne.id);


    // Une fois le bénévole sélectionné,
    // React Router redirige l'utilisateur
    // vers la liste des objets.
    //
    // Cette navigation se fait sans recharger toute l'application.
    navigate("/liste");
  };


  // Rendu JSX de la page.
  return (

    // Élément principal de la page d'identification.
    <main className="identification-page">


      {/* Image utilisée comme arrière-plan de la page.
          L'image elle-même est définie dans QuiEsTu.css. */}
      <div className="identification-background" />


      {/* Panneau situé à gauche contenant
          toute la partie identification. */}
      <section className="identification-panel">


        {/* ========================== */}
        {/* LOGO / IDENTITÉ VISUELLE   */}
        {/* ========================== */}

        <header className="identification-logo">

          {/* Logo simplifié avec la lettre R */}
          <div className="identification-logo-icon">
            R
          </div>

          <div>

            <p className="identification-logo-title">
              LA REMISE
            </p>

            <p className="identification-logo-subtitle">
              UN MONDE PLUS DURABLE
            </p>

          </div>

        </header>


        {/* ========================== */}
        {/* CONTENU PRINCIPAL          */}
        {/* ========================== */}

        <div className="identification-content">

          <p className="identification-label">
            Bienvenue
          </p>

          <h1>
            Qui es-tu ?
          </h1>

          <p className="identification-description">
            Sélectionne ton profil pour commencer ta session.
          </p>


          {/* Conteneur dans lequel sera affichée
              la liste des bénévoles. */}
          <div className="identification-personnes">


            {/* Si chargement === true,
                on indique que les données sont en cours
                de récupération depuis l'API. */}
            {chargement && (
              <p className="identification-message">
                Chargement des bénévoles...
              </p>
            )}


            {/* Si une erreur existe,
                on affiche le message enregistré
                dans le state erreur. */}
            {erreur && (
              <p className="identification-erreur">
                {erreur}
              </p>
            )}


            {/* La liste est affichée uniquement si :
                
                1. le chargement est terminé
                2. aucune erreur n'est présente
                
                Cela évite d'essayer d'afficher les bénévoles
                avant d'avoir reçu les données. */}
            {!chargement &&
              !erreur &&

              // map() parcourt le tableau personnes.
              //
              // Pour chaque bénévole, React va créer
              // un bouton permettant de le sélectionner.
              personnes.map((personne) => (

                <button

                  // key permet à React d'identifier
                  // chaque élément de la liste de manière unique.
                  //
                  // L'id provenant de la base de données
                  // est idéal pour cela.
                  key={personne.id}

                  // On précise qu'il s'agit d'un bouton classique
                  // et non d'un bouton de soumission de formulaire.
                  type="button"

                  className="identification-personne"

                  // Au clic, on appelle selectionnerBenevole()
                  // en lui donnant le bénévole concerné.
                  onClick={() =>
                    selectionnerBenevole(personne)
                  }
                >


                  {/* ========================== */}
                  {/* AVATAR DU BÉNÉVOLE         */}
                  {/* ========================== */}

                  <span className="identification-avatar">

                    {/* charAt(0) récupère la première lettre
                        du prénom et du nom.

                        Exemple :
                        Sylvain Dupont -> SD

                        ?. est l'optional chaining :
                        il évite une erreur si prénom ou nom
                        n'existe pas. */}
                    {personne.prenom?.charAt(0)}
                    {personne.nom?.charAt(0)}

                  </span>


                  {/* ========================== */}
                  {/* INFORMATIONS DU BÉNÉVOLE   */}
                  {/* ========================== */}

                  <span className="identification-personne-infos">

                    {/* Affichage du prénom et du nom
                        récupérés depuis l'API. */}
                    <strong>
                      {personne.prenom} {personne.nom}
                    </strong>

                    {/* Pour le moment le rôle affiché
                        est toujours "Bénévole". */}
                    <small>
                      Bénévole
                    </small>

                  </span>


                  {/* Flèche purement visuelle indiquant
                      que le profil est cliquable. */}
                  <span className="identification-arrow">
                    →
                  </span>

                </button>
              ))}

          </div>

        </div>


        {/* ========================== */}
        {/* PIED DU PANNEAU            */}
        {/* ========================== */}

        <footer className="identification-footer">

          {/* Icône liée au réemploi / recyclage */}
          <span className="identification-footer-icon">
            ♻
          </span>

          <div>

            <strong>
              Moins de déchets,
            </strong>

            <span>
              plus d'histoires.
            </span>

          </div>

        </footer>

      </section>

    </main>
  );
}


// Export du composant pour pouvoir l'importer
// et l'utiliser notamment dans App.jsx.
export default QuiEsTu;