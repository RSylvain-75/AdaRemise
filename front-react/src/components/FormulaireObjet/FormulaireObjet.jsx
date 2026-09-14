import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./FormulaireObjet.css";

const FormulaireObjet = () => {
  const [libelle, setLibelle] = useState("");
  // poidsKg est stocké comme un nombre (conversion faite dans le onChange, voir plus bas)
  const [poidsKg, setPoidsKg] = useState("");
  const [etatArrivee, setEtatArrivee] = useState("");
  // categorieId est stocké comme un nombre, pas une chaîne, pour matcher ce qu'attend le back
  const [categorieId, setCategorieId] = useState("");
  // depotId vient toujours de l'URL (route /objets/nouveau/:depotId) :
  // plus besoin de useState, c'est une valeur fixe pendant toute la durée du formulaire
  const { depotId } = useParams();
  const [listeCategories, setListeCategories] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  // succes : true une fois l'objet créé, pour afficher un message de confirmation à l'écran
  const [succes, setSucces] = useState(false);
  // erreurValidation est séparé de "erreur" : "erreur" déclenche les deux if ci-dessous
  // et remplace TOUT le formulaire par un message ("Echec du chargement") — utile pour
  // une erreur de chargement initial, mais pas pour une erreur de saisie, qui doit
  // s'afficher À CÔTÉ du formulaire sans le faire disparaître
  const [erreurValidation, setErreurValidation] = useState("");

  // récupère les catégories une seule fois, au montage
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

  // trois écrans possibles : chargement, erreur de chargement, ou le formulaire normal
  if (chargement) {
    return <p className="page-message"> Chargement... </p>;
  }
  if (erreur) {
    return <p className="page-message"> Echec du chargement </p>;
  }

  // fonction déclenchée au clic sur le bouton, pas dans un useEffect :
  // contrairement au fetch des catégories (qui doit se lancer automatiquement),
  // la création d'un objet ne doit se déclencher que sur une action explicite de l'utilisatrice
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
          // les clés respectent le nommage attendu par le back (snake_case),
          // même si les variables React sont en camelCase (ex: poids_kg: poidsKg)
          libelle,
          poids_kg: poidsKg,
          etat_arrivee: etatArrivee,
          categorie_id: categorieId,
          // depotId vient de useParams(), donc c'est une chaîne ("31") : on convertit
          // en nombre ici, au moment de l'envoi, comme l'exige la route back
          depot_id: Number(depotId),
        }),
      });
      const donnees = await response.json();
      setSucces(true);
      // on remet chaque champ à sa valeur initiale pour permettre d'ajouter
      // un nouvel objet directement, sans recharger la page ni renaviguer
      setLibelle("");
      setPoidsKg("");
      setEtatArrivee("");
      setCategorieId("");
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
            // Number(...) convertit la chaîne renvoyée par l'input en vrai nombre JS
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

        {/* depotId vient de l'URL, connu et fixe : affichage en lecture seule, plus de saisie manuelle */}
        <div className="formulaire-champ">
          <label>Numéro du dépôt</label>
          <p>#{depotId}</p>
        </div>

        <div className="formulaire-actions">
          <Link to={`/depot/${depotId}`} className="bouton-secondaire">
            Annuler
          </Link>
          <button className="bouton-primaire" onClick={creerObjet}>
            Créer l'objet
          </button>
        </div>

        {/* affichage conditionnel : ce message n'apparaît que si succes vaut true */}
        {succes && <p className="message-succes">Objet créé</p>}
        {/* même principe : n'apparaît que si erreurValidation contient un message */}
        {erreurValidation && <p className="message-erreur">{erreurValidation}</p>}
      </div>
    </div>
  );
};

export default FormulaireObjet;