import fs from 'fs';

let content = fs.readFileSync('src/components/InterviewSession.tsx', 'utf8');

// Update lastFeedback state type
content = content.replace(
  "const [lastFeedback, setLastFeedback] = useState<{ score: number; feedback: string; correctAnswer?: string; pronunciationFeedback?: string; conceptExplanation?: string; keyDifferences?: string ; keywords?: string[]; sentiment?: string; } | null>(null);",
  "const [lastFeedback, setLastFeedback] = useState<{ score: number; feedback: string; correctAnswer?: string; pronunciationFeedback?: string; conceptExplanation?: string; keyDifferences?: string ; keywords?: string[]; sentiment?: string; codeComplexity?: { time: string; space: string; qualityScore: number; }; } | null>(null);"
);

// Add UI for codeComplexity
const complexityUI = `
                        {lastFeedback.codeComplexity && (
                          <div className="mt-4 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                            <p className="text-emerald-400 font-bold text-[10px] uppercase tracking-widest mb-3">Code Complexity Evaluation</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                                <span className="text-[10px] font-black uppercase text-gray-500 block mb-1">Time Complexity</span>
                                <span className="text-sm font-bold text-emerald-300 font-mono">{lastFeedback.codeComplexity.time}</span>
                              </div>
                              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                                <span className="text-[10px] font-black uppercase text-gray-500 block mb-1">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-300 font-mono">{lastFeedback.codeComplexity.space}</span>
                              </div>
                              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                                <span className="text-[10px] font-black uppercase text-gray-500 block mb-1">Quality Score</span>
                                <span className="text-sm font-bold text-emerald-300 font-mono">{lastFeedback.codeComplexity.qualityScore}/100</span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {lastFeedback.conceptExplanation && (
`;

content = content.replace(
  "{lastFeedback.conceptExplanation && (",
  complexityUI
);

// Update user input display if coding
content = content.replace(
  '<p className="text-gray-300 text-sm italic">"{userInput}"</p>',
  `{isCoding ? (
                              <div className="mt-2 rounded overflow-hidden text-xs max-h-[200px] overflow-y-auto">
                                <SyntaxHighlighter language={codingLang.toLowerCase()} style={vscDarkPlus}>
                                  {finalInput}
                                </SyntaxHighlighter>
                              </div>
                            ) : (
                              <p className="text-gray-300 text-sm italic">"{userInput}"</p>
                            )}`
);

content = content.replace(
  '<p className="text-gray-300 text-sm italic">"{lastFeedback.correctAnswer || "The response you provided was accurate."}"</p>',
  `{isCoding && lastFeedback.correctAnswer ? (
                              <div className="mt-2 rounded overflow-hidden text-xs max-h-[200px] overflow-y-auto">
                                <SyntaxHighlighter language={codingLang.toLowerCase()} style={vscDarkPlus}>
                                  {lastFeedback.correctAnswer}
                                </SyntaxHighlighter>
                              </div>
                            ) : (
                              <p className="text-gray-300 text-sm italic">"{lastFeedback.correctAnswer || "The response you provided was accurate."}"</p>
                            )}`
);

fs.writeFileSync('src/components/InterviewSession.tsx', content);
