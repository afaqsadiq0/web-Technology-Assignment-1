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
  const spySections = document.querySelectorAll('section[id], header[id]');

  function updateActiveNavLink() {
    if (!spySections || spySections.length === 0) return;

    let currentSectionId = '';
    const scrollPosition = window.scrollY + 160;

    spySections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        const isMatch = (
          (currentSectionId === 'hero' && (href === 'index.html' || href === '#hero' || href === '#')) ||
          href === '#' + currentSectionId ||
          href.endsWith('#' + currentSectionId)
        );
        if (isMatch) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    } else if (window.scrollY < 250) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href === 'index.html' || href === '#hero' || href === '#') {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // Smooth scroll to hash anchor and preserve user position without reset
  function scrollToHashTarget(hash) {
    if (!hash) return;
    try {
      const targetElement = document.querySelector(hash);
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          updateActiveNavLink();
        }, 80);
      }
    } catch (e) {
      // Ignore invalid selector
    }
  }

  // Handle initial page load if hash exists
  if (window.location.hash) {
    scrollToHashTarget(window.location.hash);
  }

  // Listen for back/forward browser history changes
  window.addEventListener('popstate', () => {
    if (window.location.hash) {
      scrollToHashTarget(window.location.hash);
    }
  });

  // Intercept in-page section links to ensure history and smooth scroll without reload
  const sectionLinks = document.querySelectorAll('a[href^="#"]');
  sectionLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetHash = link.getAttribute('href');
      if (targetHash && targetHash !== '#') {
        const targetElement = document.querySelector(targetHash);
        if (targetElement) {
          e.preventDefault();
          history.pushState(null, null, targetHash);
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setTimeout(updateActiveNavLink, 150);
        }
      }
    });
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
});

// Global smart back navigation function for lecture pages
function goBackToPreviousSection() {
  if (window.history.length > 1 && document.referrer && document.referrer.includes('index.html')) {
    window.history.back();
  } else {
    window.location.href = '../index.html#lectures';
  }
}
