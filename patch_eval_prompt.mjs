import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf8');

const insertion = `
      Evaluate the response based on:
      1. Technical accuracy and depth.
      2. Practical problem-solving and handling of the real-world scenario.
      3. Appropriate use of industry-specific jargon, acronyms, and tools for the \${domain} field.`;

content = content.replace(
  "Evaluate the response and provide:",
  insertion + "\n      Provide the evaluation output as:"
);

fs.writeFileSync('server.ts', content);
console.log("Updated evaluate response prompt in server.ts");
