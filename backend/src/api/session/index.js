const express = require('express');
const router = express.Router();
const authGuard = require('../../middleware/authGuard');
const db = require('../../db/client');
const cognitiveProcessor = require('../../ia/processors/cognitiveProcessor');

// Guardar el resultado de una sesión de IA (Voz o Video) + ANÁLISIS COGNITIVO
router.post('/log', authGuard, async (req, res) => {
    try {
        const { session_type, transcript, biometrics, ai_summary } = req.body;
        const userId = req.user?.id || '00000000-0000-0000-0000-000000000000';

        // Si hay transcripción, analizamos el pensamiento detrás de las palabras
        let cognitiveAnalysis = null;
        if (transcript) {
            cognitiveAnalysis = await cognitiveProcessor.analyze(transcript);
        }

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
            cognitiveAnalysis ? cognitiveAnalysis.aiInsight : ai_summary
        ]);

        res.json({
            success: true,
            session: rows[0],
            analysis: cognitiveAnalysis,
            message: 'Sesión Bio-Sync guardada con análisis cognitivo'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar la sesión de IA' });
    }
});

module.exports = router;
