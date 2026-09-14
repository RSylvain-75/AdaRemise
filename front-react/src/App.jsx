import { Routes, Route } from "react-router-dom";
import ListeObjets from "./components/ListeObjets/ListeObjets";
import FicheObjet from "./components/FicheObjet/FicheObjet";
import FormulaireObjet from "./components/FormulaireObjet/FormulaireObjet";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Fiche_depot from "./components/Fiche_depot/Fiche_depot.jsx";
import NouveauDepot from "./components/Nouveau_depot/Nouveau_depot.jsx";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ListeObjets />} />
      <Route path="/objets/nouveau" element={<FormulaireObjet />} />
      <Route path="/objets/:id" element={<FicheObjet />} />
      <Route path="/depot/:id" element={<Fiche_depot/>}/>
      <Route path="/depots/nouveau" element={<NouveauDepot/>}/>
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
