// Configuración de variables de entorno y globales
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    port: process.env.PORT || 3000,
    db: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'postgres',
        pass: process.env.DB_PASS || 'password',
        name: process.env.DB_NAME || 'wysiati_db',
        port: process.env.DB_PORT || 5432,
    },
    jwtSecret: process.env.JWT_SECRET || 'wysiati_ultra_secret_key',
    aiKey: process.env.AI_API_KEY || ''
};
