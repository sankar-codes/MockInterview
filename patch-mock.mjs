import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');

// Replace question generation error
content = content.replace(
  /catch \(e: any\) \{\s*if \(e\.message\?\.includes\("API key not valid"\) \|\| e\.status === "INVALID_ARGUMENT" \|\| e\.message\?\.includes\("API_KEY_INVALID"\)\) \{\s*return res\.status\(500\)\.json\(\{ error: "Invalid Gemini API Key\. Please provide a valid key in your settings\." \}\);\s*\}\s*console\.error\(e\);\s*res\.status\(500\)\.json\(\{ error: "Failed to generate question: " \+ \(e\.message \|\| "Unknown error"\) \}\);\s*\}/,
  `catch (e: any) {
      console.warn("Using mock data because Gemini API failed:", e.message);
      return res.json({
        text: "This is a mock question because your API key is invalid. What is the difference between let, const, and var in JavaScript?",
        isCodeSnippet: false,
        hint: "Think about block scope and reassignment."
      });
    }`
);

// Replace evaluation error
content = content.replace(
  /catch \(e: any\) \{\s*if \(e\.message\?\.includes\("API key not valid"\) \|\| e\.status === "INVALID_ARGUMENT" \|\| e\.message\?\.includes\("API_KEY_INVALID"\)\) \{\s*return res\.status\(500\)\.json\(\{ error: "Invalid Gemini API Key\. Please provide a valid key in your settings\." \}\);\s*\}\s*console\.error\(e\);\s*res\.status\(500\)\.json\(\{ error: "Failed to evaluate response: " \+ \(e\.message \|\| "Unknown error"\) \}\);\s*\}/,
  `catch (e: any) {
      console.warn("Using mock data because Gemini API failed:", e.message);
      return res.json({
        score: 75,
        feedback: "This is a mock evaluation because your API key is invalid. You gave a reasonable answer.",
        pronunciationFeedback: "Clear speech.",
        correctAnswer: "Const cannot be reassigned, let can be reassigned, and both are block scoped. Var is function scoped.",
        conceptExplanation: "Scope determines the visibility of variables.",
        keywords: ["scope", "reassignment"],
        sentiment: "neutral"
      });
    }`
);

// Replace feedback error
content = content.replace(
  /catch \(e: any\) \{\s*if \(e\.message\?\.includes\("API key not valid"\) \|\| e\.status === "INVALID_ARGUMENT" \|\| e\.message\?\.includes\("API_KEY_INVALID"\)\) \{\s*return res\.status\(500\)\.json\(\{ error: "Invalid Gemini API Key\. Please provide a valid key in your settings\." \}\);\s*\}\s*console\.error\(e\);\s*res\.status\(500\)\.json\(\{ error: "Failed to generate feedback: " \+ \(e\.message \|\| "Unknown error"\) \}\);\s*\}/,
  `catch (e: any) {
      console.warn("Using mock data because Gemini API failed:", e.message);
      return res.json({
        overallScore: 80,
        communicationScore: 85,
        technicalScore: 75,
        confidenceScore: 80,
        summary: "This is a mock feedback summary because your API key is invalid.",
        suggestions: ["Fix your API key to get real feedback.", "Practice more."]
      });
    }`
);

// Replace roadmap error
content = content.replace(
  /catch \(e: any\) \{\s*if \(e\.message\?\.includes\("API key not valid"\) \|\| e\.status === "INVALID_ARGUMENT" \|\| e\.message\?\.includes\("API_KEY_INVALID"\)\) \{\s*return res\.status\(500\)\.json\(\{ error: "Invalid Gemini API Key\. Please provide a valid key in your settings\." \}\);\s*\}\s*console\.error\(e\);\s*res\.status\(500\)\.json\(\{ error: "Failed to generate roadmap: " \+ \(e\.message \|\| "Unknown error"\) \}\);\s*\}/,
  `catch (e: any) {
      console.warn("Using mock data because Gemini API failed:", e.message);
      return res.json({
        title: "Mock Roadmap (Invalid API Key)",
        steps: [
          {
            title: "Provide a valid API Key",
            description: "You need a valid Gemini API key for this app to generate real roadmaps.",
            resources: ["Google AI Studio API Keys page"]
          },
          {
            title: "Study JavaScript Fundamentals",
            description: "A good place to start.",
            resources: ["MDN Web Docs"]
          }
        ]
      });
    }`
);

fs.writeFileSync('server.ts', content);
