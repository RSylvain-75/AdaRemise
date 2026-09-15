import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NouveauDepot() {
  const navigate = useNavigate();

  // --- États ---
  const [benevole, setBenevole] = useState(null);
  const [personnes, setPersonnes] = useState([]);
  const [personneId, setPersonneId] = useState("");
  const [dateDepot, setDateDepot] = useState("");
  const [type, setType] = useState("boutique");
  const [notes, setNotes] = useState("");

  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [succes, setSucces] = useState(false);

  const benevoleId = localStorage.getItem("benevoleId");

  // --- Charger le bénévole connecté ---
  useEffect(() => {
    if (!benevoleId) return;

    async function chargerBenevole() {
      try {
        const res = await fetch(`http://localhost:3000/api/benevoles/${benevoleId}`);
        if (!res.ok) return;
        const data = await res.json();
        setBenevole(data);
      } catch (error) {
        console.error("Erreur chargement bénévole :", error);
      }
    }

    chargerBenevole();
  }, [benevoleId]);

  // --- Charger la liste des donateurs ---
  useEffect(() => {
    async function chargerPersonnes() {
      try {
        const res = await fetch("http://localhost:3000/api/personnes");
        if (!res.ok) throw new Error("Impossible de charger les donateurs");
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

  // --- Déconnexion ---
  const handleLogout = () => {
    localStorage.removeItem("benevoleId");
    navigate("/qui-es-tu");
  };

  // --- Soumission du formulaire ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!personneId || !dateDepot) {
      setErreur("Merci de remplir tous les champs obligatoires.");
      return;
    }

    try {
      const nouveauDepot = {
        personne_id: personneId,
        date_depot: dateDepot,
        type: type,
        notes: notes
      };

      const res = await fetch("http://localhost:3000/api/depots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nouveauDepot)
      });

      if (!res.ok) throw new Error("Erreur lors de la création du dépôt");

      const data = await res.json();
      setSucces(true);
      navigate(`/depot/${data.id}`);
    } catch (error) {
      setErreur(error.message);
    }
  };

  // --- Affichages ---
  if (chargement) return <p>Chargement...</p>;
  if (erreur) return <p>Erreur: {erreur}</p>;

  return (
    <div>
      <header>
        <h1>AdaRemise</h1>
        {benevole && (
          <p>
            Connecté : {benevole.prenom} {benevole.nom}
          </p>
        )}
        <button onClick={handleLogout}>Déconnexion</button>
      </header>

      <main>
        <h2>Nouveau dépôt</h2>

        <form onSubmit={handleSubmit}>
          <label>
            Donateur *
            <select
              value={personneId}
              onChange={(e) => setPersonneId(Number(e.target.value))}
            >
              <option value="">Sélectionner un donateur existant</option>
              {personnes.map((personne) => (
                <option key={personne.id} value={personne.id}>
                  {personne.prenom} {personne.nom}
                </option>
              ))}
            </select>
          </label>

          <label>
            Date du dépôt *
            <input
              type="date"
              value={dateDepot}
              onChange={(e) => setDateDepot(e.target.value)}
            />
          </label>

          <fieldset>
            <legend>Type de dépôt *</legend>
            <label>
              <input
                type="radio"
                name="type"
                value="boutique"
                checked={type === "boutique"}
                onChange={(e) => setType(e.target.value)}
              />
              En boutique
            </label>
            <label>
              <input
                type="radio"
                name="type"
                value="domicile"
                checked={type === "domicile"}
                onChange={(e) => setType(e.target.value)}
              />
              À domicile
            </label>
          </fieldset>

          <label>
            Notes (optionnel)
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Informations complémentaires..."
            />
          </label>

          {succes && <p>Dépôt créé avec succès !</p>}

          <button type="button" onClick={() => navigate("/")}>
            Annuler
          </button>
          <button type="submit">Créer le dépôt</button>
        </form>
      </main>
    </div>
  );
}
