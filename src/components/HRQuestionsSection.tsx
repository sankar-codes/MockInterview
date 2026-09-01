import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../lib/utils';
import { evaluateHRPractice } from '../services/geminiService';
import { CheckCircle2, Lightbulb, XCircle, Mic, MicOff, Loader2, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

interface HRQuestion {
  id: string;
  question: string;
  category: 'Fresher' | 'Technical' | 'HR' | 'Situational';
  sampleAnswer: string;
  tips: string[];
  commonMistakes: string[];
}

const hrQuestions: HRQuestion[] = [
  {
    id: 'q1',
    question: 'Tell me about yourself.',
    category: 'HR',
    sampleAnswer: 'I am a passionate developer with a strong foundation in problem-solving and software engineering. During my studies, I focused on full-stack development and successfully built several projects, including a [Project Name] that helped [Result]. I am always eager to learn new technologies and thrive in collaborative environments.',
    tips: ['Keep it professional and relevant to the job.', 'Use the Present-Past-Future formula.', 'Highlight your key achievements without repeating your entire resume.'],
    commonMistakes: ['Sharing too much personal information.', 'Rambling for more than 2 minutes.', 'Reciting your resume word-for-word.']
  },
  {
    id: 'q2',
    question: 'What are your strengths?',
    category: 'HR',
    sampleAnswer: 'One of my greatest strengths is my adaptability. In my last project, the requirements changed halfway through, and I quickly learned [New Technology] to meet the deadline. I am also highly collaborative and enjoy working in team settings to solve complex problems.',
    tips: ['Choose strengths that align with the job description.', 'Always back up your strengths with a specific example.', 'Focus on qualities like problem-solving, adaptability, or leadership.'],
    commonMistakes: ['Listing a string of adjectives without examples.', 'Choosing a generic strength like "I am a hard worker".', 'Sounding arrogant.']
  },
  {
    id: 'q3',
    question: 'What is your weakness?',
    category: 'HR',
    sampleAnswer: 'I sometimes struggle with delegating tasks because I like to ensure things are done a certain way. However, I have been actively working on this by using project management tools to assign clear roles and trusting my team members expertise, which has actually improved our overall efficiency.',
    tips: ['Choose a real weakness, but one that is not a dealbreaker for the role.', 'Focus on the steps you are taking to improve.', 'Show self-awareness.'],
    commonMistakes: ['Saying "I am a perfectionist" or "I work too hard".', 'Claiming you have no weaknesses.', 'Mentioning a weakness that is critical to the job (e.g., poor communication for a sales role).']
  },
  {
    id: 'q4',
    question: 'Why should we hire you?',
    category: 'HR',
    sampleAnswer: 'You should hire me because my skills in [Skill 1] and [Skill 2] align perfectly with what you are looking for in this role. My ability to quickly learn new concepts and my dedication to producing high-quality work will allow me to contribute to your team from day one.',
    tips: ['Connect your skills and experience directly to the company\'s needs.', 'Show enthusiasm for the role and the company.', 'Summarize your top selling points.'],
    commonMistakes: ['Giving a generic answer that applies to anyone.', 'Focusing only on what the company can do for you, rather than what you can do for them.']
  },
  {
    id: 'q5',
    question: 'Why do you want to join our company?',
    category: 'HR',
    sampleAnswer: 'I have been following your company\'s recent work in [Industry/Project], and I am highly impressed by your innovative approach. I am looking for a company where I can grow my skills while contributing to meaningful projects, and your commitment to [Company Value] really resonates with me.',
    tips: ['Do your research on the company beforehand.', 'Mention specific products, projects, or values that attract you.', 'Align your career goals with the company\'s trajectory.'],
    commonMistakes: ['Saying you just need a job or money.', 'Showing that you know nothing about what the company actually does.']
  },
  {
    id: 'q6',
    question: 'Where do you see yourself in 5 years?',
    category: 'HR',
    sampleAnswer: 'In five years, I see myself taking on more leadership responsibilities and becoming a subject matter expert in [Area of Interest]. I hope to have made a significant positive impact on my team and the company, and I am excited to continue growing within an innovative organization like this one.',
    tips: ['Show ambition but keep it realistic.', 'Align your goals with the career path of the role you are applying for.', 'Emphasize your commitment to growth and learning.'],
    commonMistakes: ['Saying "I want your job".', 'Expressing a desire to leave the industry or start your own business (unless it fits the company culture).', 'Saying you don\'t know.']
  },
  {
    id: 'q7',
    question: 'Why should we select you as a fresher?',
    category: 'Fresher',
    sampleAnswer: 'As a fresher, I bring a lot of energy, a fresh perspective, and a strong willingness to learn. I am highly adaptable and have a solid foundation in the required technologies from my academic projects. I am eager to apply my knowledge in a real-world setting and am committed to growing with the company.',
    tips: ['Focus on your enthusiasm, adaptability, and academic foundation.', 'Highlight any relevant projects, internships, or extracurricular activities.', 'Show that you are a quick learner.'],
    commonMistakes: ['Apologizing for your lack of experience.', 'Acting entitled or expecting special treatment.']
  },
  {
    id: 'q8',
    question: 'Are you willing to relocate?',
    category: 'Situational',
    sampleAnswer: 'Yes, I am open to relocating for the right opportunity. I am excited about the prospect of joining this team and am willing to make the necessary arrangements to be where I can contribute the most.',
    tips: ['Be honest about your willingness and ability to relocate.', 'If you are hesitant, you can ask for more details about the relocation package or timeline before giving a definitive answer.', 'Show flexibility if possible.'],
    commonMistakes: ['Saying yes when you actually cannot or will not relocate.', 'Being overly rigid without discussing options.']
  },
  {
    id: 'q9',
    question: 'What are your salary expectations?',
    category: 'HR',
    sampleAnswer: 'Based on my research of industry standards for this role and my current skill set, I am looking for a salary in the range of [Range]. However, I am flexible and open to discussing the complete compensation package, including benefits and opportunities for growth.',
    tips: ['Do your research on market rates for the role and location.', 'Provide a realistic range rather than a specific number.', 'Emphasize that you are flexible and consider the entire package.'],
    commonMistakes: ['Giving a number that is way too high or too low.', 'Refusing to answer the question altogether.', 'Focusing only on the money without considering other benefits.']
  }
];

export const HRQuestionsSection: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Show all questions since the filter UI was removed
  const filteredQuestions = hrQuestions;

  return (
    <section className="mt-16">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-orange-500" />
          HR & Frequently Asked Questions
        </h2>
      </div>

      <div className="space-y-4">
        {filteredQuestions.map((q) => (
          <HRQuestionCard 
            key={q.id} 
            question={q} 
            isExpanded={expandedId === q.id} 
            onToggle={() => setExpandedId(expandedId === q.id ? null : q.id)} 
          />
        ))}
      </div>
    </section>
  );
};

