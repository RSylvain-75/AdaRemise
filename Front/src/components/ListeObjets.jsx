import { useState, useEffect } from "react";

const ListeObjets = () => {
  const [listeObjets, setListeObjets] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    const recupererObjets = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/objets");
        const donnees = await response.json();
        setListeObjets(donnees);
        setChargement(false);
      } catch (err) {
        setErreur(err);
        setChargement(false);
      }
    };
    recupererObjets();
  }, []);

  if (chargement) {
    return <p> Chargement... </p>;
  }
  if (erreur) {
    return <p> Echec du chargement </p>;
  }

  return (
    <div>
      {listeObjets.map((objet) => (
        <div key={objet.id}>
          <p>{objet.libelle}</p>
          <p>{objet.statut} · {objet.categorie}</p>
        </div>
      ))}
    </div>
  );
};

export default ListeObjets;