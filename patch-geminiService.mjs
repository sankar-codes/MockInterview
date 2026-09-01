import fs from 'fs';

let content = fs.readFileSync('src/services/geminiService.ts', 'utf8');

content = content.replace(
  "Promise<{ text: string; isCodeSnippet: boolean; options?: string[]; hint?: string }>",
  "Promise<{ text: string; isCodeSnippet: boolean; options?: string[]; hint?: string; isCodingQuestion?: boolean; codingLanguage?: string; }>"
);

content = content.replace(
  "Promise<{ score: number; feedback: string; correctAnswer?: string; pronunciationFeedback: string; conceptExplanation?: string; keyDifferences?: string; keywords?: string[]; sentiment?: string }>",
  "Promise<{ score: number; feedback: string; correctAnswer?: string; pronunciationFeedback: string; conceptExplanation?: string; keyDifferences?: string; keywords?: string[]; sentiment?: string; codeComplexity?: { time: string; space: string; qualityScore: number; }; }>"
);

fs.writeFileSync('src/services/geminiService.ts', content);
