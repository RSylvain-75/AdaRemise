import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const { statut, categorie_id } = req.query;
    const statusValides = [
        "arrive",
        "en_reparation",
        "en_rayon",
        "vendu",
        "recycle"
    ];

    if (statut && !statusValides.includes(statut)) {
        return res.status(400).json({
            error: "statut invalide"
        });
    }
    if (categorie_id && isNaN(Number(categorie_id))) {
         return res.status(400).json({
            error: "categorie_id doit être un nombre"
        });
    }

    try {
        const result = await pool.query(
            `SELECT o.*, c.libelle AS categorie
             FROM objet o
             JOIN categorie c ON o.categorie_id = c.id
             WHERE o.statut = COALESCE($1, o.statut)
             AND o.categorie_id = COALESCE($2, o.categorie_id)
             ORDER BY o.id`,
            [statut || null, categorie_id ? Number(categorie_id) : null]
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "erreur serveur." });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT
                o.*,
                c.libelle AS categorie,
                d.date_depot,
                d.type AS type_depot,
                p.nom AS donatrice_nom,
                p.prenom AS donatrice_prenom
            FROM objet o
            JOIN categorie c ON o.categorie_id = c.id
            JOIN depot d ON o.depot_id = d.id
            JOIN personne p ON d.personne_id = p.id
            WHERE o.id = $1`,
            [id]
        );
         if (result.rows.length === 0) {
            return res.status(404).json({
                error: "objet introuvable"
            })
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "erreur serveur" });
    }
});

router.patch("/:id/statut", async (req, res) => {
    // Convertit l'identifiant de l'objet en nombre pour PostgreSQL
const id = Number(req.params.id);
// Vérifie la valeur de l'identifiant reçue par l'API
console.log("ID reçu :", req.params.id);
console.log("ID converti :", id);
    const { statut } = req.body ?? {};  // Modifie uniquement le statut d'un objet
    // auparavant { statut, prix }

    if (statut !== "arrive" &&
        statut !== "en_reparation" &&
        statut !== "en_rayon" &&
        statut !== "recycle" &&
        statut !== "vendu") {
        return res.status(400).json({
            error: "statut invalide"
        });
    }

    try { 
        const result = await pool.query(
            `UPDATE objet
             SET statut = $1
             WHERE id = $2
             RETURNING *`,
            [statut, id]
        ); 

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "objet introuvable"
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "erreur serveur"});
    }
});

export default router;