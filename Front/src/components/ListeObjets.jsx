import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ListeObjets = () => {
  // liste des objets reçus de l'API
  const [listeObjets, setListeObjets] = useState([]);
  // true tant que le tout premier fetch n'est pas terminé
  const [chargement, setChargement] = useState(true);
  // contient l'erreur si un fetch échoue, sinon null
  const [erreur, setErreur] = useState(null);
  // statut actuellement sélectionné dans le filtre ("" = tous)
  const [statutFiltre, setStatutFiltre] = useState("");
  // liste des catégories reçues de l'API, pour peupler le <select>
  const [listeCategories, setListeCategories] = useState([]);
  // catégorie actuellement sélectionnée dans le filtre ("" = toutes)
  const [typeCategories, setTypeCategories] = useState("");

  // récupère les objets, relancé à chaque changement de filtre (statut ou catégorie)
  useEffect(() => {
    const recupererObjets = async () => {
      try {
        // construit les query params de l'URL, un paramètre par filtre actif
        const params = new URLSearchParams();                      // ancienne : const parametres = [];
        if (statutFiltre) {
          // ajoute "statut=..." seulement si un statut est sélectionné
          params.append("statut", statutFiltre);                   // ancienne : parametres.push(`statut=${statutFiltre}`);
        }
        if (typeCategories) {
          // ajoute "categorie_id=..." seulement si une catégorie est sélectionnée
          params.append("categorie_id", typeCategories);           // ancienne : parametres.push(`categorie_id=${typeCategories}`);
        }
        // assemble l'URL finale ; si params est vide, ça donne juste "...objets?" (sans danger)
        const url = `http://localhost:3000/api/objets?${params.toString()}`;  // ancienne : parametres.join("&") + ternaire

        const response = await fetch(url);
        const donnees = await response.json();
        setListeObjets(donnees);
        setChargement(false);
      } catch (err) {
        // en cas d'échec réseau ou serveur, on arrête le chargement et on stocke l'erreur
        setErreur(err);
        setChargement(false);
      }
    };
    recupererObjets();
  }, [statutFiltre, typeCategories]);

  // récupère les catégories une seule fois, au montage (elles ne dépendent d'aucun filtre)
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

  // trois écrans possibles : chargement, erreur, ou la liste normale
  if (chargement) {
    return <p> Chargement... </p>;
  }
  if (erreur) {
    return <p> Echec du chargement </p>;
  }

  return (
    <>
      {/* filtre par statut, liste fixe écrite en dur */}
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

      {/* filtre par catégorie, options générées dynamiquement depuis l'API */}
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

      {/* liste des objets déjà filtrés côté back */}
<div>
  {listeObjets.map((objet) => (
    // Link rend toute la carte cliquable, sans recharger la page (contrairement à une balise <a>)
    // "to" construit dynamiquement l'URL de destination pour chaque objet, ex: /objets/12
    <Link key={objet.id} to={`/objets/${objet.id}`}>
      <div>
        <p>{objet.libelle}</p>
        <p>
          {objet.statut} · {objet.categorie}
        </p>
      </div>
    </Link>
  ))}
</div>
    </>
  );
};

export default ListeObjets;