import './App.css'
import { useState, useEffect } from 'react'

function App() {
  const [volontaire, setVolontaire] = useState("")
  const [statut, setStatut] = useState("")
  const [objets, setObjets] = useState([])

  // MODIFICATION : récupère les objets depuis l'API au chargement de la page
  useEffect(() => {
    fetch("http://localhost:3000/api/objets")
      .then(response => response.json())
      .then(data => {
        setObjets(data)
      })
      .catch(error => {
        console.error(error)
      })
  }, [])

  // MODIFICATION : envoie le nouveau statut de l'objet à l'API
  const modifierStatut = async (id) => {
    console.log("ID envoyé par React :", id)

    try {
      const response = await fetch(
        `http://localhost:3000/api/objets/${id}/statut`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            statut: statut,
          }),
        }
      )

      if (!response.ok) {
        throw new Error("Erreur lors de la modification du statut")
      }

      const objetModifie = await response.json()

      // MODIFICATION : met à jour le statut affiché après modification
      setObjets(objets.map((objet) =>
        objet.id === objetModifie.id
          ? objetModifie
          : objet
      ))

      console.log("Objet modifié :", objetModifie)

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <h1>AdaRemise</h1>

      <h2>Qui es-tu ?</h2>

      <button onClick={() => setVolontaire("Assya")}>
        Assya
      </button>

      <button onClick={() => setVolontaire("David")}>
        David
      </button>

      <button onClick={() => setVolontaire("Sylvain")}>
        Sylvain
      </button>

      <button onClick={() => setVolontaire("Yanis")}>
        Yanis
      </button>

      <p>Volontaire sélectionné : {volontaire}</p>

      <h2>Objets</h2>

      {/* MODIFICATION : affiche les objets récupérés depuis l'API */}
      {objets.map((objet) => (
        <div key={objet.id}>
          <h3>{objet.libelle}</h3>

          <p>Statut actuel : {objet.statut}</p>

          {/* MODIFICATION : permet de modifier le statut de cet objet */}
          <button onClick={() => modifierStatut(objet.id)}>
            Modifier le statut
          </button>
        </div>
      ))}

      {/* MODIFICATION : barre permettant de choisir le nouveau statut */}
      <h2>Modifier le statut d'un objet</h2>

      <select
        value={statut}
        onChange={(e) => setStatut(e.target.value)}
      >
        <option value="">Choisir un statut</option>
        <option value="arrive">Arrivé</option>
        <option value="en_reparation">En réparation</option>
        <option value="en_rayon">En rayon</option>
        <option value="vendu">Vendu</option>
        <option value="recycle">Recyclé</option>
      </select>

      <p>Statut sélectionné : {statut}</p>
    </>
  )
}

export default App