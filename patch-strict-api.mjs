import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');

// Replace try/catch in /api/generate-question
content = content.replace(/    \} catch \(e: any\) \{[\s\S]*?console\.log\("Using mock data fallback due to error\.", e\);[\s\S]*?return res\.json\(\{[\s\S]*?\}\);\n    \}/g, `    } catch (e: any) {
      console.error("API Error:", e.message || e);
      return res.status(500).json({ error: e.message || "Failed to call Gemini API" });
    }`);

// Replace for generate-feedback
content = content.replace(/    \} catch \(e: any\) \{[\s\S]*?console\.log\("Using mock data fallback due to invalid API key\."\);[\s\S]*?return res\.json\(\{[\s\S]*?\}\);\n    \}/g, `    } catch (e: any) {
      console.error("API Error:", e.message || e);
      return res.status(500).json({ error: e.message || "Failed to call Gemini API" });
    }`);

fs.writeFileSync('server.ts', content);
