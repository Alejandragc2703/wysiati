const express = require('express');
const router = express.Router();
const authGuard = require('../../middleware/authGuard');
const db = require('../../db/client');

// Guardar el resultado de una sesión de IA (Voz o Video)
router.post('/log', authGuard, async (req, res) => {
    try {
        const { session_type, transcript, biometrics, ai_summary } = req.body;
        const userId = req.user?.id || '00000000-0000-0000-0000-000000000000';

        const query = `
            INSERT INTO ai_sessions (user_id, session_type, transcript, biometrics, ai_summary)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        
        const { rows } = await db.query(query, [
            userId, 
            session_type, 
            transcript, 
            JSON.stringify(biometrics), 
            ai_summary
        ]);

        res.json({
            success: true,
            session: rows[0],
            message: 'Sesión Bio-Sync guardada en el historial'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar la sesión de IA' });
    }
});

module.exports = router;
