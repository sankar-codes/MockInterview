import fs from 'fs';

let content = fs.readFileSync('src/services/geminiService.ts', 'utf8');

// Add helper to get API key
const headerLogic = `    headers: { 'Content-Type': 'application/json', 'x-gemini-key': localStorage.getItem('gemini_api_key') || '' },`;

content = content.replace(/    headers: \{ 'Content-Type': 'application\/json' \},/g, headerLogic);

fs.writeFileSync('src/services/geminiService.ts', content);
