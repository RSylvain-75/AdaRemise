import { Routes, Route } from "react-router-dom";
import ListeObjets from "./components/ListeObjets/ListeObjets";
import FicheObjet from "./components/FicheObjet/FicheObjet";
import FormulaireObjet from "./components/FormulaireObjet/FormulaireObjet";
import './App.css'

function App() {
  return (
    // Routes : regarde l'URL actuelle et choisit quelle Route afficher
    <Routes>
      {/* si l'URL est exactement "/", affiche la liste des objets */}
      <Route path="/" element={<ListeObjets />} />
      {/* si l'URL est "/objets/nouveau", affiche le formulaire de création */}
      {/* placée AVANT "/objets/:id" : sinon "nouveau" serait interprété comme une valeur d'id */}
      <Route path="/objets/nouveau" element={<FormulaireObjet />} />
      {/* si l'URL est "/objets/xxx", affiche la fiche de l'objet xxx ; ":id" capture cette valeur */}
      <Route path="/objets/:id" element={<FicheObjet />} />
    </Routes>
  )
}

export default App