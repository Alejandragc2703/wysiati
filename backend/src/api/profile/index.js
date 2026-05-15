const express = require('express');
const router = express.Router();
const authGuard = require('../../middleware/authGuard');
const { Profile } = require('../../db');

// Obtener datos del perfil
router.get('/', authGuard, async (req, res) => {
    try {
        const userId = req.user?.id || 'default_user';
        const profile = await Profile.getByUserId(userId);
        res.json(profile || { nickname: 'Viajero' });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el perfil' });
    }
});

// Actualizar datos del perfil (Nickname)
router.put('/', authGuard, async (req, res) => {
    try {
        const { nickname } = req.body;
        const userId = req.user?.id || 'default_user';
        const updatedProfile = await Profile.createInitial(userId, nickname); // createInitial funciona como un upsert simplificado
        res.json(updatedProfile);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el perfil' });
    }
});

module.exports = router;
