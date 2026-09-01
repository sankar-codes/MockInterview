import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  'res.status(500).json({ error: "Invalid Gemini API Key. Please provide a valid key in your settings." });',
  'res.status(500).json({ error: "Invalid Gemini API Key. Please provide a valid key in your settings.", details: e.message, status: e.status });'
);

fs.writeFileSync('server.ts', content);
