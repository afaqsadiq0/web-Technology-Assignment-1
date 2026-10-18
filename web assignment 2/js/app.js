/**
 * QuizMaster Pro - Core Application Logic & State Engine
 * Robust single-page architecture with state transitions,
 * Fisher-Yates randomization, resilient timestamp-based timer,
 * dynamic segmented progress tracking, and accessible event handling.
 */

(function () {
  'use strict';

  // --- APPLICATION STATE ---
  const state = {
    // Configuration
    questionCount: 10,
    timeLimitSeconds: 300, // 5 minutes default
    studentName: "",
    studentRegNo: "",
    soundEnabled: false,
    theme: "light",

    // Quiz Session
    allQuestions: [],
    activeQuestions: [],
    currentIndex: 0,
    userAnswers: {}, // map: questionId -> { selectedOptionId, isCorrect }
    
    // Timer
    timerInterval: null,
    startTime: null,
    deadlineTime: null,
    timeTakenSeconds: 0,

    // Status
    isQuizActive: false,
    isSubmitted: false,
    currentReviewFilter: "all",
    finalResults: null
  };

  // --- DOM SELECTORS ---
  const DOM = {
    // Views
    viewWelcome: document.getElementById("view-welcome"),
    viewQuiz: document.getElementById("view-quiz"),
    viewResults: document.getElementById("view-results"),
    viewReview: document.getElementById("view-review"),

    // Header Controls
    themeToggleBtn: document.getElementById("theme-toggle-btn"),
    themeIcon: document.getElementById("theme-icon"),
    soundToggleBtn: document.getElementById("sound-toggle-btn"),
    soundIcon: document.getElementById("sound-icon"),
    helpBtn: document.getElementById("help-btn"),

    // Welcome Screen Actions
    btnStartChallenge: document.getElementById("btn-start-challenge"),
    btnHowItWorks: document.getElementById("btn-how-it-works"),
    btnHeroStartModal: document.getElementById("btn-hero-start-modal"),

    // Config Modal Controls
    configModalEl: document.getElementById("configModal"),
    configForm: document.getElementById("config-form"),
    selectQuestionCount: document.getElementById("config-question-count"),
    selectTimeLimit: document.getElementById("config-time-limit"),
    inputCandidateName: document.getElementById("config-candidate-name"),
    inputCandidateReg: document.getElementById("config-candidate-reg"),
    checkSoundEffect: document.getElementById("config-sound-toggle"),
    btnConfirmStartQuiz: document.getElementById("btn-confirm-start-quiz"),

    // Active Quiz Elements
    quizCategoryPill: document.getElementById("quiz-category-pill"),
    quizQuestionCounter: document.getElementById("quiz-question-counter"),
    timerDisplay: document.getElementById("timer-display"),
    timerWrapper: document.getElementById("timer-wrapper"),
    
    // Progress Segments
    segmentsTrack: document.getElementById("segments-track"),
    progressAnsweredLabel: document.getElementById("progress-answered-label"),

    // Question Panel
    questionNumTag: document.getElementById("question-num-tag"),
    questionDiffTag: document.getElementById("question-diff-tag"),
    questionTitleText: document.getElementById("question-title-text"),
    optionsContainer: document.getElementById("options-container"),
    feedbackBox: document.getElementById("feedback-box"),
    feedbackTitle: document.getElementById("feedback-title"),
    feedbackIcon: document.getElementById("feedback-icon"),
    feedbackExplanation: document.getElementById("feedback-explanation"),

    // Quiz Footer Controls
    btnPrevQuestion: document.getElementById("btn-prev-question"),
    btnNextQuestion: document.getElementById("btn-next-question"),
    btnSubmitQuiz: document.getElementById("btn-submit-quiz"),
    answeredSummaryText: document.getElementById("answered-summary-text"),

    // Submission Confirmation Modal
    confirmSubmitModalEl: document.getElementById("confirmSubmitModal"),
    unansweredWarningText: document.getElementById("unanswered-warning-text"),
    btnReviewUnanswered: document.getElementById("btn-review-unanswered"),
    btnConfirmSubmitFinal: document.getElementById("btn-confirm-submit-final"),

    // Results Dashboard Elements
    resultDonutFill: document.getElementById("result-donut-fill"),
    resultAccuracyPct: document.getElementById("result-accuracy-pct"),
    resultFractionScore: document.getElementById("result-fraction-score"),
    resultPerformanceMsg: document.getElementById("result-performance-msg"),
    metricCorrect: document.getElementById("metric-correct"),
    metricIncorrect: document.getElementById("metric-incorrect"),
    metricUnanswered: document.getElementById("metric-unanswered"),
    metricTimeTaken: document.getElementById("metric-time-taken"),
    categoryBarsContainer: document.getElementById("category-bars-container"),
    btnDownloadPdf: document.getElementById("btn-download-pdf"),
    btnReviewAnswers: document.getElementById("btn-review-answers"),
    btnRetakeQuiz: document.getElementById("btn-retake-quiz"),

    // Review Screen
    reviewCardsContainer: document.getElementById("review-cards-container"),
    reviewFilterBtns: document.querySelectorAll(".filter-pill-btn"),
    btnBackToResults: document.getElementById("btn-back-to-results"),

    // Toast
    toastEl: document.getElementById("qm-toast"),
    toastMessage: document.getElementById("toast-message")
  };

  // Bootstrap Modals instances
  let bootstrapModals = {};

  // ==========================================================================
  // 1. INITIALIZATION & SETUP
  // ==========================================================================
  function initializeApp() {
    // Validate question bank availability
    if (typeof QUESTION_BANK === "undefined" || !Array.isArray(QUESTION_BANK) || QUESTION_BANK.length === 0) {
      console.error("QuizMaster Error: QUESTION_BANK is not defined or empty.");
      showToast("Error: Question bank failed to load.", "danger");
      return;
    }
    state.allQuestions = QUESTION_BANK;

    // Initialize Bootstrap Modals
    if (typeof bootstrap !== "undefined" && bootstrap.Modal) {
      if (DOM.configModalEl) bootstrapModals.config = new bootstrap.Modal(DOM.configModalEl);
      if (DOM.confirmSubmitModalEl) bootstrapModals.confirm = new bootstrap.Modal(DOM.confirmSubmitModalEl);
      const helpModalEl = document.getElementById("helpModal");
      if (helpModalEl) bootstrapModals.help = new bootstrap.Modal(helpModalEl);
    }

    // Initialize Theme & Sound
    initTheme();
    initSound();

    // Attach Event Handlers
    bindEventListeners();

    // Start Hero Typewriter Animation
    initTypewriter();

    // Show initial welcome screen
    switchView("welcome");
  }

  // ==========================================================================
  // 1b. HERO TYPEWRITER ANIMATION ENGINE
  // ==========================================================================
  function initTypewriter() {
    const textEl = document.getElementById("typewriter-text");
    if (!textEl) return;

    const phrases = [
      "Web Technologies.",
      "HTML5 Semantics.",
      "CSS3 Flex & Grid.",
      "JavaScript ES6+.",
      "Bootstrap 5.",
      "Modern Front-End."
    ];

    let phraseIndex = 0;
    let charIndex = phrases[0].length;
    let isDeleting = true;

    function tick() {
      // If user navigated away from welcome screen, pause typing
      if (DOM.viewWelcome && !DOM.viewWelcome.classList.contains("active")) {
        setTimeout(tick, 600);
        return;
      }

      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        charIndex--;
        textEl.textContent = currentPhrase.substring(0, charIndex);
      } else {
        charIndex++;
        textEl.textContent = currentPhrase.substring(0, charIndex);
      }

      let speed = isDeleting ? 45 : 85;

      if (!isDeleting && charIndex === currentPhrase.length) {
        // Finished typing word, pause before deleting
        isDeleting = true;
        speed = 2200;
      } else if (isDeleting && charIndex === 0) {
        // Finished deleting, switch to next phrase
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        speed = 400;
      }

      setTimeout(tick, speed);
    }

    // Begin cycling after initial pause
    setTimeout(tick, 2000);
  }

  // ==========================================================================
  // 2. THEME & AUDIO MANAGEMENT
  // ==========================================================================
  function initTheme() {
    const savedTheme = localStorage.getItem("qm_theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      state.theme = savedTheme;
    } else {
      // Respect system color scheme preference
      state.theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    applyTheme(state.theme);
  }

  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("qm_theme", theme);

    if (DOM.themeIcon) {
      if (theme === "dark") {
        DOM.themeIcon.className = "bi bi-sun-fill";
        DOM.themeToggleBtn.setAttribute("aria-label", "Switch to light theme");
        DOM.themeToggleBtn.title = "Switch to light theme";
      } else {
        DOM.themeIcon.className = "bi bi-moon-stars-fill";
        DOM.themeToggleBtn.setAttribute("aria-label", "Switch to dark theme");
        DOM.themeToggleBtn.title = "Switch to dark theme";
      }
    }
  }

  function toggleTheme() {
    const nextTheme = state.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    if (typeof soundManager !== "undefined") soundManager.playClick();
  }

  function initSound() {
    const savedSound = localStorage.getItem("qm_sound");
    state.soundEnabled = savedSound === "true"; // default false per spec
    if (DOM.checkSoundEffect) DOM.checkSoundEffect.checked = state.soundEnabled;
    updateSoundUI();
  }

  function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    localStorage.setItem("qm_sound", state.soundEnabled ? "true" : "false");
    if (typeof soundManager !== "undefined") {
      soundManager.setEnabled(state.soundEnabled);
      if (state.soundEnabled) soundManager.playClick();
    }
    updateSoundUI();
    showToast(state.soundEnabled ? "Sound effects enabled" : "Sound effects muted", "info");
  }

  function updateSoundUI() {
    if (typeof soundManager !== "undefined") {
      soundManager.setEnabled(state.soundEnabled);
    }
    if (DOM.soundIcon) {
      if (state.soundEnabled) {
        DOM.soundIcon.className = "bi bi-volume-up-fill";
        DOM.soundToggleBtn.setAttribute("aria-label", "Mute sound effects");
        DOM.soundToggleBtn.title = "Mute sound effects";
      } else {
        DOM.soundIcon.className = "bi bi-volume-mute-fill";
        DOM.soundToggleBtn.setAttribute("aria-label", "Enable sound effects");
        DOM.soundToggleBtn.title = "Enable sound effects";
      }
    }
  }

  // ==========================================================================
  // 3. UTILITY FUNCTIONS (RANDOMIZATION & FORMATTING)
  // ==========================================================================
  /**
   * Fisher-Yates array shuffling algorithm (unbiased)
   */
  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /**
   * Format seconds to MM:SS
   */
  function formatTime(totalSeconds) {
    const secs = Math.max(0, Math.floor(totalSeconds));
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  /**
   * Escape HTML to prevent injection
   */
  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ==========================================================================
  // 4. VIEW NAVIGATION & ROUTING
  // ==========================================================================
  function switchView(viewName) {
    const views = [
      { name: "welcome", el: DOM.viewWelcome },
      { name: "quiz", el: DOM.viewQuiz },
      { name: "results", el: DOM.viewResults },
      { name: "review", el: DOM.viewReview }
    ];

    views.forEach(v => {
      if (v.el) {
        if (v.name === viewName) {
          v.el.classList.add("active");
        } else {
          v.el.classList.remove("active");
        }
      }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ==========================================================================
  // 5. QUIZ PREPARATION & RANDOMIZATION
  // ==========================================================================
  function openConfigModal() {
    if (bootstrapModals.config) {
      bootstrapModals.config.show();
    }
  }

  function startQuizFromConfig() {
    // Read user preferences
    const qCount = parseInt(DOM.selectQuestionCount ? DOM.selectQuestionCount.value : "10", 10) || 10;
    const timeLimitMins = parseInt(DOM.selectTimeLimit ? DOM.selectTimeLimit.value : "5", 10) || 5;
    
    state.questionCount = Math.min(qCount, state.allQuestions.length);
    state.timeLimitSeconds = timeLimitMins * 60;
    state.studentName = DOM.inputCandidateName ? DOM.inputCandidateName.value.trim() : "";
    state.studentRegNo = DOM.inputCandidateReg ? DOM.inputCandidateReg.value.trim() : "";

    if (DOM.checkSoundEffect) {
      state.soundEnabled = DOM.checkSoundEffect.checked;
      localStorage.setItem("qm_sound", state.soundEnabled ? "true" : "false");
      updateSoundUI();
    }

    if (bootstrapModals.config) {
      bootstrapModals.config.hide();
    }

    prepareAndStartQuiz();
  }

  function prepareAndStartQuiz() {
    // 1. Shuffle all questions and pick required count
    const shuffledBank = shuffleArray(state.allQuestions);
    const selectedBank = shuffledBank.slice(0, state.questionCount);

    // 2. Shuffle options for each question while preserving correctOptionId
    state.activeQuestions = selectedBank.map(q => {
      return {
        ...q,
        options: shuffleArray(q.options)
      };
    });

    // 3. Reset session state
    state.currentIndex = 0;
    state.userAnswers = {};
    state.isQuizActive = true;
    state.isSubmitted = false;
    state.finalResults = null;

    // 4. Initialize segmented progress UI
    renderProgressSegments();

    // 5. Render first question
    renderQuestion(0);

    // 6. Switch to active quiz view
    switchView("quiz");

    // 7. Start accurate countdown timer
    startCountdownTimer(state.timeLimitSeconds);

    if (typeof soundManager !== "undefined") {
      soundManager.playClick();
    }
  }

  // ==========================================================================
  // 6. COUNTDOWN TIMER (DRIFT-RESILIENT & INACTIVE-TAB SAFE)
  // ==========================================================================
  function startCountdownTimer(durationSeconds) {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }

    state.startTime = Date.now();
    state.deadlineTime = state.startTime + (durationSeconds * 1000);

    updateTimerDisplay();

    state.timerInterval = setInterval(() => {
      const now = Date.now();
      const remainingMs = state.deadlineTime - now;
      const remainingSecs = Math.max(0, Math.ceil(remainingMs / 1000));

      updateTimerUI(remainingSecs);

      // Warning Tick sound in last 10 seconds
      if (remainingSecs <= 10 && remainingSecs > 0) {
        if (typeof soundManager !== "undefined") soundManager.playWarningTick();
      }

      // Deadline Expired
      if (remainingSecs <= 0) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
        onTimerExpired();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const remainingSecs = Math.max(0, Math.ceil((state.deadlineTime - Date.now()) / 1000));
    updateTimerUI(remainingSecs);
  }

  function updateTimerUI(remainingSecs) {
    if (!DOM.timerDisplay) return;
    DOM.timerDisplay.textContent = formatTime(remainingSecs);

    if (!DOM.timerWrapper) return;
    DOM.timerWrapper.classList.remove("timer-warning", "timer-critical");

    if (remainingSecs <= 15) {
      DOM.timerWrapper.classList.add("timer-critical");
    } else if (remainingSecs <= 60) {
      DOM.timerWrapper.classList.add("timer-warning");
    }
  }

  function stopTimer() {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
    const now = Date.now();
    state.timeTakenSeconds = Math.min(
      state.timeLimitSeconds,
      Math.max(1, Math.round((now - state.startTime) / 1000))
    );
  }

  function onTimerExpired() {
    if (state.isSubmitted) return;
    stopTimer();
    showToast("Time's up! Submitting your answers automatically...", "warning");
    if (bootstrapModals.confirm) bootstrapModals.confirm.hide();
    finalizeQuizSubmission();
  }

  // ==========================================================================
  // 7. SEGMENTED PROGRESS BAR SYSTEM
  // ==========================================================================
  function renderProgressSegments() {
    if (!DOM.segmentsTrack) return;
    DOM.segmentsTrack.innerHTML = "";

    state.activeQuestions.forEach((q, index) => {
      const segment = document.createElement("div");
      segment.className = "segment-cell unanswered";
      segment.id = `segment-q-${index}`;
      segment.dataset.index = index;
      segment.tabIndex = 0;
      segment.setAttribute("role", "button");
      segment.setAttribute("aria-label", `Question ${index + 1}: Unanswered`);
      segment.title = `Jump to Question ${index + 1}`;

      segment.addEventListener("click", () => {
        navigateToQuestion(index);
      });

      segment.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigateToQuestion(index);
        }
      });

      DOM.segmentsTrack.appendChild(segment);
    });

    updateProgressSegmentsUI();
  }

  function updateProgressSegmentsUI() {
    state.activeQuestions.forEach((q, index) => {
      const segment = document.getElementById(`segment-q-${index}`);
      if (!segment) return;

      const answer = state.userAnswers[q.id];
      segment.className = "segment-cell";

      if (index === state.currentIndex) {
        segment.classList.add("current");
      }

      if (!answer) {
        segment.classList.add("unanswered");
        segment.setAttribute("aria-label", `Question ${index + 1}: Unanswered`);
      } else if (answer.isCorrect) {
        segment.classList.add("correct");
        segment.setAttribute("aria-label", `Question ${index + 1}: Correct`);
      } else {
        segment.classList.add("incorrect");
        segment.setAttribute("aria-label", `Question ${index + 1}: Incorrect`);
      }
    });

    // Update answered summary
    const answeredCount = Object.keys(state.userAnswers).length;
    const totalCount = state.activeQuestions.length;
    const progressText = `${answeredCount} of ${totalCount} Answered`;

    if (DOM.progressAnsweredLabel) DOM.progressAnsweredLabel.textContent = progressText;
    if (DOM.answeredSummaryText) DOM.answeredSummaryText.textContent = progressText;
  }

  // ==========================================================================
  // 8. QUESTION RENDERING & OPTION INTERACTIONS
  // ==========================================================================
  function renderQuestion(index) {
    if (index < 0 || index >= state.activeQuestions.length) return;
    state.currentIndex = index;

    const q = state.activeQuestions[index];
    const totalQ = state.activeQuestions.length;

    // Top Row Meta
    if (DOM.quizCategoryPill) DOM.quizCategoryPill.textContent = q.category || "General";
    if (DOM.quizQuestionCounter) DOM.quizQuestionCounter.textContent = `${(index + 1).toString().padStart(2, "0")} / ${totalQ.toString().padStart(2, "0")}`;

    // Question Panel Meta
    if (DOM.questionNumTag) DOM.questionNumTag.textContent = `QUESTION ${(index + 1).toString().padStart(2, "0")}`;
    if (DOM.questionDiffTag) {
      DOM.questionDiffTag.textContent = q.difficulty || "Medium";
      DOM.questionDiffTag.className = `difficulty-pill diff-${(q.difficulty || "medium").toLowerCase()}`;
    }

    // Question Title
    if (DOM.questionTitleText) {
      DOM.questionTitleText.innerHTML = escapeHtml(q.question);
    }

    // Render Answer Options
    renderAnswerOptions(q);

    // Render Feedback if already answered
    const existingAnswer = state.userAnswers[q.id];
    if (existingAnswer) {
      showAnswerFeedback(q, existingAnswer.selectedOptionId, existingAnswer.isCorrect);
    } else {
      hideAnswerFeedback();
    }

    // Update Question Navigation Buttons
    updateNavigationControls();

    // Update Segments
    updateProgressSegmentsUI();
  }

  function renderAnswerOptions(question) {
    if (!DOM.optionsContainer) return;
    DOM.optionsContainer.innerHTML = "";

    const existingAnswer = state.userAnswers[question.id];
    const optionLetters = ["A", "B", "C", "D"];

    question.options.forEach((opt, idx) => {
      const letter = optionLetters[idx] || String.fromCharCode(65 + idx);
      const isSelected = existingAnswer && existingAnswer.selectedOptionId === opt.id;
      const isCorrectOption = opt.id === question.correctOptionId;

      const optBtn = document.createElement("button");
      optBtn.type = "button";
      optBtn.className = "option-card";
      optBtn.dataset.optionId = opt.id;
      optBtn.setAttribute("role", "radio");
      optBtn.setAttribute("aria-checked", isSelected ? "true" : "false");

      let statusIconHtml = "";

      if (existingAnswer) {
        if (isCorrectOption) {
          optBtn.classList.add("state-correct");
          statusIconHtml = `<i class="bi bi-check-circle-fill option-status-icon" aria-hidden="true"></i>`;
        } else if (isSelected && !existingAnswer.isCorrect) {
          optBtn.classList.add("state-incorrect");
          statusIconHtml = `<i class="bi bi-x-circle-fill option-status-icon" aria-hidden="true"></i>`;
        }
      }

      optBtn.innerHTML = `
        <span class="option-letter">${letter}</span>
        <span class="option-text">${escapeHtml(opt.text)}</span>
        ${statusIconHtml}
      `;

      optBtn.addEventListener("click", () => {
        handleOptionSelection(question, opt.id);
      });

      DOM.optionsContainer.appendChild(optBtn);
    });
  }

  function handleOptionSelection(question, selectedOptionId) {
    if (state.isSubmitted) return;

    const isCorrect = selectedOptionId === question.correctOptionId;

    // Record or update authoritative answer state
    state.userAnswers[question.id] = {
      selectedOptionId,
      isCorrect,
      timestamp: Date.now()
    };

    // Play appropriate sound effect
    if (typeof soundManager !== "undefined") {
      if (isCorrect) {
        soundManager.playCorrect();
      } else {
        soundManager.playIncorrect();
      }
    }

    // Update options UI immediately
    renderAnswerOptions(question);

    // Display feedback & explanation
    showAnswerFeedback(question, selectedOptionId, isCorrect);

    // Update progress segments
    updateProgressSegmentsUI();
  }

  function showAnswerFeedback(question, selectedOptionId, isCorrect) {
    if (!DOM.feedbackBox) return;

    DOM.feedbackBox.className = `feedback-box active ${isCorrect ? "feedback-correct" : "feedback-incorrect"}`;

    if (DOM.feedbackTitle) {
      DOM.feedbackTitle.textContent = isCorrect ? "Correct! Great job." : "Not quite. Review the explanation below:";
    }

    if (DOM.feedbackIcon) {
      DOM.feedbackIcon.className = isCorrect ? "bi bi-check-circle-fill text-success" : "bi bi-x-circle-fill text-danger";
    }

    if (DOM.feedbackExplanation) {
      DOM.feedbackExplanation.innerHTML = escapeHtml(question.explanation);
    }
  }

  function hideAnswerFeedback() {
    if (!DOM.feedbackBox) return;
    DOM.feedbackBox.className = "feedback-box";
  }

  function updateNavigationControls() {
    const totalQ = state.activeQuestions.length;

    // Previous Button
    if (DOM.btnPrevQuestion) {
      DOM.btnPrevQuestion.disabled = state.currentIndex === 0;
    }

    // Next / Submit Button
    if (DOM.btnNextQuestion) {
      if (state.currentIndex === totalQ - 1) {
        DOM.btnNextQuestion.innerHTML = `<span>Submit Quiz</span> <i class="bi bi-check2-all" aria-hidden="true"></i>`;
        DOM.btnNextQuestion.className = "btn-qm-primary";
      } else {
        DOM.btnNextQuestion.innerHTML = `<span>Next</span> <i class="bi bi-chevron-right" aria-hidden="true"></i>`;
        DOM.btnNextQuestion.className = "btn-qm-secondary";
      }
    }
  }

  function navigateToQuestion(newIndex) {
    if (newIndex < 0 || newIndex >= state.activeQuestions.length) return;
    renderQuestion(newIndex);
    if (typeof soundManager !== "undefined") soundManager.playClick();
  }

  // ==========================================================================
  // 9. SUBMISSION & UNANSWERED CHECK
  // ==========================================================================
  function handleSubmitAction() {
    if (state.isSubmitted) return;

    // Check for unanswered questions
    const unansweredIndices = [];
    state.activeQuestions.forEach((q, index) => {
      if (!state.userAnswers[q.id]) {
        unansweredIndices.push(index);
      }
    });

    if (unansweredIndices.length > 0) {
      // Show confirmation dialog with exact count
      if (DOM.unansweredWarningText) {
        DOM.unansweredWarningText.textContent = `You still have ${unansweredIndices.length} unanswered question${unansweredIndices.length > 1 ? "s" : ""}. Would you like to review them or submit your quiz now?`;
      }

      if (bootstrapModals.confirm) {
        bootstrapModals.confirm.show();
      }
    } else {
      // All answered, submit directly
      finalizeQuizSubmission();
    }
  }

  function reviewFirstUnanswered() {
    if (bootstrapModals.confirm) bootstrapModals.confirm.hide();

    const firstUnansweredIndex = state.activeQuestions.findIndex(q => !state.userAnswers[q.id]);
    if (firstUnansweredIndex !== -1) {
      navigateToQuestion(firstUnansweredIndex);
    }
  }

  function finalizeQuizSubmission() {
    if (state.isSubmitted) return;
    state.isSubmitted = true;
    state.isQuizActive = false;

    // Stop and record elapsed time
    stopTimer();

    // Calculate final results
    calculateResults();

    // Play completion sound
    if (typeof soundManager !== "undefined") {
      soundManager.playComplete();
    }

    // Render results view
    renderResultsDashboard();

    // Switch view
    switchView("results");
  }

  // ==========================================================================
  // 10. RESULTS CALCULATION & DASHBOARD RENDERING
  // ==========================================================================
  function calculateResults() {
    const totalQ = state.activeQuestions.length;
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    const categoryMap = {};

    state.activeQuestions.forEach(q => {
      const cat = q.category || "General";
      if (!categoryMap[cat]) {
        categoryMap[cat] = { total: 0, correct: 0 };
      }
      categoryMap[cat].total++;

      const ans = state.userAnswers[q.id];
      if (!ans) {
        unansweredCount++;
      } else if (ans.isCorrect) {
        correctCount++;
        categoryMap[cat].correct++;
      } else {
        incorrectCount++;
      }
    });

    const accuracyPct = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;

    // Performance Tier Message
    let performanceMessage = "";
    if (accuracyPct >= 90) {
      performanceMessage = "Outstanding performance! You demonstrated excellent understanding of modern web technologies.";
    } else if (accuracyPct >= 75) {
      performanceMessage = "Great work! You have a strong grasp of the topics and core principles.";
    } else if (accuracyPct >= 50) {
      performanceMessage = "Good effort! Review the explanations to strengthen your knowledge and master edge cases.";
    } else {
      performanceMessage = "Keep practicing! Reviewing the detailed explanations will help you build solid confidence.";
    }

    // Format categories
    const categories = Object.keys(categoryMap).map(name => {
      const item = categoryMap[name];
      const accuracy = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
      return {
        name,
        total: item.total,
        correct: item.correct,
        accuracy
      };
    });

    state.finalResults = {
      score: correctCount,
      totalQuestions: totalQ,
      accuracy: accuracyPct,
      correctCount,
      incorrectCount,
      unansweredCount,
      timeTakenFormatted: formatTime(state.timeTakenSeconds),
      timeTakenSeconds: state.timeTakenSeconds,
      performanceMessage,
      categories,
      questions: state.activeQuestions.map(q => ({
        ...q,
        userAnswerId: state.userAnswers[q.id] ? state.userAnswers[q.id].selectedOptionId : null
      })),
      dateFormatted: new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      studentName: state.studentName,
      studentRegNo: state.studentRegNo,
      topic: "Web Technologies"
    };
  }

  function renderResultsDashboard() {
    if (!state.finalResults) return;
    const res = state.finalResults;

    // 1. Numerical Score & Accuracy
    if (DOM.resultFractionScore) DOM.resultFractionScore.textContent = `${res.score} / ${res.totalQuestions}`;
    if (DOM.resultAccuracyPct) DOM.resultAccuracyPct.textContent = `${res.accuracy}%`;

    // 2. Animated Donut SVG Chart
    if (DOM.resultDonutFill) {
      const circumference = 440; // 2 * PI * 70
      const offset = circumference - ((res.accuracy / 100) * circumference);
      DOM.resultDonutFill.style.strokeDashoffset = offset;

      // Color based on performance
      if (res.accuracy >= 75) {
        DOM.resultDonutFill.style.stroke = "var(--qm-emerald-success)";
      } else if (res.accuracy >= 50) {
        DOM.resultDonutFill.style.stroke = "var(--qm-amber-warning)";
      } else {
        DOM.resultDonutFill.style.stroke = "var(--qm-rose-error)";
      }
    }

    // 3. Performance Message
    if (DOM.resultPerformanceMsg) DOM.resultPerformanceMsg.textContent = res.performanceMessage;

    // 4. Metric Cards
    if (DOM.metricCorrect) DOM.metricCorrect.textContent = res.correctCount;
    if (DOM.metricIncorrect) DOM.metricIncorrect.textContent = res.incorrectCount;
    if (DOM.metricUnanswered) DOM.metricUnanswered.textContent = res.unansweredCount;
    if (DOM.metricTimeTaken) DOM.metricTimeTaken.textContent = res.timeTakenFormatted;

    // 5. Category Breakdown Bars
    if (DOM.categoryBarsContainer) {
      DOM.categoryBarsContainer.innerHTML = "";
      res.categories.forEach(cat => {
        const row = document.createElement("div");
        row.className = "cat-perf-row";
        row.innerHTML = `
          <div class="cat-perf-meta">
            <span>${escapeHtml(cat.name)} (${cat.correct}/${cat.total})</span>
            <span class="tabular-nums">${cat.accuracy}%</span>
          </div>
          <div class="cat-track-bar">
            <div class="cat-fill-bar" style="width: 0%" data-target-width="${cat.accuracy}%"></div>
          </div>
        `;
        DOM.categoryBarsContainer.appendChild(row);
      });

      // Animate progress width
      setTimeout(() => {
        document.querySelectorAll(".cat-fill-bar").forEach(bar => {
          bar.style.width = bar.dataset.targetWidth;
        });
      }, 100);
    }
  }

  // ==========================================================================
  // 11. ANSWER REVIEW SYSTEM WITH FILTERS
  // ==========================================================================
  function openAnswerReview() {
    state.currentReviewFilter = "all";
    renderAnswerReviewList();
    switchView("review");
  }

  function renderAnswerReviewList() {
    if (!DOM.reviewCardsContainer || !state.finalResults) return;
    DOM.reviewCardsContainer.innerHTML = "";

    const questions = state.finalResults.questions;
    const filter = state.currentReviewFilter;

    // Update filter pill UI active state
    if (DOM.reviewFilterBtns) {
      DOM.reviewFilterBtns.forEach(btn => {
        if (btn.dataset.filter === filter) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    }

    const filteredList = questions.filter((q, index) => {
      const isAnswered = !!q.userAnswerId;
      const isCorrect = q.userAnswerId === q.correctOptionId;
      if (filter === "correct") return isCorrect;
      if (filter === "incorrect") return isAnswered && !isCorrect;
      if (filter === "unanswered") return !isAnswered;
      return true; // "all"
    });

    if (filteredList.length === 0) {
      DOM.reviewCardsContainer.innerHTML = `
        <div class="qm-panel text-center py-5">
          <i class="bi bi-filter-circle text-muted fs-1 mb-3 d-block"></i>
          <h5 class="fw-bold">No questions found</h5>
          <p class="text-secondary mb-0">No questions match the "${filter}" filter criteria.</p>
        </div>
      `;
      return;
    }

    filteredList.forEach((q) => {
      const originalIndex = state.activeQuestions.findIndex(orig => orig.id === q.id);
      const isAnswered = !!q.userAnswerId;
      const isCorrect = q.userAnswerId === q.correctOptionId;

      let cardClass = "is-unanswered";
      let statusBadge = `<span class="badge bg-secondary">Unanswered</span>`;

      if (isAnswered) {
        if (isCorrect) {
          cardClass = "is-correct";
          statusBadge = `<span class="badge bg-success"><i class="bi bi-check-circle me-1"></i> Correct</span>`;
        } else {
          cardClass = "is-incorrect";
          statusBadge = `<span class="badge bg-danger"><i class="bi bi-x-circle me-1"></i> Incorrect</span>`;
        }
      }

      const card = document.createElement("div");
      card.className = `review-card-item ${cardClass}`;

      let optionsHtml = "";
      const letters = ["A", "B", "C", "D"];

      q.options.forEach((opt, idx) => {
        const letter = letters[idx];
        const isUserChoice = opt.id === q.userAnswerId;
        const isCorrectChoice = opt.id === q.correctOptionId;

        let optStyle = "background: var(--qm-surface-secondary); border: 1px solid var(--qm-border-subtle);";
        let marker = "";

        if (isCorrectChoice) {
          optStyle = "background: var(--qm-emerald-soft); border: 1px solid var(--qm-emerald-border); font-weight: 600;";
          marker = `<span class="badge bg-success ms-auto"><i class="bi bi-check-lg"></i> Correct Answer</span>`;
        }
        if (isUserChoice && !isCorrectChoice) {
          optStyle = "background: var(--qm-rose-soft); border: 1px solid var(--qm-rose-border); font-weight: 600;";
          marker = `<span class="badge bg-danger ms-auto"><i class="bi bi-x-lg"></i> Your Answer</span>`;
        } else if (isUserChoice && isCorrectChoice) {
          marker = `<span class="badge bg-success ms-auto"><i class="bi bi-check-lg"></i> Your Answer (Correct)</span>`;
        }

        optionsHtml += `
          <div class="d-flex align-items-center p-2 px-3 rounded-3 mb-2" style="${optStyle}">
            <strong class="me-3" style="width: 22px;">${letter}.</strong>
            <span>${escapeHtml(opt.text)}</span>
            ${marker}
          </div>
        `;
      });

      card.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="text-primary fw-bold small text-uppercase">Question ${originalIndex + 1} &bull; ${escapeHtml(q.category)}</span>
          ${statusBadge}
        </div>
        <h5 class="fw-bold mb-3">${escapeHtml(q.question)}</h5>
        <div class="mb-3">${optionsHtml}</div>
        <div class="p-3 rounded-3" style="background: var(--qm-surface-secondary); border-left: 3px solid var(--qm-indigo-primary);">
          <strong class="d-block text-secondary small text-uppercase mb-1"><i class="bi bi-lightbulb me-1 text-warning"></i> Explanation:</strong>
          <p class="mb-0 small text-primary">${escapeHtml(q.explanation)}</p>
        </div>
      `;

      DOM.reviewCardsContainer.appendChild(card);
    });
  }

  // ==========================================================================
  // 12. PDF REPORT GENERATION & DOWNLOAD
  // ==========================================================================
  async function downloadReportPDF() {
    if (!state.finalResults) {
      showToast("No completed quiz results found.", "warning");
      return;
    }

    if (!DOM.btnDownloadPdf) return;
    const originalText = DOM.btnDownloadPdf.innerHTML;
    DOM.btnDownloadPdf.disabled = true;
    DOM.btnDownloadPdf.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status"></span> Generating PDF...`;

    showToast("Preparing official PDF report...", "info");

    try {
      const result = await pdfGenerator.generateReport(state.finalResults);
      if (result && result.success) {
        showToast(`Report downloaded successfully: ${result.filename}`, "success");
      } else {
        throw new Error(result.error || "Generation error");
      }
    } catch (err) {
      console.warn("PDF generation encountered an issue, offering browser print:", err);
      showToast("Opening printable view...", "info");
      window.print();
    } finally {
      DOM.btnDownloadPdf.disabled = false;
      DOM.btnDownloadPdf.innerHTML = originalText;
    }
  }

  // ==========================================================================
  // 13. TOAST NOTIFICATION UTILITY
  // ==========================================================================
  let toastTimer = null;
  function showToast(message, type = "info") {
    if (!DOM.toastEl || !DOM.toastMessage) return;

    if (toastTimer) clearTimeout(toastTimer);

    DOM.toastMessage.textContent = message;
    DOM.toastEl.className = "qm-toast show";

    toastTimer = setTimeout(() => {
      DOM.toastEl.className = "qm-toast";
    }, 3800);
  }

  // ==========================================================================
  // 14. EVENT HANDLERS & LISTENERS
  // ==========================================================================
  function bindEventListeners() {
    // Brand home link
    const brandHomeLink = document.getElementById("brand-home-link");
    if (brandHomeLink) {
      brandHomeLink.addEventListener("click", (e) => {
        e.preventDefault();
        if (state.isQuizActive && !state.isSubmitted) {
          if (confirm("A quiz is currently in progress. Do you wish to leave and discard this attempt?")) {
            stopTimer();
            state.isQuizActive = false;
            switchView("welcome");
          }
        } else {
          switchView("welcome");
        }
      });
    }

    // Theme toggle
    if (DOM.themeToggleBtn) {
      DOM.themeToggleBtn.addEventListener("click", toggleTheme);
    }

    // Sound toggle
    if (DOM.soundToggleBtn) {
      DOM.soundToggleBtn.addEventListener("click", toggleSound);
    }

    // Help modal button
    if (DOM.helpBtn) {
      DOM.helpBtn.addEventListener("click", () => {
        if (bootstrapModals.help) bootstrapModals.help.show();
      });
    }

    // Hero buttons
    if (DOM.btnStartChallenge) {
      DOM.btnStartChallenge.addEventListener("click", openConfigModal);
    }
    if (DOM.btnHeroStartModal) {
      DOM.btnHeroStartModal.addEventListener("click", openConfigModal);
    }
    if (DOM.btnHowItWorks) {
      DOM.btnHowItWorks.addEventListener("click", () => {
        const sec = document.getElementById("section-how-it-works");
        if (sec) sec.scrollIntoView({ behavior: "smooth" });
      });
    }

    // Config Modal Start Quiz button
    if (DOM.btnConfirmStartQuiz) {
      DOM.btnConfirmStartQuiz.addEventListener("click", startQuizFromConfig);
    }

    // Navigation buttons
    if (DOM.btnPrevQuestion) {
      DOM.btnPrevQuestion.addEventListener("click", () => {
        if (state.currentIndex > 0) {
          navigateToQuestion(state.currentIndex - 1);
        }
      });
    }

    if (DOM.btnNextQuestion) {
      DOM.btnNextQuestion.addEventListener("click", () => {
        if (state.currentIndex === state.activeQuestions.length - 1) {
          handleSubmitAction();
        } else {
          navigateToQuestion(state.currentIndex + 1);
        }
      });
    }

    if (DOM.btnSubmitQuiz) {
      DOM.btnSubmitQuiz.addEventListener("click", handleSubmitAction);
    }

    // Submission Confirmation Modal Actions
    if (DOM.btnReviewUnanswered) {
      DOM.btnReviewUnanswered.addEventListener("click", reviewFirstUnanswered);
    }
    if (DOM.btnConfirmSubmitFinal) {
      DOM.btnConfirmSubmitFinal.addEventListener("click", () => {
        if (bootstrapModals.confirm) bootstrapModals.confirm.hide();
        finalizeQuizSubmission();
      });
    }

    // Results Dashboard Buttons
    if (DOM.btnDownloadPdf) {
      DOM.btnDownloadPdf.addEventListener("click", downloadReportPDF);
    }
    if (DOM.btnReviewAnswers) {
      DOM.btnReviewAnswers.addEventListener("click", openAnswerReview);
    }
    if (DOM.btnRetakeQuiz) {
      DOM.btnRetakeQuiz.addEventListener("click", () => {
        openConfigModal();
      });
    }

    // Answer Review Screen Buttons
    if (DOM.btnBackToResults) {
      DOM.btnBackToResults.addEventListener("click", () => {
        switchView("results");
      });
    }

    // Review Filters
    if (DOM.reviewFilterBtns) {
      DOM.reviewFilterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          state.currentReviewFilter = btn.dataset.filter || "all";
          renderAnswerReviewList();
        });
      });
    }

    // Keyboard navigation during quiz
    document.addEventListener("keydown", (e) => {
      if (!state.isQuizActive || state.isSubmitted) return;

      // Disable keyboard shortcuts when modal is open
      if (document.body.classList.contains("modal-open")) return;

      // Arrow keys navigation
      if (e.key === "ArrowLeft" && state.currentIndex > 0) {
        navigateToQuestion(state.currentIndex - 1);
      } else if (e.key === "ArrowRight" && state.currentIndex < state.activeQuestions.length - 1) {
        navigateToQuestion(state.currentIndex + 1);
      }

      // Keys 1, 2, 3, 4 or A, B, C, D to select options
      const keyMap = { "1": 0, "2": 1, "3": 2, "4": 3, "a": 0, "b": 1, "c": 2, "d": 3, "A": 0, "B": 1, "C": 2, "D": 3 };
      if (keyMap.hasOwnProperty(e.key)) {
        const optIndex = keyMap[e.key];
        const currentQ = state.activeQuestions[state.currentIndex];
        if (currentQ && currentQ.options && currentQ.options[optIndex]) {
          handleOptionSelection(currentQ, currentQ.options[optIndex].id);
        }
      }
    });
  }

  // Initialize on DOMContentLoaded
  document.addEventListener("DOMContentLoaded", initializeApp);

})();
