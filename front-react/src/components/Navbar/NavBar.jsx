import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

export default function NavBar() {
  const [benevole, setBenevole] = useState(null);

  const benevoleId = Number(localStorage.getItem("benevoleId"));
  const isConnected = !isNaN(benevoleId);

  useEffect(() => {
    if (!isConnected) return;

    fetch("http://localhost:3000/api/benevoles")
      .then((res) => res.json())
      .then((data) => {
        const benevoleConnecte =
          data.find((b) => b.id === benevoleId) || null;

        setBenevole(benevoleConnecte);
      })
      .catch(() => setBenevole(null));
  }, [benevoleId, isConnected]);

  return (
    <>
      <aside className="app-sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">R</div>

          <div>
            <p className="sidebar-logo-title">LA REMISE</p>
            <p className="sidebar-logo-subtitle">
              UN MONDE PLUS DURABLE
            </p>
          </div>
        </div>

        <nav className="sidebar-navigation">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
            }
          >
            <span className="sidebar-link-icon">⌂</span>
            <span>Tableau de bord</span>
          </NavLink>

          <NavLink
            to="/liste"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
            }
          >
            <span className="sidebar-link-icon">▣</span>
            <span>Objets</span>
          </NavLink>

          <NavLink
            to="/depots/nouveau"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
            }
          >
            <span className="sidebar-link-icon">＋</span>
            <span>Nouveau dépôt</span>
          </NavLink>
        </nav>

        <div className="sidebar-slogan">
          <span className="sidebar-slogan-icon">♻</span>

          <div>
            <strong>Moins de déchets,</strong>
            <span>plus d'histoires.</span>
          </div>
        </div>
      </aside>

      <header className="app-navbar">
       

        <div className="navbar-user">
          <div className="navbar-avatar">
            {benevole
              ? `${benevole.prenom?.charAt(0) || ""}${
                  benevole.nom?.charAt(0) || ""
                }`
              : "?"}
          </div>

          <div className="navbar-user-info">
            <strong>
              {isConnected && benevole
                ? `${benevole.prenom} ${benevole.nom}`
                : "Non connecté"}
            </strong>

            <span>Bénévole</span>
          </div>

          <Link to="/" className="navbar-logout">
            Déconnexion
          </Link>
        </div>
      </header>
    </>
  );
}