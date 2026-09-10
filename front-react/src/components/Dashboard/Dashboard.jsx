import { useEffect, useState } from "react";
import StatCard from "./StatCard.jsx";
import "./Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/stats")
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }

        return response.json();
      })
      .then((data) => {
        setStats(data);
      })
      .catch(() => {
        setError("Impossible de charger les statistiques.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const totalObjets = stats.objet_par_statut.reduce(
    (total, objet) => total + Number(objet.total),
    0
  );

  return (
    <main className="dashboard">
      <h1>Tableau de bord</h1>

      <p>Vue d'ensemble de l'activité de la ressourcerie.</p>

      <div className="stats-grid">
        <StatCard
          title="Total d'objets"
          value={totalObjets}
        />

        <StatCard
          title="Poids total reçu"
          value={stats.poids_total_recu}
          unit="kg"
        />

        <StatCard
          title="Objets en rayon"
          value={stats.objets_en_rayon}
        />
      </div>

      <section>
        <h2>Objets par statut</h2>

        <ul className="statut-list">
          {stats.objet_par_statut.map((objet) => (
            <li key={objet.statut}>
              {objet.statut} : {objet.total}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Dashboard;