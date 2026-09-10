import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const statutsResult = await pool.query(
            `SELECT statut, count(*) AS total
            FROM  objet
            GROUP BY statut`
        );
        const poidsTotalResult = await pool.query(
            `SELECT SUM(poids_kg) AS total
            FROM objet`
        );
        const poidsDetourneResult = await pool.query(
            `SELECT SUM(poids_kg) AS poids_detourne
            FROM objet
            WHERE statut != 'recycle'`
        );

        res.status(200).json({
            objet_par_statut: statutsResult.rows,
            poids_total_recu: poidsTotalResult.rows[0].total,
            poids_total_detourne: poidsDetourneResult.rows[0].poids_detourne
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error : "erreur serveur"});
    }
});

export default router;
