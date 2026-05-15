/**
 * IMPORTADOR MAESTRO WYSIATI
 * Sincroniza la estructura de la base de datos y prepara el entorno
 */
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const config = {
    user: process.env.DB_USER || 'blueb',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'wysiati',
    password: process.env.DB_PASS || 'mypassword',
    port: process.env.DB_PORT || 5432,
};

const pool = new Pool(config);

async function runSetup() {
    console.log("🚀 Iniciando Importador Maestro...");
    console.log(`🔌 Conectando a ${config.host}:${config.port}...`);

    try {
        const sqlPath = path.join(__dirname, 'src/db/init.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log("📜 Ejecutando esquema de tablas...");
        await pool.query(sql);
        
        console.log("✅ Estructura creada con éxito.");
        
        // Verificación final: ¿Existe el usuario dev?
        const res = await pool.query("SELECT email FROM users WHERE id = '00000000-0000-0000-0000-000000000000'");
        if (res.rows.length > 0) {
            console.log(`👤 Usuario de desarrollo verificado: ${res.rows[0].email}`);
        }

        console.log("\n✨ BASE DE DATOS LISTA PARA EL SANTUARIO ✨");
        process.exit(0);
    } catch (error) {
        console.error("\n❌ ERROR CRÍTICO EN LA IMPORTACIÓN:");
        console.error(error.message);
        process.exit(1);
    }
}

runSetup();
