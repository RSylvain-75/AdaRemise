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
        res.status(500).json({ error: "erreur serveur" });
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
    const { id } = req.params;
    const { statut, prix } = req.body ?? {};

    if (statut !== "arrive" &&
        statut !== "en_reparation" &&
        statut !== "en_rayon" &&
        statut !== "recycle" &&
        statut !== "vendu") {
        return res.status(400).json({
            error: "statut invalide"
        });
    }
    if (prix !== undefined && typeof prix !== "number") {
        return res.status(400).json({
            error: "prix doit être un nombre"
        });
    }
    try { 
        const result = await pool.query(
        `UPDATE objet
        SET statut = $1,
            prix = COALESCE($2, prix)
        WHERE id = $3
        RETURNING *`,
        [statut, prix ?? null, id]
    ); 

    if (result.rows.length === 0) {
        return res.status(404 ).json({
            error: "objet introuvable"
        });
    }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "erreur serveur"});
    }

});

router.post("/", async (req, res) => {
  const { libelle, poids_kg, etat_arrivee, categorie_id, depot_id } = req.body ?? {};

  if (!libelle || !poids_kg || !etat_arrivee || !categorie_id || !depot_id) {
    return res.status(400).json({
      error: "champs obligatoires manquants"
    });
  }
  if (typeof depot_id !== "number") {
    return res.status(400).json({
      error: "depot_id doit être un nombre"
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
        depot_id
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