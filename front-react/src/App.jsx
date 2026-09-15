import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import ListeObjets from "./components/ListeObjets/ListeObjets";
import FicheObjet from "./components/FicheObjet/FicheObjet";
import FormulaireObjet from "./components/FormulaireObjet/FormulaireObjet";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Fiche_depot from "./components/Fiche_depot/Fiche_depot.jsx";
import NouveauDepot from "./components/Nouveau_depot/Nouveau_depot.jsx";
import QuiEsTu from "./components/QuiEsTu.jsx";
import "./App.css";

function App() {
  // benevoleId doit être un vrai état React (useState), pas juste une variable lue une fois
  // depuis localStorage : sans ça, quand QuiEsTu identifie quelqu'un, App ne serait jamais
  // "prévenu" du changement et continuerait d'afficher l'ancienne valeur (souvent null),
  // même après la navigation vers "/"
  const [benevoleId, setBenevoleId] = useState(localStorage.getItem("benevoleId"));

  return (
    <Routes>
      <Route path="/" element={benevoleId ? <ListeObjets /> : <Navigate to="/qui-es-tu" replace />} />
      {/* setBenevoleId est transmis en prop à QuiEsTu (sous le nom onIdentification) :
          c'est ainsi que QuiEsTu peut "prévenir" App qu'une bénévole a été identifiée,
          ce qui déclenche un re-rendu avec la nouvelle valeur */}
      <Route path="/qui-es-tu" element={<QuiEsTu onIdentification={setBenevoleId} />} />
      <Route path="/objets/nouveau/:depotId" element={benevoleId ? <FormulaireObjet /> : <Navigate to="/qui-es-tu" replace />} />
      <Route path="/objets/:id" element={benevoleId ? <FicheObjet /> : <Navigate to="/qui-es-tu" replace />} />
      <Route path="/depot/:id" element={benevoleId ? <Fiche_depot /> : <Navigate to="/qui-es-tu" replace />} />
      <Route path="/depots/nouveau" element={benevoleId ? <NouveauDepot /> : <Navigate to="/qui-es-tu" replace />} />
      <Route path="/dashboard" element={benevoleId ? <Dashboard /> : <Navigate to="/qui-es-tu" replace />} />
    </Routes>
  );
}

export default App;