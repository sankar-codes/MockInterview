import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');

// Replace unescaped backticks in prompt with single quotes
content = content.replace(/Set `isCodingQuestion` to true/g, "Set 'isCodingQuestion' to true");
content = content.replace(/Set `codingLanguage` to the/g, "Set 'codingLanguage' to the");
content = content.replace(/ideal optimal code in `correctAnswer`/g, "ideal optimal code in 'correctAnswer'");
content = content.replace(/The `codeComplexity` object MUST/g, "The 'codeComplexity' object MUST");

fs.writeFileSync('server.ts', content);
