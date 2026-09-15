import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FicheObjet from "../FicheObjet/FicheObjet";
import "./Fiche_depot.css";

export default function FicheDepot() {
  // id du dépôt actuellement affiché, lu depuis l'URL /depot/:id
  const { id } = useParams();

  const [depot, setDepot] = useState(null);
  // contient TOUT l'historique du donateur (tous ses dépôts confondus),
  // pas seulement les objets de ce dépôt précis
  const [objetsDepot, setObjetsDepot] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  // objet cliqué dans la liste ; null = popup fermée (même principe que ListeObjets)
  const [objetSelectionne, setObjetSelectionne] = useState(null);

  useEffect(() => {
    async function chargerDepot() {
      try {
        const res = await fetch(`http://localhost:3000/api/depots/${id}`);
        if (!res.ok) throw new Error("Impossible de charger le dépôt");

        const data = await res.json();
        setDepot(data);

        // deuxième appel, vers l'historique complet du donateur (via son personne_id),
        // pas vers data.objets (qui ne contiendrait que les objets de CE dépôt précis)
        const resObjets = await fetch(
          `http://localhost:3000/api/personnes/${data.personne_id}/objets`,
        );
        if (!resObjets.ok) throw new Error("Impossible de charger l'historique");
        const anciens = await resObjets.json();
        setObjetsDepot(Array.isArray(anciens) ? anciens : []);
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

      <h3>Historique des dons de ce donateur ({objetsDepot.length})</h3>

      {objetsDepot.length === 0 ? (
        <p>Aucun objet pour ce donateur.</p>
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