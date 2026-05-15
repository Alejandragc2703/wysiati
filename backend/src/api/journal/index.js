const express = require('express');
const router = express.Router();
const authGuard = require('../../middleware/authGuard');
const cognitiveProcessor = require('../../ia/processors/cognitiveProcessor');
const userMemory = require('../../ia/userMemory');
const { Mood } = require('../../db');

// Obtener todas las reflexiones REALES de la DB
router.get('/', authGuard, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'No autorizado' });
        const history = await Mood.getUserHistory(userId);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Error al recuperar el historial' });
    }
});

// Obtener estadísticas anuales para el calendario GitHub-style
router.get('/yearly-stats', authGuard, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'No autorizado' });
        const stats = await Mood.getYearlyStats(userId);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Error al recuperar estadísticas anuales' });
    }
});

// Guardar nueva reflexión + PROCESAMIENTO IA REAL + PERSISTENCIA DB
router.post('/', authGuard, async (req, res) => {
    try {
        const { title, content, mood_score, tags, emotional_load } = req.body;
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'No autorizado' });

        // 1. Análisis de IA REAL (Asíncrono)
        const analysis = await cognitiveProcessor.analyze(content);
        userMemory.learn(userId, analysis);

        // 2. Persistencia en PostgreSQL
        const newLog = await Mood.log(userId, mood_score || 3, content, analysis.aiInsight, tags || [], title, emotional_load);

        res.json({
            ...newLog,
            analysis,
            message: 'Santuario sincronizado: Reflexión guardada con análisis de IA.'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar la reflexión' });
    }
});

module.exports = router;
