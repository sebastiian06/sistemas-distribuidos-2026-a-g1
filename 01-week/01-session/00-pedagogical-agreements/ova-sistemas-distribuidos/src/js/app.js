/* =========================================================
   OVA App · Estructura de Datos · CORHUILA
   =========================================================
   Main application logic (offline, no external dependencies)
   - Accordion rendering & interaction
   - Activity filters
   - Progress tracking with localStorage
   - Badge gamification system
   - Interactive quiz with feedback
   - Evaluation tabs
   ========================================================= */


(function () {
  "use strict";

  // Import helpers from tiny.js
  const { qs, qsa, on, clamp, escapeHtml, storage, debounce, announce } = window.tiny;
  // Tabs principales config
  const MAIN_TABS = [
    { id: "ini", label: "Inicio" },
    { id: "just", label: "Justificación" },
    { id: "obj", label: "Objetivos" },
    { id: "ruta", label: "Ruta" },
    { id: "quiz", label: "Quiz" },
    { id: "eval", label: "Evaluación" },
    { id: "rec", label: "Recursos" }
  ];
  const TAB_STORAGE_KEY = "ova_sistemas_distribuidos_tab_v2";
  /* ---------------------------------------------------------
     TABS PRINCIPALES: NAVEGACIÓN Y GAMIFICACIÓN
     --------------------------------------------------------- */

  function showTab(tabId, focusTab = false) {
    // Oculta todos los paneles y desactiva tabs
    MAIN_TABS.forEach(({ id }) => {
      const tabBtn = qs(`#tab-${id}`);
      const panel = qs(`#panel-${id}`);
      if (tabBtn) {
        tabBtn.classList.toggle("is-active", id === tabId);
        tabBtn.setAttribute("aria-selected", id === tabId ? "true" : "false");
        tabBtn.tabIndex = id === tabId ? 0 : -1;
      }
      if (panel) {
        panel.hidden = id !== tabId;
        panel.setAttribute("aria-hidden", id !== tabId ? "true" : "false");
        if (id === tabId && focusTab) tabBtn.focus();
      }
    });
    // Persistencia
    storage.set(TAB_STORAGE_KEY, tabId);
    announce(`Sección ${getTabLabel(tabId)} mostrada`);
  }

  function getTabLabel(tabId) {
    const found = MAIN_TABS.find(t => t.id === tabId);
    return found ? found.label : tabId;
  }

  function initMainTabs() {
    const tabBtns = MAIN_TABS.map(({ id }) => qs(`#tab-${id}`)).filter(Boolean);
    if (!tabBtns.length) return;

    // Click
    tabBtns.forEach((btn) => {
      on(btn, "click", () => showTab(btn.dataset.tab, false));
    });

    // Teclado (izq/der/home/end)
    tabBtns.forEach((btn, idx) => {
      on(btn, "keydown", (e) => {
        let newIdx = idx;
        if (e.key === "ArrowRight") newIdx = (idx + 1) % tabBtns.length;
        else if (e.key === "ArrowLeft") newIdx = (idx - 1 + tabBtns.length) % tabBtns.length;
        else if (e.key === "Home") newIdx = 0;
        else if (e.key === "End") newIdx = tabBtns.length - 1;
        else return;
        e.preventDefault();
        tabBtns[newIdx].focus();
        showTab(tabBtns[newIdx].dataset.tab, true);
      });
    });

    // Restaurar tab activa
    const lastTab = storage.get(TAB_STORAGE_KEY, "ini");
    showTab(lastTab);
  }

  // Course data from embedded script
  const DATA = window.__COURSE_DATA__ || {};
  const sessions = DATA.sessions || [];
  const evaluation = DATA.evaluation || {};
  const quizData = DATA.quiz || [];

  // Storage keys
  const STORAGE_KEYS = {
    progress: "ova_sistemas_distribuidos_progress_v2",
    quiz: "ova_sistemas_distribuidos_quiz_v2"
  };

  /* ---------------------------------------------------------
     STATE MANAGEMENT
     --------------------------------------------------------- */
  
  // Load progress state from localStorage
  const progressState = storage.get(STORAGE_KEYS.progress, { completed: {} });
  if (!progressState.completed) progressState.completed = {};

  // Load quiz state from localStorage
  const quizState = storage.get(STORAGE_KEYS.quiz, { answers: {}, graded: false });
  if (!quizState.answers) quizState.answers = {};

  /* ---------------------------------------------------------
     UTILITY FUNCTIONS
     --------------------------------------------------------- */

  /**
   * Infer activity tag from text content
   * @param {string} text - Activity description
   * @returns {string} - Tag identifier
   */
  function inferActivityTag(text) {
    const lowered = (text || "").toLowerCase();
    if (lowered.includes("foro")) return "foro";
    if (lowered.includes("quiz")) return "quiz";
    if (lowered.includes("taller")) return "taller";
    if (lowered.includes("parcial")) return "parcial";
    if (lowered.includes("proyecto")) return "proyecto";
    return "otro";
  }

  /**
   * Get display label for activity tag
   * @param {string} tag - Tag identifier
   * @returns {string} - Display label
   */
  function getTagLabel(tag) {
    const labels = {
      foro: "Foro",
      quiz: "Quiz",
      taller: "Taller",
      parcial: "Parcial",
      proyecto: "Proyecto",
      otro: "Actividad"
    };
    return labels[tag] || "Actividad";
  }

  /**
   * Calculate overall progress
   * @returns {Object} - Progress statistics
   */
  function calculateProgress() {
    const total = sessions.length || 1;
    const completed = sessions.reduce((count, session) => {
      return count + (progressState.completed[String(session.semana)] ? 1 : 0);
    }, 0);
    const percentage = Math.round((completed / total) * 100);
    
    return { completed, total, percentage };
  }

  /* ---------------------------------------------------------
     PROGRESS MANAGEMENT
     --------------------------------------------------------- */

  /**
   * Mark a week as completed or incomplete
   * @param {number} week - Week number
   * @param {boolean} isCompleted - Completion status
   */
  function setWeekCompleted(week, isCompleted) {
    progressState.completed[String(week)] = !!isCompleted;
    storage.set(STORAGE_KEYS.progress, progressState);
    
    updateProgressUI();
    updateBadges();
    
    // Announce to screen readers
    const status = isCompleted ? "completada" : "marcada como pendiente";
    announce(`Semana ${week} ${status}`);
  }

  /**
   * Reset all progress
   */
  function resetAllProgress() {
    if (!confirm("¿Estás seguro de que deseas reiniciar todo tu progreso? Esta acción no se puede deshacer.")) {
      return;
    }

    progressState.completed = {};
    storage.set(STORAGE_KEYS.progress, progressState);
    
    // Reset all checkboxes
    qsa(".js-week-checkbox").forEach((checkbox) => {
      checkbox.checked = false;
    });
    
    updateProgressUI();
    updateBadges();
    announce("Progreso reiniciado");
  }

  /**
   * Update progress UI elements
   */
  function updateProgressUI() {
    const { completed, total, percentage } = calculateProgress();
    
    // Update progress bar
    const progressFill = qs("#progressFill");
    const progressText = qs("#progressTxt");
    const progressStats = qs("#progressStats");
    const progressBar = qs(".progress__bar");
    
    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }
    
    if (progressText) {
      progressText.textContent = `${percentage}%`;
    }
    
    if (progressStats) {
      progressStats.textContent = `${completed} de ${total} semanas completadas`;
    }
    
    if (progressBar) {
      progressBar.setAttribute("aria-valuenow", String(percentage));
    }
  }

  /* ---------------------------------------------------------
     BADGES / GAMIFICATION
     --------------------------------------------------------- */

  /**
   * Check if a badge is unlocked
   * @param {number} startWeek - First week of range
   * @param {number} endWeek - Last week of range
   * @returns {boolean}
   */
  function isBadgeUnlocked(startWeek, endWeek) {
    for (let week = startWeek; week <= endWeek; week++) {
      if (!progressState.completed[String(week)]) {
        return false;
      }
    }
    return true;
  }

  /**
   * Update all badge states
   */
  function updateBadges() {
    const badges = [
      { id: "#badgeLineales", start: 1, end: 7, name: "Estructuras Lineales" },
      { id: "#badgeNoLineales", start: 8, end: 13, name: "Estructuras No Lineales" },
      { id: "#badgeFinal", start: 14, end: 16, name: "Curso Completado" }
    ];

    badges.forEach((badge) => {
      const element = qs(badge.id);
      if (!element) return;

      const isUnlocked = isBadgeUnlocked(badge.start, badge.end);
      element.classList.toggle("is-on", isUnlocked);
      element.setAttribute(
        "aria-label",
        isUnlocked ? `Insignia ${badge.name} desbloqueada` : `Insignia ${badge.name} bloqueada`
      );
    });
  }

  /* ---------------------------------------------------------
     ACCORDION / SESSIONS RENDERING
     --------------------------------------------------------- */

  /**
   * Render all session items
   */
  function renderSessions() {
    const container = qs("#sessions");
    if (!container) return;

    const html = sessions.map((session) => {
      const tag = inferActivityTag(session.autonoma);
      const tagClass = `tag tag--${tag}`;
      const itemId = `week_${session.semana}`;
      const panelId = `${itemId}_panel`;
      const isCompleted = !!progressState.completed[String(session.semana)];

      return `
        <article class="item" data-tag="${tag}" data-week="${session.semana}" id="${itemId}">
          <button 
            class="item__btn" 
            type="button" 
            aria-expanded="false" 
            aria-controls="${panelId}"
          >
            <span class="item__num">${session.semana}</span>
            <span class="item__title">
              <span>${escapeHtml(session.tema)}</span>
              <small>${escapeHtml(session.acompanamiento)}</small>
            </span>
            <span class="item__right">
              <span class="${tagClass}">${getTagLabel(tag)}</span>
              <label class="check" onclick="event.stopPropagation()">
                <input 
                  class="js-week-checkbox" 
                  type="checkbox" 
                  data-week="${session.semana}"
                  aria-label="Marcar semana ${session.semana} como completada" 
                  ${isCompleted ? "checked" : ""}
                />
                Hecha
              </label>
            </span>
          </button>

          <div class="item__panel" id="${panelId}" hidden>
            <div class="item__grid">
              <div class="kv">
                <div class="kv__k">Actividad de acompañamiento (${session.h_acomp || 2}h)</div>
                <div class="kv__v">${escapeHtml(session.acompanamiento)}</div>
              </div>
              <div class="kv">
                <div class="kv__k">Trabajo autónomo (${session.h_auto || 4}h)</div>
                <div class="kv__v">
                  <em>${getTagLabel(tag)}:</em> ${escapeHtml(session.autonoma)}
                </div>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join("");

    container.innerHTML = html;

    // Bind accordion and checkbox events
    qsa(".item", container).forEach((item) => {
      const btn = qs(".item__btn", item);
      const panel = qs(".item__panel", item);
      const checkbox = qs(".js-week-checkbox", item);
      const week = parseInt(item.dataset.week, 10);

      // Accordion toggle
      on(btn, "click", () => {
        const isExpanded = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", isExpanded ? "false" : "true");
        panel.hidden = isExpanded;
      });

      // Keyboard accessibility for accordion
      on(btn, "keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          btn.click();
        }
      });

      // Checkbox change
      if (checkbox) {
        on(checkbox, "change", (e) => {
          setWeekCompleted(week, e.target.checked);
        });
      }
    });
  }

  /* ---------------------------------------------------------
     ACTIVITY FILTERS
     --------------------------------------------------------- */

  /**
   * Initialize activity filters
   */
  function initFilters() {
    const filterButtons = qsa("[data-filter]");
    if (!filterButtons.length) return;

    filterButtons.forEach((button) => {
      on(button, "click", () => {
        const filter = button.dataset.filter;

        // Update button states
        filterButtons.forEach((btn) => {
          const isActive = btn === button;
          btn.classList.toggle("is-active", isActive);
          btn.setAttribute("aria-pressed", isActive ? "true" : "false");
        });

        // Filter items
        qsa(".item").forEach((item) => {
          const itemTag = item.dataset.tag;
          const shouldShow = filter === "all" || itemTag === filter;
          item.style.display = shouldShow ? "" : "none";
        });

        // Announce filter change
        const filterLabel = filter === "all" ? "todas las actividades" : `actividades de tipo ${getTagLabel(filter)}`;
        announce(`Mostrando ${filterLabel}`);
      });
    });
  }

  /* ---------------------------------------------------------
     EVALUATION TABS
     --------------------------------------------------------- */

  /**
   * Render evaluation content for all cortes
   */
  function renderEvaluation() {
    const panels = {
      "Primer corte": "#evalPrimer",
      "Segundo corte": "#evalSegundo",
      "Tercer corte": "#evalTercer"
    };

    Object.entries(panels).forEach(([corteName, selector]) => {
      const container = qs(selector);
      if (!container) return;

      const corteData = evaluation[corteName] || [];
      
      const html = corteData.map((item) => `
        <article class="eval-card">
          <div class="eval-card__top">
            <div class="eval-card__title">${escapeHtml(item.estrategia)}</div>
            <span class="eval-card__pill">${escapeHtml(item.porcentaje || item.momento)}</span>
          </div>
          <div class="eval-card__body">
            <div><strong>RAA:</strong> ${escapeHtml(item.raa)}</div>
            <div><strong>Evidencias:</strong> ${escapeHtml(item.evidencias)}</div>
            <div><strong>Técnicas:</strong> ${escapeHtml(item.tecnicas)}</div>
          </div>
        </article>
      `).join("");

      container.innerHTML = html;
    });
  }

  /**
   * Initialize evaluation tabs
   */
  function initTabs() {
    const tabs = qsa(".tab");
    if (!tabs.length) return;

    const panels = {
      "Primer corte": qs("#panel1"),
      "Segundo corte": qs("#panel2"),
      "Tercer corte": qs("#panel3")
    };

    tabs.forEach((tab) => {
      on(tab, "click", () => {
        const targetCorte = tab.dataset.tab;

        // Update tab states
        tabs.forEach((t) => {
          const isActive = t === tab;
          t.classList.toggle("is-active", isActive);
          t.setAttribute("aria-selected", isActive ? "true" : "false");
        });

        // Show/hide panels
        Object.entries(panels).forEach(([corteName, panel]) => {
          if (panel) {
            panel.hidden = corteName !== targetCorte;
          }
        });
      });

      // Keyboard navigation
      on(tab, "keydown", (e) => {
        const currentIndex = tabs.indexOf(tab);
        let newIndex = currentIndex;

        if (e.key === "ArrowRight") {
          newIndex = (currentIndex + 1) % tabs.length;
        } else if (e.key === "ArrowLeft") {
          newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        }

        if (newIndex !== currentIndex) {
          e.preventDefault();
          tabs[newIndex].focus();
          tabs[newIndex].click();
        }
      });
    });
  }

  /* ---------------------------------------------------------
     QUIZ
     --------------------------------------------------------- */

  /**
   * Render quiz questions
   */
  function renderQuiz() {
    const container = qs("#quizBody");
    if (!container || !quizData.length) return;

    const html = quizData.map((question, index) => {
      const savedAnswer = quizState.answers[question.id];

      return `
        <div class="q" data-question-id="${question.id}">
          <div class="q__t">${index + 1}. ${escapeHtml(question.t)}</div>
          <div class="opt" role="radiogroup" aria-label="${escapeHtml(question.t)}">
            ${question.opts.map((option, optIndex) => `
              <label>
                <input 
                  type="radio" 
                  name="${question.id}" 
                  value="${optIndex}" 
                  ${String(savedAnswer) === String(optIndex) ? "checked" : ""}
                />
                <span>${escapeHtml(option)}</span>
              </label>
            `).join("")}
          </div>
        </div>
      `;
    }).join("");

    container.innerHTML = html;

    // Bind answer changes
    qsa(".q", container).forEach((questionEl) => {
      const questionId = questionEl.dataset.questionId;
      
      qsa('input[type="radio"]', questionEl).forEach((radio) => {
        on(radio, "change", (e) => {
          quizState.answers[questionId] = parseInt(e.target.value, 10);
          quizState.graded = false;
          storage.set(STORAGE_KEYS.quiz, quizState);
          
          // Remove grading styles when answer changes
          questionEl.classList.remove("is-correct", "is-incorrect");
        });
      });
    });

    updateQuizScore(0, quizData.length);
  }

  /**
   * Grade the quiz
   */
  function gradeQuiz() {
    let score = 0;
    const feedback = [];

    quizData.forEach((question) => {
      const userAnswer = quizState.answers[question.id];
      const questionEl = qs(`[data-question-id="${question.id}"]`);
      
      if (questionEl) {
        const isCorrect = userAnswer === question.ok;
        
        questionEl.classList.remove("is-correct", "is-incorrect");
        questionEl.classList.add(isCorrect ? "is-correct" : "is-incorrect");
        
        if (isCorrect) {
          score++;
        } else {
          feedback.push(question.tip);
        }
      }
    });

    quizState.graded = true;
    storage.set(STORAGE_KEYS.quiz, quizState);

    updateQuizScore(score, quizData.length);

    // Update hint with feedback
    const hint = qs("#quizHint");
    if (hint) {
      if (feedback.length === 0) {
        hint.textContent = "¡Excelente! Has respondido correctamente todas las preguntas. Dominas los conceptos fundamentales de estructuras de datos.";
        hint.style.background = "rgba(0, 160, 80, 0.1)";
      } else {
        hint.innerHTML = `<strong>Sugerencias de repaso:</strong><br/>• ${feedback.slice(0, 3).join("<br/>• ")}`;
        hint.style.background = "rgba(239, 68, 68, 0.08)";
      }
    }

    announce(`Resultado del quiz: ${score} de ${quizData.length} respuestas correctas`);
  }

  /**
   * Reset the quiz
   */
  function resetQuiz() {
    quizState.answers = {};
    quizState.graded = false;
    storage.set(STORAGE_KEYS.quiz, quizState);

    // Clear radio selections and styles
    qsa(".q").forEach((questionEl) => {
      questionEl.classList.remove("is-correct", "is-incorrect");
      qsa('input[type="radio"]', questionEl).forEach((radio) => {
        radio.checked = false;
      });
    });

    // Reset hint
    const hint = qs("#quizHint");
    if (hint) {
      hint.textContent = 'Responde todas las preguntas y presiona "Calificar" para ver tu resultado.';
      hint.style.background = "";
    }

    updateQuizScore(0, quizData.length);
    announce("Quiz reiniciado");
  }

  /**
   * Update quiz score display
   * @param {number} score - Current score
   * @param {number} total - Total questions
   */
  function updateQuizScore(score, total) {
    const scoreEl = qs("#quizScore");
    if (scoreEl) {
      scoreEl.textContent = `${score}/${total}`;
    }
  }

  /* ---------------------------------------------------------
     MOBILE MENU
     --------------------------------------------------------- */

  /**
   * Initialize mobile menu
   */
  function initMobileMenu() {
    const menuButton = qs("#btnMenu");
    const mobileMenu = qs("#menuMobile");
    
    if (!menuButton || !mobileMenu) return;

    on(menuButton, "click", () => {
      const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", isExpanded ? "false" : "true");
      mobileMenu.hidden = isExpanded;
    });

    // Close menu when clicking a link
    qsa("a", mobileMenu).forEach((link) => {
      on(link, "click", () => {
        menuButton.setAttribute("aria-expanded", "false");
        mobileMenu.hidden = true;
      });
    });

    // Close menu on escape
    on(document, "keydown", (e) => {
      if (e.key === "Escape" && !mobileMenu.hidden) {
        menuButton.setAttribute("aria-expanded", "false");
        mobileMenu.hidden = true;
        menuButton.focus();
      }
    });
  }

  /* ---------------------------------------------------------
     SCROLL PROGRESS BAR
     --------------------------------------------------------- */

  /**
   * Initialize scroll progress bar
   */
  function initScrollProgress() {
    const scrollFill = qs("#scrollFill");
    if (!scrollFill) return;

    const updateScrollProgress = () => {
      const docElement = document.documentElement;
      const scrollTop = docElement.scrollTop || document.body.scrollTop;
      const scrollHeight = docElement.scrollHeight - docElement.clientHeight;
      const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      
      scrollFill.style.width = `${clamp(scrollPercent, 0, 100)}%`;
    };

    // Throttled scroll handler
    const throttledUpdate = debounce(updateScrollProgress, 10);
    
    on(window, "scroll", throttledUpdate, { passive: true });
    updateScrollProgress();
  }

  /* ---------------------------------------------------------
     INITIALIZATION
     --------------------------------------------------------- */


  /**
   * Initialize all components
   */
  function init() {
    // Render dynamic content
    renderSessions();
    renderEvaluation();
    renderQuiz();

    // Initialize interactions
    initMainTabs();
    initFilters();
    initTabs();
    initMobileMenu();
    initScrollProgress();

    // Update UI state
    updateProgressUI();
    updateBadges();

    // Bind global buttons
    const resetProgressBtn = qs("#btnReset");
    if (resetProgressBtn) {
      on(resetProgressBtn, "click", resetAllProgress);
    }

    const submitQuizBtn = qs("#btnSubmitQuiz");
    if (submitQuizBtn) {
      on(submitQuizBtn, "click", gradeQuiz);
    }

    const resetQuizBtn = qs("#btnResetQuiz");
    if (resetQuizBtn) {
      on(resetQuizBtn, "click", resetQuiz);
    }

    console.log("OVA · Estructura de Datos · CORHUILA - Initialized");
  }

  // Wait for DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
