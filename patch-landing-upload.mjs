import fs from 'fs';

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

// Add imports
content = content.replace(
  "import { Domain, InterviewerPersona } from '../types';",
  "import { Domain, InterviewerPersona } from '../types';\nimport * as pdfjsLib from 'pdfjs-dist';\nimport { Upload, File } from 'lucide-react';"
);

// Add worker setup
content = content.replace(
  "const domains:",
  "pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;\n\nconst domains:"
);

// Add loading state
content = content.replace(
  "const textareaRef = React.useRef<HTMLTextAreaElement>(null);",
  "const textareaRef = React.useRef<HTMLTextAreaElement>(null);\n  const [isUploading, setIsUploading] = useState(false);\n  const fileInputRef = React.useRef<HTMLInputElement>(null);"
);

// Add file upload handler
const uploadHandler = `
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\\n';
        }
        
        setResumeOrJD(fullText);
      } else {
        const text = await file.text();
        setResumeOrJD(text);
      }
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Failed to read file. Please try pasting the text directly.');
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
`;

content = content.replace(
  "const handleDomainClick = (domain: Domain) => {",
  uploadHandler + "\n  const handleDomainClick = (domain: Domain) => {"
);

// Replace the textarea area with a combination of upload and textarea
const newUploadArea = `
        <div className="bg-black/30 border border-white/5 rounded-3xl p-6 mb-6">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.txt,.md"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full mb-4 border-2 border-dashed border-white/10 hover:border-orange-500/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 transition-colors group cursor-pointer bg-white/[0.01] hover:bg-orange-500/5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center animate-pulse">
                <Sparkles className="w-6 h-6 text-orange-500 animate-spin" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-orange-500" />
              </div>
            )}
            <div className="text-center">
              <p className="font-bold text-lg">{isUploading ? 'Parsing Document...' : 'Upload Resume / JD'}</p>
              <p className="text-sm text-gray-500 mt-1">Supports PDF, TXT, MD</p>
            </div>
          </button>

          <div className="relative flex items-center py-4 mb-4">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-4 text-gray-600 text-xs uppercase font-mono">or paste text</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          <textarea
            ref={textareaRef}
            value={resumeOrJD}
            onChange={(e) => setResumeOrJD(e.target.value)}
            placeholder="Paste your resume or job description content here..."
            className="w-full bg-black/50 border border-white/10 rounded-2xl p-5 min-h-[150px] focus:outline-none focus:border-orange-500/50 transition-all resize-none text-sm sm:text-base font-mono placeholder:text-gray-700"
          />
        </div>
`;

content = content.replace(
  /<textarea[\s\S]*?className="w-full bg-black\/50 border border-white\/10 rounded-2xl p-5 min-h-\[150px\] focus:outline-none focus:border-orange-500\/50 transition-all resize-none text-sm sm:text-base font-mono mb-6 placeholder:text-gray-700"\s*\/>/,
  newUploadArea
);

fs.writeFileSync('src/components/LandingPage.tsx', content);
