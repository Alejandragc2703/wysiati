const db = require('../client');

class User {
    static async create(email, passwordHash, firstName = '', lastName = '') {
        const query = `
            INSERT INTO users (email, password_hash, first_name, last_name, nickname)
            VALUES ($1, $2, $3, $4, $3)
            RETURNING id, email, created_at, nickname
        `;
        const { rows } = await db.query(query, [email, passwordHash, firstName, lastName]);
        return rows[0];
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const { rows } = await db.query(query, [email]);
        return rows[0];
    }

    static async findByIdentifier(identifier) {
        const query = 'SELECT * FROM users WHERE email = $1 OR nickname = $1';
        const { rows } = await db.query(query, [identifier]);
        return rows[0];
    }

    static async findById(id) {
        const query = 'SELECT * FROM users WHERE id = $1';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }

    static async count() {
        const query = `
            SELECT COUNT(*) FROM users u
            LEFT JOIN user_profiles up ON u.id = up.user_id
            WHERE COALESCE(up.is_active, FALSE) = TRUE
        `;
        const { rows } = await db.query(query);
        return parseInt(rows[0].count);
    }
}

module.exports = User;
