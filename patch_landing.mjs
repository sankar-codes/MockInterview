import fs from 'fs';
let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const targetStr = `<textarea
                  ref={textareaRef}
                  value={resumeOrJD}
                  onChange={(e) => setResumeOrJD(e.target.value)}
                  placeholder="Or paste your context here..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 min-h-[120px] text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all resize-y text-sm font-mono"
                />`;

const replacement = `<textarea
                  ref={textareaRef}
                  value={resumeOrJD}
                  onChange={(e) => setResumeOrJD(e.target.value)}
                  placeholder="Or paste your context here..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 min-h-[120px] text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all resize-y text-sm font-mono mb-4"
                />
                
                {resumeOrJD.trim() && (
                  <button 
                    onClick={() => handleDomainClick('Personalized')}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 animate-in fade-in zoom-in duration-300"
                  >
                    <Play className="w-5 h-5" />
                    Start Resume/JD Interview
                  </button>
                )}`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacement);
  fs.writeFileSync('src/components/LandingPage.tsx', content);
  console.log("Successfully patched LandingPage.tsx");
} else {
  console.log("Could not find target string.");
}
