/**
 * QuizMaster Pro - PDF Report Generator
 * Executive-grade vector PDF report generator.
 * Self-contained, zero-dependency on external autotable plugins.
 * Supports multi-page flow, candidate metadata, category tables,
 * question-by-question review, and multi-tier download fallbacks.
 */

class PDFReportGenerator {
  constructor() {
    this.isGenerating = false;
  }

  /**
   * Resolves the jsPDF constructor from any global scope.
   */
  getJsPDFConstructor() {
    if (typeof window !== "undefined") {
      if (window.jspdf && window.jspdf.jsPDF) return window.jspdf.jsPDF;
      if (window.jsPDF) return window.jsPDF;
    }
    if (typeof global !== "undefined") {
      if (global.window && global.window.jspdf && global.window.jspdf.jsPDF) {
        return global.window.jspdf.jsPDF;
      }
    }
    return null;
  }

  /**
   * Generates and downloads the PDF report based on quiz results state.
   * @param {Object} reportData
   */
  async generateReport(reportData) {
    if (this.isGenerating) return { success: false, error: "Already generating" };
    this.isGenerating = true;

    try {
      const jsPDF = this.getJsPDFConstructor();
      if (!jsPDF) {
        throw new Error("jsPDF library constructor is not available in the global scope.");
      }

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4" // 595.28 x 841.89 pt
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 40;
      const contentWidth = pageWidth - (margin * 2);
      let currentY = margin;

      // Color Palette for PDF
      const colors = {
        primary: [99, 102, 241],     // #6366F1 Indigo
        primaryDark: [67, 56, 202],  // #4338CA Deep Indigo
        violet: [139, 92, 246],      // #8B5CF6 Electric Violet
        dark: [23, 32, 51],          // #172033
        grayText: [100, 116, 139],   // #64748B
        lightBg: [248, 250, 252],    // #F8FAFC
        border: [226, 232, 240],     // #E2E8F0
        success: [16, 185, 129],     // #10B981 Emerald
        danger: [244, 63, 94],       // #F43F5E Rose
        warning: [245, 158, 11]      // #F59E0B Amber
      };

      // Helper: Check page overflow and add new page
      const checkPageBreak = (neededHeight = 40) => {
        if (currentY + neededHeight > pageHeight - margin - 35) {
          doc.addPage();
          currentY = margin + 15;
          drawSubHeader();
        }
      };

      // Helper: Header for subsequent pages
      const drawSubHeader = () => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...colors.grayText);
        doc.text("QUIZMASTER PRO  |  OFFICIAL RESULTS REPORT", margin, currentY);
        doc.text(reportData.dateFormatted || new Date().toLocaleDateString(), pageWidth - margin, currentY, { align: "right" });
        currentY += 10;
        doc.setDrawColor(...colors.border);
        doc.setLineWidth(0.5);
        doc.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 18;
      };

      // ==========================================
      // 1. BRAND HEADER & REPORT TITLE
      // ==========================================
      // Top Accent Bar
      doc.setFillColor(...colors.primary);
      doc.rect(0, 0, pageWidth, 7, 'F');

      // Brand Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(...colors.primaryDark);
      doc.text("QUIZMASTER", margin, currentY + 16);
      
      const logoTextWidth = doc.getTextWidth("QUIZMASTER");
      doc.setFontSize(9.5);
      doc.setFillColor(...colors.primary);
      doc.roundedRect(margin + logoTextWidth + 6, currentY + 3, 32, 16, 3, 3, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text("PRO", margin + logoTextWidth + 13, currentY + 14);

      // Institution & Course Details on Right
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...colors.grayText);
      doc.text("Department of Computer Science", pageWidth - margin, currentY + 4, { align: "right" });
      doc.text("CSC336 Web Technologies — Assignment 2", pageWidth - margin, currentY + 16, { align: "right" });

      currentY += 30;
      doc.setDrawColor(...colors.border);
      doc.setLineWidth(0.8);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 18;

