import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./FormulaireObjet.css";

const FormulaireObjet = () => {
  // Récupère les paramètres présents dans l'URL.
  const [searchParams] = useSearchParams();
  // Récupère automatiquement l'id du dépôt transmis dans l'URL.
  const depotIdUrl = searchParams.get("depot");

  const [libelle, setLibelle] = useState("");
  // poidsKg est stocké comme un nombre (conversion faite dans le onChange, voir plus bas)
  const [poidsKg, setPoidsKg] = useState("");
  const [etatArrivee, setEtatArrivee] = useState("");
  // categorieId est stocké comme un nombre, pas une chaîne, pour matcher ce qu'attend le back
  const [categorieId, setCategorieId] = useState("");
  // Récupère automatiquement l'id du dépôt depuis l'URL lorsqu'on arrive depuis une fiche dépôt.
  // Si aucun dépôt n'est indiqué dans l'URL, le champ reste vide et peut être renseigné manuellement.
 const [depotId, setDepotId] = useState(depotIdUrl ? Number(depotIdUrl) : "");
  // TODO: une fois GET /depots confirmé chez B et récupéré via Git,
  // ajouter ici un state pour la liste des dépôts, ex: const [listeDepots, setListeDepots] = useState([]);
  const [listeCategories, setListeCategories] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  // succes : true une fois l'objet créé, pour afficher un message de confirmation à l'écran
  const [succes, setSucces] = useState(false);

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

  // TODO: ajouter ici un second useEffect qui récupère la liste des dépôts (GET /depots),
  // sur le modèle exact de celui des catégories ci-dessus

  if (chargement) {
    return <p className="page-message"> Chargement... </p>;
  }
  if (erreur) {
    return <p className="page-message"> Echec du chargement </p>;
  }

  // fonction déclenchée au clic sur le bouton (pas dans un useEffect : pas de déclenchement automatique)
  const creerObjet = async () => {
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
          depot_id: depotId,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de l'objet");
      }
      setSucces(true);
      // on remet chaque champ à sa valeur initiale pour permettre d'ajouter
      // un nouvel objet directement, sans recharger la page ni renaviguer
      setLibelle("");
      setPoidsKg("");
      setEtatArrivee("");
      setCategorieId("");
      // Si aucun dépôt n'a été transmis dans l'URL, on réinitialise son numéro.
      // Sinon, on conserve l'id pour pouvoir ajouter plusieurs objets au même dépôt.
      if (!depotIdUrl) {
      setDepotId("");
      }
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

        {/* Si l'id du dépôt est transmis dans l'URL, il est utilisé automatiquement.
          Sinon, le numéro du dépôt peut être renseigné manuellement. */}
       {depotIdUrl ? (
        <div className="formulaire-champ">
          <label>Dépot</label>
          <p>Dépot n°{depotId}</p>
          </div>
       ) : (
        <div className="formulaire-champ">
          <label>Numéro du dépôt</label>
          <input
          type="number"
          value={depotId}
          onChange={(e) => setDepotId(Number(e.target.value))}
          />
          </div>
       )}

        <div className="formulaire-actions">
          <Link to="/" className="bouton-secondaire">
            Annuler
          </Link>
          <button className="bouton-primaire" onClick={creerObjet}>
            Créer l'objet
          </button>
        </div>

        {/* affichage conditionnel : ce message n'apparaît que si succes vaut true */}
        {succes && <p className="message-succes">Objet créé</p>}
      </div>
    </div>
  );
};

export default FormulaireObjet;