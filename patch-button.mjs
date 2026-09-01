import fs from 'fs';

let content = fs.readFileSync('src/components/InterviewSession.tsx', 'utf8');

content = content.replace(
  "Submit Response <Send className=\"w-5 h-5 group-hover:translate-x-1 transition-transform\" />",
  "{isCoding ? 'Submit Code for Evaluation' : 'Submit Response'} <Send className=\"w-5 h-5 group-hover:translate-x-1 transition-transform\" />"
);

fs.writeFileSync('src/components/InterviewSession.tsx', content);
