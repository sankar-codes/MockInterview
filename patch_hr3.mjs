import fs from 'fs';

let content = fs.readFileSync('src/components/HRQuestionsSection.tsx', 'utf8');

// replace imports
content = content.replace("import React, { useState } from 'react';", "import React, { useState, useRef, useEffect } from 'react';");

// replace Mic import with Mic and MicOff if needed
content = content.replace("Mic, Loader2", "Mic, MicOff, Loader2");

// Now replace HRQuestionCard
const startToken = `const HRQuestionCard: React.FC<{ question: HRQuestion, isExpanded: boolean, onToggle: () => void }> = ({ question, isExpanded, onToggle }) => {`;

const newHRQuestionCard = `const HRQuestionCard: React.FC<{ question: HRQuestion, isExpanded: boolean, onToggle: () => void }> = ({ question, isExpanded, onToggle }) => {
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
                      className={\`absolute bottom-4 right-4 p-2 rounded-full transition-all \${isListening ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30 animate-pulse' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}\`}
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
`;

const splitContent = content.split(startToken);
content = splitContent[0] + newHRQuestionCard;

fs.writeFileSync('src/components/HRQuestionsSection.tsx', content);
console.log("HRQuestionsSection updated with voice recognition.");
