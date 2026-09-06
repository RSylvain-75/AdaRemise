import express from "express";
import pool from "../db.js";

const router = express.Router();

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

export default router;