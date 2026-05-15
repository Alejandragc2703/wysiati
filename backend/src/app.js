/**
 * Servidor Principal WYSIATI Backend
 * Orquestador de la arquitectura Bio-Sync
 */
const express = require('express');
const cors = require('cors');
const config = require('./config/env');

const app = express();

// Middlewares Globales
app.use(cors());
app.use(express.json());

// Importación de Rutas
const authRoutes = require('./api/auth');
const dashboardRoutes = require('./api/dashboard');
const journalRoutes = require('./api/journal');
const fortressRoutes = require('./api/fortress');
const profileRoutes = require('./api/profile');
const sessionRoutes = require('./api/session');
const academyRoutes = require('./api/academy');

// Registro de Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/fortress', fortressRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/academy', academyRoutes);

// Ruta de Salud
app.get('/health', (req, res) => {
    res.json({ status: 'active', timestamp: new Date() });
});

app.listen(config.port, '0.0.0.0', () => {
    console.log(`🔱 WYSIATI Backend sincronizado en puerto ${config.port}`);
});

module.exports = app;
