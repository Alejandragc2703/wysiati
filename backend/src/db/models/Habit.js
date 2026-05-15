const db = require('../client');

class Habit {
    static async getByUserId(userId) {
        const query = 'SELECT * FROM habit_tracker WHERE user_id = $1';
        const { rows } = await db.query(query, [userId]);
        return rows[0];
    }

    static async updateStreak(userId, newStreak) {
        const query = `
            UPDATE habit_tracker 
            SET current_streak = $2, 
                max_streak = GREATEST(max_streak, $2),
                last_check_in = CURRENT_TIMESTAMP
            WHERE user_id = $1
            RETURNING *
        `;
        const { rows } = await db.query(query, [userId, newStreak]);
        return rows[0];
    }

    static async addBadge(userId, badgeId) {
        const query = `
            UPDATE habit_tracker 
            SET badges_earned = badges_earned || $2::jsonb
            WHERE user_id = $1
            RETURNING *
        `;
        const { rows } = await db.query(query, [userId, JSON.stringify([badgeId])]);
        return rows[0];
    }
}

module.exports = Habit;
