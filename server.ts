import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import "dotenv/config";
import fs from "fs";
try {
  const envData = JSON.parse(fs.readFileSync("/app/.dev.env.json", "utf-8"));
  if (envData.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = envData.GEMINI_API_KEY;
    console.log("Loaded GEMINI_API_KEY from /app/.dev.env.json");
  }
} catch (e) {
  console.log("Could not load /app/.dev.env.json", e.message);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

async function startServer() {
  const PORT = 3000;
  
  app.use(express.json());

  let aiInstance: GoogleGenAI | null = null;
  const getAI = (clientKey?: string): GoogleGenAI => {
    const key = (clientKey && clientKey !== "null" && clientKey !== "undefined" && clientKey.trim() !== "") ? clientKey : process.env.GEMINI_API_KEY;
    console.log("Using API key starting with:", key ? key.substring(0, 4) : "NONE");
    if (!key) throw new Error("GEMINI_API_KEY is not defined");
    return new GoogleGenAI({ apiKey: key });
  };

  app.get("/api/key-test", (req, res) => {
    const clientKey = req.headers['x-gemini-key'] as string;
    const key = (clientKey && clientKey !== "null" && clientKey !== "undefined" && clientKey.trim() !== "") ? clientKey : process.env.GEMINI_API_KEY;
    res.json({ key: key ? key.substring(0, 5) + "..." : "none", clientKeyProvided: !!clientKey, clientKeyValue: clientKey });
  });
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/generate-question", async (req, res) => {
    try {
      const { domain, previousQuestions, userPerformance, resumeOrJD, difficulty, persona, language = 'en-US' } = req.body;
      const personaPrompts: Record<string, string> = {
        'Friendly': 'You are a warm, encouraging, and supportive interviewer. You want the candidate to succeed. Use a conversational and kind tone.',
        'Professional': 'You are highly professional, objective, and structured. You follow standard corporate interviewing practices.',
        'Strict': 'You are a strict, no-nonsense interviewer who expects perfect answers. You are hard to please.',
        'HR': 'You are an HR manager. You care about cultural fit, behavioral traits, conflict resolution, and teamwork.',
        'Stern': 'You are a no-nonsense, strict, and highly formal interviewer. You are difficult to impress and maintain a professional, cold distance. Your questions are direct and sharp.',
        'Technical Expert': 'You are a deep-dive technical specialist. You care only about technical precision, edge cases, and architectural depth. You skip small talk and go straight for the hardest technical details.'
      };

      const prompt = `
      ${personaPrompts[persona]}
      You are an advanced NLP-driven expert interviewer for ${domain}. 
      The selected difficulty level is ${difficulty}.
      - INDUSTRY REALISM: ALWAYS integrate industry-specific jargon, common acronyms, and real-world scenarios highly relevant to the ${domain} field.
      - SITUATIONAL CHALLENGES: Instead of generic textbook questions, present situational problems the candidate might face on the job using actual tools, edge cases, and architectures common to the role. 
      - If difficulty is 'Easy': Focus on basic concepts, definitions, and simple problem-solving.
      - If difficulty is 'Medium': Focus on practical application, intermediate concepts, and standard interview problems.
      - If difficulty is 'Hard': Focus on advanced architecture, complex algorithms, edge cases, and deep technical reasoning.
      
      ${domain === 'Core Fundamentals (Fresher)' ? `This is an interview for a FRESHER. 
      - Focus on core computer science fundamentals: OOPs (Inheritance, Polymorphism, etc.), DBMS (SQL, Normalization), OS (Processes, Threads, Deadlocks), and Networking (OSI Model, TCP/UDP).
      - Keep questions foundational but probing.` : ''}

      ${['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'TCS', 'Infosys', 'Wipro', 'Accenture', 'Zoho'].includes(domain) ? `This is a real-world interview simulation for ${domain}. 
      - For MNCs like Google/Amazon/Microsoft/Meta/Apple: Focus on high-level Data Structures, Algorithms, System Design, and their specific leadership principles.
      - For Service-based companies like TCS/Infosys/Wipro/Accenture: Focus on core technical fundamentals, aptitude, and situational behavioral questions.
      - For Product companies like Zoho: Focus on deep problem-solving, logical thinking, and hands-on coding ability.` : ''}
      
      ${resumeOrJD ? `The candidate has provided the following Resume/Job Description for context: "${resumeOrJD}". 
      ${domain === 'Personalized' ? 'This is a strictly PERSONALIZED interview. Every question MUST be directly derived from the provided Resume or Job Description.' : `Tailor your questions to this context while staying within the ${domain} domain.`}` : ''}
      
      Based on the previous questions and responses: ${JSON.stringify(previousQuestions)}
      The score of the IMMEDIATELY PRECEDING question (0-100): ${userPerformance}
      
      Generate a NEW, UNIQUE, and COMMONLY ASKED interview question that has NOT been asked before in this session. 
      
      - IF THIS IS THE FIRST QUESTION (previousQuestions is empty):
        - ALWAYS start with a common ice-breaker like "Tell me about yourself", "Walk me through your background".
      
      - If the domain is a technical field (Frontend, Backend, Mobile, DevOps, AI/ML, etc.):
        - Focus on standard, high-frequency interview questions.
        - Prioritize code-based problem-solving questions.
      
            - If the domain is a Quiz-style round (Aptitude & Reasoning, or any domain ending with '(Quiz)'):
        - Provide a multiple-choice question (Quiz style).
        - If it's a coding quiz (C, Java, Python, C++ Programming (Quiz)):
          - Focus on "Error Detection" or "Output Guessing".
          - ALWAYS set isCodeSnippet to true and include the code block in the question text.
        - Include 4 distinct options (A, B, C, D).
        - Ensure the code is formatted correctly.
        
      - If the domain is a Coding Interview (e.g. 'Python Programming', 'Java Programming', 'JavaScript Programming', 'C/C++ Programming', 'Data Structures and Algorithms (DSA)'):
        - Provide a standard Data Structures or Algorithms coding problem (e.g., LeetCode style).
        - Set 'isCodingQuestion' to true.
        - Provide the problem description clearly.
        - You don't need options.
        - Set 'codingLanguage' to the requested language (e.g., 'python', 'java', 'javascript', 'cpp'). If DSA, pick a language like 'javascript' or leave empty.
        
      - Granular Difficulty Scaling (Relative to the base difficulty '${difficulty}'):
        - If the last score was 81-100: Increase complexity significantly. Ask a "Hard" level question.
        - If the last score was 61-80: Increase complexity slightly.
        - If the last score was 41-60: Maintain the current complexity level.
        - If the last score was 21-40: Decrease complexity slightly.
        - If the last score was 0-20: Decrease complexity significantly. Ask a "Very Easy" question.
      
      Return a JSON object with:
      - text: (The question text)
      - isCodeSnippet: (boolean)
      - options: (Array of 4 strings, ONLY if domain is 'Aptitude & Reasoning' or Quiz)
      - hint: (A short, helpful hint for the candidate. Max 15 words. Mandatory.)
      - isCodingQuestion: (boolean, true if it requires writing code)
      - codingLanguage: (string, the language for the coding question)
      `;

      const result = await getAI(req.headers['x-gemini-key'] as string).models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              isCodeSnippet: { type: Type.BOOLEAN },
              hint: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING }
              },
            },
            required: ["text", "isCodeSnippet"],
          },
        },
      });

      res.json(JSON.parse(result.text || '{"text": "Could you tell me more about your experience?", "isCodeSnippet": false, "hint": "Think about your background."}'));
    } catch (e: any) {
      console.error("API Error:", e.message || e);
      return res.status(500).json({ error: e.message || "Failed to call Gemini API" });
    }
  });

  
  app.post("/api/evaluate-response", async (req, res) => {
    try {
      const { question, responseStr, domain, persona, speakingMetrics, language = 'en-US' } = req.body;
      const prompt = `
      You are an expert interviewer evaluating a candidate.
      Domain: ${domain}
      Question: ${question}
      Candidate's Response: ${responseStr}
      ${speakingMetrics ? `Speaking Metrics: ${JSON.stringify(speakingMetrics)}` : ''}
      
      
      Evaluate the response based on:
      1. Technical accuracy and depth.
      2. Practical problem-solving and handling of the real-world scenario.
      3. Appropriate use of industry-specific jargon, acronyms, and tools for the ${domain} field.
      Provide the evaluation output as:
      - score: A number from 0 to 100 representing the quality of the answer.
      - feedback: Constructive feedback on their answer.
      - correctAnswer: (Optional) The ideal answer for this question.
      - pronunciationFeedback: Feedback on their speaking metrics (if provided), or just "N/A".
      - conceptExplanation: (Optional) A brief explanation of the core concept.
      - keywords: (Optional) Key terms they missed or correctly used.
      `;
      
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


  app.post("/api/generate-feedback", async (req, res) => {
    try {
      const { domain, questions } = req.body;
      const prompt = `
      You are an expert interviewer providing final feedback for a ${domain} interview.
      Here are the questions asked and the candidate's performance:
      ${JSON.stringify(questions)}
      
      Provide a comprehensive final evaluation.
      `;
      
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



  app.post("/api/evaluate-hr-practice", async (req, res) => {
    try {
      const { question, responseStr } = req.body;
      const prompt = `
      You are an expert HR interviewer. The user is practicing for an interview.
      Question: "${question}"
      User's Answer: "${responseStr}"
      
      Provide feedback on the following 4 aspects:
      1. Confidence: Does the tone sound confident?
      2. Relevance: Did they actually answer the question asked?
      3. Grammar: Are there any grammatical errors or awkward phrasing?
      4. Missing points: What key details should they have included?
      `;
      
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
  
    app.post("/api/chat-assistant", async (req, res) => {
    try {
      const { messages } = req.body;
      
      const systemInstruction = "You are an expert technical interview coach and mentor assisting a candidate on an interview prep website. Answer their questions clearly, concisely, and encouragingly. Help them understand technical concepts, interview strategies, and provide short code examples if needed.";
      
      const result = await getAI(req.headers['x-gemini-key'] as string).models.generateContent({
        model: "gemini-3.6-flash",
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

  app.post("/api/generate-roadmap", async (req, res) => {
    try {
      const { interviews } = req.body;
      const prompt = `
      Based on the candidate's interview history: ${JSON.stringify(interviews)}
      Generate a customized learning roadmap to help them improve.
      `;
      
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

  app.get("/api/export-zip", async (req, res) => {
    try {
      const archiver = (await import("archiver")).default;
      res.attachment("project.zip");
      const archive = archiver("zip", { zlib: { level: 9 } });

      archive.on("error", (err) => {
        if (!res.headersSent) res.status(500).send({ error: err.message });
      });

      archive.pipe(res);

      archive.glob("**/*", {
        cwd: process.cwd(),
        ignore: ["node_modules/**", "dist/**", ".git/**"],
        dot: true
      });

      await archive.finalize();
    } catch (err) {
      if (!res.headersSent) res.status(500).send({ error: "Failed to export zip" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;