const express = require('express');
const router = express.Router();
const authGuard = require('../../middleware/authGuard');
const { Habit } = require('../../db');

// Hacer el Check-in diario (actualizar racha)
router.post('/check-in', authGuard, async (req, res) => {
    try {
        const userId = req.user?.id || 'default_user';
        
        // 1. Obtener racha actual
        let habitData = await Habit.getByUserId(userId);
        let newStreak = habitData ? habitData.current_streak + 1 : 1;

        // 2. Actualizar en DB
        const updatedHabit = await Habit.updateStreak(userId, newStreak);

        res.json({ 
            success: true, 
            newStreak: updatedHabit.current_streak, 
            message: 'Sober Tracker sincronizado: Racha aumentada.' 
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al procesar el check-in de Fortaleza' });
    }
});

module.exports = router;
