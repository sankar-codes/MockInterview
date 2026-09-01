import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(
  /const key = clientKey \|\| process\.env\.GEMINI_API_KEY;/,
  `const key = (clientKey && clientKey !== "null" && clientKey !== "undefined" && clientKey.trim() !== "") ? clientKey : process.env.GEMINI_API_KEY;
    console.log("Using API key starting with:", key ? key.substring(0, 4) : "NONE");`
);
fs.writeFileSync('server.ts', content);
