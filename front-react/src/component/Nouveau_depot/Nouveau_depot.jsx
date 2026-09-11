import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; //tu dois npm install react-router-dom


export default function NouveauDepot() {
    const [personnes, setPersonnes] = useState([]);
    const [personneId, setPersonneId] = useState("");
    const [etat, setEtat] = useState("chargement ...");
    const [dateDepot, setDateDepot] = useState("");
    const [typeDepot, setTypeDepot] = useState("");
    const [benevole, setBenevole] = useState(null);
    const navigate = useNavigate();
    const [notes, setNotes] = useState("");


useEffect(() => {
    const id = localStorage.getItem("benevoleId");
    

    // if (id) {
    //     async function chargerBenenvole() { // fait apparaître le benenvole connecter 
    //     try {
    //         const id = localStorage.getItem("benevoleId")
    //         const res = await fetch('') // il faut cree des route avec benevole
    //         const data = await res.json();
    //         setBenevole(data);
    //     } catch (error) {
    //         console.error("Erreur chargement bénévole");
            
    //     }
    // }
    // chargerBenenvole();
    // }

    async function chargerPersonne() { // sert a selectionner la personne qui fait le depot
        try {
            const res = await fetch('http://localhost:3000/api/personnes');
            const data = await res.json();
            setPersonnes(data);
        } catch (error) {
            setEtat("erreur");
        }
        
    }
    chargerPersonne();
},[])

async function handleCreerDepot() { // oblige a remplire c'est imformation pour pouvoir valider 
  if (!personneId || !dateDepot || !typeDepot) {
    alert("Veuillez remplir tous les champs obligatoires.");
    return;
  }

  const nouveauDepot = {
    personne_id: personneId,
    date_depot: dateDepot,
    type: typeDepot,
    notes: notes
  };

  try {
    const res = await fetch("http://localhost:3000/api/depots", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nouveauDepot)
    });

    const data = await res.json();
    if (!data.id) {
    alert("Le backend n’a pas renvoyé d’ID !");
    return;
    }
    navigate(`/depot/${data.id}`);

  } catch (error) {
    console.error("Erreur création dépôt :", error);
    alert("Impossible de créer le dépôt.");
  }

  function formulaireNotes() { // récupère tout le formulaire
    return personneId || dateDepot || typeDepot || notes;
  }

//   function handleCancel() {  // page qui apparer pour demander la confirmation avant de supprimer le formulaire
//     if (formulaireNotes()) { // on utilise cette fonction pour bien selectionner ce que l'on veut supprimer 
//         const ok =window.confirm(
//             "Des modifications ont été saisies. Voulez-vous vraiment annuler ? Les changements seront perdus."
//         );
//         if (!ok) return;
//     }

//     if (window.history.length > 1) {
//         navigate(-1);
//     } else {
//         navigate("") // ajouter la page de liste de objet.
//         }
//   }
}

// function handleLogout() {
//     localStorage.removeItem("benevoleId");
//     navigate(``); //le chemin de la page Qui est tu ?
// }

return (
    <div>
        
        <div>
           <h2>AdaRemise</h2> 
        </div>
        {/* <div>
            <span>
                Connecté : {benevole ? `${benevole.nom} ${benevole.prenom}` : "Chargement..."}
            </span>
            <button type="button" onClick={handleLogout}>Déconnexion</button>
        </div> */}
        <h1>Formulaire nouveau depot</h1>

        <label htmlFor="donnateur">Donateur </label>
        <select 
        id="donnateur"
        value={personneId}
        onChange={(e) => setPersonneId(Number(e.target.value))}>
            {personnes.map((p) => (
                <option key={p.id} value={p.id}>
                    {p.nom} {p.prenom}
                </option>
            ))}
        </select>

        <label htmlFor="date_depot">Date du dépôt</label>
        <input
        type="date"
        id="date_depot"
        value={dateDepot}
        onChange={(e) => setDateDepot(e.target.value)}
        />

        <div>
            <button
            type="button"
            className={typeDepot === "boutique" ? "active" : ""}
            onClick={() => setTypeDepot("boutique")}
            >
                Boutique
            </button>
        

            <button
            type="button"
            className={typeDepot === "domicile" ? "active" : ""}
            onClick={() => setTypeDepot("domicile")}
            >
                Domicile
            </button>
        </div>
        <label htmlFor="notes">Notes (optionnel)</label>
        <textarea 
        id="notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows="4"
        cols="50"
        placeholder="Ajouter une note si nécessaire..."
        ></textarea>

        <div>
            <button type="button" onClick={handleCreerDepot}>
                Créer le dépôt
            </button>


            {/* <button
            type="buton"
            onClick={handleCancel}>
                Annuler
            </button> */}
        </div> 
    </div>

);

}
