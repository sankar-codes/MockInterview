import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf8');

const evaluateEndpoint = `
  app.post("/api/evaluate-response", async (req, res) => {
    try {
      const { question, responseStr, domain, persona, speakingMetrics, language = 'en-US' } = req.body;
      const prompt = \`
      You are an expert interviewer evaluating a candidate.
      Domain: \${domain}
      Question: \${question}
      Candidate's Response: \${responseStr}
      \${speakingMetrics ? \`Speaking Metrics: \${JSON.stringify(speakingMetrics)}\` : ''}
      
      Evaluate the response and provide:
      - score: A number from 0 to 100 representing the quality of the answer.
      - feedback: Constructive feedback on their answer.
      - correctAnswer: (Optional) The ideal answer for this question.
      - pronunciationFeedback: Feedback on their speaking metrics (if provided), or just "N/A".
      - conceptExplanation: (Optional) A brief explanation of the core concept.
      - keywords: (Optional) Key terms they missed or correctly used.
      \`;
      
      const result = await getAI(req.headers['x-gemini-key'] as string).models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              feedback: { type: Type.STRING },
              correctAnswer: { type: Type.STRING },
              pronunciationFeedback: { type: Type.STRING },
              conceptExplanation: { type: Type.STRING },
              keyDifferences: { type: Type.STRING },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              sentiment: { type: Type.STRING },
              codeComplexity: { type: Type.OBJECT, properties: { time: { type: Type.STRING }, space: { type: Type.STRING }, qualityScore: { type: Type.NUMBER } } }
            },
            required: ["score", "feedback", "pronunciationFeedback"]
          }
        }
      });
      res.json(JSON.parse(result.text || '{}'));
    } catch (e: any) {
      console.error("API Error (evaluate-response):", e.message || e);
      return res.status(500).json({ error: e.message || "Failed to call Gemini API" });
    }
  });
`;

const feedbackEndpoint = `
  app.post("/api/generate-feedback", async (req, res) => {
    try {
      const { domain, questions } = req.body;
      const prompt = \`
      You are an expert interviewer providing final feedback for a \${domain} interview.
      Here are the questions asked and the candidate's performance:
      \${JSON.stringify(questions)}
      
      Provide a comprehensive final evaluation.
      \`;
      
      const result = await getAI(req.headers['x-gemini-key'] as string).models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              totalScore: { type: Type.NUMBER },
              summary: { type: Type.STRING },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              tips: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["totalScore", "summary", "strengths", "weaknesses", "tips"]
          }
        }
      });
      res.json(JSON.parse(result.text || '{}'));
    } catch (e: any) {
      console.error("API Error (generate-feedback):", e.message || e);
      return res.status(500).json({ error: e.message || "Failed to call Gemini API" });
    }
  });
`;

const roadmapEndpoint = `
  app.post("/api/generate-roadmap", async (req, res) => {
    try {
      const { interviews } = req.body;
      const prompt = \`
      Based on the candidate's interview history: \${JSON.stringify(interviews)}
      Generate a customized learning roadmap to help them improve.
      \`;
      
      const result = await getAI(req.headers['x-gemini-key'] as string).models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    resources: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["title", "description", "resources"]
                }
              }
            },
            required: ["title", "steps"]
          }
        }
      });
      res.json(JSON.parse(result.text || '{}'));
    } catch (e: any) {
      console.error("API Error (generate-roadmap):", e.message || e);
      return res.status(500).json({ error: e.message || "Failed to call Gemini API" });
    }
  });
`;

if (!content.includes('app.post("/api/evaluate-response"')) {
  content = content.replace('app.get("/api/export-zip"', evaluateEndpoint + '\n' + feedbackEndpoint + '\n' + roadmapEndpoint + '\n  app.get("/api/export-zip"');
}
fs.writeFileSync('server.ts', content);
