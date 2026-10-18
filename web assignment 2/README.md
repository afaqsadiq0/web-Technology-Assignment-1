# QUIZMASTER PRO

> **Interactive Educational Quiz Platform for Web Technologies**  
> *Learn Smarter. Challenge Yourself. Grow Every Day.*

---

## Academic Information

- **Institution:** COMSATS University Islamabad, Vehari Campus  
- **Department:** Department of Computer Science  
- **Course:** CSC336 — Web Technologies  
- **Assignment:** Assignment 2 (Fall 2026)  
- **Course Learning Outcome (CLO):** CLO2 — Demonstrate the capabilities for developing professional front-end using client-side technologies (*Bloom's Taxonomy: Applying*)  
- **Instructor:** Ms. Yasmeen Jana  

---

## Project Overview

**QuizMaster Pro** is a modern, single-page educational quiz application engineered for students and developers learning web technologies. Built using **HTML5**, **CSS3**, **JavaScript (ES6+)**, and **Bootstrap 5.3.3**, it delivers the polish of a modern SaaS dashboard with the pedagogical engagement of an interactive learning tool.

The application operates entirely on the client side without requiring any external backend or database, featuring a curated **40-question question bank**, dynamic question and option randomization, an accessible **multi-colored segmented progress bar**, a high-precision drift-free **countdown timer**, instant answer feedback with in-depth explanations, **dark/light theme support**, and **client-side vector PDF report generation**.

---

## Key Features & Assignment Requirements

| Feature Requirement | Implementation Details |
| :--- | :--- |
| **1. Modern Tech Stack** | Developed using HTML5 semantic elements, custom CSS3 design tokens, Vanilla JavaScript (ES6+), and Bootstrap 5.3.3. |
| **2. Multiple-Choice Questions** | Presents curated MCQs with four distinct options, clear visual selection indicators, and accessible keyboard shortcuts. |
| **3. Segmented Progress Bar** | Dynamic horizontal bar with distinct segments corresponding to each question. Visual states: Neutral Gray (Unanswered), Indigo Pulse (Current), Emerald Green (Correct), and Rose Red (Incorrect). Supports direct clickable navigation. |
| **4. Countdown Timer** | End-timestamp based timer (default 5 minutes) resistant to `setInterval` lag and background tab throttling. Features Warning (<60s) and Critical (<15s) visual states, and triggers automatic submission upon expiration. |
| **5. Dynamic Answer Feedback** | Immediate evaluation upon selection: green/red borders, status badges, check/cross icons, and a dedicated educational explanation panel. |
| **6. Dark & Light Theme** | Complete dual-theme system powered by CSS custom properties and `data-bs-theme`. Preference is persisted across sessions in `localStorage`. |
| **7. Real PDF Report Download** | Client-side vector PDF generation using `jsPDF` and `jsPDF-AutoTable`. Generates a multi-page report with candidate details, score summary, category performance table, and detailed question reviews. |
| **8. Randomized Questions** | Unbiased Fisher-Yates algorithm randomizes question order and option positions on every attempt while preserving answer evaluation integrity. Guaranteed zero duplicates. |
| **9. Responsive Design** | Fluid layouts optimized for mobile (320px–480px), tablets (768px), laptops (1024px), and desktop monitors (1440px+). |
| **10. Answer Review Screen** | Post-quiz review screen featuring filter buttons (*All*, *Correct*, *Incorrect*, *Unanswered*), user choice indicators, correct answer highlights, and explanations. |
| **11. Sound Effects (Synthesizer)** | Optional Web Audio API synthesizer for chimes, error tones, countdown ticks, and victory fanfare. Disabled by default per specification. |
| **12. Accessibility (WCAG)** | Semantic tags, `aria-live` announcements, high contrast ratios, visible focus outlines, keyboard navigation (`1-4`, `A-D`, `Arrow Keys`), and `prefers-reduced-motion` support. |

---

## Technology Stack

- **Markup:** HTML5 (Semantic Structure, ARIA attributes)
- **Styling:** CSS3 Custom Properties, Glassmorphism, Flexbox, CSS Grid
- **Framework:** Bootstrap 5.3.3 (Responsive Grid, Modals, Utilities)
- **Icons:** Bootstrap Icons 1.11.3 & Custom Vector SVGs
- **Scripting:** Modern Vanilla JavaScript (ES6+ Classes, Modules, Event Delegation)
- **PDF Engine:** jsPDF v2.5.1 + jsPDF-AutoTable v3.8.2
- **Audio:** Web Audio API (Zero external MP3 dependencies)
- **Runtime / Dev Server:** Node.js v24+ (Built-in HTTP server)

---

## Project Structure

```text
quizmaster-pro/
│
├── index.html              # Main Single-Page Application markup
├── package.json            # Project manifest & npm scripts
├── server.js               # Zero-dependency local Node.js static server
├── .gitignore              # Git ignore rules
├── README.md               # Comprehensive documentation & submission guide
│
├── css/
│   └── style.css           # Custom CSS design system (light/dark tokens, glassmorphism)
│
├── js/
│   ├── questions.js        # 40-question curated bank across 5 curriculum categories
│   ├── audio.js            # Web Audio API sound synthesizer module
│   ├── pdf.js              # Vector PDF report generator (jsPDF & AutoTable)
│   └── app.js              # State engine, timer, DOM manipulation, and event handling
│
├── assets/
│   ├── logo.svg            # Custom QuizMaster Pro brand mark
│   └── favicon.svg         # Browser tab icon
│
└── tests/
    ├── validate.js         # Automated test suite (bank integrity, randomization, scoring)
    └── simulation.js       # Lifecycle simulation test for 50 randomized quiz sessions
```

---

## Installation & Running Locally

### Option 1: Native Node.js Server (Recommended)

1. Clone or download the project folder.
2. Open a terminal / command prompt in the project root directory.
3. Start the local server:
   ```bash
   npm start
   ```
   *Alternatively:*
   ```bash
   node server.js
   ```
4. Open your browser and navigate to:
   ```text
   http://localhost:3000/
   ```

### Option 2: Direct Browser Launch

Because QuizMaster Pro is built as a pure client-side application, you can simply double-click or open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari).

