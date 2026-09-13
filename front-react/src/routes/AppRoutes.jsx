import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import App from "../App.jsx";
import QuiEsTu from "../components/QuiEsTu.jsx";

function AppRoutes() {
  const [personneSelectionnee, setPersonneSelectionnee] = useState(null);

  return (
    <Routes>
      {/* Page principale */}
      <Route
        path="/"
        element={
          <App personneSelectionnee={personneSelectionnee} />
        }
      />

      {/* Page d'identification */}
      <Route
        path="/qui-es-tu"
        element={
          <QuiEsTu
            onPersonneSelectionnee={setPersonneSelectionnee}
          />
        }
      />
    </Routes>
  );
}

export default AppRoutes;