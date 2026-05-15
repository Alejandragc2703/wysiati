const db = require('../client');

class Mood {
    /**
     * Guarda un registro de humor con su reflexión e insight de IA
     */
    static async log(userId, moodScore, note, aiInsight, tags = []) {
        const query = `
            INSERT INTO mood_logs (user_id, mood_score, note, ai_insight, tags)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const { rows } = await db.query(query, [
            userId, 
            moodScore, 
            note, 
            aiInsight, 
            JSON.stringify(tags)
        ]);
        return rows[0];
    }

    static async getUserHistory(userId) {
        const query = `
            SELECT * FROM mood_logs 
            WHERE user_id = $1 
            ORDER BY created_at DESC 
            LIMIT 100
        `;
        const { rows } = await db.query(query, [userId]);
        return rows;
    }

    /**
     * Obtiene datos para el Yearly Calendar (estilo GitHub)
     * Formatea la fecha para evitar desfases de zona horaria
     */
    static async getYearlyStats(userId) {
        const query = `
            SELECT mood_score, TO_CHAR(created_at, 'YYYY-MM-DD') as date
            FROM mood_logs
            WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '1 year'
            ORDER BY created_at ASC
        `;
        const { rows } = await db.query(query, [userId]);
        return rows;
    }
}

module.exports = Mood;
