import fs from 'fs';

let content = fs.readFileSync('src/components/FeedbackDashboard.tsx', 'utf8');

content = content.replace(
  "import html2canvas from 'html2canvas';",
  ""
);

fs.writeFileSync('src/components/FeedbackDashboard.tsx', content);
