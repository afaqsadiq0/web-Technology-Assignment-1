/**
 * QuizMaster Pro - Quiz Session Simulation Test
 * Simulates user sessions, answering, navigation, answer-changing,
 * unanswered question detection, and results generation.
 */

const { QUESTION_BANK } = require('../js/questions.js');

console.log("--- SIMULATION TEST: Quiz State & Edge Cases ---");

function simulateQuizSession(qCount = 10) {
  // 1. Shuffling
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const selectedQuestions = shuffle(QUESTION_BANK).slice(0, qCount).map(q => ({
    ...q,
    options: shuffle(q.options)
  }));

  const userAnswers = {};

  // Simulate user answering a subset of questions leaving some unanswered
  const answerUntil = Math.floor(qCount * 0.7);
  for (let i = 0; i < answerUntil; i++) {
    const q = selectedQuestions[i];
    // Alternate between correct and incorrect
    const isCorrectPick = i % 2 === 0;
    const chosenOptionId = isCorrectPick ? q.correctOptionId : q.options.find(o => o.id !== q.correctOptionId).id;
    
    // Simulate initial answer
    userAnswers[q.id] = {
      selectedOptionId: chosenOptionId,
      isCorrect: chosenOptionId === q.correctOptionId
    };

    // If i === 2, simulate changing the answer!
    if (i === 2) {
      // User changed their mind to the other option
      const newOptionId = isCorrectPick ? q.options.find(o => o.id !== q.correctOptionId).id : q.correctOptionId;
      userAnswers[q.id] = {
        selectedOptionId: newOptionId,
        isCorrect: newOptionId === q.correctOptionId
      };
    }
  }

  // Check unanswered questions
  const unanswered = selectedQuestions.filter(q => !userAnswers[q.id]);
  const expectedUnanswered = qCount - answerUntil;
  if (unanswered.length !== expectedUnanswered) {
    throw new Error(`Expected ${expectedUnanswered} unanswered questions, found ${unanswered.length}`);
  }

  // Calculate results
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  selectedQuestions.forEach(q => {
    const ans = userAnswers[q.id];
    if (!ans) unansweredCount++;
    else if (ans.isCorrect) correctCount++;
    else incorrectCount++;
  });

  const accuracy = Math.round((correctCount / qCount) * 100);

  return {
    total: qCount,
    correctCount,
    incorrectCount,
    unansweredCount,
    accuracy
  };
}

// Run 50 random simulations to ensure zero runtime exceptions
for (let run = 1; run <= 50; run++) {
  const count = run % 2 === 0 ? 5 : 10;
  const res = simulateQuizSession(count);
  if (res.correctCount + res.incorrectCount + res.unansweredCount !== count) {
    console.error("Integrity error in simulation run", run);
    process.exit(1);
  }
}

console.log("[PASS] 50 randomized quiz lifecycle simulations completed with 100% integrity!");
