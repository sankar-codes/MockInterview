import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

const replacement = `      - Conceptual Breakdown (Mandatory):
        - Provide a detailed "Concept Explanation" that explains the underlying principle of the question. 
        - Explain "Why" the answer is what it is.

      - Keyword Extraction & Sentiment Analysis:
        - Extract 3 to 5 key technical terms or concepts mentioned by the user in their response.
        - Analyze the user's sentiment/tone (e.g., 'Confident', 'Hesitant', 'Neutral', 'Enthusiastic', 'Frustrated').

      - Side-by-Side Comparison (Mandatory):
        - Provide "Key Differences" between the user's response and the ideal answer.
        - Highlight what was missing, what was incorrect, or what was particularly well-said.
        - Use bullet points.
      
      Return a JSON object with:
      - score: (0-100)
      - feedback: (Short constructive feedback on content)
      - correctAnswer: (The ideal answer, especially if the user was wrong. If the user was perfect, this can be empty)
      - pronunciationFeedback: (Feedback on clarity, articulation, and filler words.)
      - conceptExplanation: (Detailed explanation of the concept behind the question. Max 100 words.)
      - keyDifferences: (A summary of the differences between the user response and the ideal answer.)
      - keywords: (Array of extracted technical keywords from the response)
      - sentiment: (The detected sentiment of the response)`;

code = code.replace(/- Conceptual Breakdown \(Mandatory\):[\s\S]*?- keyDifferences: \(A summary of the differences between the user response and the ideal answer\.\)/, replacement);

const replacement2 = `              conceptExplanation: { type: Type.STRING },
              keyDifferences: { type: Type.STRING },
              keywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              sentiment: { type: Type.STRING },
            },
            required: ["score", "feedback", "pronunciationFeedback", "conceptExplanation", "keyDifferences", "keywords", "sentiment"],`;

code = code.replace(/              conceptExplanation: \{ type: Type\.STRING \},\s*keyDifferences: \{ type: Type\.STRING \},\s*\},\s*required: \["score", "feedback", "pronunciationFeedback", "conceptExplanation", "keyDifferences"\],/, replacement2);

fs.writeFileSync('server.ts', code);
