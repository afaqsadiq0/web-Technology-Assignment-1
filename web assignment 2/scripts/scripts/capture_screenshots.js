/**
 * QuizMaster Pro - Screenshot Capture & Automation Engine
 * Uses puppeteer-core to capture authentic screenshots of every section & component.
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots');
const APP_URL = 'http://localhost:3000/';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function captureAllSections() {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  console.log('Launching headless Chrome for screenshot capture...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--window-size=1366,900'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 900, deviceScaleFactor: 2 });

  console.log(`Navigating to ${APP_URL}...`);
  await page.goto(APP_URL, { waitUntil: 'networkidle0' });
  await sleep(1500); // Allow typewriter and fonts to stabilize

  // 1. Hero & Welcome Screen
  console.log('1. Capturing Hero Section...');
  const heroEl = await page.$('.hero-section');
  if (heroEl) {
    await heroEl.screenshot({ path: path.join(SCREENSHOT_DIR, '01_hero_welcome.png') });
  }

  // 2. Features Section
  console.log('2. Capturing Features Section...');
  const featuresEl = await page.$('.features-section');
  if (featuresEl) {
    await page.evaluate(() => document.querySelector('.features-section').scrollIntoView());
    await sleep(400);
    await featuresEl.screenshot({ path: path.join(SCREENSHOT_DIR, '02_features_section.png') });
  }

  // 3. How It Works Section
  console.log('3. Capturing How It Works Section...');
  const workflowEl = await page.$('.workflow-section');
  if (workflowEl) {
    await page.evaluate(() => document.querySelector('.workflow-section').scrollIntoView());
    await sleep(400);
    await workflowEl.screenshot({ path: path.join(SCREENSHOT_DIR, '03_how_it_works.png') });
  }

  // 4. Academic Footer
  console.log('4. Capturing Academic Footer...');
  const footerEl = await page.$('.qm-footer');
  if (footerEl) {
    await page.evaluate(() => document.querySelector('.qm-footer').scrollIntoView());
    await sleep(300);
    await footerEl.screenshot({ path: path.join(SCREENSHOT_DIR, '10_academic_footer.png') });
  }

  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(400);

  // 5. Quiz Setup Modal
  console.log('5. Capturing Quiz Setup Modal...');
  await page.click('#btn-start-challenge');
  await sleep(700);
  const configModalContent = await page.$('#configModal .modal-content');
  if (configModalContent) {
    await configModalContent.screenshot({ path: path.join(SCREENSHOT_DIR, '04_setup_modal.png') });
  }

  // 6. Start Quiz & Capture Active Quiz Screen
  console.log('6. Starting Quiz and capturing Question Screen...');
  await page.click('#btn-confirm-start-quiz');
  await sleep(1000);
  const quizActiveWrap = await page.$('.quiz-active-wrapper');
  if (quizActiveWrap) {
    await quizActiveWrap.screenshot({ path: path.join(SCREENSHOT_DIR, '05_active_quiz.png') });
  }

  // 7. Answer Question & Capture Instant Feedback
  console.log('7. Selecting Answer and capturing Instant Feedback...');
  const firstOption = await page.$('.option-card');
  if (firstOption) {
    await firstOption.click();
    await sleep(600);
    const questionPanel = await page.$('.question-panel');
    if (questionPanel) {
      await questionPanel.screenshot({ path: path.join(SCREENSHOT_DIR, '06_instant_feedback.png') });
    }
  }

  // Answer 2 more questions to have good sample progress
  await page.click('#btn-next-question');
  await sleep(400);
  const secondOption = await page.$('.option-card');
  if (secondOption) {
    await secondOption.click();
    await sleep(400);
  }

  // 8. Capture Exit Quiz Early Modal
  console.log('8. Capturing Exit Quiz Modal...');
  await page.click('#btn-quiz-back');
  await sleep(600);
  const exitModalContent = await page.$('#exitQuizModal .modal-content');
  if (exitModalContent) {
    await exitModalContent.screenshot({ path: path.join(SCREENSHOT_DIR, '07_exit_modal.png') });
  }

  // 9. Save & Get PDF -> Switch to Results Dashboard
  console.log('9. Finalizing quiz and capturing Results Dashboard...');
  await page.click('#btn-exit-save-results');
  await sleep(1200);
  const resultsWrap = await page.$('.results-wrapper');
  if (resultsWrap) {
    await resultsWrap.screenshot({ path: path.join(SCREENSHOT_DIR, '08_results_dashboard.png') });
  }

  // 10. Capture Detailed Answer Review Screen
  console.log('10. Capturing Answer Review Screen...');
  await page.click('#btn-review-answers');
  await sleep(1000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(300);
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, '09_answer_review.png'),
    clip: { x: 180, y: 70, width: 1006, height: 720 }
  });

  await browser.close();
  console.log('All 10 section screenshots successfully captured in screenshots/ directory!');
}

captureAllSections().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
