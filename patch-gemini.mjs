import fs from 'fs';

let content = fs.readFileSync('src/services/geminiService.ts', 'utf8');

// Update generateNextQuestion
content = content.replace(
  "persona: InterviewerPersona = 'Friendly'",
  "persona: InterviewerPersona = 'Friendly',\n  language: string = 'en-US'"
);

content = content.replace(
  "body: JSON.stringify({ domain, previousQuestions, userPerformance, resumeOrJD, difficulty, persona })",
  "body: JSON.stringify({ domain, previousQuestions, userPerformance, resumeOrJD, difficulty, persona, language })"
);

// Update evaluateResponse
content = content.replace(
  "persona: InterviewerPersona = 'Friendly',",
  "persona: InterviewerPersona = 'Friendly',\n  language: string = 'en-US',"
);

content = content.replace(
  "body: JSON.stringify({ question, responseStr, domain, persona, speakingMetrics })",
  "body: JSON.stringify({ question, responseStr, domain, persona, speakingMetrics, language })"
);

fs.writeFileSync('src/services/geminiService.ts', content);
