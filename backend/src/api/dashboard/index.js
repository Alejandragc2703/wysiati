const express = require('express');
const router = express.Router();
const authGuard = require('../../middleware/authGuard');
const { Habit, Mood } = require('../../db');

router.get('/stats', authGuard, async (req, res) => {
    try {
        const userId = req.user?.id || 'default_user';
        
        // 1. Obtener racha real
        const habitData = await Habit.getByUserId(userId);
        
        // 2. Obtener último consejo de IA
        const moodLogs = await Mood.getUserHistory(userId);
        const lastInsight = moodLogs.length > 0 ? moodLogs[0].ai_insight : "Tu Sistema 2 está listo para empezar el día.";

        res.json({
            nickname: req.user?.nickname || 'Adrián',
            streak: habitData ? habitData.current_streak : 1,
            lastInsight: lastInsight,
            moodTrend: 'Estable', // Aquí podríamos meter lógica de MoodCalculator
            personality: 'Arquitecto de Hábitos'
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar estadísticas del Dashboard' });
    }
});

module.exports = router;
