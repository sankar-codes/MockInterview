import fs from 'fs';
let content = fs.readFileSync('src/components/FeedbackDashboard.tsx', 'utf8');
content = content.replace(
  /"ml-auto p-2 rounded-lg transition-all",/g,
  '"ml-auto p-2 rounded-lg transition-all hide-on-print",'
);
fs.writeFileSync('src/components/FeedbackDashboard.tsx', content);
