const OpenAI = require('openai');
const prompts = require('../prompts/kahneman');

class CognitiveProcessor {
    constructor() {
        this.openai = null;
        if (process.env.AI_API_KEY && process.env.AI_API_KEY !== 'tu_api_key_aqui') {
            this.openai = new OpenAI({
                apiKey: process.env.AI_API_KEY
            });
        }
        
        this.biasMarkers = {
            'disponibilidad': ['siempre', 'nunca', 'todo el tiempo', 'últimamente'],
            'confirmacion': ['lo sabía', 'estaba seguro', 'como siempre'],
            'exceso_optimismo': ['fácil', 'rápido', 'sin problemas', 'seguro que sale'],
            'anclaje': ['primero', 'inicialmente', 'antes de que']
        };
    }

    /**
     * Analiza una entrada de texto usando IA Real (GPT-4o/3.5)
     */
    async analyze(text) {
        // Si no hay IA configurada, vamos directo al básico
        if (!this.openai) {
            return this.analyzeBasic(text);
        }

        console.log("🧠 Iniciando análisis de IA Real...");
        
        try {
            const prompt = prompts.journalInsight.replace('{{text}}', text);
            
            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "Eres un experto en psicología cognitiva y en la obra de Daniel Kahneman." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 500,
            });

            console.log("✅ IA Real respondió con éxito.");
            const aiInsight = response.choices[0].message.content;
            const basic = this.analyzeBasic(text);
            
            return {
                ...basic,
                aiInsight,
                isRealAI: true
            };
        } catch (error) {
            // CAPTURA CUALQUIER ERROR (429, 500, TIMEOUT) Y EVITA QUE EL PROCESO SE PARE
            console.warn("⚠️ IA Real falló (Cuota o Red). Usando modo Resiliencia.");
            console.error("Detalle:", error.message);
            
            const basic = this.analyzeBasic(text);
            return {
                ...basic,
                aiInsight: "(Análisis Resiliente): " + this.generateCorrection(basic),
                isRealAI: false,
                error: error.message
            };
        }
    }

    analyzeBasic(text) {
        const input = text.toLowerCase();
        let detectedBiases = [];
        let systemType = 'Sistema 1 (Intuitivo)';

        for (const [bias, triggers] of Object.entries(this.biasMarkers)) {
            if (triggers.some(trigger => input.includes(trigger))) {
                detectedBiases.push(bias);
            }
        }

        if (input.length > 300 && detectedBiases.length === 0) {
            systemType = 'Sistema 2 (Analítico)';
        }

        return {
            systemType,
            detectedBiases,
            intensity: detectedBiases.length * 0.25,
            aiInsight: "Análisis básico: " + this.generateCorrection({ detectedBiases }),
            isRealAI: false,
            timestamp: new Date()
        };
    }

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
