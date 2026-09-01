import { Domain, InterviewQuestion, InterviewFeedback, InterviewerPersona } from "../types";

export const generateNextQuestion = async (
  domain: Domain,
  previousQuestions: InterviewQuestion[],
  userPerformance: number,
  resumeOrJD?: string,
  difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium',
  persona: InterviewerPersona = 'Friendly',
  language: string = 'en-US'
): Promise<{ text: string; isCodeSnippet: boolean; options?: string[]; hint?: string; isCodingQuestion?: boolean; codingLanguage?: string; }> => {
  const response = await fetch('/api/generate-question', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-gemini-key': localStorage.getItem('gemini_api_key') || '' },
    body: JSON.stringify({ domain, previousQuestions, userPerformance, resumeOrJD, difficulty, persona, language })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate question');
  }
  return response.json();
};

export const evaluateResponse = async (
  question: string,
  responseStr: string,
  domain: Domain,
  persona: InterviewerPersona = 'Friendly',
  speakingMetrics?: {
    wpm: number;
    fillerCount: number;
    fillersUsed: Record<string, number>;
    durationSeconds: number;
  },
  language: string = 'en-US'
): Promise<{ score: number; feedback: string; correctAnswer?: string; pronunciationFeedback: string; conceptExplanation?: string; keyDifferences?: string; keywords?: string[]; sentiment?: string; codeComplexity?: { time: string; space: string; qualityScore: number; }; }> => {
  const response = await fetch('/api/evaluate-response', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-gemini-key': localStorage.getItem('gemini_api_key') || '' },
    body: JSON.stringify({ question, responseStr, domain, persona, speakingMetrics, language })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to evaluate response');
  }
  return response.json();
};

export const generateFinalFeedback = async (
  domain: Domain,
  questions: InterviewQuestion[]
): Promise<InterviewFeedback> => {
  const response = await fetch('/api/generate-feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-gemini-key': localStorage.getItem('gemini_api_key') || '' },
    body: JSON.stringify({ domain, questions })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate feedback');
  }
  return response.json();
};

export const generateRoadmap = async (
  interviews: any[]
): Promise<{ title: string; steps: { title: string; description: string; resources: string[] }[] }> => {
  const response = await fetch('/api/generate-roadmap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-gemini-key': localStorage.getItem('gemini_api_key') || '' },
    body: JSON.stringify({ interviews })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate roadmap');
  }
  return response.json();
};

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
