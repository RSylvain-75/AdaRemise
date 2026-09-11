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
        const objetEnRayonResult = await pool.query(
            `SELECT count(*) total
            FROM objet
            WHERE statut = 'en_rayon'`
        );

        res.status(200).json({
            objet_par_statut: statutsResult.rows,
            poids_total_recu: poidsTotalResult.rows[0].total,
            objets_en_rayon: objetEnRayonResult.rows[0].total
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error : "erreur serveur"});
    }
});

export default router;
