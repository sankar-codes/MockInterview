import fs from 'fs';

let content = fs.readFileSync('src/components/InterviewSession.tsx', 'utf8');

// Import Monaco Editor
if (!content.includes("@monaco-editor/react")) {
  content = content.replace(
    "import { cn } from '../lib/utils';",
    "import { cn } from '../lib/utils';\nimport Editor from '@monaco-editor/react';"
  );
}

// Add state for code editor
content = content.replace(
  "const [userInput, setUserInput] = useState('');",
  "const [userInput, setUserInput] = useState('');\n  const [codeContent, setCodeContent] = useState('');"
);

// We should sync codeContent with userInput before submission if it's a coding question.
content = content.replace(
  "const handleSubmit = async () => {",
  "const handleSubmit = async () => {\n    const finalInput = currentQuestion?.isCodingQuestion ? codeContent : userInput;\n    if (!finalInput.trim() || isLoading) return;"
);

content = content.replace(
  "const stats = calculateMetrics(userInput, speechDuration);",
  "const stats = calculateMetrics(currentQuestion?.isCodingQuestion ? codeContent : userInput, speechDuration);"
);

content = content.replace(
  "const evaluation = await evaluateResponse(currentQ.text, userInput, domain, persona, finalMetrics, language);",
  "const evaluation = await evaluateResponse(currentQ.text, finalInput, domain, persona, finalMetrics, language);"
);

content = content.replace(
  "userResponse: userInput,",
  "userResponse: finalInput,"
);

// Clear codeContent on next question
content = content.replace(
  "setUserInput('');",
  "setUserInput('');\n      setCodeContent('');"
);

content = content.replace(
  "const currentQuestion = questions[currentIndex];",
  `const currentQuestion = questions[currentIndex];
  const isCoding = currentQuestion?.isCodingQuestion;
  const codingLang = currentQuestion?.codingLanguage || 'javascript';
  `
);

// Update layout to support code editor
const codeEditorUI = `
                  {isCoding ? (
                    <div className="w-full h-96 mt-4 border border-white/10 rounded-xl overflow-hidden">
                      <Editor
                        height="100%"
                        language={codingLang === 'c' || codingLang === 'cpp' || codingLang === 'c++' ? 'cpp' : codingLang.toLowerCase()}
                        theme="vs-dark"
                        value={codeContent}
                        onChange={(val) => setCodeContent(val || '')}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 14,
                          lineHeight: 24,
                          padding: { top: 16 },
                        }}
                      />
                    </div>
                  ) : (
                    <>
                      {/* Original Input Area */}
                      {currentQuestion?.options ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {currentQuestion.options.map((opt, i) => (
                            <button
                              key={i}
                              onClick={() => handleOptionSelect(opt)}
                              className={cn(
                                "p-4 text-left rounded-xl border transition-all text-sm sm:text-base",
                                userInput === opt 
                                  ? "bg-orange-500 text-white border-orange-500" 
                                  : "bg-[#151619] border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 text-gray-300"
                              )}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="relative">
                          <textarea 
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Type your answer or use the microphone..."
                            className="w-full h-32 sm:h-40 bg-[#151619] border border-white/10 rounded-xl p-4 pr-12 focus:outline-none focus:border-orange-500 transition-colors resize-none text-base sm:text-lg"
                          />
                          <button 
                            onClick={toggleListening}
                            className={cn(
                              "absolute bottom-4 right-4 p-3 rounded-full transition-all shadow-lg",
                              isListening 
                                ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                                : "bg-orange-500 hover:bg-orange-600"
                            )}
                          >
                            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                  
                  {isCoding && (
                    <div className="flex gap-4">
                      <div className="relative w-full hidden md:block">
                          <textarea 
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Add voice explanation (optional)..."
                            className="w-full h-12 bg-[#151619] border border-white/10 rounded-xl p-3 pr-12 focus:outline-none focus:border-orange-500 transition-colors resize-none text-sm"
                          />
                          <button 
                            onClick={toggleListening}
                            className={cn(
                              "absolute bottom-2 right-2 p-2 rounded-full transition-all",
                              isListening 
                                ? "bg-red-500 hover:bg-red-600 animate-pulse text-white" 
                                : "bg-white/5 hover:bg-white/10 text-gray-400"
                            )}
                          >
                            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                          </button>
                      </div>
                    </div>
                  )}
`;

content = content.replace(
  /\{currentQuestion\?\.options \? \([\s\S]*?<\/button>\s*<\/div>\s*\)\}/,
  codeEditorUI
);

fs.writeFileSync('src/components/InterviewSession.tsx', content);
