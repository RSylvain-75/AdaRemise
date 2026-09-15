import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./FormulaireObjet.css";

const FormulaireObjet = () => {
  const [libelle, setLibelle] = useState("");
  const [poidsKg, setPoidsKg] = useState("");
  const [etatArrivee, setEtatArrivee] = useState("");
  const [categorieId, setCategorieId] = useState("");
  // depotId vient de l'URL (route /objets/nouveau/:depotId), si elle est présente.
  // Cas normal du workflow : on arrive toujours via Fiche_depot avec un id connu.
  const { depotId: depotIdUrl } = useParams();
  // Repli : si jamais le formulaire est atteint sans depotId dans l'URL (accès direct,
  // cas non prévu par le workflow normal), le champ reste modifiable manuellement.
  const [depotId, setDepotId] = useState(depotIdUrl ? Number(depotIdUrl) : "");
  const [listeCategories, setListeCategories] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [succes, setSucces] = useState(false);
  const [erreurValidation, setErreurValidation] = useState("");

  useEffect(() => {
    const recupererCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/categories");
        const donnees = await response.json();
        setListeCategories(donnees);
        setChargement(false);
      } catch (err) {
        setErreur(err);
        setChargement(false);
      }
    };
    recupererCategories();
  }, []);

  if (chargement) {
    return <p className="page-message"> Chargement... </p>;
  }
  if (erreur) {
    return <p className="page-message"> Echec du chargement </p>;
  }

  const creerObjet = async () => {
    if (!libelle || !poidsKg || !etatArrivee || !categorieId || !depotId) {
      setErreurValidation("Merci de remplir tous les champs");
      return;
    }
    setErreurValidation("");
    try {
      const response = await fetch("http://localhost:3000/api/objets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          libelle,
          poids_kg: poidsKg,
          etat_arrivee: etatArrivee,
          categorie_id: categorieId,
          depot_id: Number(depotId),
        }),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de l'objet");
      }
      setSucces(true);
      setLibelle("");
      setPoidsKg("");
      setEtatArrivee("");
      setCategorieId("");
      // si depotId venait de l'URL (workflow normal), on le garde pour enchaîner
      // les ajouts au même dépôt ; sinon (saisie manuelle), on le vide aussi
      if (!depotIdUrl) {
        setDepotId("");
      }
    } catch (err) {
      setErreur(err);
    }
  };

  return (
    <div className="page-formulaire">
      <Link to={`/depot/${depotId}`} className="lien-retour">
        ← Retour au dépôt
      </Link>

      <h1>Nouvel objet</h1>

      <div className="formulaire-carte">
        <div className="formulaire-champ">
          <label>Libellé</label>
          <input
            type="text"
            value={libelle}
            onChange={(e) => setLibelle(e.target.value)}
            placeholder="Libellé"
          />
        </div>

        <div className="formulaire-champ">
          <label>Poids (kg)</label>
          <input
            type="number"
            value={poidsKg}
            onChange={(e) => setPoidsKg(Number(e.target.value))}
            placeholder="Poids en kg"
          />
        </div>

        <div className="formulaire-champ">
          <label>État d'arrivée</label>
          <select
            value={etatArrivee}
            onChange={(e) => setEtatArrivee(e.target.value)}
          >
            <option value="">Choisir un état</option>
            <option value="bon_etat">Bon état</option>
            <option value="a_reparer">À réparer</option>
            <option value="hors_service">Hors service</option>
          </select>
        </div>

        <div className="formulaire-champ">
          <label>Catégorie</label>
          <select
            value={categorieId}
            onChange={(e) => setCategorieId(Number(e.target.value))}
          >
            <option value="">Choisir une catégorie</option>
            {listeCategories.map((categorie) => (
              <option key={categorie.id} value={categorie.id}>
                {categorie.libelle}
              </option>
            ))}
          </select>
        </div>

        {/* si depotId vient de l'URL (workflow normal), affichage fixe en lecture seule ;
            sinon (accès direct sans dépôt précis), champ modifiable manuellement */}
        {depotIdUrl ? (
          <div className="formulaire-champ">
            <label>Numéro du dépôt</label>
            <p>#{depotId}</p>
          </div>
        ) : (
          <div className="formulaire-champ">
            <label>Numéro du dépôt</label>
            <input
              type="number"
              value={depotId}
              onChange={(e) => setDepotId(Number(e.target.value))}
              placeholder="Numéro du dépôt (ex: 5)"
            />
          </div>
        )}

        <div className="formulaire-actions">
          <Link to={`/depot/${depotId}`} className="bouton-secondaire">
            Annuler
          </Link>
          <button className="bouton-primaire" onClick={creerObjet}>
            Créer l'objet
          </button>
        </div>

        {succes && <p className="message-succes">Objet créé</p>}
        {erreurValidation && <p className="message-erreur">{erreurValidation}</p>}
      </div>
    </div>
  );
};

export default FormulaireObjet;