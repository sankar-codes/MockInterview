import fs from 'fs';
let content = fs.readFileSync('src/components/FeedbackDashboard.tsx', 'utf8');

content = content.replace(
  /const canvas = await html2canvas\(element, \{/g,
  'const canvas = await html2canvas(element, { // @ts-ignore'
);
fs.writeFileSync('src/components/FeedbackDashboard.tsx', content);
