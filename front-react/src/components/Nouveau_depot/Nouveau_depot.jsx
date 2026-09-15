import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; //tu dois npm install react-router-dom


export default function NouveauDepot() {
    const [personnes, setPersonnes] = useState([]);
    const [personneId, setPersonneId] = useState("");
    const [dateDepot, setDateDepot] = useState("");
    const [typeDepot, setTypeDepot] = useState("");
    const [benevole, setBenevole] = useState(null);
    const navigate = useNavigate();
    const [notes, setNotes] = useState("");

useEffect(() => {
    // Fonction qui récupère toutes les personnes enregistrées dans la base de données.
    const chargerPersonnes = async () => {
        try {
            // Appel de l'API pour récupérer la liste des personnes.
            const response = await fetch("http://localhost:3000/api/personnes");
            // fetch ne déclenche pas automatiquement le catch pour une erreur HTTP
            // comme 404 ou 500, donc on vérifie response.ok.
            if (!response.ok) {
                throw new Error("Erreur lors du chargement des personnes");
            }
            // Conversion de la réponse JSON en données JavaScript.
            const data = await response.json();

            // On stocke toutes les personnes pour pouvoir les afficher
            // dans le select du donateur.
            setPersonnes(data);

            // Récupère l'id du bénévole choisi précédemment
            // sur la page "Qui es-tu ?".
            const benevoleId = localStorage.getItem("benevoleId");
            // Si un bénévole a bien été sélectionné...
            if (benevoleId) {
                // localStorage renvoie toujours du texte.
                // Number() permet donc de comparer l'id avec les ids numériques de l'API.
                const benevoleConnecte = data.find(
                    (personne) => personne.id === Number(benevoleId)
                );
                // Enregistre les informations du bénévole trouvé.
                // Si aucun bénévole ne correspond à l'id, on stocke null.
                setBenevole(benevoleConnecte || null);
            }
            // Affiche l'erreur dans la console si l'API ne répond pas
            // ou si le chargement des personnes échoue.
        } catch (error) {
            console.error("Erreur du chargement personnes :", error);
        }
    };
    // Lance le chargement lorsque le composant NouveauDepot apparaît
    chargerPersonnes();
}, []);

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

    if(!res.ok) {
        throw new Error("Erreur lors de la création du dépôt");
    }

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
}

function formulaireNotes() { // récupère tout le formulaire
    return personneId || dateDepot || typeDepot || notes;
}

function handleCancel() {  // page qui apparer pour demander la confirmation avant de supprimer le formulaire
    if (formulaireNotes()) { // on utilise cette fonction pour bien selectionner ce que l'on veut supprimer 
        const ok =window.confirm(
            "Des modifications ont été saisies. Voulez-vous vraiment annuler ? Les changements seront perdus."
        );
        if (!ok) return;
    }

    if (window.history.length > 1) {
        navigate(-1);
    } else {
        navigate("/") // ajouter la page de liste de objet.
        }
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

            <div>
                <span>
                    Connecté : {benevole ? `${benevole.prenom} ${benevole.nom}` : "Chargement..."}
                </span>
            </div>

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


            <button
            type="button"
            onClick={handleCancel}>
                Annuler
            </button>
        </div> 
    </div>

);

}
