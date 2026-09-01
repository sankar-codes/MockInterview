import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(/catch \(e: any\) \{\s*if \(e\.message\?\.includes\("API key not valid"\) \|\| e\.message\?\.includes\("API_KEY_INVALID"\)\) \{\s*return res\.status\(500\)\.json\(\{ error: "Invalid Gemini API Key\. Please provide a valid key in your settings\." \}\);\s*\}\s*console\.error\(e\); \|\| e\.status === "INVALID_ARGUMENT" \|\| e\.message\?\.includes\("API_KEY_INVALID"\)\) \{\s*return res\.status\(500\)\.json\(\{ error: "Invalid Gemini API Key\. Please provide a valid key in your settings\."(?:, details: e\.message, status: e\.status)? \}\);\s*\}/g,
`catch (e: any) {
      if (e.message?.includes("API key not valid") || e.status === "INVALID_ARGUMENT" || e.message?.includes("API_KEY_INVALID")) {
        return res.status(500).json({ error: "Invalid Gemini API Key. Please provide a valid key in your settings." });
      }
      console.error(e);`);

fs.writeFileSync('server.ts', content);
