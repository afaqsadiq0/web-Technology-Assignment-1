/**
 * WEB TECHNOLOGIES - CSC336
 * COMSATS University Islamabad, Vehari Campus
 * Student: Muhammad Afaq (FA23-BSE-012)
 * Master Interactive JavaScript: Typewriter, Theme Toggle, Smart Section Navigation
 */

// Immediate Theme Initialization (prevents flash of wrong theme)
(function initTheme() {
  const savedTheme = localStorage.getItem('webTechTheme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
})();

document.addEventListener('DOMContentLoaded', () => {

  // -------------------------------------------------------------------------
  // 1. Dark / Light Mode Theme Toggle
  // -------------------------------------------------------------------------
  const themeToggleButtons = document.querySelectorAll('.theme-toggle-btn');

  function updateThemeIcons(currentTheme) {
    themeToggleButtons.forEach(btn => {
      btn.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('title', currentTheme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme');
      btn.setAttribute('aria-label', currentTheme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme');
    });
  }

  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  updateThemeIcons(currentTheme);

  themeToggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', activeTheme);
      localStorage.setItem('webTechTheme', activeTheme);
      updateThemeIcons(activeTheme);
    });
  });

  // -------------------------------------------------------------------------
  // 2. Typewriter Effect (Hero Section on Homepage)
  // -------------------------------------------------------------------------
  const typewriterElement = document.getElementById('typewriterText');
  if (typewriterElement) {
    const phrases = [
      "Web Technologies",
      "HTML5 Semantic Markup",
      "Modern CSS3 Layouts",
      "Tiered Web Architecture",
      "Flexbox & CSS Grid Systems",
      "COMSATS University Islamabad"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function type() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 45;
      } else {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 90;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        // Pause at full phrase
        typingSpeed = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        // Move to next phrase
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 450;
      }

      setTimeout(type, typingSpeed);
    }

    type();
  }

  // -------------------------------------------------------------------------
  // 3. Section Preservation & Dynamic Scroll-Spy in Navbar
  // -------------------------------------------------------------------------
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  const pageSections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    if (!pageSections || pageSections.length === 0 || !navLinks || navLinks.length === 0) return;

    let activeId = 'hero';
    const scrollPos = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    // Check if user is scrolled near bottom of page
    if (scrollPos + windowHeight >= docHeight - 70) {
      activeId = 'contact';
    } else if (scrollPos < 140) {
      activeId = 'hero';
    } else {
      // Find section currently occupying the viewport
      pageSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 180 && rect.bottom >= 140) {
          activeId = section.getAttribute('id');
        }
      });
    }

    navLinks.forEach(link => {
      const href = (link.getAttribute('href') || '').trim();
      let targetId = '';
      if (href.startsWith('#')) {
        targetId = href.substring(1);
      } else if (href === 'index.html' || href === './' || href === '/') {
        targetId = 'hero';
      } else if (href.includes('#')) {
        targetId = href.split('#')[1];
      }

      if (targetId === activeId || (activeId === 'hero' && (targetId === 'hero' || href === 'index.html'))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  window.addEventListener('resize', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // Smooth scroll click handler for all in-page links (including navbar & hero buttons)
  const inPageLinks = document.querySelectorAll('a[href^="#"], a[href*="index.html#"]');
  inPageLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href) return;
      const hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;
      const hash = href.substring(hashIndex);
      if (hash === '#' || hash === '') return;

      const target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });
        if (history.pushState) {
          history.pushState(null, null, hash);
        }
        setTimeout(updateActiveNavLink, 200);
      }
    });
  });

  // Handle initial page load if hash exists
  if (window.location.hash) {
    const targetHash = window.location.hash;
    const targetElement = document.querySelector(targetHash);
    if (targetElement) {
      setTimeout(() => {
        const headerOffset = 80;
        const targetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });
        updateActiveNavLink();
      }, 120);
    }
  }

  // Listen for back/forward browser history changes
  window.addEventListener('popstate', () => {
    if (window.location.hash) {
      const targetElement = document.querySelector(window.location.hash);
      if (targetElement) {
        const headerOffset = 80;
        const targetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });
        setTimeout(updateActiveNavLink, 150);
      }
    }
  });

  // When clicking any "View Lecture" link, store that we came from #lectures
  const lectureLinks = document.querySelectorAll('.lecture-btn-link');
  lectureLinks.forEach(link => {
    link.addEventListener('click', () => {
      sessionStorage.setItem('lastViewedSection', '#lectures');
    });
  });

  // -------------------------------------------------------------------------
  // 4. Mobile Navigation Menu Toggle
  // -------------------------------------------------------------------------
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('is-active');
    });

    document.addEventListener('click', (event) => {
      if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
        navMenu.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // -------------------------------------------------------------------------
  // 5. Back to Top Button
  // -------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // -------------------------------------------------------------------------
  // 6. Code Snippet Copy to Clipboard
  // -------------------------------------------------------------------------
  const copyButtons = document.querySelectorAll('.code-copy-btn');
  copyButtons.forEach(button => {
    button.addEventListener('click', () => {
      const codeWrapper = button.closest('.code-wrapper');
      if (codeWrapper) {
        const codeElement = codeWrapper.querySelector('pre code') || codeWrapper.querySelector('pre');
        if (codeElement) {
          const textToCopy = codeElement.innerText;
          navigator.clipboard.writeText(textToCopy).then(() => {
            const originalHTML = button.innerHTML;
            button.innerHTML = '<span>✓</span> Copied!';
            button.style.color = '#10b981';
            setTimeout(() => {
              button.innerHTML = originalHTML;
              button.style.color = '';
            }, 2000);
          }).catch(err => {
            console.error('Failed to copy text: ', err);
          });
        }
      }
    });
  });

  // -------------------------------------------------------------------------
  // 7. Interactive Demo Form Handling (Lecture 5)
  // -------------------------------------------------------------------------
  const demoForm = document.getElementById('academicDemoForm');
  const formFeedback = document.getElementById('formFeedback');
  if (demoForm && formFeedback) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('demoName');
      const emailInput = document.getElementById('demoEmail');
      const courseSelect = document.getElementById('demoCourse');

      if (nameInput && emailInput) {
        formFeedback.style.display = 'block';
        formFeedback.innerHTML = `
          <div style="background:#ecfdf5; border:1px solid #10b981; color:#065f46; padding:1rem; border-radius:8px; margin-top:1rem;">
            <strong>✓ Form Submitted Successfully!</strong><br>
            <span style="font-size:0.9rem;">Thank you, <strong>${nameInput.value || 'Student'}</strong> (${emailInput.value}). Your enrollment record for ${courseSelect ? courseSelect.value : 'the course'} has been captured locally.</span>
          </div>
        `;
        demoForm.reset();
      }
    });
  }

  // -------------------------------------------------------------------------
  // 8. Lecture Query Station & Preset Doubt Options Handler
  // -------------------------------------------------------------------------
  const queryDropdowns = document.querySelectorAll('.query-dropdown');
  queryDropdowns.forEach(dropdown => {
    dropdown.addEventListener('change', () => {
      const parentSection = dropdown.closest('.lecture-query-section');
      if (!parentSection) return;
      const targetSolutionId = dropdown.value;
      const solutionBoxes = parentSection.querySelectorAll('.query-solution-display');
      solutionBoxes.forEach(box => { box.style.display = 'none'; });

      if (targetSolutionId) {
        const targetBox = parentSection.querySelector(`#${targetSolutionId}`);
        if (targetBox) {
          targetBox.style.display = 'block';
          targetBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  });

  const queryChipButtons = document.querySelectorAll('.query-chip-btn');
  queryChipButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentSection = btn.closest('.lecture-query-section');
      if (!parentSection) return;

      // Update active chip state
      const siblingChips = parentSection.querySelectorAll('.query-chip-btn');
      siblingChips.forEach(chip => chip.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.getAttribute('data-target');
      const solutionBoxes = parentSection.querySelectorAll('.query-solution-display');
      solutionBoxes.forEach(box => { box.style.display = 'none'; });

      if (targetId) {
        const targetBox = parentSection.querySelector(`#${targetId}`);
        if (targetBox) {
          targetBox.style.display = 'block';
          targetBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }

      // Sync dropdown value if matching
      const dropdown = parentSection.querySelector('.query-dropdown');
      if (dropdown && targetId) {
        dropdown.value = targetId;
      }
    });
  });

  // Custom Query Form Submission Handler
  const customQueryForms = document.querySelectorAll('.query-custom-form');
  customQueryForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const parentSection = form.closest('.lecture-query-section');
      const textarea = form.querySelector('.query-textarea');
      const categorySelect = form.querySelector('.query-category-select');
      const historyLog = parentSection ? parentSection.querySelector('.query-history-log') : null;

      if (textarea && textarea.value.trim().length > 0) {
        const userQuery = textarea.value.trim();
        const category = categorySelect ? categorySelect.value : 'General Query';
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (historyLog) {
          historyLog.style.display = 'block';
          historyLog.innerHTML = `
            <div style="font-weight: 700; margin-bottom: 0.35rem; display: flex; align-items: center; justify-content: space-between;">
              <span>✓ Query Received &amp; Logged [${category}]</span>
              <span style="font-size: 0.75rem; font-weight: normal; opacity: 0.85;">${now}</span>
            </div>
            <div style="font-size: 0.88rem; margin-bottom: 0.5rem; background: rgba(255,255,255,0.6); padding: 0.5rem 0.75rem; border-radius: 6px;">
              <em>"${userQuery}"</em>
            </div>
            <p style="margin: 0; font-size: 0.84rem; line-height: 1.5;">
              <strong>Academic Guidance:</strong> Your query has been recorded. Review the comprehensive lecture breakdown above or select from the pre-verified questions on the left for immediate verified solutions!
            </p>
          `;
          historyLog.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        textarea.value = '';
      }
    });
  });

  // -------------------------------------------------------------------------
  // 9. Interactive Knowledge Check & MCQ Quiz Handler
  // -------------------------------------------------------------------------
  let quizScores = {};

  const quizOptionButtons = document.querySelectorAll('.quiz-option-btn');
  quizOptionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const quizCard = btn.closest('.quiz-card');
      const quizContainer = btn.closest('.quiz-station-container');
      if (!quizCard || !quizContainer) return;

      const questionId = quizCard.getAttribute('data-quiz-id') || 'q1';
      const isCorrect = btn.getAttribute('data-correct') === 'true';
      const allButtonsInCard = quizCard.querySelectorAll('.quiz-option-btn');
      const explanationBox = quizCard.querySelector('.quiz-explanation-box');

      // Disable all options in this card once clicked
      allButtonsInCard.forEach(b => {
        b.disabled = true;
        b.style.cursor = 'default';
        if (b.getAttribute('data-correct') === 'true') {
          b.classList.add('selected-correct');
        }
      });

      if (!isCorrect) {
        btn.classList.add('selected-wrong');
      }

      // Display Explanation
      if (explanationBox) {
        explanationBox.className = isCorrect ? 'quiz-explanation-box correct' : 'quiz-explanation-box wrong';
        explanationBox.style.display = 'block';
      }

      // Update score tracker for this lecture
      if (isCorrect) {
        quizScores[questionId] = 1;
      } else {
        quizScores[questionId] = 0;
      }

      const scoreBadge = quizContainer.querySelector('.quiz-score-num');
      if (scoreBadge) {
        const totalAnswered = Object.keys(quizScores).length;
        const totalCorrect = Object.values(quizScores).reduce((a, b) => a + b, 0);
        scoreBadge.textContent = `${totalCorrect} / ${totalAnswered}`;
      }
    });
  });

  // -------------------------------------------------------------------------
  // 10. Multi-Tier Data Flow Interactive Simulator (Lecture 2)
  // -------------------------------------------------------------------------
  const tierSimBtn = document.getElementById('btnSimulateTierFlow');
  if (tierSimBtn) {
    tierSimBtn.addEventListener('click', () => {
      const steps = [
        { id: 'tierNodeClient', status: 'Client sends HTTP GET /catalog' },
        { id: 'tierNodeWeb', status: 'Web Server terminates SSL & routes to App Tier' },
        { id: 'tierNodeApp', status: 'App Server validates auth & queries Database' },
        { id: 'tierNodeDb', status: 'Database executes SQL query & returns recordset' },
        { id: 'tierNodeApp', status: 'App Server serializes JSON payload' },
        { id: 'tierNodeClient', status: 'Client browser renders HTML/DOM' }
      ];

      const simLog = document.getElementById('tierSimLog');
      tierSimBtn.disabled = true;
      let stepIndex = 0;

      function runNextStep() {
        if (stepIndex < steps.length) {
          const step = steps[stepIndex];
          document.querySelectorAll('.tier-sim-node').forEach(n => n.classList.remove('active-node'));
          const activeNode = document.getElementById(step.id);
          if (activeNode) activeNode.classList.add('active-node');
          if (simLog) {
            simLog.innerHTML = `<span style="color:#10b981; font-weight:700;">Step ${stepIndex + 1}/${steps.length}:</span> ${step.status}`;
          }
          stepIndex++;
          setTimeout(runNextStep, 800);
        } else {
          tierSimBtn.disabled = false;
          if (simLog) {
            simLog.innerHTML = `<span style="color:#10b981; font-weight:700;">✓ Transaction Complete!</span> Round-trip latency: <strong>42ms</strong> (HTTP 200 OK)`;
          }
        }
      }
      runNextStep();
    });
  }
});

// Global smart back navigation function for lecture pages
function goBackToPreviousSection() {
  if (window.history.length > 1 && document.referrer && document.referrer.includes('index.html')) {
    window.history.back();
  } else {
    window.location.href = '../index.html#lectures';
  }
}
