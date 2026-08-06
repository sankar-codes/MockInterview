import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');

// Update Personas
content = content.replace(
  "'Friendly': 'You are a warm, encouraging, and supportive interviewer. You want the candidate to succeed. Use a conversational and kind tone.',",
  "'Friendly': 'You are a warm, encouraging, and supportive interviewer. You want the candidate to succeed. Use a conversational and kind tone.',\n        'Professional': 'You are highly professional, objective, and structured. You follow standard corporate interviewing practices.',\n        'Strict': 'You are a strict, no-nonsense interviewer who expects perfect answers. You are hard to please.',\n        'HR': 'You are an HR manager. You care about cultural fit, behavioral traits, conflict resolution, and teamwork.',"
);

// Update generating logic for coding questions
const newGenerateLogic = `      - If the domain is a Quiz-style round (Aptitude & Reasoning, or any domain ending with '(Quiz)'):
        - Provide a multiple-choice question (Quiz style).
        - If it's a coding quiz (C, Java, Python, C++ Programming (Quiz)):
          - Focus on "Error Detection" or "Output Guessing".
          - ALWAYS set isCodeSnippet to true and include the code block in the question text.
        - Include 4 distinct options (A, B, C, D).
        - Ensure the code is formatted correctly.
        
      - If the domain is a Coding Interview (e.g. 'Python Programming', 'Java Programming', 'JavaScript Programming', 'C/C++ Programming', 'Data Structures and Algorithms (DSA)'):
        - Provide a standard Data Structures or Algorithms coding problem (e.g., LeetCode style).
        - Set \`isCodingQuestion\` to true.
        - Provide the problem description clearly.
        - You don't need options.
        - Set \`codingLanguage\` to the requested language (e.g., 'python', 'java', 'javascript', 'cpp'). If DSA, pick a language like 'javascript' or leave empty.
        
      - Granular Difficulty Scaling`;

content = content.replace(
  /- If the domain is a Quiz-style round[\s\S]*?- Granular Difficulty Scaling/,
  newGenerateLogic
);

// Update the JSON schema for generating questions
content = content.replace(
  "properties: {\n              text: { type: Type.STRING },\n              isCodeSnippet: { type: Type.BOOLEAN },\n              options: {\n                type: Type.ARRAY,\n                items: { type: Type.STRING }\n              },\n              hint: { type: Type.STRING },\n            },",
  "properties: {\n              text: { type: Type.STRING },\n              isCodeSnippet: { type: Type.BOOLEAN },\n              options: {\n                type: Type.ARRAY,\n                items: { type: Type.STRING }\n              },\n              hint: { type: Type.STRING },\n              isCodingQuestion: { type: Type.BOOLEAN },\n              codingLanguage: { type: Type.STRING }\n            },"
);

// Update evaluate-response for coding questions
const newEvaluateLogic = `      - For Coding Questions:
        - If the user submitted code, evaluate it rigorously.
        - Determine Time Complexity and Space Complexity.
        - Evaluate Code Quality (0-100).
        - Provide the ideal optimal code in \`correctAnswer\`.
        - The \`codeComplexity\` object MUST be populated.
        
      - For other domains:`;
content = content.replace(
  "- For other domains:",
  newEvaluateLogic
);

const newEvaluateSchema = `              sentiment: { type: Type.STRING },
              codeComplexity: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  space: { type: Type.STRING },
                  qualityScore: { type: Type.NUMBER }
                }
              }
            },
            required: ["score", "feedback", "pronunciationFeedback", "conceptExplanation", "keyDifferences", "keywords", "sentiment"],`;

content = content.replace(
  /sentiment: \{ type: Type.STRING \},\s*\},/,
  `sentiment: { type: Type.STRING },
              codeComplexity: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  space: { type: Type.STRING },
                  qualityScore: { type: Type.NUMBER }
                }
              }
            },`
);

fs.writeFileSync('server.ts', content);
