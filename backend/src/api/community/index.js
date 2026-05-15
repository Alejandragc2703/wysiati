const express = require('express');
const router = express.Router();
const authGuard = require('../../middleware/authGuard');
const { Post, Profile } = require('../../db');
const multer = require('multer');
const path = require('path');

// Configuración de Multer para subidas
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 50 * 1024 * 1024 } 
});

// Obtener todos los posts (FEED)
router.get('/feed', authGuard, async (req, res) => {
    try {
        const posts = await Post.getAll(req.user.id);
        res.json(posts);
    } catch (error) {
        console.error("Error al obtener posts:", error);
        res.status(500).json({ error: 'Error al obtener el feed de comunidad' });
    }
});

// Crear un post con media
router.post('/', authGuard, upload.single('media'), async (req, res) => {
    try {
        const userId = req.user?.id;
        const { content } = req.body;
        
        // Verificar si el usuario está activo para poder publicar
        const profile = await Profile.getByUserId(userId);
        console.log(`📝 Intento de publicación - User: ${userId}, Active: ${profile?.is_active}`);

        if (!profile || !profile.is_active) {
            console.warn(`🚫 Bloqueado: Usuario ${userId} intentó publicar estando Inactivo.`);
            return res.status(403).json({ error: 'Debes estar en modo "Activo" para publicar en el Santuario.' });
        }

        let mediaUrl = null;
        let mediaType = null;

        if (req.file) {
            mediaUrl = `/uploads/${req.file.filename}`;
            mediaType = req.file.mimetype.startsWith('image') ? 'image' : 'video';
        }

        const newPost = await Post.create(userId, content, mediaUrl, mediaType);
        res.status(201).json(newPost);
    } catch (error) {
        console.error("Error al crear post:", error);
        res.status(500).json({ error: 'Error al publicar en la comunidad' });
    }
});

// Toggle Like
router.post('/:id/like', authGuard, async (req, res) => {
    try {
        const userId = req.user?.id;
        const postId = req.params.id;
        const result = await Post.toggleLike(userId, postId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error al procesar el like' });
    }
});

// Comentar
router.post('/:id/comment', authGuard, async (req, res) => {
    try {
        const userId = req.user?.id;
        const postId = req.params.id;
        const { content } = req.body;
        const comment = await Post.addComment(userId, postId, content);
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: 'Error al añadir comentario' });
    }
});

// Obtener comentarios de un post
router.get('/:id/comments', authGuard, async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await Post.getComments(postId);
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener comentarios' });
    }
});

// Eliminar post
router.delete('/:id', authGuard, async (req, res) => {
    try {
        const userId = req.user?.id;
        const postId = req.params.id;
        const deleted = await Post.delete(userId, postId);
        if (!deleted) return res.status(403).json({ error: 'No autorizado o post inexistente' });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el post' });
    }
});

// Editar post
router.put('/:id', authGuard, async (req, res) => {
    try {
        const userId = req.user?.id;
        const postId = req.params.id;
        const { content } = req.body;
        const updated = await Post.update(userId, postId, content);
        if (!updated) return res.status(403).json({ error: 'No autorizado o post inexistente' });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Error al editar el post' });
    }
});

module.exports = router;
