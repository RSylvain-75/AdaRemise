import { Routes, Route } from "react-router-dom";
import ListeObjets from "./components/ListeObjets";
import FicheObjet from "./components/FicheObjet";
import './App.css'

// function App() {
//   return (
//     <>
//       <ListeObjets />
//     </>
//   )
// }
function App() {
  return (
    // Routes : regarde l'URL actuelle et choisit quelle Route afficher
    <Routes>
      {/* si l'URL est exactement "/", affiche la liste des objets */}
      <Route path="/" element={<ListeObjets />} />
      {/* si l'URL est "/objets/xxx", affiche la fiche de l'objet xxx ; ":id" capture cette valeur */}
      <Route path="/objets/:id" element={<FicheObjet />} />
    </Routes>
  )
}

export default App