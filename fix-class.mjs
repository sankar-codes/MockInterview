import fs from 'fs';
let content = fs.readFileSync('src/components/FeedbackDashboard.tsx', 'utf8');
content = content.replace(/className="mt-2 p-2 hover:bg-white\/5 rounded-lg text-gray-400 hover:text-white transition-all hide-on-print"\n              className="mt-2 p-2 hover:bg-white\/5 rounded-lg text-gray-400 hover:text-white transition-all hide-on-print"/g, 'className="mt-2 p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all hide-on-print"');
fs.writeFileSync('src/components/FeedbackDashboard.tsx', content);
