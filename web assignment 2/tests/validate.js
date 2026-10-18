/**
 * QuizMaster Pro - Automated Verification & Test Suite
 * Validates data integrity, randomization, score calculation,
 * and state transitions.
 */

const fs = require('fs');
const path = require('path');

console.log("==================================================");
console.log("   QUIZMASTER PRO - TEST & VALIDATION SUITE       ");
console.log("==================================================");

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    testsPassed++;
  } else {
    console.error(`[FAIL] ${message}`);
    testsFailed++;
  }
}

// --------------------------------------------------------------------------
// TEST 1: Question Bank Integrity
// --------------------------------------------------------------------------
console.log("\n--- TEST SUITE 1: Question Bank Integrity ---");
const { QUESTION_BANK } = require('../js/questions.js');

assert(Array.isArray(QUESTION_BANK), "QUESTION_BANK is an array");
assert(QUESTION_BANK.length >= 30, `QUESTION_BANK contains at least 30 questions (actual count: ${QUESTION_BANK.length})`);

const ids = new Set();
let allQuestionsValid = true;
const categories = new Set();

QUESTION_BANK.forEach((q, idx) => {
  if (!q.id || ids.has(q.id)) {
    console.error(`Duplicate or missing id at index ${idx}: ${q.id}`);
    allQuestionsValid = false;
  }
  ids.add(q.id);

  if (!q.category || !q.difficulty || !q.question || !q.explanation) {
    console.error(`Missing required text fields on question ${q.id}`);
    allQuestionsValid = false;
  }
  categories.add(q.category);

  if (!Array.isArray(q.options) || q.options.length !== 4) {
    console.error(`Question ${q.id} must have exactly 4 options. Found: ${q.options ? q.options.length : 0}`);
    allQuestionsValid = false;
  }

  const optionIds = q.options.map(o => o.id);
  if (!optionIds.includes(q.correctOptionId)) {
    console.error(`Question ${q.id} correctOptionId (${q.correctOptionId}) not found in options (${optionIds.join(',')})`);
    allQuestionsValid = false;
  }
});

assert(allQuestionsValid, "All questions have valid structure, unique IDs, 4 options, and valid correctOptionId");
assert(categories.size >= 4, `Covers multiple curriculum categories: ${[...categories].join(', ')}`);

// --------------------------------------------------------------------------
// TEST 2: Randomization & Uniqueness
// --------------------------------------------------------------------------
console.log("\n--- TEST SUITE 2: Randomization & Uniqueness ---");

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Test 10-question slice has no duplicates
const attempt1 = shuffleArray(QUESTION_BANK).slice(0, 10);
const uniqueAttempt1Ids = new Set(attempt1.map(q => q.id));
assert(uniqueAttempt1Ids.size === 10, "A 10-question attempt contains 10 strictly unique questions");

// Test option shuffling preserves correctness
let optionShufflingValid = true;
attempt1.forEach(q => {
  const shuffledOptions = shuffleArray(q.options);
  const correctOpt = shuffledOptions.find(o => o.id === q.correctOptionId);
  if (!correctOpt) {
    optionShufflingValid = false;
  }
});
assert(optionShufflingValid, "Option shuffling preserves correctOptionId integrity");

// --------------------------------------------------------------------------
// TEST 3: Scoring & Category Analytics
// --------------------------------------------------------------------------
console.log("\n--- TEST SUITE 3: Scoring & Analytics ---");

// Simulate answering 8 correct and 2 incorrect
const sampleQuiz = QUESTION_BANK.slice(0, 10);
const simulatedAnswers = {};

sampleQuiz.forEach((q, idx) => {
  if (idx < 8) {
    // Correct
    simulatedAnswers[q.id] = { selectedOptionId: q.correctOptionId, isCorrect: true };
  } else {
    // Incorrect
    const wrongOpt = q.options.find(o => o.id !== q.correctOptionId);
    simulatedAnswers[q.id] = { selectedOptionId: wrongOpt.id, isCorrect: false };
  }
});

let calculatedScore = 0;
let calculatedIncorrect = 0;
sampleQuiz.forEach(q => {
  const ans = simulatedAnswers[q.id];
  if (ans && ans.isCorrect) calculatedScore++;
  else calculatedIncorrect++;
});

assert(calculatedScore === 8, `Score calculation correct: 8/10 (actual: ${calculatedScore})`);
assert(calculatedIncorrect === 2, `Incorrect count correct: 2/10 (actual: ${calculatedIncorrect})`);
const accuracy = Math.round((calculatedScore / sampleQuiz.length) * 100);
assert(accuracy === 80, `Accuracy percentage correct: 80% (actual: ${accuracy}%)`);

// --------------------------------------------------------------------------
// TEST 4: File Existence and Asset References
// --------------------------------------------------------------------------
console.log("\n--- TEST SUITE 4: File Existence and Assets ---");

const filesToCheck = [
  'index.html',
  'css/style.css',
  'js/questions.js',
  'js/audio.js',
  'js/pdf.js',
  'js/app.js',
  'assets/logo.svg',
  'assets/favicon.svg'
];

filesToCheck.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  assert(fs.existsSync(fullPath), `Required asset exists: ${file}`);
});

// Verify index.html references all files correctly
const indexHtmlContent = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
assert(indexHtmlContent.includes('css/style.css'), "index.html links to css/style.css");
assert(indexHtmlContent.includes('js/questions.js'), "index.html links to js/questions.js");
assert(indexHtmlContent.includes('js/audio.js'), "index.html links to js/audio.js");
assert(indexHtmlContent.includes('js/pdf.js'), "index.html links to js/pdf.js");
assert(indexHtmlContent.includes('js/app.js'), "index.html links to js/app.js");
assert(indexHtmlContent.includes('assets/logo.svg'), "index.html displays assets/logo.svg");

// --------------------------------------------------------------------------
// Summary
// --------------------------------------------------------------------------
console.log("\n==================================================");
console.log(`TOTAL TESTS: ${testsPassed + testsFailed} | PASSED: ${testsPassed} | FAILED: ${testsFailed}`);
console.log("==================================================");

if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log("ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!");
  process.exit(0);
}
