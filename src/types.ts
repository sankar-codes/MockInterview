export type InterviewerPersona = 'Friendly' | 'Stern' | 'Technical Expert';

export type Domain = 
  | 'Frontend Development' 
  | 'Backend Development' 
  | 'Fullstack Development' 
  | 'Mobile App Development'
  | 'DevOps & SRE'
  | 'AI & Machine Learning'
  | 'Data Engineering'
  | 'Software Testing & QA'
  | 'UI/UX Design'
  | 'Cybersecurity' 
  | 'Data Science' 
  | 'Cloud Computing' 
  | 'Mechanical Engineering'
  | 'Electrical Engineering'
  | 'Civil Engineering'
  | 'Chemical Engineering'
  | 'Electronics & Communication Engineering'
  | 'Aptitude & Reasoning' 
  | 'HR & Behavioral'
  | 'Personalized'
  | 'Google'
  | 'Amazon'
  | 'Microsoft'
  | 'Meta'
  | 'Apple'
  | 'TCS'
  | 'Infosys'
  | 'Wipro'
  | 'Accenture'
  | 'Zoho'
  | 'HCL'
  | 'Cognizant'
  | 'Tech Mahindra'
  | 'LTIMindtree'
  | 'Mphasis'
  | 'Core Fundamentals (Fresher)'
  | 'System Design'
  | 'Database Management'
  | 'Embedded Systems'
  | 'Game Development'
  | 'Product Management'
  | 'Project Management'
  | 'Business Analysis'
  | 'Blockchain Development'
  | 'Data Analytics'
  | 'Cloud Architecture'
  | 'Sales & Marketing'
  | 'Finance & Accounting'
  | 'C Programming (Quiz)'
  | 'Java Programming (Quiz)'
  | 'Python Programming (Quiz)'
  | 'C++ Programming (Quiz)';

export interface InterviewState {
  domain: Domain;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'idle' | 'preparing' | 'ongoing' | 'completed';
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  feedback: InterviewFeedback | null;
}

export interface InterviewQuestion {
  id: string;
  text: string;
  userResponse?: string;
  aiEvaluation?: string;
  score?: number;
  correctAnswer?: string; // AI provides the correct answer if user is wrong
  pronunciationFeedback?: string; // AI provides feedback on clarity and articulation
  isCodeSnippet?: boolean; // If the question contains a code snippet
  options?: string[]; // For quiz-style questions (e.g., Aptitude)
  hint?: string; // Hint for freshers
  conceptExplanation?: string; // Detailed conceptual explanation
  keyDifferences?: string; // Comparison between user and ideal response
  keywords?: string[]; // Extracted technical keywords from the response
  sentiment?: string; // Emotional sentiment of the user response (e.g. Confident, Hesitant, Frustrated, etc.)
  speakingMetrics?: {
    wpm: number;
    fillerCount: number;
    durationSeconds: number;
  };
}

export interface InterviewFeedback {
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  confidenceScore: number;
  summary: string;
  suggestions: string[];
  strengths?: string[];
  weaknesses?: string[];
  recommendedTopics?: string[];
  interviewReadiness?: string;
}


export const SUPPORTED_LANGUAGES = [
  { code: 'en-US', name: 'English' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'fr-FR', name: 'French' },
  { code: 'de-DE', name: 'German' },
  { code: 'zh-CN', name: 'Chinese (Mandarin)' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'ar-SA', name: 'Arabic' },
  { code: 'pt-BR', name: 'Portuguese' },
  { code: 'ru-RU', name: 'Russian' },
  { code: 'it-IT', name: 'Italian' },
  { code: 'ko-KR', name: 'Korean' },
  { code: 'ta-IN', name: 'Tamil' },
  { code: 'te-IN', name: 'Telugu' }
];