const HRQuestionCard: React.FC<{ question: HRQuestion, isExpanded: boolean, onToggle: () => void }> = ({ question, isExpanded, onToggle }) => {
  const [practiceMode, setPracticeMode] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ confidence: string; relevance: string; grammar: string; missingPoints: string } | null>(null);
  
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setUserAnswer((prev) => prev + (prev && !prev.endsWith(' ') ? ' ' : '') + finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (!recognitionRef.current) {
        alert("Speech recognition is not supported in this browser.");
        return;
      }
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch(e) {
        console.error(e);
      }
    }
  };

  const handlePracticeSubmit = async () => {
    if (!userAnswer.trim()) return;
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    setIsSubmitting(true);
    try {
      const result = await evaluateHRPractice(question.question, userAnswer);
      setFeedback(result);
    } catch (error) {
      console.error(error);
      alert('Failed to get feedback. Please check API key.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#151619] border border-white/5 rounded-2xl overflow-hidden transition-all">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400/80 bg-orange-500/10 px-2 py-0.5 rounded">
            {question.category}
          </span>
          <h3 className="font-bold text-lg text-white">{question.question}</h3>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>

      {isExpanded && (
        <div className="p-6 pt-0 border-t border-white/5 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
            {/* Left side: Guide */}
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-sm text-green-400 flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4" /> Sample Answer
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed p-4 bg-green-500/5 rounded-xl border border-green-500/10">
                  {question.sampleAnswer}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-sm text-yellow-400 flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4" /> Tips
                </h4>
                <ul className="space-y-2">
                  {question.tips.map((tip, i) => (
                    <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                      <span className="text-yellow-500/50 mt-1">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-sm text-red-400 flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4" /> Common Mistakes
                </h4>
                <ul className="space-y-2">
                  {question.commonMistakes.map((mistake, i) => (
                    <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                      <span className="text-red-500/50 mt-1">•</span>
                      {mistake}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right side: Practice Mode */}
            <div className="bg-black/30 rounded-xl p-6 border border-white/5 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-orange-500 flex items-center gap-2">
                  <Mic className="w-4 h-4" /> Practice Mode
                </h4>
                <button 
                  onClick={() => setPracticeMode(!practiceMode)}
                  className="text-xs font-semibold text-gray-400 hover:text-white transition-colors underline underline-offset-4"
                >
                  {practiceMode ? 'Close Practice' : 'Try it yourself'}
                </button>
              </div>

              {practiceMode ? (
                <div className="flex flex-col flex-1 gap-4">
                  <div className="relative flex-1">
                    <textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your answer here or click the microphone to speak..."
                      className="w-full h-full min-h-[120px] bg-black/50 border border-white/10 rounded-xl p-4 pr-12 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
                    />
                    <button
                      onClick={toggleListening}
                      title={isListening ? "Stop recording" : "Start recording"}
                      className={`absolute bottom-4 right-4 p-2 rounded-full transition-all ${isListening ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30 animate-pulse' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {feedback ? (
                    <div className="space-y-3 bg-[#1a1b1e] p-4 rounded-xl border border-white/5 text-sm">
                      <div className="space-y-1">
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Confidence</span>
                        <p className="text-white">{feedback.confidence}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Relevance</span>
                        <p className="text-white">{feedback.relevance}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Grammar</span>
                        <p className="text-white">{feedback.grammar}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Missing Points</span>
                        <p className="text-white">{feedback.missingPoints}</p>
                      </div>
                      <button 
                        onClick={() => { setFeedback(null); setUserAnswer(''); }}
                        className="mt-2 text-xs text-orange-500 hover:text-orange-400 font-semibold"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handlePracticeSubmit}
                      disabled={isSubmitting || !userAnswer.trim()}
                      className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Get AI Feedback'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-white/10 rounded-xl bg-white/[0.02]">
                  <Mic className="w-8 h-8 text-gray-600 mb-3" />
                  <p className="text-sm text-gray-400 mb-4">Want to see how you'd do? Type or speak your answer and get instant AI analysis on your delivery and content.</p>
                  <button 
                    onClick={() => setPracticeMode(true)}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold transition-all text-sm"
                  >
                    Start Practice
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