---

## Running the Automated Test Suite

The project includes an automated test and verification suite that verifies question bank integrity, unbiased randomization, scoring precision, and asset availability:

```bash
npm test
```

### Test Suite Output Summary:
- **Test Suite 1 (Question Bank):** Verifies 40 questions, unique IDs, 4 options per question, valid `correctOptionId`, and multi-category coverage.
- **Test Suite 2 (Randomization):** Verifies Fisher-Yates uniqueness and option shuffling integrity.
- **Test Suite 3 (Scoring & Analytics):** Validates accuracy percentage, correct/incorrect calculations, and category statistics.
- **Test Suite 4 (Asset References):** Verifies all CSS, JS, and SVG assets are properly linked and present.
- **Simulation Suite:** Executes 50 randomized quiz sessions testing answering, option changing, and submission detection without errors.

---

## Keyboard Navigation & Accessibility Shortcuts

During an active quiz attempt, the following keyboard controls are active:
- **Select Option A / B / C / D:** Press <kbd>A</kbd>, <kbd>B</kbd>, <kbd>C</kbd>, <kbd>D</kbd> or <kbd>1</kbd>, <kbd>2</kbd>, <kbd>3</kbd>, <kbd>4</kbd>
- **Previous Question:** Press <kbd>&larr;</kbd> (Left Arrow)
- **Next Question:** Press <kbd>&rarr;</kbd> (Right Arrow)
- **Jump to Question:** Focus on any segment cell using <kbd>Tab</kbd> and press <kbd>Enter</kbd> or <kbd>Space</kbd>

---

## Step-by-Step GitHub Upload Instructions

To complete your assignment submission, follow these steps to upload the project to your GitHub account:

1. **Initialize Git Repository:**
   ```bash
   git init
   git add .
   git commit -m "feat: complete QuizMaster Pro interactive quiz web application"
   ```

