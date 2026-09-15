import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// onIdentification vient de App.jsx (c'est en réalité sa fonction setBenevoleId) :
// l'appeler ici permet de mettre à jour l'état de App, pas seulement celui de QuiEsTu
function QuiEsTu({ onIdentification }) {
  const [personnes, setPersonnes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const recupererPersonnes = async () => {
      try {
      const response = await fetch("http://localhost:3000/api/benevoles");

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des benevoles");
        }

        const data = await response.json();
        setPersonnes(data);
      } catch (error) {
        console.error(error);
        setErreur("Impossible de charger la liste des benevoles.");
      } finally {
        setChargement(false);
      }
    };

    recupererPersonnes();
  }, []);

  const selectionnerBenevole = (personne) => {
    // localStorage : persiste l'identification même après un rechargement de page
    localStorage.setItem("benevoleId", personne.id);
    // onIdentification : met à jour l'état React de App, pour que le re-rendu
    // se déclenche AVANT que navigate("/") ne change l'URL — sans cet appel,
    // App afficherait encore l'ancienne valeur (null) juste après la navigation
    onIdentification(personne.id);
    navigate("/");
  };

  if (chargement) {
    return <p>Chargement des personnes...</p>;
  }

  if (erreur) {
    return <p>{erreur}</p>;
  }

  return (
    <main>
      <h1>Qui es-tu ?</h1>

      <div>
        {personnes.map((personne) => (
          <button
            key={personne.id}
            type="button"
            onClick={() => selectionnerBenevole(personne)}
          >
            {personne.prenom} {personne.nom}
          </button>
        ))}
      </div>
    </main>
  );
}

export default QuiEsTu;