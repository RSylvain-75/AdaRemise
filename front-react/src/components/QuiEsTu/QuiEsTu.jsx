import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./QuiEsTu.css";

function QuiEsTu() {
  const [personnes, setPersonnes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const recupererPersonnes = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/benevoles"
        );

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des bénévoles");
        }

        const data = await response.json();

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

  return (
    <main className="identification-page">
      <div className="identification-background" />

      <section className="identification-panel">
        <header className="identification-logo">
          <div className="identification-logo-icon">R</div>

          <div>
            <p className="identification-logo-title">LA REMISE</p>
            <p className="identification-logo-subtitle">
              UN MONDE PLUS DURABLE
            </p>
          </div>
        </header>

        <div className="identification-content">
          <p className="identification-label">Bienvenue</p>

          <h1>Qui es-tu ?</h1>

          <p className="identification-description">
            Sélectionne ton profil pour commencer ta session.
          </p>

          <div className="identification-personnes">
            {chargement && (
              <p className="identification-message">
                Chargement des bénévoles...
              </p>
            )}

            {erreur && (
              <p className="identification-erreur">
                {erreur}
              </p>
            )}

            {!chargement &&
              !erreur &&
              personnes.map((personne) => (
                <button
                  key={personne.id}
                  type="button"
                  className="identification-personne"
                  onClick={() => selectionnerBenevole(personne)}
                >
                  <span className="identification-avatar">
                    {personne.prenom?.charAt(0)}
                    {personne.nom?.charAt(0)}
                  </span>

                  <span className="identification-personne-infos">
                    <strong>
                      {personne.prenom} {personne.nom}
                    </strong>
                    <small>Bénévole</small>
                  </span>

                  <span className="identification-arrow">→</span>
                </button>
              ))}
          </div>
        </div>

        <footer className="identification-footer">
          <span className="identification-footer-icon">♻</span>

          <div>
            <strong>Moins de déchets,</strong>
            <span>plus d'histoires.</span>
          </div>
        </footer>
      </section>
    </main>
  );
}

export default QuiEsTu;