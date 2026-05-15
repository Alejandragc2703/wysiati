const db = require('../client');

class Post {
    static async create(userId, content, mediaUrl, mediaType) {
        const query = `
            WITH inserted_post AS (
                INSERT INTO posts (user_id, content, media_url, media_type)
                VALUES ($1, $2, $3, $4)
                RETURNING *
            )
            SELECT ip.*, 
                   ip.user_id AS author_id,
                   COALESCE(up.nickname, u.nickname, 'Viajero') as nickname,
                   u.first_name, u.last_name
            FROM inserted_post ip
            LEFT JOIN users u ON ip.user_id = u.id
            LEFT JOIN user_profiles up ON u.id = up.user_id
        `;
        const { rows } = await db.query(query, [userId, content, mediaUrl, mediaType]);
        return rows[0];
    }

    static async getAll(currentUserId = null) {
        const query = `
            SELECT p.*, 
                   p.user_id as author_id,
                   COALESCE(up.nickname, u.nickname, 'Viajero') as nickname, 
                   u.first_name, u.last_name,
                   COALESCE(up.is_active, FALSE) as is_active,
                   (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count,
                   (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) as comments_count,
                   EXISTS(SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = $1) as liked
            FROM posts p
            LEFT JOIN users u ON p.user_id = u.id
            LEFT JOIN user_profiles up ON u.id = up.user_id
            WHERE COALESCE(up.is_active, FALSE) = TRUE OR p.user_id = $1
            ORDER BY p.created_at DESC
        `;
        const { rows } = await db.query(query, [currentUserId]);
        return rows;
    }

    static async toggleLike(userId, postId) {
        // Verificar si ya existe el like
        const checkQuery = 'SELECT * FROM post_likes WHERE user_id = $1 AND post_id = $2';
        const { rows } = await db.query(checkQuery, [userId, postId]);

        if (rows.length > 0) {
            await db.query('DELETE FROM post_likes WHERE user_id = $1 AND post_id = $2', [userId, postId]);
            return { liked: false };
        } else {
            await db.query('INSERT INTO post_likes (user_id, post_id) VALUES ($1, $2)', [userId, postId]);
            return { liked: true };
        }
    }

    static async addComment(userId, postId, content) {
        const query = `
            INSERT INTO post_comments (user_id, post_id, content)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const { rows } = await db.query(query, [userId, postId, content]);
        return rows[0];
    }

    static async getComments(postId) {
        const query = `
            SELECT c.*, u.nickname 
            FROM post_comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = $1
            ORDER BY c.created_at ASC
        `;
        const { rows } = await db.query(query, [postId]);
        return rows;
    }

    static async delete(userId, postId) {
        const query = 'DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING *';
        const { rows } = await db.query(query, [postId, userId]);
        return rows[0];
    }

    static async update(userId, postId, content) {
        const query = `
            WITH updated_post AS (
                UPDATE posts 
                SET content = $1 
                WHERE id = $2 AND user_id = $3 
                RETURNING *
            )
            SELECT up.*, 
                   up.user_id AS author_id,
                   COALESCE(u_prof.nickname, u.nickname, 'Viajero') as nickname,
                   u.first_name, u.last_name
            FROM updated_post up
            LEFT JOIN users u ON up.user_id = u.id
            LEFT JOIN user_profiles u_prof ON u.id = u_prof.user_id
        `;
        const { rows } = await db.query(query, [content, postId, userId]);
        return rows[0];
    }
}

module.exports = Post;
