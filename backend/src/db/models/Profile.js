const db = require('../client');

class Profile {
    static async createInitial(userId, nickname) {
        const query = `
            INSERT INTO user_profiles (user_id, nickname)
            VALUES ($1, $2)
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

    static async getByUserId(userId) {
        const query = 'SELECT * FROM user_profiles WHERE user_id = $1';
        const { rows } = await db.query(query, [userId]);
        return rows[0];
    }
}

module.exports = Profile;
