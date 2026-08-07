import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  "- hint: (A short, helpful hint for the candidate. Max 15 words. Mandatory.)",
  "- hint: (A short, helpful hint for the candidate. Max 15 words. Mandatory.)\n      - isCodingQuestion: (boolean, true if it requires writing code)\n      - codingLanguage: (string, the language for the coding question)"
);

fs.writeFileSync('server.ts', content);
