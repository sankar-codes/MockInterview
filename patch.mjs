import fs from 'fs';

let content = fs.readFileSync('src/components/FeedbackDashboard.tsx', 'utf8');

// Add imports
content = content.replace(
  "import { Domain, InterviewQuestion, InterviewFeedback } from '../types';",
  "import { Domain, InterviewQuestion, InterviewFeedback } from '../types';\nimport { jsPDF } from 'jspdf';\nimport html2canvas from 'html2canvas';"
);

// Add Download icon
content = content.replace(
  "RefreshCcw, Volume2, VolumeX, Square, ArrowLeft } from 'lucide-react';",
  "RefreshCcw, Volume2, VolumeX, Square, ArrowLeft, Download, Loader2 } from 'lucide-react';"
);

// Add state
content = content.replace(
  "const [isSpeaking, setIsSpeaking] = useState(false);",
  "const [isSpeaking, setIsSpeaking] = useState(false);\n  const [isExporting, setIsExporting] = useState(false);"
);

// Add download function
const downloadFn = `
  const handleDownloadPDF = async () => {
    setIsExporting(true);
    // Stop speaking if it's currently speaking to avoid issues
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    
    setTimeout(async () => {
      const element = document.getElementById('report-content');
      if (!element) {
        setIsExporting(false);
        return;
      }

      try {
        const canvas = await html2canvas(element, {
          scale: 2,
          backgroundColor: '#0a0a0a',
          useCORS: true,
          logging: false,
          ignoreElements: (node) => {
            return node.classList && node.classList.contains('hide-on-print');
          }
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        // Calculate PDF dimensions (A4 proportion is ~1:1.414)
        // Here we just use the canvas dimensions to make a single long page
        const pdf = new jsPDF({
          orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });

        pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
        pdf.save(\`Interview_Report_\${domain.replace(/[^a-z0-9]/gi, '_')}.pdf\`);
      } catch (error) {
        console.error("Failed to generate PDF:", error);
      } finally {
        setIsExporting(false);
      }
    }, 100);
  };
`;

content = content.replace(
  "const speakSummary = () => {",
  downloadFn + "\n  const speakSummary = () => {"
);

// Add id and hide-on-print classes
content = content.replace(
  '<div className="max-w-6xl mx-auto">',
  '<div className="max-w-6xl mx-auto" id="report-content">'
);

// We need to add the Export button and add hide-on-print to some buttons
const headerButtons = `
          <div className="flex gap-4 hide-on-print">
            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border border-orange-500/20 rounded-xl transition-all disabled:opacity-50"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {isExporting ? 'Generating...' : 'Export PDF'}
            </button>
            <button
              onClick={onRestart}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
            >
              <RefreshCcw className="w-4 h-4" /> New Interview
            </button>
          </div>
`;

content = content.replace(
  /<button\s+onClick=\{onRestart\}\s+className="flex items-center gap-2 px-6 py-3 bg-white\/5 hover:bg-white\/10 border border-white\/10 rounded-xl transition-all"\s*>\s*<RefreshCcw className="w-4 h-4" \/> New Interview\s*<\/button>/m,
  headerButtons
);

content = content.replace(
  '<button \n              onClick={onRestart}',
  '<button \n              onClick={onRestart}\n              className="mt-2 p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all hide-on-print"'
);

// Replace again because of multi-line matching issue on the first button replacement
content = content.replace(
  /className="mt-2 p-2 hover:bg-white\/5 rounded-lg text-gray-400 hover:text-white transition-all"\s+title="Back to Home"/g,
  'className="mt-2 p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all hide-on-print"\n              title="Back to Home"'
);

fs.writeFileSync('src/components/FeedbackDashboard.tsx', content);

