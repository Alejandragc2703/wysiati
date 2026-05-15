# WYSIATI (What You See Is All There Is) - El Santuario del Bienestar 🌿

Bienvenido a **WYSIATI**, una plataforma integral y "Santuario de Bienestar" diseñada para ayudarte a entender tu mente, monitorear tus emociones y fomentar hábitos positivos a través de la introspección profunda y el apoyo de Inteligencia Artificial.

## 🚀 Arquitectura del Proyecto

El ecosistema está construido como una aplicación **Full-Stack** moderna, dockerizada y dividida en dos componentes principales:

### 🧠 El Cerebro (Backend)
- **Tecnologías:** Node.js, Express, PostgreSQL, Docker.
- **Autenticación:** JWT (JSON Web Tokens) robusto y seguro.
- **Base de Datos:** PostgreSQL para persistencia de Usuarios, Perfiles, Logs de Humor (Mood), Misiones Diarias (Quests), Hábitos (Fortress) y Posts de la Comunidad.
- **Inteligencia Artificial:** Módulo `cognitiveProcessor` integrado para analizar las entradas de diario en tiempo real, extraer cargas emocionales y ofrecer insights psicológicos.
- **Despliegue:** Totalmente containerizado con `docker-compose`.

### 🎨 El Santuario (Frontend)
- **Tecnologías:** React, Tailwind CSS (V4), Framer Motion, Vite.
- **Diseño UI/UX:** Estética "Bento Grid" inmersiva, modo oscuro premium (Glassmorphism, Neon Glows) y animaciones de alta fluidez.
- **Arquitectura de Vistas:**
  - **Dashboard:** Centro de control diario con coherencia cardíaca, rastreador de sobriedad/hábitos, y "Daily Quest".
  - **Diario y Calendario (History):** Visualización tipo "GitHub contribution graph" (`YearlyCalendar`) que mapea el estado emocional (1-5) a lo largo de 365 días con algoritmos precisos de zona horaria y sincronización en tiempo real.
  - **Fortaleza (Hábitos):** Un sistema gamificado para construir y mantener hábitos (Fortress).
  - **Comunidad:** Un muro social para compartir reflexiones y conectar con otros usuarios.
  - **Perfil:** Gestión dinámica de cuenta de usuario con estadísticas.

## ✨ Características Principales Implementadas

1. **Mapa Emocional Anual (Tu Camino):** Un calendario de 53 semanas que lee de la base de datos y colorea cada celda basándose en tu estado de ánimo registrado ese día (Genial, Bien, Meh, Mal, Fatal). Incluye *auto-scroll* inteligente y diseño *scroll-hide* sin barras feas.
2. **Registro de Diario AI:** Al escribir cómo te sientes, la IA analiza el texto y extrae metadatos emocionales y "etiquetas" que se guardan en tu historial de forma automática.
3. **Misiones y Coherencia:** Integración de ejercicios de coherencia cardíaca (burbuja de respiración) y tareas diarias aleatorias para mantener a los usuarios enfocados en metas alcanzables.
4. **Infraestructura Sólida de Base de Datos:** Relaciones complejas en PostgreSQL gestionadas eficientemente (Usuarios -> Logs -> Hábitos -> Comunidad).

---

## 🔮 Futuro y Próximos Pasos (Roadmap)

A medida que **WYSIATI** evoluciona, el objetivo es convertir a la Inteligencia Artificial en un verdadero "Arquitecto de Bienestar" personal. 

Las próximas iteraciones incluirán:
- **Ejercicios de TCC (Terapia Cognitivo-Conductual / CTT):** Módulos interactivos donde la plataforma te guiará para identificar distorsiones cognitivas, reestructurar pensamientos negativos y aplicar técnicas basadas en la evidencia científica.
- **Sesiones de IA Más Completas:** A medida que enseñemos a la IA integrada sobre tus patrones históricos, el motor de "Active Learning" podrá mantener conversaciones terapéuticas de texto, voz (e incluso reconocimiento facial) profundamente contextualizadas, adaptándose dinámicamente a tus crisis o picos de ansiedad.
- **Módulo de Calma Avanzado:** Integración de paisajes sonoros dinámicos, cronómetros Pomodoro/Deep Work y ambientes visuales personalizables.
- **"Fact Diario" Ampliado:** Curación de contenido automático donde la IA no solo te da un dato de psicología/filosofía (ej. Kahneman, Estoicismo), sino que te permite debatir y profundizar en cómo aplicarlo a tu cerebro y vida personal.

---

