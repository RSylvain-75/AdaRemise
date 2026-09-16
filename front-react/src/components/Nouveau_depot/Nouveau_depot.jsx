import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Nouveau_depot.css";

export default function NouveauDepot() {
  const navigate = useNavigate();

  const [personnes, setPersonnes] = useState([]);
  const [personneId, setPersonneId] = useState("");
  const [dateDepot, setDateDepot] = useState("");
  const [type, setType] = useState("boutique");
  const [notes, setNotes] = useState("");
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [succes, setSucces] = useState(false);

  useEffect(() => {
    async function chargerPersonnes() {
      try {
        const res = await fetch("http://localhost:3000/api/personnes");

        if (!res.ok) {
          throw new Error("Impossible de charger les donateurs");
        }

        const data = await res.json();
        setPersonnes(data);
      } catch (error) {
        setErreur(error.message);
      } finally {
        setChargement(false);
      }
    }

    chargerPersonnes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!personneId || !dateDepot) {
      setErreur("Merci de remplir tous les champs obligatoires.");
      return;
    }

    setErreur(null);

    try {
      const nouveauDepot = {
        personne_id: personneId,
        date_depot: dateDepot,
        type: type,
        notes: notes,
      };

      const res = await fetch("http://localhost:3000/api/depots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nouveauDepot),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la création du dépôt");
      }

      const data = await res.json();

      setSucces(true);
      navigate(`/depot/${data.id}`);
    } catch (error) {
      setErreur(error.message);
    }
  };

  if (chargement) {
    return <p className="nouveau-depot-message">Chargement...</p>;
  }

  return (
    <main className="nouveau-depot-page">
      <div className="nouveau-depot-header">
        <div>
          <h1>Nouveau dépôt</h1>
          <p>Enregistrez l'arrivée d'un nouveau don à La Remise.</p>
        </div>
      </div>

      <section className="nouveau-depot-card">
        <div className="nouveau-depot-card-header">
          <div className="nouveau-depot-card-icon">R</div>

          <div>
            <h2>Informations du dépôt</h2>
            <p>Renseignez les informations concernant le nouveau don.</p>
          </div>
        </div>

        <form className="nouveau-depot-form" onSubmit={handleSubmit}>
          <div className="nouveau-depot-grid">
            <div className="nouveau-depot-field">
              <label htmlFor="donateur">
                Donateur <span>*</span>
              </label>

              <select
                id="donateur"
                value={personneId}
                onChange={(e) => setPersonneId(Number(e.target.value))}
              >
                <option value="">
                  Sélectionner un donateur existant
                </option>

                {personnes.map((personne) => (
                  <option key={personne.id} value={personne.id}>
                    {personne.prenom} {personne.nom}
                  </option>
                ))}
              </select>
            </div>

            <div className="nouveau-depot-field">
              <label htmlFor="dateDepot">
                Date du dépôt <span>*</span>
              </label>

              <input
                id="dateDepot"
                type="date"
                value={dateDepot}
                onChange={(e) => setDateDepot(e.target.value)}
              />
            </div>
          </div>

          <fieldset className="nouveau-depot-type">
            <legend>
              Type de dépôt <span>*</span>
            </legend>

            <div className="nouveau-depot-options">
              <label
                className={`depot-option ${
                  type === "boutique" ? "depot-option-active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value="boutique"
                  checked={type === "boutique"}
                  onChange={(e) => setType(e.target.value)}
                />

                <span className="depot-option-radio"></span>

                <span className="depot-option-content">
                  <strong>En boutique</strong>
                  <small>Dépôt effectué directement à La Remise</small>
                </span>
              </label>

              <label
                className={`depot-option ${
                  type === "domicile" ? "depot-option-active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value="domicile"
                  checked={type === "domicile"}
                  onChange={(e) => setType(e.target.value)}
                />

                <span className="depot-option-radio"></span>

                <span className="depot-option-content">
                  <strong>À domicile</strong>
                  <small>Collecte effectuée chez le donateur</small>
                </span>
              </label>
            </div>
          </fieldset>

          <div className="nouveau-depot-field">
            <label htmlFor="notes">Notes (optionnel)</label>

            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Informations complémentaires..."
            />
          </div>

          {erreur && (
            <p className="nouveau-depot-erreur">
              {erreur}
            </p>
          )}

          {succes && (
            <p className="nouveau-depot-succes">
              Dépôt créé avec succès !
            </p>
          )}

          <div className="nouveau-depot-actions">
            <button
              type="button"
              className="depot-button-secondary"
              onClick={() => navigate("/liste")}
            >
              Annuler
            </button>

            <button
              type="submit"
              className="depot-button-primary"
            >
              Créer le dépôt
              <span>→</span>
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}