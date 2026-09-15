import { Routes, Route, Navigate } from "react-router-dom";
import ListeObjets from "./components/ListeObjets/ListeObjets";
import FicheObjet from "./components/FicheObjet/FicheObjet";
import FormulaireObjet from "./components/FormulaireObjet/FormulaireObjet";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Fiche_depot from "./components/Fiche_depot/Fiche_depot.jsx";
import NouveauDepot from "./components/Nouveau_depot/Nouveau_depot.jsx";
import QuiEsTu from "./components/QuiEsTu.jsx";
import "./App.css";

function App() {
  const benevoleId = localStorage.getItem("benevoleId");

  return (
    <Routes>
      <Route path="/" element={benevoleId ? <ListeObjets /> : <Navigate to="/qui-es-tu" replace />} />
      <Route path="/qui-es-tu" element={<QuiEsTu />} />
      <Route path="/objets/nouveau" element={benevoleId ? <FormulaireObjet /> : <Navigate to="/qui-es-tu" replace />} />
      <Route path="/objets/:id" element={benevoleId ? <FicheObjet /> : <Navigate to="/qui-es-tu" replace />} />
      <Route path="/depot/:id" element={benevoleId ? <Fiche_depot /> : <Navigate to="/qui-es-tu" replace />} />
      <Route path="/depots/nouveau" element={benevoleId ? <NouveauDepot /> : <Navigate to="/qui-es-tu" replace />} />
      <Route path="/dashboard" element={benevoleId ? <Dashboard /> : <Navigate to="/qui-es-tu" replace />} />
    </Routes>
  );
}

export default App;