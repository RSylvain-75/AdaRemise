import { Routes, Route } from "react-router-dom";
import ListeObjets from "./components/ListeObjets/ListeObjets";
import FicheObjet from "./components/FicheObjet/FicheObjet";
import FormulaireObjet from "./components/FormulaireObjet/FormulaireObjet";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ListeObjets />} />
      <Route path="/objets/nouveau" element={<FormulaireObjet />} />
      <Route path="/objets/:id" element={<FicheObjet />} />

      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
