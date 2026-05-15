const express = require('express');
const router = express.Router();
const authGuard = require('../../middleware/authGuard');
const OpenAI = require('openai');

// Cache en memoria: un fact por día (se resetea cuando el servidor reinicia)
let dailyFactCache = { date: null, fact: null };

const FALLBACK_FACTS = [
  {
    title: "El Sesgo de Disponibilidad",
    text: "Tu cerebro juzga la probabilidad de un evento por la facilidad con que recuerdas ejemplos. Si ves muchos accidentes en noticias, sobreestimas el riesgo de conducir.",
    deep: "Daniel Kahneman llama a esto 'Heurística de Disponibilidad' (Thinking, Fast and Slow, Cap. 12). Tu Sistema 1 confunde 'fácil de recordar' con 'frecuente'. Esto explica por qué los titulares sensacionalistas distorsionan nuestra percepción del mundo real. Práctica: antes de estimar una probabilidad, pregúntate '¿cuántos ejemplos conozco realmente?' vs '¿cuántos existen en el mundo?'",
    source: "Kahneman, D. (2011). Thinking, Fast and Slow. Farrar, Straus and Giroux.",
    author: "Daniel Kahneman",
    category: "Sesgos Cognitivos"
  },
  {
    title: "El Efecto de Anclaje",
    text: "El primer número que escuchas ancla todas tus estimaciones posteriores. En una negociación, quien dice el primer precio gana ventaja psicológica.",
    deep: "Kahneman y Tversky demostraron en 1974 que la gente ajusta desde un 'ancla' inicial pero no suficientemente. Si te pregunto si Gandhi murió antes o después de los 144 años, tu estimación de su edad será más alta que si te pregunto si murió antes o después de los 35. El ancla contamina el pensamiento racional. Estrategia: en decisiones importantes, genera tu propio número ANTES de escuchar el de otros.",
    source: "Tversky, A. & Kahneman, D. (1974). Judgment under Uncertainty: Heuristics and Biases. Science.",
    author: "Kahneman & Tversky",
    category: "Economía del Comportamiento"
  },
  {
    title: "La Paradoja de la Elección",
    text: "Más opciones no generan más felicidad — generan parálisis de decisión y arrepentimiento. El supermercado con 24 tipos de mermelada vende menos que el que tiene 6.",
    deep: "Barry Schwartz documenta en 'The Paradox of Choice' (2004) cómo la abundancia de opciones aumenta la ansiedad, las expectativas y el arrepentimiento post-decisión. El 'coste de oportunidad' mental de cada opción no elegida te pesa aunque hayas elegido bien. Solución: practica el 'satisficing' (elegir suficientemente bueno) en lugar del 'maximizing' (buscar lo perfecto).",
    source: "Schwartz, B. (2004). The Paradox of Choice. Harper Perennial.",
    author: "Barry Schwartz",
    category: "Psicología de la Decisión"
  },
  {
    title: "La Falacia del Costo Hundido",
    text: "Seguimos invirtiendo en algo perdido solo porque ya invertimos antes. Terminas la película aburrida porque pagaste la entrada. Sigues en una mala relación porque 'ya llevas 5 años'.",
    deep: "En economía conductual, un 'sunk cost' (costo hundido) es un gasto ya realizado e irrecuperable. Racionalmente no debería influir en decisiones futuras, pero emocionalmente nos ancla. Ariel Rubinstein y Kahneman muestran que el miedo a 'desperdiciar' lo ya invertido genera peores decisiones. La pregunta correcta es: '¿Si empezara hoy desde cero, elegiría esto?'",
    source: "Thaler, R. (1980). Toward a Positive Theory of Consumer Choice. Journal of Economic Behavior.",
    author: "Richard Thaler",
    category: "Economía Conductual"
  },
  {
    title: "El Yo Recordador vs. el Yo Experimentador",
    text: "Tu memoria no guarda promedios sino picos y finales. Una colonoscopia dolorosa larga pero con final suave se recuerda mejor que una corta pero con final abrupto.",
    deep: "Kahneman distingue dos 'yos': el Yo Experimentador (vive el momento) y el Yo Recordador (construye la historia). La 'Regla del Pico-Final' dice que juzgamos experiencias por su momento más intenso y su final, no por la duración. Esto tiene implicaciones enormes: el bienestar real (experimentado) y el bienestar narrado (recordado) pueden ser opuestos. Diseña tus experiencias pensando en ambos.",
    source: "Kahneman, D. (2011). Thinking, Fast and Slow. Cap. 35: Two Selves.",
    author: "Daniel Kahneman",
    category: "Psicología del Bienestar"
  },
  {
    title: "El Estoicismo y la Dicotomía del Control",
    text: "Epicteto enseñó que solo hay dos tipos de cosas: las que dependen de ti (opiniones, deseos, aversiones) y las que no. La serenidad viene de distinguirlas y enfocarte solo en las primeras.",
    deep: "El Enchiridión de Epicteto comienza: 'De las cosas que existen, unas dependen de nosotros y otras no.' Marcos Aurelio aplicó esto como Emperador: no puedes controlar si llueve, si te insultan, si el mercado cae — pero sí puedes controlar tu juicio sobre esas cosas. La psicología cognitiva moderna (CBT, ACT) descubrió lo mismo: el sufrimiento no viene del evento sino de la interpretación. Práctica diaria: cada mañana, identifica qué en tu lista de tareas está dentro de tu control y qué no.",
    source: "Epictetus. (135 AD). Enchiridion. Marco Aurelio. (170 AD). Meditaciones.",
    author: "Epicteto / Marco Aurelio",
    category: "Filosofía Estoica"
  },
  {
    title: "El Flujo (Flow) de Csikszentmihalyi",
    text: "El estado de máximo rendimiento y felicidad ocurre cuando el nivel de desafío iguala exactamente tus habilidades. Ni demasiado fácil (aburrimiento) ni demasiado difícil (ansiedad).",
    deep: "Mihaly Csikszentmihalyi estudió durante décadas a cirujanos, escaladores, músicos y jugadores de ajedrez buscando qué tenían en común sus mejores momentos. Todos describían el mismo estado: tiempo que desaparece, acción automática, ausencia de ego, claridad total. La clave no es la actividad sino la proporción desafío/habilidad. Para alcanzarlo: trabaja en el límite superior de tu competencia — eso que puedes hacer pero requiere toda tu concentración.",
    source: "Csikszentmihalyi, M. (1990). Flow: The Psychology of Optimal Experience. Harper & Row.",
    author: "Mihaly Csikszentmihalyi",
    category: "Psicología Positiva"
  }
];

