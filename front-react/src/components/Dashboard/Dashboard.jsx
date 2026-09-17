import { useEffect, useState } from "react";
import StatCard from "./StatCard.jsx";
import "./Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const chargerStats = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/stats");

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des statistiques");
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error(error);
        setError("Impossible de charger les statistiques.");
      } finally {
        setLoading(false);
      }
    };

    chargerStats();
  }, []);

  if (loading) {
    return <p className="dashboard-message">Chargement...</p>;
  }

  if (error) {
    return <p className="dashboard-message">{error}</p>;
  }

  const totalObjets = stats.objet_par_statut.reduce(
    (total, objet) => total + Number(objet.total),
    0,
  );

  const statuts = {
    en_rayon: 0,
    vendu: 0,
    recycle: 0,
    arrive: 0,
    en_reparation: 0,
  };

  stats.objet_par_statut.forEach((objet) => {
    statuts[objet.statut] = Number(objet.total);
  });

  const totalGraphique = totalObjets || 1;

  const pourcentageEnRayon = (statuts.en_rayon / totalGraphique) * 100;
  const pourcentageVendu = (statuts.vendu / totalGraphique) * 100;
  const pourcentageRecycle = (statuts.recycle / totalGraphique) * 100;
  const pourcentageArrive = (statuts.arrive / totalGraphique) * 100;
  const pourcentageReparation =
    (statuts.en_reparation / totalGraphique) * 100;

  const finEnRayon = pourcentageEnRayon;
  const finVendu = finEnRayon + pourcentageVendu;
  const finRecycle = finVendu + pourcentageRecycle;
  const finArrive = finRecycle + pourcentageArrive;
  const finReparation = finArrive + pourcentageReparation;

const donutStyle = {
  background: `conic-gradient(
    #bbf7d0 0% ${finEnRayon}%,
    #dbeafe ${finEnRayon}% ${finVendu}%,
    #f3e8ff ${finVendu}% ${finRecycle}%,
    #f3f4f6 ${finRecycle}% ${finArrive}%,
    #fef3c7 ${finArrive}% ${finReparation}%,
    #edf0f4 ${finReparation}% 100%
  )`,
};

  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-heading">
          <h1>Tableau de bord</h1>
          <p>Vue d'ensemble de l'activité de la ressourcerie.</p>
        </div>

        <img
          src="/images/slogan-chaque-objet.png"
          alt="Chaque objet compte !"
          className="dashboard-slogan"
        />
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total d'objets"
          value={totalObjets}
          icon="◇"
          variant="red"
        />

        <StatCard
          title="Poids total reçu"
          value={stats.poids_total_recu}
          unit="kg"
          icon="♧"
          variant="green"
        />

        <StatCard
          title="Objets en rayon"
          value={stats.objets_en_rayon}
          icon="▣"
          variant="blue"
        />
      </div>

      <div className="dashboard-main-grid">
        <section className="dashboard-status-card">
          <div className="dashboard-status-header">
            <h2>Objets par statut</h2>
            <p>Répartition des {totalObjets} objets</p>
          </div>

          <div className="dashboard-status-content">
            <div className="dashboard-donut" style={donutStyle}>
              <div className="dashboard-donut-center">
                <strong>{totalObjets}</strong>
                <span>objets</span>
              </div>
            </div>

            <div className="dashboard-legend">
              <div className="dashboard-legend-item">
                <span className="legend-dot legend-red"></span>
                <span className="legend-label">En rayon</span>
                <strong>{statuts.en_rayon}</strong>
              </div>

              <div className="dashboard-legend-item">
                <span className="legend-dot legend-orange"></span>
                <span className="legend-label">Vendu</span>
                <strong>{statuts.vendu}</strong>
              </div>

              <div className="dashboard-legend-item">
                <span className="legend-dot legend-yellow"></span>
                <span className="legend-label">Recyclé</span>
                <strong>{statuts.recycle}</strong>
              </div>

              <div className="dashboard-legend-item">
                <span className="legend-dot legend-green"></span>
                <span className="legend-label">Arrivé</span>
                <strong>{statuts.arrive}</strong>
              </div>

              <div className="dashboard-legend-item">
                <span className="legend-dot legend-blue"></span>
                <span className="legend-label">En réparation</span>
                <strong>{statuts.en_reparation}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-visual">
          <img
            src="/images/carte-remise.png"
            alt="Donnez une seconde vie aux objets"
          />
        </section>
      </div>
    </main>
  );
}

export default Dashboard;