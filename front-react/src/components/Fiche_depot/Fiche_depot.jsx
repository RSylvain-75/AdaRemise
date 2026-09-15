import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function FicheDepot() {
    const {id} = useParams();
    const navigate = useNavigate();

    const [depot, setDepot] = useState(null);
    // Contient uniquement les objets associés au dépôt actuellement affiché.
    const [objetsDepot, setObjetsDepot] = useState([]);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState(null)


useEffect(() => {
    async function chargerDepot() {
        try {
            const res = await fetch(`http://localhost:3000/api/depots/${id}`);
            if (!res.ok)throw new Error("Impossible de charger le dépôt");

            const data =await res.json();
            setDepot(data);

            // La route GET /api/depots/:id renvoie déjà les objets du dépôt.
            // On évite donc un deuxième appel API vers l'historique du donateur.
            setObjetsDepot(Array.isArray(data.objets) ? data.objets : []);
            
        } catch (error) {
            setErreur(error.message)
        } finally {
            setChargement(false);
        }
    }
    chargerDepot();
},[id]);

if (chargement) return <p>Chargement...</p>;
if (erreur) return <p>Erreur: {erreur}</p>;
if (!depot) return <p>Dépôt introuvable.</p>

return(
 <div>
    <h1>Dépôt :{depot.id}</h1>

    <h3>Informations du dépôt</h3>
    <section>
        <p><strong>Donateur :</strong> {depot.donatrice_nom} {depot.donatrice_prenom}</p>
        <p><strong>Date :</strong> {depot.date_depot}</p>
        <p><strong>Type :</strong> {depot.type}</p> 
    </section>

    <h3>Objets du dépôt ({objetsDepot.length})</h3>

    {objetsDepot.length === 0 ? (
        <p>Aucun objet pour ce dépôt.</p>
    ) : (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Libellé</th>
                    <th>Catégorie</th>
                    <th>État d'arrivée</th>
                    <th>Statut</th>
                    <th>Poids</th>
                </tr>
            </thead>

            <tbody>
                {objetsDepot?.length > 0 && objetsDepot.map((obj) => (
                    <tr key={obj.id}>
                        <td>{obj.id}</td>
                        <td>{obj.libelle}</td>
                        <td>{obj.categorie_libelle}</td>
                        <td>{obj.etat_arrivee}</td>
                        <td>{obj.statut}</td>
                        <td>{obj.poids_kg} kg</td>
                        <td>
                            <button onClick={() => navigate(`/objets/${obj.id}`)}>
                                Voir
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )}

    <button onClick={() => navigate(`/objets/nouveau?depot=${id}`)}>
        Ajouter un objet
    </button>
 </div>

);
}