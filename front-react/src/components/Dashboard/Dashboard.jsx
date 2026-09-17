import { useEffect, useState } from "react";

import StatCard from "./StatCard.jsx";

import "./Dashboard.css";

function Dashboard() {
  // stats contient les statistiques récupérées depuis l'API.
  // Au premier affichage, aucune donnée n'a encore été récupérée,
  // donc la valeur initiale est null.
  const [stats, setStats] = useState(null);

  // loading permet de savoir si la requête vers l'API est encore en cours.
  const [loading, setLoading] = useState(true);

  // error permet de stocker un éventuel message d'erreur
  // si la récupération des statistiques échoue.
  const [error, setError] = useState(null);

  // useEffect est exécuté après le premier affichage du composant.
  // Le tableau vide [] signifie que cet effet ne sera exécuté
  // qu'une seule fois lors du montage du Dashboard.
  useEffect(() => {
    // Fonction asynchrone chargée de récupérer les statistiques du backend.
    const chargerStats = async () => {
      try {
        // Appel de la route GET /api/stats de notre API Express.
        const response = await fetch("http://localhost:3000/api/stats");

        // fetch ne déclenche pas automatiquement une erreur pour
        // les réponses HTTP comme 404 ou 500.
        // On vérifie donc manuellement si la réponse est correcte.
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des statistiques");
        }

        // Transformation de la réponse JSON en objet JavaScript.
        const data = await response.json();

        // On stocke les statistiques reçues dans le state.
        // La modification du state provoque un nouveau rendu du composant.
        setStats(data);
      } catch (error) {
        // Si la requête échoue, on affiche l'erreur dans la console
        // et on prépare un message compréhensible pour l'utilisateur.
        console.error(error);
        setError("Impossible de charger les statistiques.");
      } finally {
        // finally est exécuté que la requête réussisse ou échoue.
        // Le chargement est donc terminé dans tous les cas.
        setLoading(false);
      }
    };

    // Appel de la fonction créée juste au-dessus.
    chargerStats();
  }, []);

  // Tant que les données ne sont pas arrivées,
  // on affiche un message de chargement à la place du Dashboard.
  if (loading) {
    return <p className="dashboard-message">Chargement...</p>;
  }

  // Si une erreur s'est produite, on affiche le message d'erreur
  // plutôt que d'essayer d'utiliser des statistiques inexistantes.
  if (error) {
    return <p className="dashboard-message">{error}</p>;
  }

  // objet_par_statut contient plusieurs lignes du type :
  // { statut: "en_rayon", total: "5" }
  //
  // reduce permet d'additionner tous les totaux afin d'obtenir
  // le nombre total d'objets enregistrés dans la ressourcerie.
  const totalObjets = stats.objet_par_statut.reduce(
    (total, objet) => total + Number(objet.total),
    0,
  );

  // On initialise tous les statuts possibles à 0.
  // Cela permet notamment d'avoir une valeur même lorsqu'aucun objet
  // d'un certain statut n'est retourné par la base de données.
  const statuts = {
    en_rayon: 0,
    vendu: 0,
    recycle: 0,
    arrive: 0,
    en_reparation: 0,
  };

  // On parcourt les statistiques reçues depuis l'API.
  // Pour chaque statut, on remplace le 0 par le nombre réel d'objets.
  stats.objet_par_statut.forEach((objet) => {
    statuts[objet.statut] = Number(objet.total);
  });

  // Le graphique fonctionne avec des pourcentages.
  //
  // Si totalObjets vaut 0, une division par zéro donnerait un résultat
  // incorrect. On utilise donc temporairement 1 comme valeur de sécurité.
  const totalGraphique = totalObjets || 1;

  // Calcul de la part de chaque statut dans le nombre total d'objets.
  const pourcentageEnRayon = (statuts.en_rayon / totalGraphique) * 100;
  const pourcentageVendu = (statuts.vendu / totalGraphique) * 100;
  const pourcentageRecycle = (statuts.recycle / totalGraphique) * 100;
  const pourcentageArrive = (statuts.arrive / totalGraphique) * 100;
  const pourcentageReparation =
    (statuts.en_reparation / totalGraphique) * 100;

  // Pour construire le donut avec un conic-gradient CSS,
  // chaque couleur doit commencer là où la précédente se termine.
  //
  // Exemple :
  // En rayon : 0% -> 30%
  // Vendu :    30% -> 50%
  // Recyclé :  50% -> etc.
  //
  // On additionne donc progressivement les pourcentages.
  const finEnRayon = pourcentageEnRayon;
  const finVendu = finEnRayon + pourcentageVendu;
  const finRecycle = finVendu + pourcentageRecycle;
  const finArrive = finRecycle + pourcentageArrive;
  const finReparation = finArrive + pourcentageReparation;

  // Création dynamique du style CSS du graphique.
  //
  // conic-gradient crée un dégradé circulaire.
  // Les limites calculées précédemment permettent à chaque couleur
  // d'occuper une portion proportionnelle au nombre d'objets.
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
      {/* En-tête du tableau de bord */}
      <div className="dashboard-header">
        <div className="dashboard-heading">
          <h1>Tableau de bord</h1>
          <p>Vue d'ensemble de l'activité de la ressourcerie.</p>
        </div>

        {/* Illustration liée à l'identité visuelle de La Remise */}
        <img
          src="/images/slogan-chaque-objet.png"
          alt="Chaque objet compte !"
          className="dashboard-slogan"
        />
      </div>

      {/* Cartes contenant les trois indicateurs principaux */}
      <div className="stats-grid">
        {/* StatCard est un composant réutilisable.
            On lui transmet les informations différentes via des props. */}
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

      {/* Partie principale : graphique à gauche et illustration à droite */}
      <div className="dashboard-main-grid">
        <section className="dashboard-status-card">
          <div className="dashboard-status-header">
            <h2>Objets par statut</h2>
            <p>Répartition des {totalObjets} objets</p>
          </div>

          <div className="dashboard-status-content">
            {/* Le style du donut est calculé dynamiquement
                à partir des données récupérées depuis l'API. */}
            <div className="dashboard-donut" style={donutStyle}>
              <div className="dashboard-donut-center">
                <strong>{totalObjets}</strong>
                <span>objets</span>
              </div>
            </div>

            {/* Légende correspondant aux différentes parties du donut */}
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

        {/* Illustration complémentaire du Dashboard */}
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