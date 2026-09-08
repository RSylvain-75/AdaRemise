import { useState, useEffect } from "react";


export default function NouveauDepot() {
    const [personne, setPersonnes] = useState([]);
    const [personneid, setPersonneId] = useState("")
    const [etat, setEtat] = useState("chargement ...")


useEffect(() => {
    async function chargerPersonne() {
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

return (
    <div>
        <h1>Formulaire nouveau depot</h1>

        <label htmlFor="donnateur">Donateur </label>
        <select 
        id="donnateur"
        value={personneid}
        onChange={(e) => setPersonneId(Number(e.target.value))}>
            {personne.map((p) => (
                <option key={p.id} value={p.id}>
                    {p.nom} {p.prenom}
                </option>
            ))}
        </select>
    </div>

);

}
