import fs from 'fs';

let content = fs.readFileSync('src/components/InterviewSession.tsx', 'utf8');

content = content.replace(
  "{finalInput}",
  "{isCoding ? codeContent : userInput}"
);

fs.writeFileSync('src/components/InterviewSession.tsx', content);
