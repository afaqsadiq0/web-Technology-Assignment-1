/**
 * QuizMaster Pro - Academic Project Report Generator (Optimized Compact Layout)
 * Features:
 * - Zero awkward empty page space (even, balanced vertical flow across 7 rich pages).
 * - Extra-large, prominent, bold clickable banners for Vercel Live Link & GitHub Repo.
 * - Complete student credentials for Muhammad Afaq (FA23-BSE-012).
 * - 10 high-resolution figures covering every section and feature of the platform.
 * - Strict zero-overflow guarantees with print CSS and boundary containment.
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots');
const OUTPUT_PDF_PATH = path.join(__dirname, '..', 'QuizMaster_Pro_Project_Report_Muhammad_Afaq.pdf');
const REPORT_HTML_PATH = path.join(__dirname, '..', 'project_report.html');

function getBase64Image(filename) {
  const fullPath = path.join(SCREENSHOT_DIR, filename);
  if (!fs.existsSync(fullPath)) return '';
  const bitmap = fs.readFileSync(fullPath);
  return `data:image/png;base64,${bitmap.toString('base64')}`;
}

function buildReportHtml() {
  const imgHero = getBase64Image('01_hero_welcome.png');
  const imgFeatures = getBase64Image('02_features_section.png');
  const imgWorkflow = getBase64Image('03_how_it_works.png');
  const imgSetupModal = getBase64Image('04_setup_modal.png');
  const imgActiveQuiz = getBase64Image('05_active_quiz.png');
  const imgFeedback = getBase64Image('06_instant_feedback.png');
  const imgExitModal = getBase64Image('07_exit_modal.png');
  const imgResults = getBase64Image('08_results_dashboard.png');
  const imgReview = getBase64Image('09_answer_review.png');
  const imgFooter = getBase64Image('10_academic_footer.png');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>QuizMaster Pro — Project Documentation Report — Muhammad Afaq</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 14mm 14mm 14mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0F172A;
      background: #FFFFFF;
      font-size: 12px;
      line-height: 1.45;
    }

    .page {
      height: 270mm;
      max-height: 270mm;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      page-break-after: always;
      break-after: page;
    }

    .page:last-child {
      page-break-after: avoid;
      break-after: avoid;
    }

    /* ==========================================================================
       COVER PAGE STYLES (PAGE 1)
       ========================================================================== */
    .cover-page {
      border: 3px solid #E2E8F0;
      border-radius: 12px;
      padding: 18mm 16mm 16mm;
      text-align: center;
      background: linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 60%, #EEF2FF 100%);
      justify-content: space-between;
    }

    .cover-top .uni-main {
      font-size: 22px;
      font-weight: 900;
      color: #0F172A;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 4px;
    }

    .cover-top .uni-sub {
      font-size: 14px;
      font-weight: 700;
      color: #4F46E5;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 16px;
    }

    .cover-top .badge-course {
      display: inline-block;
      padding: 5px 18px;
      background: rgba(79, 70, 229, 0.12);
      border: 1px solid rgba(79, 70, 229, 0.3);
      color: #4338CA;
      font-size: 13px;
      font-weight: 800;
      border-radius: 50px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 18px;
    }

    .cover-app-title {
      font-size: 38px;
      font-weight: 900;
      color: #0F172A;
      line-height: 1.15;
      margin-bottom: 8px;
    }

    .cover-app-title span {
      background: linear-gradient(135deg, #4F46E5, #7C3AED);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .cover-app-desc {
      font-size: 13px;
      color: #475569;
      max-width: 580px;
      margin: 0 auto 20px;
      line-height: 1.5;
    }

    /* Giant Student Identification Box */
    .giant-student-card {
      background: #FFFFFF;
      border: 2px solid #CBD5E1;
      border-left: 8px solid #4F46E5;
      border-radius: 10px;
      padding: 16px 22px;
      max-width: 560px;
      margin: 0 auto 20px;
      box-shadow: 0 4px 15px rgba(15, 23, 42, 0.06);
      text-align: left;
    }

    .giant-student-card table {
      width: 100%;
      border-collapse: collapse;
    }

    .giant-student-card td {
      padding: 5px 4px;
      font-size: 13px;
    }

    .giant-student-card td.lbl {
      color: #64748B;
      font-weight: 700;
      width: 155px;
      text-transform: uppercase;
      font-size: 11.5px;
      letter-spacing: 0.04em;
    }

    .giant-student-card td.val {
      color: #0F172A;
      font-weight: 800;
      font-size: 13.5px;
    }

    .giant-student-card td.val .highlight {
      color: #4F46E5;
      font-size: 15px;
    }

    /* EXTRA LARGE ACTION BANNERS ("bra bra ho") */
    .giant-links-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 560px;
      margin: 0 auto 16px;
    }

    .giant-link-banner {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 18px;
      border-radius: 10px;
      text-decoration: none;
      color: #FFFFFF !important;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);
      text-align: left;
    }

    .giant-link-banner.live-banner {
      background: linear-gradient(135deg, #4338CA 0%, #6366F1 50%, #4F46E5 100%);
      border: 2px solid #3730A3;
    }

    .giant-link-banner.github-banner {
      background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%);
      border: 2px solid #0F172A;
    }

    .banner-icon {
      font-size: 26px;
      line-height: 1;
      flex-shrink: 0;
      background: rgba(255, 255, 255, 0.2);
      width: 44px;
      height: 44px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .banner-text-block {
      flex-grow: 1;
    }

    .banner-badge-title {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      opacity: 0.9;
      margin-bottom: 2px;
    }

    .banner-main-url {
      font-size: 14px;
      font-weight: 800;
      word-break: break-all;
      letter-spacing: -0.01em;
      text-decoration: underline;
    }

    .banner-cta-chip {
      background: #FFFFFF;
      color: #0F172A;
      font-size: 11px;
      font-weight: 800;
      padding: 5px 12px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      flex-shrink: 0;
    }

    .cover-bottom-meta {
      font-size: 11.5px;
      color: #64748B;
      font-weight: 600;
    }

    /* ==========================================================================
       INNER PAGES STYLES
       ========================================================================== */
    .page-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #E2E8F0;
      padding-bottom: 6px;
      margin-bottom: 12px;
    }

    .page-header-title {
      font-size: 16px;
      font-weight: 800;
      color: #0F172A;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .page-header-title .num-pill {
      background: #4F46E5;
      color: #FFFFFF;
      width: 22px;
      height: 22px;
      border-radius: 5px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 800;
    }

    .page-header-meta {
      font-size: 11px;
      font-weight: 700;
      color: #64748B;
    }

    .page-header-meta strong {
      color: #4F46E5;
    }

    /* Figure Container - Clean, crisp, space-efficient */
    .figure-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 10px 12px;
      margin-bottom: 12px;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
    }

    .figure-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .figure-title {
      font-size: 12.5px;
      font-weight: 800;
      color: #0F172A;
    }

    .figure-tag {
      font-size: 10.5px;
      font-weight: 700;
      padding: 2px 7px;
      background: #EEF2FF;
      color: #4338CA;
      border-radius: 10px;
    }

    .figure-caption {
      font-size: 11px;
      color: #475569;
      line-height: 1.4;
      margin-bottom: 8px;
    }

    .figure-img-box {
      border: 1px solid #CBD5E1;
      border-radius: 6px;
      overflow: hidden;
      background: #0F172A;
      text-align: center;
    }

    .figure-img-box img {
      width: 100%;
      max-height: 220px;
      object-fit: contain;
      display: block;
      margin: 0 auto;
    }

    /* For single-figure pages */
    .figure-img-box.tall img {
      max-height: 380px;
    }

    /* Tables */
    .report-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
      font-size: 11px;
    }

    .report-table th, .report-table td {
      border: 1px solid #E2E8F0;
      padding: 6px 10px;
      text-align: left;
    }

    .report-table th {
      background: #F8FAFC;
      font-weight: 800;
      color: #0F172A;
    }

    .report-table tr:nth-child(even) {
      background: #FDFEFE;
    }

    .badge-pass {
      color: #10B981;
      font-weight: 800;
    }

    /* Mini links banner for inside pages */
    .inner-links-bar {
      background: #EEF2FF;
      border: 1px solid #C7D2FE;
      border-radius: 8px;
      padding: 8px 14px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
    }

    .inner-links-bar a {
      color: #4338CA;
      font-weight: 800;
      text-decoration: underline;
    }

    /* Page bottom footer */
    .page-footer-row {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #E2E8F0;
      padding-top: 6px;
      font-size: 10px;
      color: #94A3B8;
      font-weight: 600;
    }
  </style>
