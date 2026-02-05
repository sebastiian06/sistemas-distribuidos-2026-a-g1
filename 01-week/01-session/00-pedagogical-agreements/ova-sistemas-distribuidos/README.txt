================================================================================
OBJETO VIRTUAL DE APRENDIZAJE (OVA)
SISTEMAS DISTRIBUIDOS
================================================================================

Asignatura:    Sistemas Distribuidos
Código:        84719
Créditos:      3
Semestre:      VII
Horas totales: 144 (48 acompañamiento + 96 autónomas)
Programa:      Ingeniería de Sistemas
Institución:   CORHUILA
Versión:       2.0

================================================================================
DESCRIPCIÓN
================================================================================

OVA interactivo diseñado para la asignatura Sistemas Distribuidos del VII
semestre del programa de Ingeniería de Sistemas. Ofrece contenido gamificado
con sistema de progreso, badges y actividades prácticas.

================================================================================
RESULTADOS DE APRENDIZAJE (RAA)
================================================================================

Diseña y evalúa soluciones basadas en sistemas distribuidos aplicando principios
de comunicación, sincronización, consistencia y tolerancia a fallos.

================================================================================
OBJETIVOS DE APRENDIZAJE
================================================================================

Objetivo General:
- Comprender los principios fundamentales, arquitecturas y tecnologías de los
  sistemas distribuidos para diseñar e implementar aplicaciones escalables,
  resilientes y de alto rendimiento.

Objetivos Específicos:
1. Implementar y comparar mecanismos de comunicación entre procesos (IPC) y
   técnicas de sincronización en ambientes distribuidos.
2. Analizar modelos de consistencia y estrategias de replicación para garantizar
   la coherencia de datos en sistemas distribuidos.
3. Diseñar esquemas de tolerancia a fallos y recuperación ante desastres en
   arquitecturas distribuidas.

================================================================================
ESTRUCTURA DEL CURSO (16 SEMANAS)
================================================================================

BADGE 1: Arquitecturas Distribuidas (Semanas 1-7)
- Modelos Cliente-Servidor, P2P, Microservicios
- Comunicación IPC, RPC, Mensajería

Semana 1:  FORO     - Introducción a sistemas distribuidos
Semana 2:  TALLER   - Arquitecturas Cliente-Servidor
Semana 3:  TALLER   - P2P y Microservicios
Semana 4:  QUIZ     - Evaluación de comunicación IPC
Semana 5:  PARCIAL  - Primer corte (30% = 5% auto + 5% co + 20% hetero)
Semana 6:  FORO     - Relojes lógicos y sincronización
Semana 7:  TALLER   - Coordinación distribuida

BADGE 2: Comunicación y Sincronización (Semanas 8-13)
- Transacciones distribuidas, consistencia, replicación
- Modelos CAP, algoritmos de consenso

Semana 8:  TALLER   - Transacciones distribuidas
Semana 9:  QUIZ     - Evaluación de consistencia y replicación
Semana 10: PARCIAL  - Segundo corte (30% = 5% auto + 5% co + 20% hetero)
Semana 11: FORO     - Tolerancia a fallos
Semana 12: TALLER   - Algoritmos de consenso (Paxos, Raft)
Semana 13: TALLER   - Sistemas de archivos distribuidos

BADGE 3: Tolerancia a Fallos (Semanas 14-16)
- Replicación, consenso, cloud computing
- Arquitecturas resilientes

Semana 14: QUIZ     - Cloud computing y certificación
Semana 15: PARCIAL + PROYECTO - Tercer corte (40% = 5% auto + 5% co + 30% hetero)
Semana 16: CIERRE   - Retroalimentación y cierre del curso

================================================================================
EVALUACIÓN
================================================================================

Primer Corte (30%):
- Autoevaluación:     5%  - Cuestionario de reflexión sobre arquitecturas
- Coevaluación:       5%  - Evaluación entre pares en diseño de sistemas
- Heteroevaluación:   20% - Parcial teórico-práctico + talleres + participación

Segundo Corte (30%):
- Autoevaluación:     5%  - Cuestionario sobre coordinación distribuida
- Coevaluación:       5%  - Revisión de código entre compañeros
- Heteroevaluación:   20% - Parcial teórico-práctico + implementaciones + quizzes

