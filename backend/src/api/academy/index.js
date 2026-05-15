const express = require('express');
const router = express.Router();
const authGuard = require('../../middleware/authGuard');
const db = require('../../db/client');

// Obtener todo el contenido de la biblioteca
router.get('/content', authGuard, async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM library_content ORDER BY category ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al recuperar contenido de la academia' });
    }
});

module.exports = router;
