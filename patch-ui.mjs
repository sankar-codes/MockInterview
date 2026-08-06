import fs from 'fs';

let content = fs.readFileSync('src/components/FeedbackDashboard.tsx', 'utf8');

const newUI = `
            <h3 className="text-xl font-bold mb-6 uppercase tracking-widest text-orange-500">Improvement Plan</h3>
            <ul className="space-y-4">
              {feedback?.suggestions.map((suggestion, i) => (
                <li key={i} className="flex gap-4 items-start group">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-orange-500 shrink-0 group-hover:scale-150 transition-transform" />
                  <p className="text-gray-300 group-hover:text-white transition-colors">{suggestion}</p>
                </li>
              ))}
            </ul>
            
            {feedback?.strengths && feedback.strengths.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-bold mb-4 uppercase tracking-widest text-green-500">Strengths Demonstrated</h4>
                <ul className="space-y-3">
                  {feedback.strengths.map((s, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <div className="mt-2 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                      <p className="text-gray-400 text-sm">{s}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {feedback?.weaknesses && feedback.weaknesses.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-bold mb-4 uppercase tracking-widest text-red-500">Areas for Improvement</h4>
                <ul className="space-y-3">
                  {feedback.weaknesses.map((w, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <div className="mt-2 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                      <p className="text-gray-400 text-sm">{w}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {feedback?.recommendedTopics && feedback.recommendedTopics.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-bold mb-4 uppercase tracking-widest text-blue-500">Recommended Topics to Study</h4>
                <ul className="space-y-3">
                  {feedback.recommendedTopics.map((t, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <div className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      <p className="text-gray-400 text-sm">{t}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {feedback?.interviewReadiness && (
              <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl">
                <h4 className="text-xs font-black mb-2 uppercase tracking-widest text-gray-500">Interview Readiness</h4>
                <p className="text-sm font-semibold text-white">{feedback.interviewReadiness}</p>
              </div>
            )}
`;

content = content.replace(
  /<h3 className="text-xl font-bold mb-6 uppercase tracking-widest text-orange-500">Improvement Plan<\/h3>\s*<ul className="space-y-4">\s*\{feedback\?\.suggestions\.map\(\(suggestion, i\) => \(\s*<li key=\{i\} className="flex gap-4 items-start group">\s*<div className="mt-1.5 w-2 h-2 rounded-full bg-orange-500 shrink-0 group-hover:scale-150 transition-transform" \/>\s*<p className="text-gray-300 group-hover:text-white transition-colors">\{suggestion\}<\/p>\s*<\/li>\s*\)\)\}\s*<\/ul>/,
  newUI
);

fs.writeFileSync('src/components/FeedbackDashboard.tsx', content);
