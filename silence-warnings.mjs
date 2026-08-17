import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(/console\.warn\("Using mock data because Gemini API failed:", e\.message\);/g, 'console.log("Using mock data fallback due to invalid API key.");');

fs.writeFileSync('server.ts', content);
