import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');

// Update generate-question
content = content.replace(
  "const { domain, previousQuestions, userPerformance, resumeOrJD, difficulty, persona } = req.body;",
  "const { domain, previousQuestions, userPerformance, resumeOrJD, difficulty, persona, language = 'en-US' } = req.body;"
);

content = content.replace(
  "Generate a realistic interview question.",
  "Generate a realistic interview question. The question MUST be in the language specified by the locale code: ${language}."
);

// Update evaluate-response
content = content.replace(
  "const { question, responseStr, domain, persona, speakingMetrics } = req.body;",
  "const { question, responseStr, domain, persona, speakingMetrics, language = 'en-US' } = req.body;"
);

content = content.replace(
  "Utilize advanced NLP semantics to evaluate the response based on correctness, relevance, and communication.",
  "Utilize advanced NLP semantics to evaluate the response based on correctness, relevance, and communication. ALL feedback, explanations, and text in the JSON output MUST be in the language specified by the locale code: ${language}."
);

fs.writeFileSync('server.ts', content);
