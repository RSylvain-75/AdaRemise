import { useState, useEffect } from "react";

const ListeObjets = () => {
  const [listeObjets, setListeObjets] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [statutFiltre, setStatutFiltre] = useState("");
  const [listeCategories, setListeCategories] = useState([]);
  const [typeCategories, setTypeCategories] = useState("");

  useEffect(() => {
    const recupererObjets = async () => {
      try {
        const parametres = [];
        if (statutFiltre) {
          parametres.push(`statut=${statutFiltre}`);
        }
        if (typeCategories) {
          parametres.push(`categorie_id=${typeCategories}`);
        }
        const chaineParametres = parametres.join("&");
        const url = chaineParametres
          ? `http://localhost:3000/api/objets?${chaineParametres}`
          : "http://localhost:3000/api/objets";
        const response = await fetch(url);
        const donnees = await response.json();
        setListeObjets(donnees);
        setChargement(false);
      } catch (err) {
        setErreur(err);
        setChargement(false);
      }
    };
    recupererObjets();
  }, [statutFiltre, typeCategories]);

  useEffect(() => {
    const recupererCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/categories");
        const donnees = await response.json();
        setListeCategories(donnees);
      } catch (err) {
        setErreur(err);
      }
    };
    recupererCategories();
  }, []);

  if (chargement) {
    return <p> Chargement... </p>;
  }
  if (erreur) {
    return <p> Echec du chargement </p>;
  }

  return (
    <>
      <select
        value={statutFiltre}
        onChange={(e) => setStatutFiltre(e.target.value)}
      >
        <option value=""> Tous les status </option>
        <option value="arrive"> Arrivé </option>
        <option value="en_reparation"> En reparation </option>
        <option value="en_rayon"> En rayon </option>
        <option value="vendu"> Vendu </option>
        <option value="recycle"> Recyclé </option>
      </select>

      <select
        value={typeCategories}
        onChange={(e) => setTypeCategories(e.target.value)}
      >
        <option value="">Toutes les catégories</option>
        {listeCategories.map((categorie) => (
          <option key={categorie.id} value={categorie.id}>
            {categorie.libelle}
          </option>
        ))}
      </select>

      <div>
        {listeObjets.map((objet) => (
          <div key={objet.id}>
            <p>{objet.libelle}</p>
            <p>
              {objet.statut} · {objet.categorie}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default ListeObjets;