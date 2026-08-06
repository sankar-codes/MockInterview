import fs from 'fs';

let content = fs.readFileSync('src/components/FeedbackDashboard.tsx', 'utf8');

// Add autoTable import
content = content.replace(
  "import { jsPDF } from 'jspdf';",
  "import { jsPDF } from 'jspdf';\nimport autoTable from 'jspdf-autotable';"
);

// Rewrite handleDownloadPDF
const newPdfLogic = `
  const handleDownloadPDF = () => {
    if (!feedback) return;
    setIsExporting(true);
    
    setTimeout(() => {
      try {
        const doc = new jsPDF();
        
        // Title
        doc.setFontSize(22);
        doc.setTextColor(249, 115, 22); // Orange
        doc.text('Interview Performance Report', 14, 20);
        
        // Meta
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(\`Domain: \${domain}\`, 14, 30);
        doc.text(\`Date: \${new Date().toLocaleDateString()}\`, 14, 38);
        
        // Scores
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('Scores', 14, 50);
        
        autoTable(doc, {
          startY: 55,
          head: [['Metric', 'Score']],
          body: [
            ['Overall Score', \`\${feedback.overallScore}/100\`],
            ['Technical Score', \`\${feedback.technicalScore}/100\`],
            ['Communication Score', \`\${feedback.communicationScore}/100\`],
            ['Confidence Score', \`\${feedback.confidenceScore}/100\`]
          ],
          theme: 'grid',
          headStyles: { fillColor: [249, 115, 22] },
        });
        
        // Summary & Readiness
        let nextY = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.setTextColor(249, 115, 22);
        doc.text('Summary', 14, nextY);
        
        doc.setFontSize(11);
        doc.setTextColor(50, 50, 50);
        const summaryLines = doc.splitTextToSize(feedback.summary, 180);
        doc.text(summaryLines, 14, nextY + 8);
        
        nextY += 8 + (summaryLines.length * 6) + 10;
        
        if (feedback.interviewReadiness) {
          doc.setFontSize(14);
          doc.setTextColor(249, 115, 22);
          doc.text('Interview Readiness', 14, nextY);
          
          doc.setFontSize(11);
          doc.setTextColor(50, 50, 50);
          const readinessLines = doc.splitTextToSize(feedback.interviewReadiness, 180);
          doc.text(readinessLines, 14, nextY + 8);
          nextY += 8 + (readinessLines.length * 6) + 10;
        }
        
        // Strengths & Weaknesses
        if (nextY > 250) {
          doc.addPage();
          nextY = 20;
        }
        
        if (feedback.strengths && feedback.strengths.length > 0) {
          doc.setFontSize(14);
          doc.setTextColor(40, 167, 69); // Green
          doc.text('Strengths', 14, nextY);
          
          doc.setFontSize(11);
          doc.setTextColor(50, 50, 50);
          feedback.strengths.forEach((s, i) => {
            const lines = doc.splitTextToSize(\`• \${s}\`, 180);
            doc.text(lines, 14, nextY + 8 + (i * 6));
          });
          nextY += 8 + (feedback.strengths.length * 6) + 10;
        }
        
        if (feedback.weaknesses && feedback.weaknesses.length > 0) {
          if (nextY > 250) { doc.addPage(); nextY = 20; }
          
          doc.setFontSize(14);
          doc.setTextColor(220, 53, 69); // Red
          doc.text('Areas for Improvement', 14, nextY);
          
          doc.setFontSize(11);
          doc.setTextColor(50, 50, 50);
          feedback.weaknesses.forEach((w, i) => {
            const lines = doc.splitTextToSize(\`• \${w}\`, 180);
            doc.text(lines, 14, nextY + 8 + (i * 6));
          });
          nextY += 8 + (feedback.weaknesses.length * 6) + 10;
        }
        
        // Recommended Topics
        if (feedback.recommendedTopics && feedback.recommendedTopics.length > 0) {
          if (nextY > 250) { doc.addPage(); nextY = 20; }
          
          doc.setFontSize(14);
          doc.setTextColor(0, 123, 255); // Blue
          doc.text('Recommended Topics to Study', 14, nextY);
          
          doc.setFontSize(11);
          doc.setTextColor(50, 50, 50);
          feedback.recommendedTopics.forEach((t, i) => {
            const lines = doc.splitTextToSize(\`• \${t}\`, 180);
            doc.text(lines, 14, nextY + 8 + (i * 6));
          });
          nextY += 8 + (feedback.recommendedTopics.length * 6) + 10;
        }
        
        // Detailed Q&A
        doc.addPage();
        doc.setFontSize(18);
        doc.setTextColor(249, 115, 22);
        doc.text('Detailed Q&A Breakdown', 14, 20);
        
        let qaY = 30;
        
        questions.forEach((q, index) => {
          if (qaY > 250) {
            doc.addPage();
            qaY = 20;
          }
          
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 0, 0);
          const qLines = doc.splitTextToSize(\`Q\${index + 1}: \${q.text}\`, 180);
          doc.text(qLines, 14, qaY);
          qaY += (qLines.length * 6) + 4;
          
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.setTextColor(80, 80, 80);
          const aLines = doc.splitTextToSize(\`Your Answer: \${q.userResponse || 'No response'}\`, 180);
          doc.text(aLines, 14, qaY);
          qaY += (aLines.length * 5) + 4;
          
          if (q.aiEvaluation) {
            doc.setTextColor(40, 167, 69); // Greenish
            const fLines = doc.splitTextToSize(\`Feedback: \${q.aiEvaluation}\`, 180);
            doc.text(fLines, 14, qaY);
            qaY += (fLines.length * 5) + 4;
          }
          
          if (q.correctAnswer) {
            doc.setTextColor(0, 123, 255);
            const caLines = doc.splitTextToSize(\`Ideal Answer: \${q.correctAnswer}\`, 180);
            doc.text(caLines, 14, qaY);
            qaY += (caLines.length * 5) + 4;
          }
          
          qaY += 6; // Spacing between questions
        });
        
        doc.save(\`Interview_Report_\${domain.replace(/[^a-z0-9]/gi, '_')}.pdf\`);
      } catch (error) {
        console.error("Failed to generate PDF:", error);
      } finally {
        setIsExporting(false);
      }
    }, 100);
  };`;

content = content.replace(
  /const handleDownloadPDF = async \(\) => \{[\s\S]*?\}, 100\);\n  \};/,
  newPdfLogic
);

fs.writeFileSync('src/components/FeedbackDashboard.tsx', content);
