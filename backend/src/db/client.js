// Cliente de conexión a PostgreSQL usando 'pg' Pool
const { Pool } = require('pg');
const config = require('../config/env');

const pool = new Pool({
    user: config.db.user,
    host: config.db.host,
    database: config.db.name,
    password: config.db.pass,
    port: config.db.port,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};
