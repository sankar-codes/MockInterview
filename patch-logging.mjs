import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(/catch \(e: any\) \{\n\s*console\.error\(e\);\n\s*if \(e\.message\?\.includes\("API key not valid"\)/g, 'catch (e: any) {\n      if (e.message?.includes("API key not valid") || e.message?.includes("API_KEY_INVALID")) {\n        return res.status(500).json({ error: "Invalid Gemini API Key. Please provide a valid key in your settings." });\n      }\n      console.error(e);');

fs.writeFileSync('server.ts', content);
