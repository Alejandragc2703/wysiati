/**
 * Middleware de Seguridad
 * Verifica que el usuario esté autenticado mediante JWT
 */
const jwt = require('jsonwebtoken');
const config = require('../config/env');

const authGuard = (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Se requiere vinculación (Token).' });
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(401).json({ error: 'Sincronización de sesión fallida o expirada.' });
    }
};

module.exports = authGuard;
