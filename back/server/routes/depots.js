import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
        `SELECT
            d.*,
            p.nom AS donatrice_nom,
            p.prenom AS donatrice_prenom
        FROM depot d
        JOIN personne p ON d.personne_id = p.id
        WHERE d.id = $1`,
        [id]
);
    if (result.rows.length === 0) {
        return res.status(404).json({
            error: "dépôt introuvable"
        });
    } 
        const objetsResult = await pool.query(`
            SELECT o.*
            FROM objet o
            WHERE o.depot_id = $1
            Order BY o.id`,
        [id]
    );
        const depot = result.rows[0];
        depot.objets = objetsResult.rows;

    res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "erreur serveur"});
    }
});

        router.post("/", async(req, res) => {
            const { date_depot, type, personne_id } = req.body ?? {};

            if (!date_depot || !type || !personne_id) {
                 return res.status(400).json({ error: "champs obligatoires manquants" });
                }

            if (typeof personne_id !== "number") {
                return res.status(400).json({
                    error: "personne_id doit être un nombre"
                });
            }
            
            if (type !== "boutique" && type !== "domicile") {
                return res.status(400).json({ error: "type invalide"});
            }

            try {
                const result = await pool.query(
                    `INSERT INTO depot (date_depot, type, personne_id)
                    VALUES ($1, $2, $3)
                    RETURNING *`, 
                    [date_depot, type, personne_id]
                );

                res.status(201).json(result.rows[0]);

            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "erreur serveur" });
            }

        });

        router.post("/:id/objets", async (req, res) => {
            const { id } = req.params;

            const {
                libelle,
                poids_kg,
                etat_arrivee,
                categorie_id
            } = req.body ?? {};

            if (!libelle || !poids_kg || !etat_arrivee || !categorie_id) {
                return res.status(400).json({
                error: "champs obligatoires manquants"
                });
            }

            if (typeof categorie_id !== "number") {
                return res.status(400).json({
                    error: "categorie_id doit être un nombre"
                });
            }

            if (typeof poids_kg !== "number") {
                return res.status(400).json({
                    error: "poids_kg doit être un nombre"
                });
            }

            if (poids_kg <= 0) {
                return res.status(400).json({
                    error: "poids_kg doit être supérieur à 0"
                });
            }

            if (
                etat_arrivee !== "bon_etat" &&
                etat_arrivee !== "a_reparer" &&
                etat_arrivee !== "hors_service"
            ) {
                return res.status(400).json({
                error: "etat_arrivee invalide"
                });
            }

            try {
                const result = await pool.query(
                `INSERT INTO objet (
                    libelle,
                    poids_kg,
                    etat_arrivee,
                    categorie_id,
                    depot_id
                )
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *`,
                [
                    libelle,
                    poids_kg,
                    etat_arrivee,
                    categorie_id,
                    id
                ]
                );

                res.status(201).json(result.rows[0]);

            } catch (error) {
                console.error(error);
                res.status(500).json({
                error: "erreur serveur"
                });
            }
            });

export default router;