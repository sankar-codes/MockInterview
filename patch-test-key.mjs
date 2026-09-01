import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(
  /app\.get\("\/api\/health", \(req, res\) => \{/,
  `app.get("/api/key-test", (req, res) => {
    const clientKey = req.headers['x-gemini-key'];
    const key = (clientKey && clientKey !== "null" && clientKey !== "undefined" && clientKey.trim() !== "") ? clientKey : process.env.GEMINI_API_KEY;
    res.json({ key: key ? key.substring(0, 5) + "..." : "none", clientKeyProvided: !!clientKey, clientKeyValue: clientKey });
  });
  app.get("/api/health", (req, res) => {`
);
fs.writeFileSync('server.ts', content);
