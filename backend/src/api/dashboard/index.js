const express = require('express');
const router = express.Router();
const authGuard = require('../../middleware/authGuard');
const { Habit, Mood, Profile, Quest, User } = require('../../db');

router.get('/stats', authGuard, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'No autorizado' });
        
        // 1. Obtener racha real
        const habitData = await Habit.getByUserId(userId);
        
        // 2. Obtener último consejo de IA
        const moodLogs = await Mood.getUserHistory(userId);
        const lastInsight = moodLogs.length > 0 ? moodLogs[0].ai_insight : "Tu Sistema 2 está listo para empezar el día.";

        // 3. Obtener perfil
        const profile = await Profile.getByUserId(userId);

        // 4. Obtener total de usuarios reales
        const communityUsers = await User.count();

        // 5. Verificar si ya registró mood hoy
        const hasMoodToday = moodLogs.length > 0 && 
            new Date(moodLogs[0].created_at).toDateString() === new Date().toDateString();
            
        // 6. Verificar si ya hizo la misión diaria
        const todayQuest = await Quest.getTodayQuest(userId);
        const hasQuestToday = !!todayQuest;

        // 7. Asegurar que el nickname no sea "Viajero" si el usuario tiene uno real
        let finalNickname = profile?.nickname;
        if (!finalNickname || finalNickname === 'Viajero') {
            const user = await User.findById(userId);
            finalNickname = user?.nickname || 'Viajero';
        }

        res.json({
            nickname: finalNickname,
            email: req.user?.email,
            streak: habitData ? habitData.current_streak : 0,
            maxStreak: habitData ? habitData.max_streak : 0,
            lastInsight: lastInsight,
            hasMoodToday,
            hasQuestToday,
            lastMoodScore: moodLogs.length > 0 ? moodLogs[0].mood_score : null,
            lastQuestScore: todayQuest ? todayQuest.score : null,
            questResults: todayQuest ? todayQuest.answers : null,
            moodTrend: 'Estable',
            personality: profile?.personality_type || 'Arquitecto de Hábitos',
            fortressUnlocked: habitData?.is_unlocked || false,
            selectedHabits: habitData?.selected_habits || [],
            lastCheckIn: habitData?.last_check_in || null,
            isActive: profile?.is_active ?? false,
            communityUsers: communityUsers
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar estadísticas del Dashboard' });
    }
});

router.post('/save-quest', authGuard, async (req, res) => {
    try {
        const userId = req.user?.id;
        const { answers, score, resultText } = req.body;

        // Verificar si ya lo hizo hoy
        const existing = await Quest.getTodayQuest(userId);
        if (existing) return res.status(400).json({ error: 'Misión ya completada hoy' });

        const saved = await Quest.save(userId, answers, score, resultText);
        res.json(saved);
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar la misión' });
    }
});

module.exports = router;
