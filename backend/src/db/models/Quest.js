const db = require('../client');

class Quest {
    static async save(userId, answers, score, resultText) {
        const query = `
            INSERT INTO daily_quests (user_id, answers, score, result_text)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const { rows } = await db.query(query, [userId, JSON.stringify(answers), score, resultText]);
        return rows[0];
    }

    static async getTodayQuest(userId) {
        const query = `
            SELECT * FROM daily_quests 
            WHERE user_id = $1 
            AND created_at::date = CURRENT_DATE
            LIMIT 1;
        `;
        const { rows } = await db.query(query, [userId]);
        return rows[0];
    }
}

module.exports = Quest;
