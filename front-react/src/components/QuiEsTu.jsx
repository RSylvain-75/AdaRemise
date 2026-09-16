import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// On importe les hooks React nécessaires :
// useState permet de créer et modifier des données dans le composant.
// useEffect permet d'exécuter du code automatiquement au chargement du composant.
// useNavigate permet de changer de page avec React Router.


function QuiEsTu({ onIdentification }) {
  // Liste des bénévoles récupérée depuis l'API.
  // Au départ, la liste est vide.
  const [personnes, setPersonnes] = useState([]);

  // Permet de savoir si les données sont encore en train d'être chargées.
  // true au départ car la requête API n'a pas encore terminé.
  const [chargement, setChargement] = useState(true);

  // Stocke un éventuel message d'erreur.
  // null signifie qu'il n'y a pas d'erreur au départ.
  const [erreur, setErreur] = useState(null);

  // Fonction fournie par React Router pour naviguer vers une autre page.
  const navigate = useNavigate();

  // useEffect s'exécute automatiquement lorsque le composant est chargé.
  useEffect(() => {

    // Fonction asynchrone permettant de récupérer les bénévoles depuis l'API.
    const recupererPersonnes = async () => {
      try {
        // On envoie une requête GET à l'API pour récupérer la liste des bénévoles.
        const response = await fetch(
          "http://localhost:3000/api/benevoles"
        );

        // Si le serveur répond avec une erreur HTTP (404, 500, etc.),
        // on déclenche une erreur.
        if (!response.ok) {
          throw new Error(
            "Erreur lors du chargement des bénévoles"
          );
        }

        // On transforme la réponse de l'API en données JavaScript.
        const data = await response.json();

        // On vérifie que l'API nous renvoie bien un tableau.
        // Cela évite d'essayer d'utiliser .map() sur un mauvais format de données.
        if (!Array.isArray(data)) {
          throw new Error("Format de données invalide");
        }

        // On enregistre la liste des bénévoles dans notre state.
        // Cela permet à React de mettre automatiquement l'affichage à jour.
        setPersonnes(data);

      } catch (error) {
        // Affiche l'erreur dans la console pour faciliter le débogage.
        console.error(error);

        // Message affiché à l'utilisateur si la récupération échoue.
        setErreur(
          "Impossible de charger la liste des bénévoles."
        );

      } finally {
        // Que la requête réussisse ou échoue,
        // on indique que le chargement est terminé.
        setChargement(false);
      }
    };

    // On lance la récupération des bénévoles.
    recupererPersonnes();

  // Le tableau vide signifie que useEffect s'exécute une seule fois,
  // lorsque le composant est monté.
  }, []);

  // Cette fonction est appelée lorsqu'un bénévole clique sur son nom.
  const selectionnerBenevole = (personne) => {

    // On sauvegarde l'identifiant du bénévole dans le navigateur.
    // Cela permet de conserver son identification pendant la navigation.
    localStorage.setItem("benevoleId", personne.id);

    // Une fois le bénévole sélectionné, on redirige vers la liste des objets.
    navigate("/liste");
  };

  // Si les bénévoles sont encore en train d'être récupérés,
  // on affiche un message de chargement.
  if (chargement) {
    return <p>Chargement des personnes...</p>;
  }

  // Si une erreur s'est produite pendant la récupération,
  // on affiche le message d'erreur.
  if (erreur) {
    return <p>{erreur}</p>;
  }

  // Affichage principal de la page "Qui es-tu ?"
  return (
    <main>
      <h1>Qui es-tu ?</h1>

      <div>
        {/*
          On parcourt la liste des bénévoles avec .map().
          Pour chaque bénévole, on crée un bouton.
        */}
        {personnes.map((personne) => (
          <button
            // React a besoin d'une clé unique pour chaque élément de la liste.
            key={personne.id}

            type="button"

            // Lorsque l'utilisateur clique sur le bouton,
            // on appelle selectionnerBenevole avec le bénévole choisi.
            onClick={() => selectionnerBenevole(personne)}
          >
            {/* Affichage du prénom et du nom du bénévole. */}
            {personne.prenom} {personne.nom}
          </button>
        ))}
      </div>
    </main>
  );
}

// On exporte le composant pour pouvoir l'utiliser dans les autres fichiers React.
export default QuiEsTu;

