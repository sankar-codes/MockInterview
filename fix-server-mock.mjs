import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(/      if \(e\.message\.includes\('GEMINI_API_KEY is not defined'\)\) \{\n         return res\.status\(401\)\.json\(\{ error: 'API Key Required' \}\);\n      \}/g, '');

fs.writeFileSync('server.ts', content);
