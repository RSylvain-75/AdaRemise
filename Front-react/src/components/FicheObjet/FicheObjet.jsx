import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./FicheObjet.css";

const FicheObjet = () => {
    const { id } = useParams();
    const [stockageObjet, setStockageObjet] = useState(null)
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState(null);
  
  
  useEffect(() => {
  const recupererObjet = async () => {
    try {
      const reponse = await fetch(`http://localhost:3000/api/objets/${id}`);
      const donnees = await reponse.json();
      setStockageObjet (donnees)
      setChargement (false)
    } catch (err) {
      setErreur(err)
      setChargement(false)
    }
  };
  recupererObjet();
}, [id]);
  
  if (chargement) {
  return <p> Chargement... </p>;
}
if (erreur) {
  return <p> Echec du chargement </p>;
}
return (
    <> 
    <p> {stockageObjet.libelle} </p>
    <p> {stockageObjet.poids_kg} </p>
    <p> {stockageObjet.etat_arrivee} </p>
    <p> {stockageObjet.categorie} </p>
    <p> {stockageObjet.prix} </p>
    <p> {stockageObjet.donatrice_nom} </p>
    <p> {stockageObjet.donatrice_prenom} </p>
    <p> {stockageObjet.statut} </p>
    </>
)
};

export default FicheObjet;