/**
 * CSS Grid Garden Interactive Explorer & Simulator
 * CSC336 Web Technologies — Muhammad Afaq (FA23-BSE-012)
 * Manages 28-level navigation, live simulator, copy actions, and screenshot lightbox.
 */

(function initGridGardenExplorer() {
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof GRID_GARDEN_LEVELS === 'undefined' || !GRID_GARDEN_LEVELS.length) {
      console.warn('GRID_GARDEN_LEVELS data not loaded.');
      return;
    }

    const state = {
      currentLevelIndex: 0,
      activeFilter: 'all'
    };

    // UI Elements
    const pillsContainer = document.getElementById('gridGardenPills');
    const filterTabs = document.querySelectorAll('.garden-filter-btn');
    const prevBtn = document.getElementById('gardenPrevBtn');
    const nextBtn = document.getElementById('gardenNextBtn');
    const levelTitle = document.getElementById('gardenLevelTitle');
    const levelBadge = document.getElementById('gardenLevelBadge');
    const levelCounter = document.getElementById('gardenLevelCounter');
    const levelInstruction = document.getElementById('gardenLevelInstruction');
    const levelCode = document.getElementById('gardenLevelCode');
    const levelScreenshot = document.getElementById('gardenLevelScreenshot');
    const copyBtn = document.getElementById('gardenCopySolutionBtn');
    const zoomBtn = document.getElementById('gardenZoomScreenshotBtn');
    const solutionsMatrix = document.getElementById('gardenSolutionsMatrix');

    // Simulator Elements
    const simInput = document.getElementById('gardenSimCodeInput');
    const simApplyBtn = document.getElementById('gardenSimApplyBtn');
    const simResetBtn = document.getElementById('gardenSimResetBtn');
    const simWater = document.getElementById('gardenSimWater');
    const simFeedback = document.getElementById('gardenSimFeedback');
    const simGarden = document.getElementById('gardenSimBoard');

    // Lightbox Elements
    const lightboxModal = document.getElementById('gardenLightboxModal');
    const lightboxImg = document.getElementById('gardenLightboxImg');
    const lightboxCaption = document.getElementById('gardenLightboxCaption');
    const lightboxClose = document.getElementById('gardenLightboxClose');
    const lightboxPrev = document.getElementById('gardenLightboxPrev');
    const lightboxNext = document.getElementById('gardenLightboxNext');

    // Check if on a page that includes Grid Garden
    if (!pillsContainer && !solutionsMatrix) return;

    // 1. Build Level Navigation Pills
    function renderPills() {
      if (!pillsContainer) return;
      pillsContainer.innerHTML = '';

      GRID_GARDEN_LEVELS.forEach((lvl, idx) => {
        // Filter check
        const isVisible = state.activeFilter === 'all' || lvl.category === state.activeFilter;
        if (!isVisible) return;

        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = 'garden-level-pill' + (idx === state.currentLevelIndex ? ' active' : '');
        pill.setAttribute('data-level-index', idx);
        pill.innerHTML = `
          <span class="pill-num">${lvl.level}</span>
          <span class="pill-check">✓</span>
        `;
        pill.setAttribute('title', `Level ${lvl.level}: ${lvl.concept}`);
        pill.addEventListener('click', () => {
          loadLevel(idx);
        });
        pillsContainer.appendChild(pill);
      });
    }

    // 2. Load Selected Level
    function loadLevel(index) {
      if (index < 0) index = 0;
      if (index >= GRID_GARDEN_LEVELS.length) index = GRID_GARDEN_LEVELS.length - 1;
      state.currentLevelIndex = index;

      const lvl = GRID_GARDEN_LEVELS[index];

      // Update Active Pill
      document.querySelectorAll('.garden-level-pill').forEach(p => {
        const pIdx = parseInt(p.getAttribute('data-level-index'), 10);
        p.classList.toggle('active', pIdx === index);
      });

      // Update Meta
      if (levelTitle) levelTitle.textContent = lvl.title;
      if (levelBadge) levelBadge.textContent = lvl.concept;
      if (levelCounter) levelCounter.textContent = `${lvl.level} / 28`;
      if (levelInstruction) levelInstruction.textContent = lvl.instruction;
      if (levelCode) levelCode.textContent = lvl.solution;

      // Update Screenshot
      if (levelScreenshot) {
        levelScreenshot.src = lvl.image;
        levelScreenshot.alt = `Grid Garden Level ${lvl.level} Screenshot — Solved by Muhammad Afaq`;
      }

      // Update Prev / Next Buttons
      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index === GRID_GARDEN_LEVELS.length - 1;

      // Reset & Configure Simulator for Current Level
      setupSimulator(lvl);

      // Scroll pills into view smoothly
      const activePill = pillsContainer ? pillsContainer.querySelector('.garden-level-pill.active') : null;
      if (activePill && typeof activePill.scrollIntoView === 'function') {
        activePill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }

    // 3. Configure Live Garden Simulator
    function setupSimulator(lvl) {
      if (!simWater || !simGarden || !simInput) return;

      // Clear previous inline styles
      simWater.style.cssText = '';
      simWater.className = 'garden-element-water';
      if (simFeedback) simFeedback.innerHTML = '';

      // Populate input with default solution for quick testing
      simInput.value = lvl.solution;

      // Set target plants on board (5x5 grid)
      renderBoardPlants(lvl);
      applySimCss(lvl.solution, false);
    }

    function renderBoardPlants(lvl) {
      if (!simGarden) return;
      // Clear previous carrots/weeds
      const oldPlants = simGarden.querySelectorAll('.garden-sim-plant');
      oldPlants.forEach(p => p.remove());

      // Simple visual indicator of target zone
      const plant = document.createElement('div');
      plant.className = 'garden-sim-plant ' + (lvl.name.includes('poison') || lvl.solution.includes('order') ? 'plant-weed' : 'plant-carrot');
      plant.title = lvl.name;
      
      // Place target based on level
      if (lvl.level === 1) {
        plant.style.gridColumn = '3';
        plant.style.gridRow = '1';
      } else if (lvl.level === 2) {
        plant.style.gridColumn = '5';
        plant.style.gridRow = '1';
      } else if (lvl.level === 3) {
        plant.style.gridColumn = '1 / 4';
        plant.style.gridRow = '1';
      } else if (lvl.level === 4) {
        plant.style.gridColumn = '2 / 5';
        plant.style.gridRow = '1';
      } else if (lvl.level === 5) {
        plant.style.gridColumn = '1 / 5';
        plant.style.gridRow = '1';
      } else if (lvl.level === 9) {
        plant.style.gridColumn = '3 / 6';
        plant.style.gridRow = '1';
      } else if (lvl.level === 10) {
        plant.style.gridColumn = '4 / 6';
        plant.style.gridRow = '1';
      } else if (lvl.level === 12) {
        plant.style.gridColumn = '1';
        plant.style.gridRow = '3';
      } else if (lvl.level === 13) {
        plant.style.gridColumn = '1';
        plant.style.gridRow = '3 / 6';
      } else if (lvl.level === 14) {
        plant.style.gridColumn = '2';
        plant.style.gridRow = '5';
      } else if (lvl.level === 15) {
        plant.style.gridColumn = '2 / 6';
        plant.style.gridRow = '1 / 6';
      } else if (lvl.level === 16) {
        plant.style.gridArea = '1 / 2 / 4 / 6';
      } else if (lvl.level === 17) {
        plant.style.gridArea = '2 / 3 / 5 / 6';
      } else {
        plant.style.gridColumn = '2 / 4';
        plant.style.gridRow = '2 / 4';
      }

      simGarden.appendChild(plant);
    }

    function applySimCss(cssText, showMessage = true) {
      if (!simWater) return;
      try {
        const rules = cssText.split(';').map(r => r.trim()).filter(Boolean);
        rules.forEach(rule => {
          const parts = rule.split(':');
          if (parts.length === 2) {
            const prop = parts[0].trim();
            const val = parts[1].trim();
            if (prop.startsWith('grid-template')) {
              if (simGarden) simGarden.style.setProperty(prop, val);
            } else {
              simWater.style.setProperty(prop, val);
            }
          }
        });

        if (showMessage && simFeedback) {
          simFeedback.innerHTML = `<span style="color:#10b981; font-weight:700;">✓ CSS Applied:</span> Garden elements updated in real time!`;
        }
      } catch (e) {
        if (showMessage && simFeedback) {
          simFeedback.innerHTML = `<span style="color:#ef4444; font-weight:600;">⚠️ Invalid CSS declaration:</span> ${e.message}`;
        }
      }
    }

    // 4. Simulator Button Listeners
    if (simApplyBtn) {
      simApplyBtn.addEventListener('click', () => {
        applySimCss(simInput.value, true);
      });
    }

    if (simResetBtn) {
      simResetBtn.addEventListener('click', () => {
        const lvl = GRID_GARDEN_LEVELS[state.currentLevelIndex];
        setupSimulator(lvl);
      });
    }

    // 5. Solution Copy Button
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const lvl = GRID_GARDEN_LEVELS[state.currentLevelIndex];
        if (!lvl) return;
        navigator.clipboard.writeText(lvl.solution).then(() => {
          const original = copyBtn.innerHTML;
          copyBtn.innerHTML = '<span>✓ Copied!</span>';
          copyBtn.classList.add('copied');
          setTimeout(() => {
            copyBtn.innerHTML = original;
            copyBtn.classList.remove('copied');
          }, 1800);
        });
      });
    }

    // 6. Navigation Buttons
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (state.currentLevelIndex > 0) {
          loadLevel(state.currentLevelIndex - 1);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (state.currentLevelIndex < GRID_GARDEN_LEVELS.length - 1) {
          loadLevel(state.currentLevelIndex + 1);
        }
      });
    }

    // 7. Filter Tabs Handler
    filterTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        filterTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeFilter = btn.getAttribute('data-filter') || 'all';
        renderPills();

        // If current level is filtered out, select first visible
        const currentLvl = GRID_GARDEN_LEVELS[state.currentLevelIndex];
        if (state.activeFilter !== 'all' && currentLvl.category !== state.activeFilter) {
          const firstVisible = GRID_GARDEN_LEVELS.findIndex(l => l.category === state.activeFilter);
          if (firstVisible !== -1) {
            loadLevel(firstVisible);
          }
        }
      });
    });

    // 8. Render All-28 Solutions Catalog / Matrix
    function renderSolutionsMatrix() {
      if (!solutionsMatrix) return;
      solutionsMatrix.innerHTML = '';

      GRID_GARDEN_LEVELS.forEach((lvl, idx) => {
        const card = document.createElement('div');
        card.className = 'garden-matrix-card';
        card.innerHTML = `
          <div class="matrix-card-header">
            <div class="matrix-level-badge">Level ${lvl.level}</div>
            <span class="matrix-cat-tag">${lvl.category.toUpperCase()}</span>
          </div>
          <div class="matrix-img-wrapper" title="Click to view full screenshot in Lightbox">
            <img src="${lvl.image}" alt="Grid Garden Level ${lvl.level}" class="matrix-thumb-img" loading="lazy">
            <div class="matrix-zoom-overlay">🔍 View Full Screenshot</div>
          </div>
          <div class="matrix-card-body">
            <h4 class="matrix-card-concept">${lvl.concept}</h4>
            <div class="matrix-code-box">
              <code>${lvl.solution.replace(/\n/g, '<br>')}</code>
            </div>
            <div class="matrix-card-actions">
              <button type="button" class="matrix-btn-jump" data-level="${idx}">
                <span>🚀 Inspect Level</span>
              </button>
              <button type="button" class="matrix-btn-copy" data-solution="${encodeURIComponent(lvl.solution)}">
                <span>📋 Copy</span>
              </button>
            </div>
          </div>
        `;

        // Image click -> Lightbox
        const imgWrap = card.querySelector('.matrix-img-wrapper');
        imgWrap.addEventListener('click', () => {
          openLightbox(idx);
        });

        // Jump button
        const jumpBtn = card.querySelector('.matrix-btn-jump');
        jumpBtn.addEventListener('click', () => {
          loadLevel(idx);
          const explorerSection = document.getElementById('gardenLevelExplorer');
          if (explorerSection) {
            explorerSection.scrollIntoView({ behavior: 'smooth' });
          }
        });

        // Copy button
        const matCopyBtn = card.querySelector('.matrix-btn-copy');
        matCopyBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const codeToCopy = decodeURIComponent(matCopyBtn.getAttribute('data-solution'));
          navigator.clipboard.writeText(codeToCopy).then(() => {
            matCopyBtn.textContent = '✓ Copied!';
            setTimeout(() => { matCopyBtn.textContent = '📋 Copy'; }, 1500);
          });
        });

        solutionsMatrix.appendChild(card);
      });
    }

    // 9. Lightbox Modal Functions
    function openLightbox(index) {
      if (!lightboxModal || !lightboxImg) return;
      const lvl = GRID_GARDEN_LEVELS[index];
      state.currentLevelIndex = index;

      lightboxImg.src = lvl.image;
      lightboxImg.alt = lvl.title;
      if (lightboxCaption) {
        lightboxCaption.innerHTML = `
          <strong>Level ${lvl.level} of 28:</strong> ${lvl.concept} — 
          <code style="background: rgba(255,255,255,0.15); padding: 2px 6px; border-radius: 4px;">${lvl.solution.replace(/\n/g, ' ')}</code>
        `;
      }
      lightboxModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      if (!lightboxModal) return;
      lightboxModal.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (zoomBtn) {
      zoomBtn.addEventListener('click', () => {
        openLightbox(state.currentLevelIndex);
      });
    }

    if (levelScreenshot) {
      levelScreenshot.addEventListener('click', () => {
        openLightbox(state.currentLevelIndex);
      });
    }

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxModal) {
      lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) closeLightbox();
      });
    }

    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        if (state.currentLevelIndex > 0) {
          openLightbox(state.currentLevelIndex - 1);
        }
      });
    }

    if (lightboxNext) {
      lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        if (state.currentLevelIndex < GRID_GARDEN_LEVELS.length - 1) {
          openLightbox(state.currentLevelIndex + 1);
        }
      });
    }

    // Keyboard navigation (Arrow keys & Escape)
    document.addEventListener('keydown', (e) => {
      if (lightboxModal && lightboxModal.classList.contains('open')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft' && state.currentLevelIndex > 0) openLightbox(state.currentLevelIndex - 1);
        if (e.key === 'ArrowRight' && state.currentLevelIndex < GRID_GARDEN_LEVELS.length - 1) openLightbox(state.currentLevelIndex + 1);
      }
    });

    // Initial Execution
    renderPills();
    loadLevel(0);
    renderSolutionsMatrix();
  });
})();
