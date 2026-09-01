import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace("import { auth } from './lib/firebase';", "import { auth, isConfigured } from './lib/firebase';");
code = code.replace("import { LogIn,", "import { AlertCircle, LogIn,");
fs.writeFileSync('src/App.tsx', code);
