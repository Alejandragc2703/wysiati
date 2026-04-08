# WYSIATI - Terapia Multimodal con IA

## 1. Resumen Ejecutivo
Este proyecto se desarrolla como parte del módulo de Proyecto Integrado para el Ciclo Superior en Desarrollo de Aplicaciones.

### a) Nombre del producto
**WYSIATI (What You See Is All There Is) - Terapia Integrada**.

### b) Descripción general
WYSIATI es una plataforma de salud mental avanzada que rompe las limitaciones de los chatbots tradicionales basados exclusivamente en texto. El sistema utiliza un **avatar fotorrealista** y un motor de **análisis multimodal** para procesar no solo lo que el usuario verbaliza, sino también sus gestos, microexpresiones y biomarcadores vocales, ofreciendo una visión completa del estado emocional del paciente.

### c) Objetivos del sistema
* **Superar sesgos cognitivos:** Evitar interpretaciones erróneas basadas en información incompleta (el efecto "Sistema 1" de Kahneman).
* **Intervención Dinámica:** Proporcionar herramientas terapéuticas en tiempo real (como guías de respiración visuales) al detectar crisis de ansiedad o pánico.
* **Gestión de Protocolos Clínicos:** Adaptar la respuesta del sistema según el diagnóstico del usuario (Bipolaridad, TOC, Depresión o TEPT).

### d) Funcionalidades principales (Alto nivel)
* **Videollamada Interactiva:** Interacción fluida con un avatar que mantiene contacto visual y reacciona emocionalmente.
* **Análisis de Biomarcadores en Tiempo Real:** Detección de fatiga vocal, cambios de tempo en el habla y microexpresiones faciales.
* **Integración de Terapia Cognitivo-Conductual (TCC):** Ejercicios guiados para reencuadrar pensamientos negativos mediante la voz.
* **Módulo de Prevención de Recaídas:** Monitoreo de patrones de sueño y energía para predecir episodios maníacos o depresivos.

### e) Arquitectura propuesta
Para garantizar la escalabilidad y el procesamiento de IA, se propone la siguiente estructura:
* **Cliente (Frontend):** Aplicación Web desarrollada en **React.js** para la gestión de flujos de video y componentes reactivos.
* **Servidor (Backend):** API robusta en **Python (FastAPI)**, ideal para la integración de modelos de Machine Learning y visión por computador.
* **Base de datos:** **PostgreSQL**, gestionada a través de **pgAdmin 4**. Se ha elegido por su robustez en el manejo de datos relacionales complejos y su eficiencia en entornos de producción.

### f) Justificación del proyecto
La propuesta busca humanizar la IA en el ámbito de la salud mental. Al integrar el análisis de rostro y voz, el software ofrece una precisión diagnóstica y un apoyo emocional muy superior al de las aplicaciones actuales, cubriendo la necesidad de herramientas tecnológicas que comprendan el contexto real del ser humano.

---
PD. Dejo un enlace por aquí de una presentacion que hice para que se entienda un poquito más y de forma más clara y concisa por si le quieren echar un vistazo--> https://docs.google.com/presentation/d/1-VZ65k6aEkxjHMTHaTFCeXID6P5wM4bsPrcvCNOSbBY/edit?usp=sharing
