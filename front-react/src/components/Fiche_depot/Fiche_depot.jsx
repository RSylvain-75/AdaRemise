import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function FicheDepot() {
  // id du dépôt actuellement affiché, lu depuis l'URL /depot/:id
  const { id } = useParams();
  const navigate = useNavigate();

  const [depot, setDepot] = useState(null);
  const [anciensObjets, setAnciensObjets] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  // récupère le dépôt, puis les objets liés à son donateur, à chaque changement d'id
  useEffect(() => {
    async function chargerDepot() {
      try {
        const res = await fetch(`http://localhost:3000/api/depots/${id}`);
        if (!res.ok) throw new Error("Impossible de charger le dépôt");

        const data = await res.json();
        setDepot(data);

        // TODO: cette route (/personnes/:id/objets) semble ne pas exister côté back
        // pour le moment (404 constaté) — à créer ou à corriger le chemin
        const resObjets = await fetch(
          `http://localhost:3000/api/personnes/${data.personne_id}/objets`,
        );
        const anciens = await resObjets.json();
        setAnciensObjets(Array.isArray(anciens) ? anciens : []);
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

      <h3>Infomations du dépôt</h3>
      <section>
        <p>
          <strong>Donateur :</strong> {depot.donatrice_nom}{" "}
          {depot.donatrice_prenom}
        </p>
        <p>
          <strong>Date :</strong> {depot.date_depot}
        </p>
        <p>
          <strong>Type :</strong> {depot.type_depot}
        </p>
      </section>

      <h3>Objets deja donner ({anciensObjets.length || 0}) </h3>

      {anciensObjets.length === 0 ? (
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
            {anciensObjets?.length > 0 &&
              anciensObjets.map((obj) => (
                <tr key={obj.id}>
                  <td>{obj.id}</td>
                  <td>{obj.libelle}</td>
                  <td>{obj.categorie_libelle}</td>
                  <td>{obj.etat_arrivee}</td>
                  <td>{obj.statut}</td>
                  <td>{obj.poids_kg} kg</td>
                  <td>
                    {/* state: { depotId: id } transmet l'origine à FicheObjet, sans l'exposer
                        dans l'URL — permet d'y afficher "Retour au dépôt" plutôt que "Retour à la liste" */}
                    <button
                      onClick={() =>
                        navigate(`/objets/${obj.id}`, {
                          state: { depotId: id },
                        })
                      }
                    >
                      Voir
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {/* redirige vers le formulaire d'ajout d'objet, avec ce dépôt déjà connu dans l'URL
          (route /objets/nouveau/:depotId), pour pré-remplir le champ dépôt automatiquement */}
      <button onClick={() => navigate(`/objets/nouveau/${id}`)}>
        Ajouter un objet
      </button>
    </div>
  );
}