const getOpenAI = () => {
  if (process.env.AI_API_KEY && process.env.AI_API_KEY !== 'tu_api_key_aqui') {
    return new OpenAI({ apiKey: process.env.AI_API_KEY });
  }
  return null;
};

const getTodayKey = () => new Date().toISOString().split('T')[0];

// GET /api/fact/daily
router.get('/daily', authGuard, async (req, res) => {
  try {
    const today = getTodayKey();

    // Servir desde cache si es del mismo día
    if (dailyFactCache.date === today && dailyFactCache.fact) {
      return res.json({ ...dailyFactCache.fact, cached: true });
    }

    const openai = getOpenAI();

    if (!openai) {
      // Sin API key → rotar fallbacks por día del año
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
      const fact = FALLBACK_FACTS[dayOfYear % FALLBACK_FACTS.length];
      dailyFactCache = { date: today, fact };
      return res.json({ ...fact, cached: false, aiGenerated: false });
    }

    // Generar con IA
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Eres un experto en psicología cognitiva, neurociencia y filosofía estoica. 
          Tu misión es generar UN hecho educativo diario, breve y profundo, que ayude a las personas a entender mejor cómo funciona su cerebro y sus emociones.
          Debes responder SIEMPRE en formato JSON exacto con estos campos:
          {
            "title": "Nombre del concepto (máx 5 palabras)",
            "text": "Un hecho o insight poderoso en 2-3 frases máximo. Debe impactar y generar curiosidad.",
            "deep": "Explicación profunda de 4-6 frases. Incluye contexto científico, aplicación práctica y cómo usarlo en el día a día.",
            "source": "Referencia bibliográfica real en formato: Apellido, Inicial. (año). Título. Editorial.",
            "author": "Nombre del autor principal",
            "category": "Una categoría de: Sesgos Cognitivos | Psicología del Bienestar | Filosofía Estoica | Neurociencia | Economía Conductual | Psicología Positiva"
          }
          Referencias prioritarias: Kahneman (Thinking Fast and Slow), Tversky, Epicteto, Marco Aurelio, Csikszentmihalyi, Viktor Frankl, Nassim Taleb, Barry Schwartz, Richard Thaler, Carol Dweck, James Clear, Robert Cialdini, Seneca, Nozick.
          El hecho de hoy debe ser DIFERENTE cada día. Hoy es: ${new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}.`
        },
        {
          role: 'user',
          content: 'Genera el hecho educativo del día. Responde SOLO con el JSON, sin texto adicional.'
        }
      ],
      temperature: 0.85,
      max_tokens: 700,
    });

    const rawContent = response.choices[0].message.content;
    const fact = JSON.parse(rawContent);

    dailyFactCache = { date: today, fact };
    res.json({ ...fact, cached: false, aiGenerated: true });

  } catch (error) {
    console.error('Error generando fact diario:', error.message);
    // Fallback si la IA falla
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const fact = FALLBACK_FACTS[dayOfYear % FALLBACK_FACTS.length];
    res.json({ ...fact, cached: false, aiGenerated: false });
  }
});

// POST /api/fact/expand — profundizar sobre un tema con IA
router.post('/expand', authGuard, async (req, res) => {
  try {
    const { title, text, author } = req.body;
    if (!title) return res.status(400).json({ error: 'Se requiere título del fact' });

    const openai = getOpenAI();
    if (!openai) {
      return res.json({
        expansion: `${title} es uno de los conceptos más importantes de la psicología moderna. ${text} Para profundizar, te recomendamos leer directamente la obra de ${author}, donde encontrarás experimentos, casos reales y ejercicios prácticos para aplicar este conocimiento en tu vida cotidiana.`,
        aiGenerated: false
      });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Eres un divulgador experto en psicología cognitiva y filosofía. Cuando el usuario pide profundizar sobre un concepto, debes explicarlo de forma clara, rica en ejemplos reales y aplicaciones prácticas. Escribe en español, con un tono cercano pero intelectualmente sólido. Máximo 5 párrafos bien estructurados.`
        },
        {
          role: 'user',
          content: `Quiero profundizar sobre "${title}". El concepto base es: "${text}". Este concepto viene de ${author}. Explícame más en profundidad: el origen, los experimentos clave, cómo afecta mi vida real hoy, y qué puedo hacer para usar este conocimiento a mi favor.`
        }
      ],
      temperature: 0.7,
      max_tokens: 900,
    });

    res.json({
      expansion: response.choices[0].message.content,
      aiGenerated: true
    });

  } catch (error) {
    console.error('Error expandiendo fact:', error.message);
    res.status(500).json({ error: 'No se pudo generar la expansión' });
  }
});

module.exports = router;
