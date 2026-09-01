import fs from 'fs';

let content = fs.readFileSync('src/types.ts', 'utf8');

content = content.replace(
  "isCodeSnippet?: boolean; // If the question contains a code snippet",
  "isCodeSnippet?: boolean; // If the question contains a code snippet\n  isCodingQuestion?: boolean; // True if the user needs to write code\n  codingLanguage?: string;\n  codeComplexity?: { time: string; space: string; qualityScore: number; };"
);

fs.writeFileSync('src/types.ts', content);
