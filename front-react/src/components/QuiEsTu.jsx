import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
          throw new Error("Erreur lors du chargement des bénévoles");
        }

        const data = await response.json();

        // Vérification utile
        if (!Array.isArray(data)) {
          throw new Error("Format de données invalide");
        }

        setPersonnes(data);
      } catch (error) {
        console.error(error);
        setErreur("Impossible de charger la liste des bénévoles.");
      } finally {
        setChargement(false);
      }
    };

    recupererPersonnes();
  }, []);

  const selectionnerBenevole = (personne) => {
    localStorage.setItem("benevoleId", personne.id);
    navigate("/liste");
  };

  if (chargement) return <p>Chargement des personnes...</p>;
  if (erreur) return <p>{erreur}</p>;

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
