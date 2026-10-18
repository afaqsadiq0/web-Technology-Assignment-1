/**
 * Test PDF Generation Logic
 * Simulates jsPDF environment and executes generateReport to verify zero runtime errors.
 */

const { QUESTION_BANK } = require('../js/questions.js');

// Mock jsPDF class
class MockJSPDF {
  constructor() {
    this.pages = [1];
    this.currentPage = 1;
    this.internal = {
      pageSize: {
        getWidth: () => 595.28,
        getHeight: () => 841.89
      },
      getNumberOfPages: () => this.pages.length
    };
  }
  setFillColor() {}
  rect() {}
  setFont() {}
  setFontSize() {}
  setTextColor() {}
  text() {}
  getTextWidth(txt) { return txt.length * 6; }
  roundedRect() {}
  setDrawColor() {}
  setLineWidth() {}
  line() {}
  addPage() { this.pages.push(this.pages.length + 1); this.currentPage = this.pages.length; }
  setPage(n) { this.currentPage = n; }
  splitTextToSize(txt, maxWidth) {
    // Return array of simulated lines
    const lineCount = Math.max(1, Math.ceil(txt.length / 50));
    return new Array(lineCount).fill("Simulated wrapped line");
  }
  autoTable(config) {
    this.lastAutoTable = { finalY: config.startY + 60 };
  }
  save(filename) {
    this.savedFilename = filename;
  }
}

// Set up global mock
global.window = {
  jspdf: { jsPDF: MockJSPDF }
};

// Load PDFReportGenerator
const { pdfGenerator } = require('../js/pdf.js');

async function testPdfReport() {
  console.log("--- Testing PDF Generation Execution ---");
  const sampleQuestions = QUESTION_BANK.slice(0, 5).map((q, idx) => ({
    ...q,
    userAnswerId: idx === 0 ? q.correctOptionId : (idx === 1 ? q.options.find(o => o.id !== q.correctOptionId).id : null)
  }));

  const sampleReportData = {
    score: 1,
    totalQuestions: 5,
    accuracy: 20,
    correctCount: 1,
    incorrectCount: 1,
    unansweredCount: 3,
    timeTakenFormatted: "01:45",
    timeTakenSeconds: 105,
    performanceMessage: "Keep practicing! Reviewing the detailed explanations will help you build solid confidence.",
    categories: [
      { name: "HTML5", total: 3, correct: 1, accuracy: 33 },
      { name: "CSS3", total: 2, correct: 0, accuracy: 0 }
    ],
    questions: sampleQuestions,
    dateFormatted: "Oct 18, 2026, 12:00 PM",
    studentName: "Muhammad Bilal",
    studentRegNo: "FA23-BSE-042",
    topic: "Web Technologies"
  };

  const result = await pdfGenerator.generateReport(sampleReportData);
  if (result.success) {
    console.log(`[PASS] PDF report generated successfully: ${result.filename}`);
  } else {
    console.error(`[FAIL] PDF generation failed: ${result.error}`);
    process.exit(1);
  }
}

testPdfReport();
