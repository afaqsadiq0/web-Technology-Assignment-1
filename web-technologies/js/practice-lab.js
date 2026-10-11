/**
 * WEB TECHNOLOGIES - CSC336
 * Lecture 08: Practice Questions Interactive Laboratory (Q1 to Q15)
 * Developed by: Muhammad Afaq (FA23-BSE-012)
 * Dynamic Filtering, Fast Jump Pills, Axis Flippers & CSS Property Demonstrators
 */

document.addEventListener('DOMContentLoaded', () => {

  // ---------------------------------------------------------------------------
  // 1. Category Filter Tabs (All, Flexbox, Grid, Comparison)
  // ---------------------------------------------------------------------------
  const filterButtons = document.querySelectorAll('.practice-filter-btn');
  const practiceCards = document.querySelectorAll('.practice-card');
  const gridSectionDivider = document.getElementById('grid-questions-start');

  if (filterButtons.length > 0 && practiceCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetCategory = btn.getAttribute('data-filter');

        // Update active filter button
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter cards visibility (supports multiple space-separated categories)
        practiceCards.forEach(card => {
          const cardCategories = (card.getAttribute('data-category') || '').split(' ');
          if (targetCategory === 'all' || cardCategories.includes(targetCategory)) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });

        // Toggle Grid section divider visibility
        if (gridSectionDivider) {
          if (targetCategory === 'flexbox') {
            gridSectionDivider.style.display = 'none';
          } else {
            gridSectionDivider.style.display = 'flex';
          }
        }

        // Auto-scroll to relevant section if Grid is selected
        if (targetCategory === 'grid' && gridSectionDivider) {
          gridSectionDivider.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (targetCategory === 'flexbox') {
          const firstFlexCard = document.getElementById('pq1');
          if (firstFlexCard) firstFlexCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 2. Fast Jump Pills with Smooth Scroll & Pulse Highlight
  // ---------------------------------------------------------------------------
  const pillLinks = document.querySelectorAll('.practice-pill-link');
  pillLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetCard = document.querySelector(targetId);
        if (targetCard) {
          // If category filter hid it, switch back to 'all'
          const currentFilter = document.querySelector('.practice-filter-btn.active');
          if (currentFilter && currentFilter.getAttribute('data-filter') !== 'all') {
            const allBtn = document.querySelector('.practice-filter-btn[data-filter="all"]');
            if (allBtn) allBtn.click();
          }

          targetCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
          targetCard.classList.add('is-highlighted');
          setTimeout(() => {
            targetCard.classList.remove('is-highlighted');
          }, 2000);
        }
      }
    });
  });

  // ---------------------------------------------------------------------------
  // 3. Question 03: Main Axis vs. Cross Axis Live Toggle
  // ---------------------------------------------------------------------------
  const q3Container = document.getElementById('demoContainerQ3');
  const q3BtnRow = document.getElementById('q3BtnRow');
  const q3BtnCol = document.getElementById('q3BtnCol');
  const q3MainLabel = document.getElementById('q3MainLabel');
  const q3CrossLabel = document.getElementById('q3CrossLabel');
  const q3FooterNote = document.getElementById('q3FooterNote');

  if (q3Container && q3BtnRow && q3BtnCol) {
    q3BtnRow.addEventListener('click', () => {
      q3Container.classList.remove('is-column');
      q3Container.classList.add('is-row');
      q3BtnRow.classList.add('active');
      q3BtnCol.classList.remove('active');
      if (q3MainLabel) q3MainLabel.innerHTML = '↔️ Horizontal (Left &rarr; Right)';
      if (q3CrossLabel) q3CrossLabel.innerHTML = '↕️ Vertical (Top &rarr; Bottom)';
      if (q3FooterNote) q3FooterNote.innerHTML = '<strong>Row Mode:</strong> Main axis is horizontal (justify-content spaces left-to-right). Cross axis is vertical (align-items centers top-to-bottom).';
    });

    q3BtnCol.addEventListener('click', () => {
      q3Container.classList.remove('is-row');
      q3Container.classList.add('is-column');
      q3BtnCol.classList.add('active');
      q3BtnRow.classList.remove('active');
      if (q3MainLabel) q3MainLabel.innerHTML = '↕️ Vertical (Top &rarr; Bottom)';
      if (q3CrossLabel) q3CrossLabel.innerHTML = '↔️ Horizontal (Left &rarr; Right)';
      if (q3FooterNote) q3FooterNote.innerHTML = '<strong>Column Mode:</strong> Main axis has FLIPPED to vertical! Cross axis is now horizontal. justify-content now spaces items vertically!';
    });
  }

  // ---------------------------------------------------------------------------
  // 4. Question 04: Student Dashboard Flex Direction Switcher
  // ---------------------------------------------------------------------------
  const q4Dash = document.getElementById('demoDashQ4');
  const q4BtnCol = document.getElementById('q4BtnCol');
  const q4BtnRow = document.getElementById('q4BtnRow');
  const q4FooterNote = document.getElementById('q4FooterNote');

  if (q4Dash && q4BtnCol && q4BtnRow) {
    q4BtnCol.addEventListener('click', () => {
      q4Dash.classList.remove('is-row');
      q4Dash.classList.add('is-column');
      q4BtnCol.classList.add('active');
      q4BtnRow.classList.remove('active');
      if (q4FooterNote) q4FooterNote.innerHTML = '<strong>Vertical Stack:</strong> flex-direction: column arranges student menu cards top-to-bottom (ideal for mobile viewports).';
    });

    q4BtnRow.addEventListener('click', () => {
      q4Dash.classList.remove('is-column');
      q4Dash.classList.add('is-row');
      q4BtnRow.classList.add('active');
      q4BtnCol.classList.remove('active');
      if (q4FooterNote) q4FooterNote.innerHTML = '<strong>Horizontal Bar:</strong> flex-direction: row positions items side-by-side in a responsive desktop navbar layout.';
    });
  }

  // ---------------------------------------------------------------------------
  // 5. Question 05: Justify-Content Alignment Demonstrator
  // ---------------------------------------------------------------------------
  const q5Container = document.getElementById('demoContainerQ5');
  const q5Buttons = document.querySelectorAll('[data-q5-justify]');
  const q5FooterNote = document.getElementById('q5FooterNote');

  if (q5Container && q5Buttons.length > 0) {
    q5Buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-q5-justify');
        q5Container.style.justifyContent = val;
        q5Buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const descriptions = {
          'flex-start': '<strong>flex-start:</strong> Items are packed tightly to the start of the Main Axis (left edge). Leftover free space is at the far right.',
          'center': '<strong>center:</strong> Items are clustered directly in the middle of the container with equal positive free space on both left and right edges.',
          'space-between': '<strong>space-between:</strong> First button is locked to the far left margin, last button to the far right margin. Free space is divided evenly between items.',
          'space-around': '<strong>space-around:</strong> Each item gets equal space on both sides. The spaces at both container ends are half the size of the space between items.',
          'space-evenly': '<strong>space-evenly:</strong> Every space between any two items and between the edges is exactly identical in pixel measurement.'
        };
        if (q5FooterNote && descriptions[val]) {
          q5FooterNote.innerHTML = descriptions[val];
        }
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 6. Question 06: Align-Items Cross-Axis Demonstrator
  // ---------------------------------------------------------------------------
  const q6Container = document.getElementById('demoContainerQ6');
  const q6Buttons = document.querySelectorAll('[data-q6-align]');
  const q6FooterNote = document.getElementById('q6FooterNote');

  if (q6Container && q6Buttons.length > 0) {
    q6Buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-q6-align');
        q6Container.style.alignItems = val;
        q6Buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Special handling for stretch
        const q6Boxes = q6Container.querySelectorAll('.demo-box-q6');
        if (val === 'stretch') {
          q6Boxes.forEach(box => box.style.height = 'auto');
        } else {
          // Restore original unequal heights
          document.getElementById('q6Box1').style.height = '60px';
          document.getElementById('q6Box2').style.height = '140px';
          document.getElementById('q6Box3').style.height = '95px';
        }

        const descriptions = {
          'flex-start': '<strong>align-items: flex-start:</strong> All boxes align flush against the top edge of the Cross Axis.',
          'center': '<strong>align-items: center:</strong> Boxes are vertically centered along the container\'s cross-axis midpoint.',
          'flex-end': '<strong>align-items: flex-end:</strong> Boxes sink down to touch the bottom boundary of the container.',
          'stretch': '<strong>align-items: stretch:</strong> Boxes with auto height stretch vertically to fill the full 200px container cross-axis track!'
        };
        if (q6FooterNote && descriptions[val]) {
          q6FooterNote.innerHTML = descriptions[val];
        }
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 7. Question 07: Product Gallery Flex-Wrap Toggle
  // ---------------------------------------------------------------------------
  const q7Gallery = document.getElementById('demoGalleryQ7');
  const q7BtnWrap = document.getElementById('q7BtnWrap');
  const q7BtnNoWrap = document.getElementById('q7BtnNoWrap');
  const q7FooterNote = document.getElementById('q7FooterNote');

  if (q7Gallery && q7BtnWrap && q7BtnNoWrap) {
    q7BtnWrap.addEventListener('click', () => {
      q7Gallery.classList.remove('is-nowrap');
      q7Gallery.classList.add('is-wrap');
      q7BtnWrap.classList.add('active');
      q7BtnNoWrap.classList.remove('active');
      if (q7FooterNote) q7FooterNote.innerHTML = '<strong>flex-wrap: wrap:</strong> As screen width shrinks, cards gracefully break onto additional rows without horizontal overflow!';
    });

    q7BtnNoWrap.addEventListener('click', () => {
      q7Gallery.classList.remove('is-wrap');
      q7Gallery.classList.add('is-nowrap');
      q7BtnNoWrap.classList.add('active');
      q7BtnWrap.classList.remove('active');
      if (q7FooterNote) q7FooterNote.innerHTML = '<strong>flex-wrap: nowrap:</strong> All 8 cards are forced onto a single horizontal line, causing squishing or container scroll overflow.';
    });
  }

  // ---------------------------------------------------------------------------
  // 8. Question 14: Grid Line Placement Guide Overlay Toggle
  // ---------------------------------------------------------------------------
  const q14ToggleLinesBtn = document.getElementById('q14ToggleLinesBtn');
  const q14LineOverlay = document.getElementById('q14LineOverlay');

  if (q14ToggleLinesBtn && q14LineOverlay) {
    q14ToggleLinesBtn.addEventListener('click', () => {
      const isActive = q14LineOverlay.classList.toggle('is-active');
      q14ToggleLinesBtn.classList.toggle('active', isActive);
      q14ToggleLinesBtn.innerText = isActive ? '📐 Hide Grid Lines' : '📐 Show Grid Line Indices (1 to 5)';
    });
  }

});
