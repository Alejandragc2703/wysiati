/**
 * Plantillas de Contexto para la IA
 * Enfocado en psicología cognitiva (Daniel Kahneman)
 */

module.exports = {
    journalInsight: `
        Actúa como un psicólogo cognitivo experto en los sistemas de pensamiento de Daniel Kahneman.
        Analiza el siguiente texto de un diario personal: {{text}}
        Identifica posibles sesgos cognitivos (disponibilidad, confirmación, anclaje) 
        y ofrece una reflexión breve y profunda para el Sistema 2 del usuario.
    `,
    dailyFact: `
        Genera un "Fact" diario basado en el libro 'Pensar rápido, pensar despacio'.
        Debe ser corto, impactante y aplicable a la productividad o bienestar emocional.
    `
};