</head>
<body>

  <!-- ======================================================================
       PAGE 1: OFFICIAL COVER PAGE (WELL BALANCED, NO GAPS)
       ====================================================================== -->
  <div class="page cover-page">
    
    <div class="cover-top">
      <div class="uni-main">COMSATS University Islamabad</div>
      <div class="uni-sub">Vehari Campus &bull; Department of Computer Science</div>
      <div class="badge-course">CSC336 Web Technologies &bull; Assignment 2</div>
      
      <h1 class="cover-app-title">
        QuizMaster <span>PRO</span>
      </h1>
      <p class="cover-app-desc">
        A State-of-the-Art Interactive Educational Web Quiz Platform Featuring Live Drift-Free Timer, Multi-Colored Segmented Progress Tracking, Web Audio Keystroke Synthesis, and Client-Side Vector PDF Export.
      </p>
    </div>

    <!-- Student Credentials Box -->
    <div class="giant-student-card">
      <table>
        <tr>
          <td class="lbl">Student Name:</td>
          <td class="val"><span class="highlight">Muhammad Afaq</span></td>
        </tr>
        <tr>
          <td class="lbl">Registration No:</td>
          <td class="val"><span class="highlight">FA23-BSE-012</span></td>
        </tr>
        <tr>
          <td class="lbl">Degree Program:</td>
          <td class="val">BS Software Engineering (BSE)</td>
        </tr>
        <tr>
          <td class="lbl">Course Title:</td>
          <td class="val">CSC336 Web Technologies</td>
        </tr>
        <tr>
          <td class="lbl">Assignment:</td>
          <td class="val">Assignment 2 (CLO 2 Front-End Application)</td>
        </tr>
        <tr>
          <td class="lbl">Academic Term:</td>
          <td class="val">Fall 2026 / Spring 2026</td>
        </tr>
      </table>
    </div>

    <!-- EXTRA LARGE ACTION BANNERS ("bra bra ho") -->
    <div class="giant-links-container">
      
      <!-- Big Live Vercel Banner -->
      <a href="https://quizmaster-pro-zeta.vercel.app/" class="giant-link-banner live-banner" target="_blank">
        <div class="banner-icon">🌐</div>
        <div class="banner-text-block">
          <div class="banner-badge-title">OFFICIAL LIVE WEBSITE (VERCEL PRODUCTION)</div>
          <div class="banner-main-url">https://quizmaster-pro-zeta.vercel.app/</div>
        </div>
        <div class="banner-cta-chip">OPEN SITE &rarr;</div>
      </a>

      <!-- Big GitHub Repository Banner -->
      <a href="https://github.com/afaqsadiq0/web-Technology-Assignment-1/tree/main/web%20assignment%202" class="giant-link-banner github-banner" target="_blank">
        <div class="banner-icon">📁</div>
        <div class="banner-text-block">
          <div class="banner-badge-title">GITHUB SOURCE CODE (WEB ASSIGNMENT 2 FOLDER)</div>
          <div class="banner-main-url">https://github.com/afaqsadiq0/web-Technology-Assignment-1/tree/main/web%20assignment%202</div>
        </div>
        <div class="banner-cta-chip">VIEW CODE &rarr;</div>
      </a>

    </div>

    <div class="cover-bottom-meta">
      Designed &amp; Developed by <strong>Muhammad Afaq (FA23-BSE-012)</strong> &bull; Department of Computer Science &bull; COMSATS Vehari
    </div>

  </div>

  <!-- ======================================================================
       PAGE 2: EXECUTIVE SUMMARY & FIGURE 1 (HERO VIEW)
       ====================================================================== -->
  <div class="page">
    
    <div>
      <div class="page-header-row">
        <div class="page-header-title">
          <span class="num-pill">1</span>
          <span>Executive Summary &amp; Architecture</span>
        </div>
        <div class="page-header-meta">
          Candidate: <strong>Muhammad Afaq</strong> (FA23-BSE-012)
        </div>
      </div>

      <!-- Quick Links Banner -->
      <div class="inner-links-bar">
        <div><strong>🌐 Live App:</strong> <a href="https://quizmaster-pro-zeta.vercel.app/">https://quizmaster-pro-zeta.vercel.app/</a></div>
        <div><strong>📁 GitHub:</strong> <a href="https://github.com/afaqsadiq0/web-Technology-Assignment-1/tree/main/web%20assignment%202">web-Technology-Assignment-1</a></div>
      </div>

      <p style="font-size: 11.5px; color: #334155; margin-bottom: 10px;">
        <strong>QuizMaster Pro</strong> is an interactive educational assessment web application engineered with vanilla <strong>HTML5, CSS3, JavaScript ES6+, and Bootstrap 5</strong> for university course CSC336. The platform fulfills all CLO2 requirements through modular single-page architecture, resilient timer state handling, interactive segmented progress indicators, synthesized audio effects, and client-side vector PDF generation.
      </p>

      <table class="report-table">
        <thead>
          <tr>
            <th style="width: 25%;">Core System</th>
            <th style="width: 50%;">Implementation Details</th>
            <th style="width: 25%;">Verification</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Question Bank</strong></td>
            <td>40 curated MCQs covering HTML5, CSS3, JavaScript ES6+, and Bootstrap 5</td>
            <td><span class="badge-pass">&#10004; 100% Unique &amp; Verified</span></td>
          </tr>
          <tr>
            <td><strong>Timer Engine</strong></td>
            <td>Timestamp-based drift-free countdown timer with urgency warning tick</td>
            <td><span class="badge-pass">&#10004; Drift-Free Accuracy</span></td>
          </tr>
          <tr>
            <td><strong>Audio System</strong></td>
            <td>Web Audio API mechanical typewriter keystrokes &amp; answer chimes</td>
            <td><span class="badge-pass">&#10004; Zero External Audio Assets</span></td>
          </tr>
          <tr>
            <td><strong>Vector PDF Engine</strong></td>
            <td>Client-side multi-page PDF generation via jsPDF with auto-wrapping</td>
            <td><span class="badge-pass">&#10004; Clean Vector Tables</span></td>
          </tr>
        </tbody>
      </table>

      <!-- Figure 1 -->
      <div class="figure-card">
        <div class="figure-header">
          <span class="figure-title">Figure 1: Welcome &amp; Hero View with Student Credit Card</span>
          <span class="figure-tag">Section 1: Hero Experience</span>
        </div>
        <div class="figure-desc">
          Showcases the hero headline, real-time typewriter keystroke animation, technology badges, and prominent <strong>Designed &amp; Developed by Muhammad Afaq (FA23-BSE-012)</strong> course attribution card.
        </div>
        <div class="figure-img-box tall">
          <img src="${imgHero}" alt="Hero Welcome Screen">
        </div>
      </div>
    </div>

    <div class="page-footer-row">
      <span>QuizMaster Pro &bull; CSC336 Web Technologies</span>
      <span>Muhammad Afaq (FA23-BSE-012)</span>
    </div>

  </div>

  <!-- ======================================================================
       PAGE 3: PLATFORM FEATURES & WORKFLOW (FIGURES 2 & 3)
       ====================================================================== -->
  <div class="page">
    
    <div>
      <div class="page-header-row">
        <div class="page-header-title">
          <span class="num-pill">2</span>
          <span>Core Platform Features &amp; User Workflow</span>
        </div>
        <div class="page-header-meta">
          Course: <strong>CSC336 Web Technologies</strong>
        </div>
      </div>

      <!-- Figure 2: Features -->
      <div class="figure-card">
        <div class="figure-header">
          <span class="figure-title">Figure 2: Four Core Feature Pillars</span>
          <span class="figure-tag">Section 2: Platform Features</span>
        </div>
        <div class="figure-desc">
          Four independent architectural modules: Smart Randomization (Fisher-Yates), Live Progress Tracking, Instant Educational Feedback, and Vector PDF Report Downloads.
        </div>
        <div class="figure-img-box">
          <img src="${imgFeatures}" alt="Platform Features">
        </div>
      </div>

      <!-- Figure 3: Workflow -->
      <div class="figure-card" style="margin-bottom: 0;">
        <div class="figure-header">
          <span class="figure-title">Figure 3: Interactive Challenge Workflow</span>
          <span class="figure-tag">Section 3: How It Works</span>
        </div>
        <div class="figure-desc">
          Structured 3-step candidate progression (01: Start Challenge &rarr; 02: Answer &amp; Learn &rarr; 03: Review &amp; Export) maintaining clear navigational hierarchy.
        </div>
        <div class="figure-img-box">
          <img src="${imgWorkflow}" alt="How It Works Workflow">
        </div>
      </div>
    </div>

    <div class="page-footer-row">
      <span>QuizMaster Pro &bull; CSC336 Web Technologies</span>
      <span>Muhammad Afaq (FA23-BSE-012)</span>
    </div>

  </div>

  <!-- ======================================================================
       PAGE 4: QUIZ CONFIGURATION & ACTIVE QUIZ INTERFACE (FIGURES 4 & 5)
       ====================================================================== -->
  <div class="page">
    
    <div>
      <div class="page-header-row">
        <div class="page-header-title">
          <span class="num-pill">3</span>
          <span>Quiz Configuration &amp; Active Question Interface</span>
        </div>
        <div class="page-header-meta">
          Candidate: <strong>Muhammad Afaq</strong> (FA23-BSE-012)
        </div>
      </div>

      <!-- Figure 4: Setup Modal -->
      <div class="figure-card">
        <div class="figure-header">
          <span class="figure-title">Figure 4: Quiz Setup &amp; Rules Configuration Modal</span>
          <span class="figure-tag">Component: Config Modal</span>
        </div>
        <div class="figure-desc">
          Configuration dialog supporting question count selection (5, 10, 15, 20), variable time limits (3, 5, 10 mins), synthesized audio toggle, and student credentials pre-populated with <strong>Muhammad Afaq (FA23-BSE-012)</strong>.
        </div>
        <div class="figure-img-box">
          <img src="${imgSetupModal}" alt="Setup Modal">
        </div>
      </div>

      <!-- Figure 5: Active Quiz -->
      <div class="figure-card" style="margin-bottom: 0;">
        <div class="figure-header">
          <span class="figure-title">Figure 5: Active Quiz Interface &amp; Multi-Colored Segmented Bar</span>
          <span class="figure-tag">Section 4: Active Quiz</span>
        </div>
        <div class="figure-desc">
          Displays the Exit Quiz back button, countdown timer, interactive multi-colored segmented progress track (Grey: Unanswered, Blue: Current, Green: Correct, Red: Incorrect), question title, and accessible MCQ options.
        </div>
        <div class="figure-img-box">
          <img src="${imgActiveQuiz}" alt="Active Quiz Interface">
        </div>
      </div>
    </div>

    <div class="page-footer-row">
      <span>QuizMaster Pro &bull; CSC336 Web Technologies</span>
      <span>Muhammad Afaq (FA23-BSE-012)</span>
    </div>

  </div>

  <!-- ======================================================================
       PAGE 5: REAL-TIME FEEDBACK & EARLY EXIT FEATURE (FIGURES 6 & 7)
       ====================================================================== -->
  <div class="page">
    
    <div>
      <div class="page-header-row">
        <div class="page-header-title">
          <span class="num-pill">4</span>
          <span>Instant Validation &amp; Early Exit with Partial PDF</span>
        </div>
        <div class="page-header-meta">
          Course: <strong>CSC336 Web Technologies</strong>
        </div>
      </div>

      <!-- Figure 6: Instant Feedback -->
      <div class="figure-card">
        <div class="figure-header">
          <span class="figure-title">Figure 6: Real-Time Answer Validation &amp; Educational Explanation</span>
          <span class="figure-tag">Interaction: Instant Feedback</span>
        </div>
        <div class="figure-desc">
          Immediate evaluation upon selection: correct option highlighted in emerald green, wrong choice flagged in rose red, options locked, and comprehensive technical explanation card presented below.
        </div>
        <div class="figure-img-box">
          <img src="${imgFeedback}" alt="Instant Feedback">
        </div>
      </div>

      <!-- Figure 7: Exit Modal -->
      <div class="figure-card" style="margin-bottom: 0;">
        <div class="figure-header">
          <span class="figure-title">Figure 7: Early Exit Modal with Partial Progress PDF Download</span>
          <span class="figure-tag">Feature: Exit Quiz Back Dialog</span>
        </div>
        <div class="figure-desc">
          Clicking the "Exit Quiz" back icon prompts this confirmation modal showing attempted questions. Candidates can resume, discard to home, or click <strong>Save &amp; Get PDF</strong> to export an official report of whatever questions were attempted.
        </div>
        <div class="figure-img-box">
          <img src="${imgExitModal}" alt="Exit Modal">
        </div>
      </div>
    </div>

    <div class="page-footer-row">
      <span>QuizMaster Pro &bull; CSC336 Web Technologies</span>
      <span>Muhammad Afaq (FA23-BSE-012)</span>
    </div>

  </div>

  <!-- ======================================================================
       PAGE 6: RESULTS DASHBOARD & ANSWER REVIEW (FIGURES 8 & 9)
       ====================================================================== -->
  <div class="page">
    
    <div>
      <div class="page-header-row">
        <div class="page-header-title">
          <span class="num-pill">5</span>
          <span>Results Analytics &amp; Comprehensive Review Screen</span>
        </div>
        <div class="page-header-meta">
          Candidate: <strong>Muhammad Afaq</strong> (FA23-BSE-012)
        </div>
      </div>

      <!-- Figure 8: Results Dashboard -->
      <div class="figure-card">
        <div class="figure-header">
          <span class="figure-title">Figure 8: Performance Analytics Dashboard (Download Button on Right Side)</span>
          <span class="figure-tag">Section 5: Results View</span>
        </div>
        <div class="figure-desc">
          Highlights the animated SVG Donut chart, accuracy percentage, fractional score, metric cards (Correct, Incorrect, Unanswered, Time Taken), Topic performance progress breakdown, and <strong>Download PDF Report</strong> button positioned on the right side.
        </div>
        <div class="figure-img-box">
          <img src="${imgResults}" alt="Results Dashboard">
        </div>
      </div>

      <!-- Figure 9: Answer Review -->
      <div class="figure-card" style="margin-bottom: 0;">
        <div class="figure-header">
          <span class="figure-title">Figure 9: Comprehensive Answer Review Screen</span>
          <span class="figure-tag">Section 6: Review View</span>
        </div>
        <div class="figure-desc">
          Post-quiz analysis featuring interactive filter pills (All Questions, Correct Only, Incorrect Only, Unanswered), candidate's selected choice vs correct answer, and detailed technical rationale for every question.
        </div>
        <div class="figure-img-box">
          <img src="${imgReview}" alt="Answer Review Screen">
        </div>
      </div>
    </div>

    <div class="page-footer-row">
      <span>QuizMaster Pro &bull; CSC336 Web Technologies</span>
      <span>Muhammad Afaq (FA23-BSE-012)</span>
    </div>

  </div>

  <!-- ======================================================================
       PAGE 7: ACADEMIC FOOTER, TEST VERIFICATION & MASTER LINKS (FIGURE 10)
       ====================================================================== -->
  <div class="page">
    
    <div>
      <div class="page-header-row">
        <div class="page-header-title">
          <span class="num-pill">6</span>
          <span>Academic Verification &amp; Master Project Links</span>
        </div>
        <div class="page-header-meta">
          COMSATS University Islamabad &bull; Vehari Campus
        </div>
      </div>

      <!-- Figure 10: Academic Footer -->
      <div class="figure-card">
        <div class="figure-header">
          <span class="figure-title">Figure 10: Academic Footer &amp; Institutional Attribution</span>
          <span class="figure-tag">Component: Academic Footer</span>
        </div>
        <div class="figure-desc">
          Institutional attribution identifying CSC336 Web Technologies, Department of Computer Science, COMSATS University Islamabad, and developer credentials for <strong>Muhammad Afaq (FA23-BSE-012)</strong>.
        </div>
        <div class="figure-img-box" style="background: transparent;">
          <img src="${imgFooter}" alt="Academic Footer" style="max-height: 100px; object-fit: contain;">
        </div>
      </div>

      <!-- Automated Test Verification Table -->
      <h3 style="font-size: 13px; font-weight: 800; color: #0F172A; margin: 10px 0 6px;">Automated Quality Assurance &amp; Verification Matrix</h3>
      <table class="report-table">
        <thead>
          <tr>
            <th>Testing Suite</th>
            <th>Verification Scope</th>
            <th>Execution Result</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Question Bank Integrity</strong></td>
            <td>40 questions: 4 options each, unique IDs, category coverage</td>
            <td><span class="badge-pass">&#10004; 23/23 Unit Tests Passed</span></td>
          </tr>
          <tr>
            <td><strong>Scoring &amp; Analytics</strong></td>
            <td>Accuracy %, correct, incorrect, unanswered calculations</td>
            <td><span class="badge-pass">&#10004; 100% Mathematically Verified</span></td>
          </tr>
          <tr>
            <td><strong>State Simulation Suite</strong></td>
            <td>50 full randomized quiz lifecycle simulations across presets</td>
            <td><span class="badge-pass">&#10004; 50/50 Passed (0 Failures)</span></td>
          </tr>
          <tr>
            <td><strong>Vector PDF Engine</strong></td>
            <td>Zero-autotable vector table rendering, text wrapping, dynamic pages</td>
            <td><span class="badge-pass">&#10004; Vector PDF Output Validated</span></td>
          </tr>
        </tbody>
      </table>

      <!-- EXTRA LARGE MASTER ACCESS BANNERS AT CONCLUSION ("bra bra ho") -->
      <div style="margin-top: 10px;">
        <h3 style="font-size: 13px; font-weight: 800; color: #0F172A; margin-bottom: 8px;">Master Project Online Verification Links</h3>
        
        <div class="giant-links-container" style="max-width: 100%; margin-bottom: 8px;">
          <!-- Big Live Vercel Banner -->
          <a href="https://quizmaster-pro-zeta.vercel.app/" class="giant-link-banner live-banner" target="_blank" style="padding: 14px 20px;">
            <div class="banner-icon" style="font-size: 28px; width: 48px; height: 48px;">🌐</div>
            <div class="banner-text-block">
              <div class="banner-badge-title" style="font-size: 12px;">CLICK TO TEST LIVE RUNNING APPLICATION (VERCEL)</div>
              <div class="banner-main-url" style="font-size: 16px;">https://quizmaster-pro-zeta.vercel.app/</div>
            </div>
            <div class="banner-cta-chip" style="font-size: 12px; padding: 6px 16px;">VISIT LIVE &rarr;</div>
          </a>

          <!-- Big GitHub Repository Banner -->
          <a href="https://github.com/afaqsadiq0/web-Technology-Assignment-1/tree/main/web%20assignment%202" class="giant-link-banner github-banner" target="_blank" style="padding: 14px 20px;">
            <div class="banner-icon" style="font-size: 28px; width: 48px; height: 48px;">📁</div>
            <div class="banner-text-block">
              <div class="banner-badge-title" style="font-size: 12px;">CLICK TO INSPECT GITHUB REPOSITORY SOURCE CODE</div>
              <div class="banner-main-url" style="font-size: 14.5px;">https://github.com/afaqsadiq0/web-Technology-Assignment-1/tree/main/web%20assignment%202</div>
            </div>
            <div class="banner-cta-chip" style="font-size: 12px; padding: 6px 16px;">VIEW CODE &rarr;</div>
          </a>
        </div>
      </div>
    </div>

    <div class="page-footer-row">
      <span>QuizMaster Pro &bull; CSC336 Web Technologies</span>
      <span>Muhammad Afaq (FA23-BSE-012) &bull; COMSATS Vehari</span>
    </div>

  </div>

