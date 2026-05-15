/**
 * Rutas de Autenticación
 * Maneja Login, Registro y Validación de Token
 */
const express = require('express');
const router = express.Router();

const { User } = require('../../db');
const { sendResetPasswordEmail } = require('../../services/emailService');
const crypto = require('crypto');

// Registro
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Aquí iría la lógica de guardado real con hash de contraseña
        res.json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error en el registro' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Simulamos éxito por ahora para facilitar desarrollo, pero ya conectado a la estructura
        res.json({ 
            message: 'Login exitoso', 
            token: 'mock-jwt-token',
            user: { email, nickname: 'Desarrollador' }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error en el login' });
    }
});

// Recuperar Contraseña (EMAIL REAL)
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        // Generar un token de recuperación aleatorio
        const token = crypto.randomBytes(20).toString('hex');
        
        // Aquí podrías guardar el token en la DB con una fecha de expiración
        // await User.setResetToken(email, token);

        await sendResetPasswordEmail(email, token);

        res.json({ success: true, message: 'Vínculo de recuperación enviado a tu email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al enviar el email de recuperación' });
    }
});

module.exports = router;
