import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async(req, res) => {
    try {
        const data = await pool.query(
            "SELECT id , nom, prenom, telephone, adherente FROM personne  ORDER BY id"
        ); 
        res.status(200).json(data.rows);
    } catch (error) {
        console.error("liste de personne", error);
        res.status(500).json({error: "erreur serveur"});
    }
});

router.post("/", async (req, res) => {
    const { nom, prenom, telephone, adherente } = req.body ?? {};
        if (!nom || !prenom) {
            return res.status(400).json({
                error: "nom et prenom obligatoires"
            });
        }

        const telephoneValeur = telephone ?? null;
        const adherenteValeur = adherente ?? false;
    try {
        const result = await pool.query(
            `INSERT INTO personne (nom, prenom, telephone, adherente)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [nom, prenom, telephoneValeur, adherenteValeur]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "erreur serveur"});
    }
});

router.get("/:id/objets", async (req, res) => {
    const { id } = req.params;

    try {
        const data = await pool.query(
            `SELECT 
                o.id,
                o.libelle,
                o.poids_kg,
                o.etat_arrivee,
                o.statut,
                c.libelle AS categorie_libelle,
                d.id AS depot_id,
                d.date_depot
            FROM objet o
            JOIN categorie c ON o.categorie_id = c.id
            JOIN depot d ON o.depot_id = d.id
            WHERE d.personne_id = $1
            ORDER BY o.id`,
            [id]
        );

        res.status(200).json(data.rows);
    } catch (error) {
        console.error("Erreur historique objets", error);
        res.status(500).json({ error: "erreur serveur" });
    }
});

export default router;