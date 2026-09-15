import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const data = await pool.query(
            `SELECT id, nom, prenom, telephone, date_arrivee 
            FROM benevole 
            ORDER BY id`
        );
        res.status(200).json(data.rows);
    } catch (error) {
        console.error("liste des bénévoles", error);
        res.status(500).json({ error: "erreur serveur" });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const data = await pool.query(
            `SELECT id, nom, prenom, telephone, date_arrivee 
            FROM benevole 
            WHERE id = $1`,
            [id]
        );

        if (data.rows.length === 0) {
            return res.status(404).json({ error: "bénévole introuvable" });
        }

        res.status(200).json(data.rows[0]);
    } catch (error) {
        console.error("détail bénévole", error);
        res.status(500).json({ error: "erreur serveur" });
    }
});

export default router;