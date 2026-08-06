import fs from 'fs';

let content = fs.readFileSync('src/components/InterviewSession.tsx', 'utf8');

content = content.replace(
  "if (!finalInput.trim() || isLoading) return;\n    if (!userInput.trim() || isLoading) return;",
  "if (!finalInput.trim() || isLoading) return;"
);

fs.writeFileSync('src/components/InterviewSession.tsx', content);
