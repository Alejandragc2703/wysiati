/**
 * Servicio Central de API WYSIATI
 * Puente de comunicación entre el Santuario (Frontend) y el Cerebro (Backend)
 */

const API_URL = 'http://localhost:3000/api';

const api = {
    // Helper para peticiones con Token
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('wysiati_token');
        const headers = {
            ...(token && { 'Authorization': token }),
            ...options.headers
        };

        // Si es FormData, dejamos que el navegador gestione el Content-Type (con boundary)
        if (options.body instanceof FormData) {
            delete headers['Content-Type'];
        } else {
            headers['Content-Type'] = headers['Content-Type'] || 'application/json';
        }

        // Eliminar headers que sean undefined explícitamente
        Object.keys(headers).forEach(key => {
            if (headers[key] === undefined) delete headers[key];
        });

        console.log(`🚀 Llamando a: ${API_URL}${endpoint}`, options);

        try {
            const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
            if (!response.ok) {
                let errorMsg = `${response.status} ${response.statusText}`;
                try {
                    const errBody = await response.json();
                    errorMsg = errBody.error || errorMsg;
                } catch (_) { }
                console.error(`Error en respuesta API: ${errorMsg}`);
                const err = new Error(errorMsg);
                err.status = response.status;
                throw err;
            }
            return response.json();
        } catch (error) {
            console.error("🔥 Error crítico en Fetch:", error.message);
            throw error;
        }
    },

    // ── DASHBOARD ──
    getDashboardStats: () => api.request('/dashboard/stats'),
    saveQuest: (data) => api.request('/dashboard/save-quest', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    // ── DIARIO (JOURNAL) ──
    getJournalEntries: () => api.request('/journal'),
    getYearlyStats: () => api.request('/journal/yearly-stats'),
    saveJournalEntry: (data) => api.request('/journal', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    // ── FORTALEZA (HABITS) ──
    getFortressStatus: () => api.request('/fortress/status'),
    unlockFortress: (selectedHabits) => api.request('/fortress/unlock', {
        method: 'POST',
        body: JSON.stringify({ selectedHabits })
    }),
    checkInHabit: () => api.request('/fortress/check-in', { method: 'POST' }),

    // ── PERFIL (PROFILE) ──
    getProfile: () => api.request('/profile'),
    updateProfile: (data) => api.request('/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    updateStatus: (isActive) => api.request('/profile/status', {
        method: 'POST',
        body: JSON.stringify({ isActive })
    }),

    // ── SESIONES DE IA (VOICE/VIDEO) ──
    logAiSession: (data) => api.request('/session/log', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    // ── ACADEMIA (LIBRARY) ──
    getAcademyContent: () => api.request('/academy/content'),

    // ── AUTH (MOCK PARA DEMO) ──
    register: (email, password, firstName, lastName) => api.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, firstName, lastName })
    }),
    login: (identifier, password) => api.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password })
    }),

    // ── COMUNIDAD (SOCIAL) ──
    getCommunityFeed: () => api.request('/community/feed'),
    createPost: (formData) => api.request('/community/', {
        method: 'POST',
        body: formData
    }),
    togglePostLike: (postId) => api.request(`/community/${postId}/like`, { method: 'POST' }),
    addPostComment: (postId, content) => api.request(`/community/${postId}/comment`, {
        method: 'POST',
        body: JSON.stringify({ content })
    }),
    getPostComments: (postId) => api.request(`/community/${postId}/comments`),
    updatePost: (postId, content) => api.request(`/community/${postId}`, {
        method: 'PUT',
        body: JSON.stringify({ content })
    }),
    deletePost: (postId) => api.request(`/community/${postId}`, { method: 'DELETE' }),

    // ── FACT DEL DÍA (IA) ──
    getDailyFact: () => api.request('/fact/daily'),
    expandFact: (data) => api.request('/fact/expand', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

};

export default api;
