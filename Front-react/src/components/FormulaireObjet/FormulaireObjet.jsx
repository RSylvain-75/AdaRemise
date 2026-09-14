import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./FormulaireObjet.css";

const FormulaireObjet = () => {
  const [libelle, setLibelle] = useState("");
  const [poidsKg, setPoidsKg] = useState("");
  const [etatArrivee, setEtatArrivee] = useState("");
  const [categorieId, setCategorieId] = useState("");
  // depotId : saisi à la main pour l'instant (pas de select, faute de route GET /depots disponible)
  const [depotId, setDepotId] = useState("");
  // TODO: une fois GET /depots confirmé chez B et récupéré via Git,
  // ajouter ici un state pour stocker la liste des dépôts, ex: const [listeDepots, setListeDepots] = useState([]);
  const [listeCategories, setListeCategories] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [succes, setSucces] = useState(false);

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

  // TODO: ajouter ici un second useEffect qui récupère la liste des dépôts
  // (GET /depots), sur le modèle exact de celui des catégories ci-dessus

  if (chargement) {
    return <p className="page-message"> Chargement... </p>;
  }
  if (erreur) {
    return <p className="page-message"> Echec du chargement </p>;
  }

  const creerObjet = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/objets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          libelle,
          poids_kg: poidsKg,
          etat_arrivee: etatArrivee,
          categorie_id: categorieId,
          depot_id: depotId,
        }),
      });
      const donnees = await response.json();
      setSucces(true);
      setLibelle("");
      setPoidsKg("");
      setEtatArrivee("");
      setCategorieId("");
      setDepotId("");
    } catch (err) {
      setErreur(err);
    }
  };

  return (
    <div className="page-formulaire">
      <Link to="/" className="lien-retour">
        ← Retour à la liste
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

        {/* TODO: remplacer cet input par un <select> alimenté par listeDepots, une fois GET /depots disponible */}
        <div className="formulaire-champ">
          <label>Numéro du dépôt</label>
          <input
            type="number"
            value={depotId}
            onChange={(e) => setDepotId(Number(e.target.value))}
            placeholder="Numéro du dépôt (ex: 5)"
          />
        </div>

        <div className="formulaire-actions">
          <Link to="/" className="bouton-secondaire">
            Annuler
          </Link>
          <button className="bouton-primaire" onClick={creerObjet}>
            Créer l'objet
          </button>
        </div>

        {succes && <p className="message-succes">Objet créé</p>}
      </div>
    </div>
  );
};

export default FormulaireObjet;