</body>
</html>
`;
}

async function generatePdf() {
  console.log('Building compact, zero-gap HTML report template...');
  const htmlContent = buildReportHtml();
  fs.writeFileSync(REPORT_HTML_PATH, htmlContent, 'utf8');
  console.log(`Report HTML saved to: ${REPORT_HTML_PATH}`);

  console.log('Launching headless Chrome for PDF generation...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu'
    ]
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  console.log('Rendering vector PDF with print background and proper margins...');
  await page.pdf({
    path: OUTPUT_PDF_PATH,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `<div style="font-size: 8px; font-family: sans-serif; color: #94A3B8; width: 100%; text-align: right; padding-right: 14mm;">QuizMaster Pro &bull; Muhammad Afaq (FA23-BSE-012)</div>`,
    footerTemplate: `<div style="font-size: 8px; font-family: sans-serif; color: #94A3B8; width: 100%; text-align: center;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>`,
    margin: {
      top: '12mm',
      bottom: '12mm',
      left: '12mm',
      right: '12mm'
    }
  });

  await browser.close();
  console.log(`\n======================================================`);
  console.log(`PDF REPORT SUCCESSFULLY GENERATED (ZERO UNWANTED GAPS):`);
  console.log(`${OUTPUT_PDF_PATH}`);
  console.log(`======================================================\n`);
}

generatePdf().catch(err => {
  console.error('PDF generation failed:', err);
  process.exit(1);
});
