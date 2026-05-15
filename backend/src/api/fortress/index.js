const express = require('express');
const router = express.Router();
const authGuard = require('../../middleware/authGuard');
const { Habit } = require('../../db');

// Obtener estado de la fortaleza
router.get('/status', authGuard, async (req, res) => {
    try {
        const userId = req.user?.id;
        const habitData = await Habit.getByUserId(userId);
        res.json(habitData);
    } catch (error) {
        console.error("🔥 Error en status fortaleza:", error);
        res.status(500).json({ error: 'Error al obtener estado de Fortaleza' });
    }
});

// Desbloquear fortaleza (Onboarding)
router.post('/unlock', authGuard, async (req, res) => {
    try {
        const userId = req.user?.id;
        const { selectedHabits } = req.body;
        if (!selectedHabits || selectedHabits.length === 0) {
            return res.status(400).json({ error: 'Debes seleccionar al menos un hábito' });
        }

        const updatedHabit = await Habit.unlock(userId, selectedHabits);
        res.json(updatedHabit);
    } catch (error) {
        console.error("🔥 Error en unlock fortaleza:", error);
        res.status(500).json({ error: 'Error al desbloquear Fortaleza' });
    }
});

// Hacer el Check-in diario
router.post('/check-in', authGuard, async (req, res) => {
    try {
        const userId = req.user?.id;
        const updatedHabit = await Habit.checkIn(userId);

        res.json({ 
            success: true, 
            newStreak: updatedHabit.current_streak, 
            message: '¡Fortaleza confirmada!' 
        });
    } catch (error) {
        console.error("🔥 Error en check-in fortaleza:", error);
        const msg = error.message === 'Ya has registrado tu fortaleza hoy' 
            ? error.message 
            : 'Error al procesar el check-in';
        res.status(400).json({ error: msg });
    }
});

module.exports = router;
