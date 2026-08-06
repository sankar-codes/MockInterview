import fs from 'fs';

let content = fs.readFileSync('src/components/InterviewSession.tsx', 'utf8');

// Update props interface
content = content.replace(
  "resumeOrJD?: string;\n  onComplete: (questions: InterviewQuestion[]) => void;",
  "resumeOrJD?: string;\n  language?: string;\n  onComplete: (questions: InterviewQuestion[]) => void;"
);

// Update component signature
content = content.replace(
  "export const InterviewSession: React.FC<InterviewSessionProps> = ({ domain, difficulty, persona, resumeOrJD, onComplete, onCancel }) => {",
  "export const InterviewSession: React.FC<InterviewSessionProps> = ({ domain, difficulty, persona, resumeOrJD, language = 'en-US', onComplete, onCancel }) => {"
);

// Update generateNextQuestion call
content = content.replace(
  "generateNextQuestion(domain, questions, prevScore, resumeOrJD, difficulty, persona)",
  "generateNextQuestion(domain, questions, prevScore, resumeOrJD, difficulty, persona, language)"
);

// Update evaluateResponse call
content = content.replace(
  "const evaluation = await evaluateResponse(currentQuestion.text, userInput, domain, persona, {",
  "const evaluation = await evaluateResponse(currentQuestion.text, userInput, domain, persona, {\n          wpm,\n          fillerCount,\n          fillersUsed,\n          durationSeconds: Math.max(1, speechDuration)\n        }, language);"
);

content = content.replace(
  "fillerCount,\n          fillersUsed,\n          durationSeconds: Math.max(1, speechDuration)\n        });",
  ""
);

// We need to be careful with replace here.
fs.writeFileSync('src/components/InterviewSession.tsx', content);