Tercer Corte (40%):
- Autoevaluación:     5%  - Informe de autoevaluación del proyecto
- Coevaluación:       5%  - Evaluación grupal y distribución de trabajo
- Heteroevaluación:   30% - Proyecto final + documentación + sustentación

================================================================================
QUIZ INTERACTIVO
================================================================================

5 preguntas sobre temas clave:
1. Características fundamentales de sistemas distribuidos
2. Protocolos de comunicación (TCP vs UDP)
3. Teorema CAP
4. Relojes lógicos de Lamport
5. Algoritmo de consenso Raft

================================================================================
BIBLIOGRAFÍA INSTITUCIONAL
================================================================================

1. Tanenbaum, A. S., & Van Steen, M. (2017). Distributed Systems: Principles
   and Paradigms (3rd ed.). Pearson.

2. Coulouris, G., Dollimore, J., Kindberg, T., & Blair, G. (2011). Distributed
   Systems: Concepts and Design (5th ed.). Addison-Wesley.

3. Kleppmann, M. (2017). Designing Data-Intensive Applications. O'Reilly Media.

================================================================================
BIBLIOGRAFÍA COMPLEMENTARIA
================================================================================

1. Burns, B., Beda, J., & Hightower, K. (2019). Kubernetes: Up and Running
   (2nd ed.). O'Reilly Media.

2. Newman, S. (2021). Building Microservices (2nd ed.). O'Reilly Media.

3. Richardson, C. (2018). Microservices Patterns. Manning Publications.

================================================================================
RECURSOS INTERACTIVOS
================================================================================

1. Coursera: Cloud Computing Specialization (University of Illinois)
   https://www.coursera.org/specializations/cloud-computing

2. Martin Kleppmann's Blog: Distributed Systems & Data Engineering
   https://martin.kleppmann.com/

3. Leslie Lamport's Papers: Time, Clocks, and the Ordering of Events
   https://lamport.azurewebsites.net/pubs/pubs.html

================================================================================
CARACTERÍSTICAS TÉCNICAS
================================================================================

- Interfaz gamificada con sistema de progreso
- 3 badges específicos por dominio de competencias
- Sistema de almacenamiento local de progreso (localStorage)
- Quiz interactivo con feedback inmediato
- Diseño responsive (escritorio, tablet, móvil)
- Accesibilidad WCAG 2.1 AA
- Compatible con SCORM 1.2

================================================================================
ARCHIVOS MODIFICADOS
================================================================================

Solo se editaron 3 archivos para personalizar este OVA:

1. index.html
   - Metadatos (título, descripción, Open Graph)
   - Información del curso (código, créditos, horas)
   - Justificación pedagógica
   - RAA y objetivos específicos
   - 3 badges específicos de Sistemas Distribuidos
   - Bibliografía institucional y complementaria
   - Recursos interactivos
   - window.__COURSE_DATA__.meta (información del curso)
   - window.__COURSE_DATA__.sessions (16 semanas de contenido)
   - window.__COURSE_DATA__.evaluation (3 cortes con RAA)
   - window.__COURSE_DATA__.quiz (5 preguntas sobre sistemas distribuidos)

2. src/js/app.js
   - TAB_STORAGE_KEY: "ova_sistemas_distribuidos_tab_v2"
   - STORAGE_KEYS.progress: "ova_sistemas_distribuidos_progress_v2"
   - STORAGE_KEYS.quiz: "ova_sistemas_distribuidos_quiz_v2"

3. imsmanifest.xml
   - <title>OVA · Sistemas Distribuidos · CORHUILA</title>

================================================================================
INSTRUCCIONES DE USO
================================================================================

1. Abrir index.html en un navegador web moderno
2. Navegar por las pestañas:
   - Inicio: Presentación del curso
   - Contenido: 16 semanas organizadas por badges
   - Quiz: Evaluación interactiva de 5 preguntas
   - Evaluación: Criterios y estrategias de evaluación
   - Recursos: Bibliografía y recursos interactivos

3. El progreso se guarda automáticamente en localStorage
4. Compatible con plataformas SCORM 1.2

================================================================================
FECHA DE CREACIÓN
================================================================================

Generado el: 2024
Método: Automatizado siguiendo promt-acuerdos-v3.md

================================================================================