2. **Create a New Repository on GitHub:**
   - Log in to your GitHub account at [https://github.com](https://github.com).
   - Click the **+** icon in the top right and select **New repository**.
   - Name your repository (e.g., `quizmaster-pro` or `web-technologies-assignment-2`).
   - Leave it **Public** and do **not** check "Initialize with a README" (since we already have one).
   - Click **Create repository**.

3. **Push Local Repository to GitHub:**
   ```bash
   git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/<YOUR-REPO-NAME>.git
   git branch -M main
   git push -u origin main
   ```

4. **Verify Your Repository:**
   - Refresh your GitHub repository page.
   - Confirm that all files (`index.html`, `css/`, `js/`, `assets/`, `README.md`) are present.
   - Copy your repository URL for your assignment report submission.

---

## Required Screenshots for Assignment Report

When assembling your submission PDF report, capture and include screenshots of the following application states:

1. **Welcome Screen:** Two-column hero showing brand identity, badges, and the illustrative preview card.
2. **Quiz Configuration Modal:** Dialog demonstrating question count selection (5/10/15), timer settings, and candidate information inputs.
3. **Active Quiz Screen:** Question view showing live progress badge, countdown timer, question number, and answer cards.
4. **Segmented Progress Bar:** Demonstrating live segment states (Unanswered, Current, Correct, Incorrect).
5. **Instant Feedback (Correct):** Showing emerald feedback banner, checkmark icon, and technical explanation.
6. **Instant Feedback (Incorrect):** Showing rose feedback banner and highlighting the correct answer with explanation.
7. **Dark Mode Interface:** Active quiz and results displayed in the sleek `#090D18` dark theme.
8. **Unanswered Warning Dialog:** Modal alerting the user of remaining unanswered questions before submission.
9. **Results Dashboard:** Score banner with circular SVG accuracy donut chart, 4 metric cards, and category progress bars.
10. **Comprehensive Answer Review:** Review screen showing question cards, filter buttons, and user vs. correct answer markers.
11. **Downloaded PDF Report:** Generated multi-page PDF document showing executive summary, category breakdown table, and question details.
12. **Mobile Viewport:** Demonstrating responsive layout on a smartphone screen size (375px/390px).

---

## Viva / Presentation Defense Guide

Be prepared to answer the following questions during your viva or project presentation:

1. **How does the multi-colored segmented progress bar work?**
   - *Answer:* The segmented bar is rendered dynamically based on the total questions in the session. Each segment has a unique ID and maps to a question index. When an answer is evaluated, the application updates the question's state in `state.userAnswers` and dynamically toggles CSS classes (`unanswered`, `current`, `correct`, `incorrect`) on the corresponding DOM segment.
2. **How do you ensure the countdown timer doesn't drift or freeze when the browser tab is inactive?**
   - *Answer:* Instead of relying solely on `setInterval` ticks (which browsers throttle to once per minute in inactive tabs), the timer calculates remaining time from a fixed target timestamp: `remainingMs = deadlineTime - Date.now()`. This guarantees the countdown accurately reflects real elapsed time regardless of tab backgrounding.
3. **How does question and answer randomization work without corrupting answer keys?**
   - *Answer:* We apply the Fisher-Yates shuffle to the question array, and then individually shuffle each question's `options` array. The `correctOptionId` remains linked to the option object's immutable `id` property (e.g. `'a'`), so regardless of its shuffled display index (`A`, `B`, `C`, or `D`), correctness is evaluated reliably.
4. **How is the client-side PDF generated?**
   - *Answer:* We utilize `jsPDF` and `jsPDF-AutoTable`. The application collects the final state data (candidate info, score, percentage, elapsed time, category stats, and question reviews), calculates page boundaries with `doc.splitTextToSize` and `checkPageBreak`, renders vector styling and tables, and triggers a download via the browser's Blob API.
5. **How does theme switching persist across reloads?**
   - *Answer:* The selected theme (`'light'` or `'dark'`) is saved to `localStorage` under key `'qm_theme'`. On page initialization, `initTheme()` reads this key (or falls back to the system's `prefers-color-scheme`), sets `data-bs-theme` on the `<html>` root, and updates the icon.

---

## License

This project is submitted for academic evaluation for **CSC336 Web Technologies** at **COMSATS University Islamabad, Vehari Campus**. All rights reserved.
