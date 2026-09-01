import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(
  /import "dotenv\/config";/,
  `import "dotenv/config";
import fs from "fs";
try {
  const envData = JSON.parse(fs.readFileSync("/app/.dev.env.json", "utf-8"));
  if (envData.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = envData.GEMINI_API_KEY;
    console.log("Loaded GEMINI_API_KEY from /app/.dev.env.json");
  }
} catch (e) {
  console.log("Could not load /app/.dev.env.json", e.message);
}`
);
fs.writeFileSync('server.ts', content);
