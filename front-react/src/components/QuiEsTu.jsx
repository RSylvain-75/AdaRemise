import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function QuiEsTu() {
  const [personnes, setPersonnes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const recupererPersonnes = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/personnes");

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des personnes");
        }

        const data = await response.json();
        setPersonnes(data);
      } catch (error) {
        console.error(error);
        setErreur("Impossible de charger la liste des personnes.");
      } finally {
        setChargement(false);
      }
    };

    recupererPersonnes();
  }, []);

  const selectionnerBenevole = (personne) => {
    localStorage.setItem("benevoleId", personne.id);
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