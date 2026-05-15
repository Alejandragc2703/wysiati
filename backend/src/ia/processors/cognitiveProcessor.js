/**
 * Procesador Cognitivo WYSIATI
 * Basado en la teoría de Sistemas de Pensamiento de Daniel Kahneman
 */

class CognitiveProcessor {
    constructor() {
        // Diccionario de sesgos y sus disparadores (triggers)
        this.biasMarkers = {
            'disponibilidad': ['siempre', 'nunca', 'todo el tiempo', 'últimamente'],
            'confirmacion': ['lo sabía', 'estaba seguro', 'como siempre'],
            'exceso_optimismo': ['fácil', 'rápido', 'sin problemas', 'seguro que sale'],
            'anclaje': ['primero', 'inicialmente', 'antes de que']
        };
    }

    /**
     * Analiza una entrada de texto buscando huellas de pensamiento impulsivo (Sistema 1)
     */
    analyzeSystem(text) {
        const input = text.toLowerCase();
        let detectedBiases = [];
        let systemType = 'Sistema 1 (Intuitivo)';

        // Buscar disparadores de sesgos
        for (const [bias, triggers] of Object.entries(this.biasMarkers)) {
            if (triggers.some(trigger => input.includes(trigger))) {
                detectedBiases.push(bias);
            }
        }

        // Si el texto es largo y complejo, el Sistema 2 podría estar activo
        if (input.length > 300 && detectedBiases.length === 0) {
            systemType = 'Sistema 2 (Analítico)';
        }

        return {
            systemType,
            detectedBiases,
            intensity: detectedBiases.length * 0.25,
            timestamp: new Date()
        };
    }

    /**
     * Genera un consejo para "despertar" al Sistema 2
     */
    generateCorrection(analysis) {
        if (analysis.detectedBiases.includes('disponibilidad')) {
            return "Estás decidiendo basándote en lo más reciente. Haz una lista de 3 excepciones pasadas para activar tu Sistema 2.";
        }
        if (analysis.detectedBiases.includes('exceso_optimismo')) {
            return "Tu Sistema 1 está ignorando los riesgos. Haz un 'Pre-mortem': ¿Qué podría fallar en este plan?";
        }
        return "Tómate 2 minutos antes de decidir. El silencio es el aliado del pensamiento lento.";
    }
}

module.exports = new CognitiveProcessor();
