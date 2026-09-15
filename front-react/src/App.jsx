import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ListeObjets from "./components/ListeObjets/ListeObjets";
import FicheObjet from "./components/FicheObjet/FicheObjet";
import FormulaireObjet from "./components/FormulaireObjet/FormulaireObjet";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Fiche_depot from "./components/Fiche_depot/Fiche_depot.jsx";
import NouveauDepot from "./components/Nouveau_depot/Nouveau_depot.jsx";
import QuiEsTu from "./components/QuiEsTu.jsx";
import NavBar from "./components/Navbar/NavBar.jsx";
import "./App.css";

function App() {
  const benevoleId = localStorage.getItem("benevoleId");
  const location = useLocation();

  const hideNavbar = location.pathname === "/";

  return (
    <>
      {!hideNavbar && <NavBar />}
      <div style={{marginTop: hideNavbar ? "0" : "80px"}}>
        <Routes>
          <Route path="/" element={<QuiEsTu />} />
          <Route path="/liste" element={benevoleId ? <ListeObjets /> : <Navigate to="/" replace />} />
          <Route path="/objets/nouveau/:depotId" element={benevoleId ? <FormulaireObjet /> : <Navigate to="/" replace />} />
          <Route path="/objets/:id" element={benevoleId ? <FicheObjet /> : <Navigate to="/" replace />} />
          <Route path="/depot/:id" element={benevoleId ? <Fiche_depot /> : <Navigate to="/" replace />} />
          <Route path="/depots/nouveau" element={benevoleId ? <NouveauDepot /> : <Navigate to="/" replace />} />
          <Route path="/dashboard" element={benevoleId ? <Dashboard /> : <Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default App;