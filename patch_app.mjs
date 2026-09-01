import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

const importStr = "import { auth, db } from './lib/firebase';";
const newImportStr = "import { auth, db, isConfigured } from './lib/firebase';\nimport { AlertCircle } from 'lucide-react';";

content = content.replace(importStr, newImportStr);

const errorScreen = `
  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-3xl font-bold mb-4">Configuration Missing</h1>
        <p className="text-gray-400 max-w-lg mb-8">
          The application cannot start because the Firebase and Gemini environment variables are missing.
        </p>
        <div className="bg-[#151619] border border-white/10 p-6 rounded-2xl text-left max-w-2xl w-full">
          <h2 className="text-xl font-bold text-orange-500 mb-4">How to fix this in Vercel:</h2>
          <ol className="list-decimal pl-5 space-y-3 text-gray-300">
            <li>Go to your project in the Vercel Dashboard.</li>
            <li>Navigate to <strong>Settings</strong> &gt; <strong>Environment Variables</strong>.</li>
            <li>Add all the <code>VITE_FIREBASE_*</code> variables listed in your <code>.env.example</code> file with their correct values.</li>
            <li>Add your <code>GEMINI_API_KEY</code> variable.</li>
            <li>Go to <strong>Deployments</strong> and redeploy your latest build.</li>
          </ol>
        </div>
      </div>
    );
  }
`;

// Insert the error screen at the top of the App component return/render logic.
// Find `if (isAuthLoading) {`
content = content.replace('if (isAuthLoading) {', errorScreen + '\n  if (isAuthLoading) {');

fs.writeFileSync('src/App.tsx', content);
console.log("App.tsx updated");
