import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NavBar() {
  const [benevole, setBenevole] = useState(null);
  const benevoleId = Number(localStorage.getItem("benevoleId"));
  const isConnected = !isNaN(benevoleId);

  useEffect(() => {
    

    if (isConnected) {
      fetch("http://localhost:3000/api/benevoles")
        .then((res) => res.json())
        .then((data) => {
          const benevoleConnecte = data.find(
            (b) => b.id === benevoleId
          ) || null;

          setBenevole(benevoleConnecte);
        })
        .catch(() => setBenevole(null));
    }
  }, []);

  return (
    <nav className="navbar">
        <h1>La Remise</h1>
      <Link to="/" className="nav-button">Déconnexion</Link>
      <Link to="/dashboard" className=" dashboard-button">Tableau de bord</Link>

      <div className="benevole-info">
        <span>
          Connecté :{" "}
          {isConnected && benevole
            ? `${benevole.prenom} ${benevole.nom}`
            : "Non connecté"}
        </span>
      </div>
    </nav>
  );
}
