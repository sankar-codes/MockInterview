import fs from 'fs';

let content = fs.readFileSync('src/services/geminiService.ts', 'utf8');

const newFunc = `
export const evaluateHRPractice = async (
  question: string,
  responseStr: string
): Promise<{ confidence: string; relevance: string; grammar: string; missingPoints: string }> => {
  const response = await fetch('/api/evaluate-hr-practice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-gemini-key': localStorage.getItem('gemini_api_key') || '' },
    body: JSON.stringify({ question, responseStr })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to evaluate practice');
  }
  return response.json();
};
`;

content = content + newFunc;
fs.writeFileSync('src/services/geminiService.ts', content);
console.log("geminiService patched.");
