import fs from 'fs';
let code = fs.readFileSync('src/components/InterviewSession.tsx', 'utf8');

// Update lastFeedback state definition
code = code.replace(
  /const \[lastFeedback, setLastFeedback\] = useState<\{([^}]+)\} \| null>\(null\);/,
  'const [lastFeedback, setLastFeedback] = useState<{$1; keywords?: string[]; sentiment?: string; } | null>(null);'
);

// Update updatedQuestions mapped values to include keywords and sentiment
code = code.replace(
  'keyDifferences: evaluation.keyDifferences,',
  'keyDifferences: evaluation.keyDifferences,\n        keywords: evaluation.keywords,\n        sentiment: evaluation.sentiment,'
);

// Add display for keywords and sentiment
const newDisplay = `
                        {lastFeedback.keywords && lastFeedback.keywords.length > 0 && (
                          <div className="mt-4 p-4 bg-teal-500/5 border border-teal-500/10 rounded-xl">
                            <p className="text-teal-400 font-bold text-[10px] uppercase tracking-widest mb-2">Extracted Keywords</p>
                            <div className="flex flex-wrap gap-2">
                              {lastFeedback.keywords.map((kw, i) => (
                                <span key={i} className="px-2 py-1 bg-teal-500/10 text-teal-300 rounded text-xs">{kw}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {lastFeedback.sentiment && (
                          <div className="mt-4 p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl">
                            <p className="text-orange-400 font-bold text-[10px] uppercase tracking-widest mb-1">Response Sentiment</p>
                            <p className="text-gray-400 text-sm leading-relaxed capitalize">{lastFeedback.sentiment}</p>
                          </div>
                        )}

                        {lastFeedback.keyDifferences && (
`;

code = code.replace(
  /\{lastFeedback\.keyDifferences && \(/,
  newDisplay.trim()
);

fs.writeFileSync('src/components/InterviewSession.tsx', code);
