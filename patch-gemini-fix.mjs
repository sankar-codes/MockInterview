import fs from 'fs';

let content = fs.readFileSync('src/services/geminiService.ts', 'utf8');

content = content.replace(
  "language: string = 'en-US',\n  language: string = 'en-US'",
  "language: string = 'en-US'"
);

content = content.replace(
  "persona: InterviewerPersona = 'Friendly',\n  speakingMetrics?: {",
  "persona: InterviewerPersona = 'Friendly',\n  speakingMetrics?: {\n    wpm: number;\n    fillerCount: number;\n    fillersUsed: Record<string, number>;\n    durationSeconds: number;\n  },\n  language: string = 'en-US'\n): Promise<{ score: number; feedback: string; correctAnswer?: string; pronunciationFeedback: string; conceptExplanation?: string; keyDifferences?: string; keywords?: string[]; sentiment?: string }> => {\n  const response = await fetch('/api/evaluate-response', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ question, responseStr, domain, persona, speakingMetrics, language })\n  });"
);

// We should properly re-write `evaluateResponse`
