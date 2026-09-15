import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FicheObjet from "../FicheObjet/FicheObjet";
import "./Fiche_depot.css";

export default function FicheDepot() {
  const { id } = useParams();

  const [depot, setDepot] = useState(null);
  const [objetsDepot, setObjetsDepot] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [objetSelectionne, setObjetSelectionne] = useState(null);

  useEffect(() => {
    async function chargerDepot() {
      try {
        const res = await fetch(`http://localhost:3000/api/depots/${id}`);
        if (!res.ok) throw new Error("Impossible de charger le dépôt");

        const data = await res.json();
        setDepot(data);
        setObjetsDepot(Array.isArray(data.objets) ? data.objets : []);
      } catch (error) {
        setErreur(error.message);
      } finally {
        setChargement(false);
      }
    }
    chargerDepot();
  }, [id]);

  if (chargement) return <p>Chargement...</p>;
  if (erreur) return <p>Erreur: {erreur}</p>;
  if (!depot) return <p>Dépôt introuvable.</p>;

  return (
    <div>
      <h1>Dépôt :{depot.id}</h1>

      <h3>Informations du dépôt</h3>
      <section>
        <p>
          <strong>Donateur :</strong> {depot.donatrice_nom}{" "}
          {depot.donatrice_prenom}
        </p>
        <p>
          <strong>Date :</strong> {depot.date_depot}
        </p>
        <p>
          <strong>Type :</strong> {depot.type}
        </p>
      </section>

      <h3>Objets du dépôt ({objetsDepot.length})</h3>

      {objetsDepot.length === 0 ? (
        <p>Aucun objet pour ce dépôt.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Libellé</th>
              <th>Catégorie</th>
              <th>État d'arrivée</th>
              <th>Statut</th>
              <th>Poids</th>
            </tr>
          </thead>

          <tbody>
            {objetsDepot?.length > 0 &&
              objetsDepot.map((obj) => (
                <tr key={obj.id}>
                  <td>{obj.id}</td>
                  <td>{obj.libelle}</td>
                  <td>{obj.categorie_libelle}</td>
                  <td>{obj.etat_arrivee}</td>
                  <td>{obj.statut}</td>
                  <td>{obj.poids_kg} kg</td>
                  <td>
                    <button onClick={() => setObjetSelectionne(obj)}>
                      Voir
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      <a href={`/objets/nouveau/${id}`}>
        <button>Ajouter un objet</button>
      </a>

      {objetSelectionne && (
        <div className="popup-overlay" onClick={() => setObjetSelectionne(null)}>
          <div className="popup-carte" onClick={(e) => e.stopPropagation()}>
            <button className="bouton-fermer" onClick={() => setObjetSelectionne(null)}>
              ✕
            </button>
            <FicheObjet id={objetSelectionne.id} />
          </div>
        </div>
      )}
    </div>
  );
}