import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function FicheDepot() {
  // id du dépôt actuellement affiché, lu depuis l'URL /depot/:id
  const { id } = useParams();
  const navigate = useNavigate();

  const [depot, setDepot] = useState(null);

  // Contient uniquement les objets associés au dépôt actuellement affiché.
  const [objetsDepot, setObjetsDepot] = useState([]);

  // Contient tous les objets déposés par le donateur, tous dépôts confondus.
  const [historiqueDonateur, setHistoriqueDonateur] = useState([]);

  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  // Récupère le dépôt et l'historique du donateur à chaque changement d'id.
  useEffect(() => {
    async function chargerDepot() {
      try {
        const res = await fetch(`http://localhost:3000/api/depots/${id}`);

        if (!res.ok) {
          throw new Error("Impossible de charger le dépôt");
        }

        const data = await res.json();

        setDepot(data);

        // La route GET /api/depots/:id renvoie déjà les objets du dépôt.
        // On les conserve séparément de l'historique complet du donateur.
        setObjetsDepot(Array.isArray(data.objets) ? data.objets : []);

        // personne_id permet de retrouver tous les objets déposés par cette personne,
        // y compris ceux appartenant à ses anciens dépôts.
        const resHistorique = await fetch(
          `http://localhost:3000/api/personnes/${data.personne_id}/objets`
        );

        if (!resHistorique.ok) {
          throw new Error("Impossible de charger l'historique du donateur");
        }

        const historique = await resHistorique.json();

        setHistoriqueDonateur(
          Array.isArray(historique) ? historique : []
        );
      } catch (error) {
        console.error(error);
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
      <h1>Dépôt : {depot.id}</h1>

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
              <th></th>
            </tr>
          </thead>

          <tbody>
            {objetsDepot.map((obj) => (
              <tr key={obj.id}>
                <td>{obj.id}</td>
                <td>{obj.libelle}</td>
                <td>{obj.categorie_libelle}</td>
                <td>{obj.etat_arrivee}</td>
                <td>{obj.statut}</td>
                <td>{obj.poids_kg} kg</td>

                <td>
                  {/* Transmet le dépôt d'origine à FicheObjet afin de pouvoir
                      revenir sur ce dépôt depuis la fiche de l'objet. */}
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

      {/* Le dépôt est transmis dans l'URL afin de pré-remplir
          automatiquement le formulaire d'ajout d'objet. */}
      <button onClick={() => navigate(`/objets/nouveau/${id}`)}>
        Ajouter un objet
      </button>

      {/* Historique complet du donateur, distinct des objets du dépôt actuel. */}
      <section>
        <h2>Historique du donateur</h2>

        <p>
          {depot.donatrice_prenom} {depot.donatrice_nom}
        </p>

        <p>{historiqueDonateur.length} objet(s) déposé(s)</p>

        {historiqueDonateur.length === 0 ? (
          <p>Aucun objet déposé.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Objet</th>
                <th>Catégorie</th>
                <th>Dépôt</th>
                <th>Date du dépôt</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {historiqueDonateur.map((objet) => (
                <tr key={objet.id}>
                  <td>#{objet.id}</td>
                  <td>{objet.libelle}</td>
                  <td>{objet.categorie_libelle}</td>
                  <td>#{objet.depot_id}</td>
                  <td>{objet.date_depot}</td>
                  <td>{objet.statut}</td>

                  <td>
                    <button
                      onClick={() =>
                        navigate(`/objets/${objet.id}`, {
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
      </section>
    </div>
  );
}