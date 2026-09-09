import { useEffect, useState } from "react";

// La prop onPersonneSelectionnee permet de transmettre
// la personne choisie à App.jsx lors de l'intégration
function QuiEsTu({ onPersonneSelectionnee }) {
  // Stocke la liste des personnes récupérées depuis l'API
  const [personnes, setPersonnes] = useState([]);

  // Stocke la personne sélectionnée dans ce composant
  const [personneSelectionnee, setPersonneSelectionnee] = useState(null);

  // Indique si la liste est encore en cours de chargement
  const [chargement, setChargement] = useState(true);

  // Stocke un éventuel message d'erreur
  const [erreur, setErreur] = useState("");

  // Récupère les personnes depuis l'API lorsque le composant est chargé
  useEffect(() => {
    fetch("http://localhost:3000/api/personnes")
      .then((response) => {
        // Vérifie que la réponse de l'API est correcte
        if (!response.ok) {
          throw new Error("Impossible de récupérer les personnes");
        }

        return response.json();
      })
      .then((data) => {
        // Enregistre la liste des personnes dans le state
        setPersonnes(data);
      })
      .catch((error) => {
        // Gère les erreurs de connexion à l'API
        console.error(error);
        setErreur("Impossible de charger la liste des personnes.");
      })
      .finally(() => {
        // Indique que le chargement est terminé
        setChargement(false);
      });
  }, []);

  // Affiche un message pendant le chargement de la liste
  if (chargement) {
    return <p>Chargement des personnes...</p>;
  }

  // Affiche un message si la récupération des personnes échoue
  if (erreur) {
    return <p>{erreur}</p>;
  }

  return (
    <section>
      <h2>Qui es-tu ?</h2>

      {/* Affiche toutes les personnes récupérées depuis l'API */}
      <div>
        {personnes.map((personne) => (
          <button
            key={personne.id}
            onClick={() => {
              // Enregistre la personne sélectionnée dans ce composant
              setPersonneSelectionnee(personne);

              // Transmet la personne sélectionnée au composant parent
              // grâce à la prop onPersonneSelectionnee
              onPersonneSelectionnee(personne);
            }}
          >
            {personne.prenom} {personne.nom}
          </button>
        ))}
      </div>

      {/* Affiche la personne actuellement sélectionnée */}
      {personneSelectionnee && (
        <p>
          Personne sélectionnée :{" "}
          {personneSelectionnee.prenom} {personneSelectionnee.nom}
        </p>
      )}
    </section>
  );
}

// Permet à App.jsx d'importer et d'utiliser le composant
export default QuiEsTu;