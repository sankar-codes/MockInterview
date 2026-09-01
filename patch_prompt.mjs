import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf8');

const insertion = `
      - INDUSTRY REALISM: ALWAYS integrate industry-specific jargon, common acronyms, and real-world scenarios highly relevant to the \${domain} field.
      - SITUATIONAL CHALLENGES: Instead of generic textbook questions, present situational problems the candidate might face on the job using actual tools, edge cases, and architectures common to the role.`;

content = content.replace(
  "The selected difficulty level is ${difficulty}.",
  "The selected difficulty level is ${difficulty}." + insertion
);

fs.writeFileSync('server.ts', content);
console.log("Updated prompt in server.ts");
