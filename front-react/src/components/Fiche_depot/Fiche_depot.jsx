import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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

        if (!res.ok) {
          throw new Error("Impossible de charger le dépôt");
        }

        const data = await res.json();
        setDepot(data);

        // deuxième appel, vers l'historique complet du donateur (via son personne_id),
        // pas vers data.objets (qui ne contiendrait que les objets de CE dépôt précis)
        const resObjets = await fetch(
          `http://localhost:3000/api/personnes/${data.personne_id}/objets`,
        );

        if (!resObjets.ok) {
          throw new Error("Impossible de charger l'historique");
        }

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

  const formaterDate = (dateIso) => {
    if (!dateIso) return "-";

    return new Date(dateIso).toLocaleDateString("fr-FR");
  };

  const formaterStatut = (statut) => {
    const libelles = {
      arrive: "Arrivé",
      en_reparation: "En réparation",
      en_rayon: "En rayon",
      vendu: "Vendu",
      recycle: "Recyclé",
    };

    return libelles[statut] || statut;
  };

  const formaterEtat = (etat) => {
    const libelles = {
      bon: "Bon",
      moyen: "Moyen",
      mauvais: "Mauvais",
      hors_service: "Hors service",
    };

    return libelles[etat] || etat;
  };

  if (chargement) {
    return <p className="fiche-depot-message">Chargement...</p>;
  }

  if (erreur) {
    return <p className="fiche-depot-message fiche-depot-error">Erreur : {erreur}</p>;
  }

  if (!depot) {
    return <p className="fiche-depot-message">Dépôt introuvable.</p>;
  }

  return (
    <main className="fiche-depot-page">
      <div className="fiche-depot-header">
        <div>
          <span className="fiche-depot-label">DÉPÔT #{depot.id}</span>
          <h1>Fiche du dépôt</h1>
          <p>Consultez les informations du don et l'historique du donateur.</p>
        </div>

        <Link
          to={`/objets/nouveau/${id}`}
          className="fiche-depot-add-button"
        >
          <span>+</span>
          Ajouter un objet
        </Link>
      </div>

      <section className="fiche-depot-info-card">
        <div className="fiche-depot-info-title">
          <div className="fiche-depot-info-icon">R</div>

          <div>
            <h2>Informations du dépôt</h2>
            <p>Informations enregistrées lors de la réception du don.</p>
          </div>
        </div>

        <div className="fiche-depot-info-grid">
          <div className="fiche-depot-info-item">
            <span className="fiche-depot-info-label">Donateur</span>
            <strong>
              {depot.donatrice_prenom} {depot.donatrice_nom}
            </strong>
          </div>

          <div className="fiche-depot-info-item">
            <span className="fiche-depot-info-label">Date du dépôt</span>
            <strong>{formaterDate(depot.date_depot)}</strong>
          </div>

          <div className="fiche-depot-info-item">
            <span className="fiche-depot-info-label">Type de dépôt</span>
            <strong className="fiche-depot-type">
              {depot.type === "boutique" ? "En boutique" : "À domicile"}
            </strong>
          </div>
        </div>
      </section>

      <section className="fiche-depot-history-card">
        <div className="fiche-depot-history-header">
          <div>
            <h2>Historique des dons</h2>
            <p>
              Tous les objets déposés par{" "}
              <strong>
                {depot.donatrice_prenom} {depot.donatrice_nom}
              </strong>
            </p>
          </div>

          <span className="fiche-depot-count">
            {objetsDepot.length} objet{objetsDepot.length > 1 ? "s" : ""}
          </span>
        </div>

        {objetsDepot.length === 0 ? (
          <div className="fiche-depot-empty">
            <p>Aucun objet pour ce donateur.</p>
          </div>
        ) : (
          <div className="fiche-depot-table-wrapper">
            <table className="fiche-depot-table">
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
                    <td>#{obj.id}</td>

                    <td className="fiche-depot-object-name">
                      {obj.libelle}
                    </td>

                    <td>{obj.categorie_libelle}</td>

                    <td>{formaterEtat(obj.etat_arrivee)}</td>

                    <td>
                      <span
                        className={`fiche-depot-status fiche-depot-status-${obj.statut}`}
                      >
                        {formaterStatut(obj.statut)}
                      </span>
                    </td>

                    <td>{obj.poids_kg} kg</td>

                    <td>
                      <button
                        type="button"
                        className="fiche-depot-view-button"
                        onClick={() => setObjetSelectionne(obj)}
                      >
                        Voir
                        <span>→</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {objetSelectionne && (
        <div
          className="popup-overlay"
          onClick={() => setObjetSelectionne(null)}
        >
          <div
            className="popup-carte"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="bouton-fermer"
              onClick={() => setObjetSelectionne(null)}
            >
              ✕
            </button>

            <FicheObjet id={objetSelectionne.id} />
          </div>
        </div>
      )}
    </main>
  );
}