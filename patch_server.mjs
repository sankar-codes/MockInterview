import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');

const newRoute = `
  app.post("/api/evaluate-hr-practice", async (req, res) => {
    try {
      const { question, responseStr } = req.body;
      const prompt = \`
      You are an expert HR interviewer. The user is practicing for an interview.
      Question: "\${question}"
      User's Answer: "\${responseStr}"
      
      Provide feedback on the following 4 aspects:
      1. Confidence: Does the tone sound confident?
      2. Relevance: Did they actually answer the question asked?
      3. Grammar: Are there any grammatical errors or awkward phrasing?
      4. Missing points: What key details should they have included?
      \`;
      
      const result = await getAI(req.headers['x-gemini-key'] as string).models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              confidence: { type: Type.STRING },
              relevance: { type: Type.STRING },
              grammar: { type: Type.STRING },
              missingPoints: { type: Type.STRING }
            },
            required: ["confidence", "relevance", "grammar", "missingPoints"]
          }
        }
      });
      res.json(JSON.parse(result.text || '{}'));
    } catch (e: any) {
      console.error("API Error (evaluate-hr-practice):", e.message || e);
      return res.status(500).json({ error: e.message || "Failed to call Gemini API" });
    }
  });
  
  app.post("/api/generate-roadmap"`;

content = content.replace('  app.post("/api/generate-roadmap"', newRoute);
fs.writeFileSync('server.ts', content);
console.log("Server patched.");
