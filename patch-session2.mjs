import fs from 'fs';

let content = fs.readFileSync('src/components/InterviewSession.tsx', 'utf8');

content = content.replace(
  "const evaluation = await evaluateResponse(currentQ.text, userInput, domain, persona, finalMetrics);",
  "const evaluation = await evaluateResponse(currentQ.text, userInput, domain, persona, finalMetrics, language);"
);

// Update speech synthesis and recognition language
content = content.replace(
  "const utterance = new SpeechSynthesisUtterance(text);",
  "const utterance = new SpeechSynthesisUtterance(text);\n    utterance.lang = language || 'en-US';"
);

// We should also find the part where it searches for voice and make it respect the language.
content = content.replace(
  "const preferredVoice = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) || \n                          voices.find(v => v.lang.startsWith('en'));",
  "const preferredVoice = voices.find(v => v.name.includes('Google') && v.lang.startsWith(language.split('-')[0])) || \n                          voices.find(v => v.lang.startsWith(language.split('-')[0]));"
);

// SpeechRecognition language
content = content.replace(
  "const recognition = new SpeechRecognition();\n      recognition.continuous = true;",
  "const recognition = new SpeechRecognition();\n      recognition.lang = language || 'en-US';\n      recognition.continuous = true;"
);

fs.writeFileSync('src/components/InterviewSession.tsx', content);
