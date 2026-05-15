const db = require('../client');

class Habit {
    static async getByUserId(userId) {
        const query = 'SELECT * FROM habit_tracker WHERE user_id = $1';
        const { rows } = await db.query(query, [userId]);
        
        // Si no existe el registro, lo creamos bloqueado por defecto
        if (rows.length === 0) {
            const insertQuery = 'INSERT INTO habit_tracker (user_id) VALUES ($1) RETURNING *';
            const newHabit = await db.query(insertQuery, [userId]);
            return newHabit.rows[0];
        }
        return rows[0];
    }

    static async unlock(userId, selectedHabits) {
        const query = `
            INSERT INTO habit_tracker (user_id, is_unlocked, selected_habits, current_streak, last_check_in)
            VALUES ($1, TRUE, $2, 0, NULL)
            ON CONFLICT (user_id) DO UPDATE 
            SET is_unlocked = TRUE, 
                selected_habits = $2,
                current_streak = 0,
                last_check_in = NULL
            RETURNING *
        `;
        const { rows } = await db.query(query, [userId, JSON.stringify(selectedHabits)]);
        return rows[0];
    }

    static async checkIn(userId) {
        // 1. Intentar insertar el check-in (evita duplicados por el UNIQUE de la DB)
        const checkInQuery = `
            INSERT INTO habit_checkins (user_id, checked_at) 
            VALUES ($1, CURRENT_DATE) 
            ON CONFLICT DO NOTHING
            RETURNING *
        `;
        const checkInResult = await db.query(checkInQuery, [userId]);
        
        if (checkInResult.rows.length === 0) {
            throw new Error('Ya has registrado tu fortaleza hoy');
        }

        // 2. Actualizar la racha en habit_tracker
        const updateQuery = `
            UPDATE habit_tracker 
            SET current_streak = current_streak + 1,
                max_streak = GREATEST(max_streak, current_streak + 1),
                last_check_in = CURRENT_TIMESTAMP
            WHERE user_id = $1
            RETURNING *
        `;
        const { rows } = await db.query(updateQuery, [userId]);
        return rows[0];
    }
}

module.exports = Habit;
