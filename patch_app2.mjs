import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "import { auth } from './lib/firebase';",
  "import { auth, isConfigured } from './lib/firebase';\nimport { AlertCircle } from 'lucide-react';"
);

fs.writeFileSync('src/App.tsx', content);
console.log("App.tsx fixed");
