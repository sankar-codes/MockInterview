import fs from 'fs';
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

code = code.replace(
  "import * as pdfjsLib from 'pdfjs-dist';",
  "import * as pdfjsLib from 'pdfjs-dist';\nimport pdfWorkerSrc from 'pdfjs-dist/build/pdf.worker.min.js?url';"
);

code = code.replace(
  "pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;",
  "pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;"
);

fs.writeFileSync('src/components/LandingPage.tsx', code);
