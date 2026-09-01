import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');

const newRoute = `  app.post("/api/chat-assistant", async (req, res) => {
    try {
      const { messages } = req.body;
      
      const systemInstruction = "You are an expert technical interview coach and mentor assisting a candidate on an interview prep website. Answer their questions clearly, concisely, and encouragingly. Help them understand technical concepts, interview strategies, and provide short code examples if needed.";
      
      const result = await getAI(req.headers['x-gemini-key'] as string).models.generateContent({
        model: "gemini-2.5-flash",
        contents: messages,
        config: {
          systemInstruction,
        }
      });
      
      res.json({ reply: result.text });
    } catch (error) {
      console.error("Chat Assistant Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate chat response" });
    }
  });

`;

// insert before app.post("/api/generate-roadmap"
content = content.replace('app.post("/api/generate-roadmap"', newRoute + '  app.post("/api/generate-roadmap"');
fs.writeFileSync('server.ts', content);
console.log("Chat route added.");
