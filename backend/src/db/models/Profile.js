const db = require('../client');

class Profile {
    static async createInitial(userId, nickname) {
        const query = `
            INSERT INTO user_profiles (user_id, nickname)
            VALUES ($1, $2)
            ON CONFLICT (user_id) DO UPDATE 
            SET nickname = EXCLUDED.nickname
            RETURNING *
        `;
        const { rows } = await db.query(query, [userId, nickname]);
        return rows[0];
    }

    static async updatePersonality(userId, type, data) {
        const query = `
            UPDATE user_profiles 
            SET personality_type = $2, personality_data = $3
            WHERE user_id = $1
            RETURNING *
        `;
        const { rows } = await db.query(query, [userId, type, JSON.stringify(data)]);
        return rows[0];
    }

    static async updateStatus(userId, isActive) {
        const query = `
            INSERT INTO user_profiles (user_id, is_active, nickname)
            SELECT id, $2, nickname FROM users WHERE id = $1
            ON CONFLICT (user_id) DO UPDATE 
            SET is_active = EXCLUDED.is_active
            RETURNING *
        `;
        const { rows } = await db.query(query, [userId, isActive]);
        return rows[0];
    }

    static async update(userId, data) {
        const { nickname, is_active } = data;
        const query = `
            INSERT INTO user_profiles (user_id, nickname, is_active)
            VALUES ($1, $2, COALESCE($3, FALSE))
            ON CONFLICT (user_id) DO UPDATE 
            SET nickname = COALESCE(EXCLUDED.nickname, user_profiles.nickname),
                is_active = COALESCE(EXCLUDED.is_active, user_profiles.is_active)
            RETURNING *
        `;
        const { rows } = await db.query(query, [userId, nickname, is_active]);
        return rows[0];
    }

    static async getByUserId(userId) {
        const query = 'SELECT * FROM user_profiles WHERE user_id = $1';
        const { rows } = await db.query(query, [userId]);
        return rows[0];
    }
}

module.exports = Profile;
