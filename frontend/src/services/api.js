/**
 * Servicio Central de API WYSIATI
 * Puente de comunicación entre el Santuario (Frontend) y el Cerebro (Backend)
 */

const API_URL = 'http://127.0.0.1:3000/api';

const api = {
    // Helper para peticiones con Token
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('wysiati_token');
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': token }),
            ...options.headers
        };

        const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        return response.json();
    },

    // ── DASHBOARD ──
    getDashboardStats: () => api.request('/dashboard/stats'),

    // ── DIARIO (JOURNAL) ──
    getJournalEntries: () => api.request('/journal'),
    getYearlyStats: () => api.request('/journal/yearly-stats'),
    saveJournalEntry: (data) => api.request('/journal', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    // ── FORTALEZA (HABITS) ──
    checkInHabit: () => api.request('/fortress/check-in', { method: 'POST' }),

    // ── PERFIL (PROFILE) ──
    getProfile: () => api.request('/profile'),
    updateProfile: (data) => api.request('/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
    }),

    // ── SESIONES DE IA (VOICE/VIDEO) ──
    logAiSession: (data) => api.request('/session/log', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    // ── ACADEMIA (LIBRARY) ──
    getAcademyContent: () => api.request('/academy/content'),

    // ── AUTH (MOCK PARA DEMO) ──
    login: (email, password) => api.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    })
};

export default api;
