import fs from 'fs';

// 1. Fix geminiService.ts
let code = fs.readFileSync('src/services/geminiService.ts', 'utf8');
code = code.replace(
  /Promise<\{ score: number; feedback: string; correctAnswer\?: string; pronunciationFeedback: string; conceptExplanation\?: string; keyDifferences\?: string \}>/,
  'Promise<{ score: number; feedback: string; correctAnswer?: string; pronunciationFeedback: string; conceptExplanation?: string; keyDifferences?: string; keywords?: string[]; sentiment?: string }>'
);
fs.writeFileSync('src/services/geminiService.ts', code);

// 2. Fix firebase.ts
let firebaseCode = fs.readFileSync('src/firebase.ts', 'utf8');
firebaseCode = firebaseCode.replace(/import\.meta\.env/g, '(import.meta as any).env');
fs.writeFileSync('src/firebase.ts', firebaseCode);