      // Candidate & Session Summary Box
      doc.setFillColor(...colors.lightBg);
      doc.roundedRect(margin, currentY, contentWidth, 50, 5, 5, 'F');
      doc.setDrawColor(...colors.border);
      doc.roundedRect(margin, currentY, contentWidth, 50, 5, 5, 'D');

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(...colors.dark);
      doc.text("Official Quiz Performance & Learning Report", margin + 14, currentY + 20);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...colors.grayText);
      const studentLabel = reportData.studentName ? `Candidate: ${reportData.studentName}` : "Candidate: Anonymous Student";
      const regLabel = reportData.studentRegNo ? `Reg No: ${reportData.studentRegNo}` : "";
      const metaLine = [studentLabel, regLabel, `Topic: ${reportData.topic || 'Web Technologies'}`, `Date: ${reportData.dateFormatted}`].filter(Boolean).join("   •   ");
      doc.text(metaLine, margin + 14, currentY + 37);

      currentY += 64;

      // ==========================================
      // 2. EXECUTIVE METRICS DASHBOARD
      // ==========================================
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(...colors.dark);
      doc.text("EXECUTIVE PERFORMANCE SUMMARY", margin, currentY);
      currentY += 10;

      const cardWidth = (contentWidth - 30) / 4;
      const cardHeight = 52;
      const accuracyCol = reportData.accuracy >= 75 ? colors.success : (reportData.accuracy >= 50 ? colors.warning : colors.danger);

      const metricCards = [
        { label: "FINAL SCORE", value: `${reportData.score} / ${reportData.totalQuestions}`, color: colors.primaryDark },
        { label: "ACCURACY", value: `${reportData.accuracy}%`, color: accuracyCol },
        { label: "CORRECT / TOTAL", value: `${reportData.correctCount} Correct (${reportData.incorrectCount} Err)`, color: colors.dark },
        { label: "TIME TAKEN", value: reportData.timeTakenFormatted, color: colors.dark }
      ];

      metricCards.forEach((card, index) => {
        const xPos = margin + (index * (cardWidth + 10));
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(xPos, currentY, cardWidth, cardHeight, 4, 4, 'F');
        doc.setDrawColor(...colors.border);
        doc.roundedRect(xPos, currentY, cardWidth, cardHeight, 4, 4, 'D');

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(...colors.grayText);
        doc.text(card.label, xPos + 10, currentY + 16);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(...card.color);
        doc.text(card.value, xPos + 10, currentY + 37);
      });

      currentY += cardHeight + 12;

      // Performance Feedback Banner
      doc.setFillColor(243, 244, 246);
      doc.roundedRect(margin, currentY, contentWidth, 30, 4, 4, 'F');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(...colors.primaryDark);
      doc.text("Assessment:", margin + 12, currentY + 19);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...colors.dark);
      const perfMsgLines = doc.splitTextToSize(reportData.performanceMessage || "Good performance.", contentWidth - 95);
      doc.text(perfMsgLines[0] || "", margin + 85, currentY + 19);

      currentY += 40;

      // ==========================================
      // 3. NATIVE VECTOR CATEGORY TABLE
      // ==========================================
      if (reportData.categories && reportData.categories.length > 0) {
        checkPageBreak(80);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10.5);
        doc.setTextColor(...colors.dark);
        doc.text("KNOWLEDGE AREA BREAKDOWN", margin, currentY);
        currentY += 10;

        const colWidths = [155, 80, 80, 95, 105];
        const colHeaders = ["Category", "Questions", "Correct", "Accuracy", "Proficiency Level"];
        const rowHeight = 18;

        // Header Row
        doc.setFillColor(...colors.primaryDark);
        doc.rect(margin, currentY, contentWidth, rowHeight, 'F');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);

        let colX = margin + 8;
        colHeaders.forEach((h, hIdx) => {
          doc.text(h, colX, currentY + 12);
          colX += colWidths[hIdx];
        });
        currentY += rowHeight;

        // Category Rows
        reportData.categories.forEach((cat, rIdx) => {
          if (rIdx % 2 === 1) {
            doc.setFillColor(248, 250, 252);
            doc.rect(margin, currentY, contentWidth, rowHeight, 'F');
          }
          doc.setDrawColor(...colors.border);
          doc.setLineWidth(0.5);
          doc.rect(margin, currentY, contentWidth, rowHeight, 'D');

          const profLevel = cat.accuracy >= 80 ? "Proficient" : (cat.accuracy >= 50 ? "Competent" : "Needs Review");
          const rowData = [cat.name, `${cat.total}`, `${cat.correct}`, `${cat.accuracy}%`, profLevel];

          let rColX = margin + 8;
          rowData.forEach((val, cIdx) => {
            if (cIdx === 4) {
              doc.setFont("helvetica", "bold");
              doc.setFontSize(8);
              if (cat.accuracy >= 80) doc.setTextColor(...colors.success);
              else if (cat.accuracy >= 50) doc.setTextColor(...colors.primaryDark);
              else doc.setTextColor(...colors.danger);
            } else {
              doc.setFont("helvetica", "normal");
              doc.setFontSize(8);
              doc.setTextColor(...colors.dark);
            }
            doc.text(val, rColX, currentY + 12);
            rColX += colWidths[cIdx];
          });

          currentY += rowHeight;
        });

        currentY += 20;
      }

      // ==========================================
      // 4. DETAILED QUESTION-BY-QUESTION REVIEW
      // ==========================================
      checkPageBreak(70);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(...colors.dark);
      doc.text("COMPREHENSIVE QUESTION REVIEW & EXPLANATIONS", margin, currentY);
      currentY += 12;

      reportData.questions.forEach((q, idx) => {
        const isCorrect = q.userAnswerId === q.correctOptionId;
        const isUnanswered = !q.userAnswerId;

        const qLines = doc.splitTextToSize(`Q${idx + 1}. [${q.category}] ${q.question}`, contentWidth - 95);
        const explLines = doc.splitTextToSize(`Explanation: ${q.explanation}`, contentWidth - 28);

        const userOption = q.options.find(o => o.id === q.userAnswerId);
        const correctOption = q.options.find(o => o.id === q.correctOptionId);

        const userAnsText = userOption ? `${userOption.id.toUpperCase()}) ${userOption.text}` : "None (Skipped)";
        const userAnsLines = doc.splitTextToSize(userAnsText, contentWidth - 120);
        const correctAnsText = correctOption ? `${correctOption.id.toUpperCase()}) ${correctOption.text}` : "";
        const correctAnsLines = isCorrect ? [] : doc.splitTextToSize(correctAnsText, contentWidth - 120);

        const estimatedHeight = 48 + (qLines.length * 11) + (userAnsLines.length * 10) + (correctAnsLines.length * 10) + (explLines.length * 9.5);

        checkPageBreak(estimatedHeight);

        const statusColor = isCorrect ? colors.success : (isUnanswered ? colors.grayText : colors.danger);

        // Card container
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(margin, currentY, contentWidth, estimatedHeight, 4, 4, 'F');
        doc.setDrawColor(...statusColor);
        doc.setLineWidth(0.8);
        doc.roundedRect(margin, currentY, contentWidth, estimatedHeight, 4, 4, 'D');

        let innerY = currentY + 15;

        // Status pill & Question title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(...statusColor);
        const statusBadge = isCorrect ? "CORRECT" : (isUnanswered ? "UNANSWERED" : "INCORRECT");
        doc.text(`[${statusBadge}]`, margin + 10, innerY);

        doc.setTextColor(...colors.dark);
        doc.text(qLines, margin + 85, innerY);
        innerY += (qLines.length * 11) + 6;

        // User Selection vs Correct Answer
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(...colors.grayText);
        doc.text("Candidate Answer:", margin + 10, innerY);
        doc.setFont("helvetica", "normal");
        const candidateChoiceColor = isCorrect ? colors.success : colors.danger;
        doc.setTextColor(...candidateChoiceColor);
        doc.text(userAnsLines, margin + 100, innerY);
        innerY += Math.max(11, userAnsLines.length * 10) + 2;

        if (!isCorrect) {
          doc.setFont("helvetica", "bold");
          doc.setTextColor(...colors.grayText);
          doc.text("Correct Answer:", margin + 10, innerY);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(...colors.success);
          doc.text(correctAnsLines, margin + 100, innerY);
          innerY += Math.max(11, correctAnsLines.length * 10) + 2;
        }

        innerY += 4;

        // Educational Explanation Box
        const explBoxHeight = (explLines.length * 9.5) + 8;
        doc.setFillColor(...colors.lightBg);
        doc.rect(margin + 8, innerY, contentWidth - 16, explBoxHeight, 'F');
        doc.setFont("helvetica", "italic");
        doc.setFontSize(7.5);
        doc.setTextColor(...colors.grayText);
        doc.text(explLines, margin + 14, innerY + 9);

        currentY += estimatedHeight + 10;
      });

      // ==========================================
      // 5. FOOTER & PAGE NUMBERING
      // ==========================================
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(...colors.grayText);
        doc.setDrawColor(...colors.border);
        doc.setLineWidth(0.5);
        doc.line(margin, pageHeight - 26, pageWidth - margin, pageHeight - 26);
        
        doc.text("QuizMaster Pro — Interactive Educational Quiz Platform", margin, pageHeight - 14);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 14, { align: "right" });
      }

      // Dynamic Filename
      const dateStr = new Date().toISOString().slice(0, 10);
      const filename = `QuizMaster_Results_${dateStr}.pdf`;

      // Multi-tier reliable download execution
      let downloaded = false;
      try {
        doc.save(filename);
        downloaded = true;
      } catch (saveErr) {
        console.warn("doc.save() threw error, trying Blob URL fallback:", saveErr);
      }

      if (!downloaded && typeof window !== "undefined" && window.URL && window.URL.createObjectURL) {
        try {
          const blob = doc.output("blob");
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = filename;
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();
          setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
          }, 2000);
          downloaded = true;
        } catch (blobErr) {
          console.warn("Blob download fallback failed:", blobErr);
        }
      }

      return { success: true, filename };
    } catch (err) {
      console.error("PDF generation critical error:", err);
      return { success: false, error: err.message };
    } finally {
      this.isGenerating = false;
    }
  }
}

const pdfGenerator = new PDFReportGenerator();

if (typeof window !== "undefined") {
  window.pdfGenerator = pdfGenerator;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { PDFReportGenerator, pdfGenerator };
}
