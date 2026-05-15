/**
 * Sistema de Memoria de Aprendizaje
 * Registra la evolución cognitiva del usuario para detectar patrones a largo plazo
 */
const fs = require('fs');
const path = require('path');

class UserMemory {
    constructor() {
        this.memoryPath = path.join(__dirname, '../../db/user_cognitive_history.json');
        this.initializeMemory();
    }

    initializeMemory() {
        const dir = path.dirname(this.memoryPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        if (!fs.existsSync(this.memoryPath)) {
            fs.writeFileSync(this.memoryPath, JSON.stringify({ users: {} }, null, 2));
        }
    }

    /**
     * Guarda un nuevo 'punto de aprendizaje' para el usuario
     */
    learn(userId, analysis) {
        const history = JSON.parse(fs.readFileSync(this.memoryPath));
        
        if (!history.users[userId]) {
            history.users[userId] = {
                logs: [],
                bias_frequencies: {},
                dominant_system: 'Sistema 1'
            };
        }

        // Añadir log
        history.users[userId].logs.push(analysis);

        // Actualizar frecuencias de sesgos
        analysis.detectedBiases.forEach(bias => {
            history.users[userId].bias_frequencies[bias] = (history.users[userId].bias_frequencies[bias] || 0) + 1;
        });

        // Limitar logs a los últimos 50 para optimizar
        if (history.users[userId].logs.length > 50) history.users[userId].logs.shift();

        fs.writeFileSync(this.memoryPath, JSON.stringify(history, null, 2));
        return history.users[userId];
    }

    /**
     * Obtiene el perfil de pensamiento actual del usuario
     */
    getMentalProfile(userId) {
        const history = JSON.parse(fs.readFileSync(this.memoryPath));
        return history.users[userId] || { error: 'Sin datos aún' };
    }
}

module.exports = new UserMemory();
