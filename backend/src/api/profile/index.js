const express = require('express');
const router = express.Router();
const authGuard = require('../../middleware/authGuard');
const { Profile } = require('../../db');

// Obtener datos del perfil
router.get('/', authGuard, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'No autorizado' });
        
        // Buscamos perfil y datos base de usuario en una sola consulta
        const { User, Profile } = require('../../db');
        const user = await User.findById(userId);
        const profile = await Profile.getByUserId(userId);

        res.json({ 
            ...(profile || {}),
            id: userId,
            user_id: userId,
            nickname: profile?.nickname || user?.nickname || user?.first_name || 'Viajero', 
            email: user?.email,
            created_at: user?.created_at,
            first_name: user?.first_name,
            last_name: user?.last_name,
            is_active: profile?.is_active || false
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el perfil' });
    }
});

// Actualizar datos del perfil (Nickname)
router.put('/', authGuard, async (req, res) => {
    try {
        const { nickname, is_active } = req.body;
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'No autorizado' });
        const updatedProfile = await Profile.update(userId, { nickname, is_active });
        res.json(updatedProfile);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el perfil' });
    }
});

// Cambiar estado de actividad (Activo/Inactivo)
router.post('/status', authGuard, async (req, res) => {
    try {
        const { isActive } = req.body;
        const userId = req.user?.id;
        const updatedProfile = await Profile.updateStatus(userId, isActive);
        res.json(updatedProfile);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar estado de actividad' });
    }
});

module.exports = router;
