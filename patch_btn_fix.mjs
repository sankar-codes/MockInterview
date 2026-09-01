import fs from 'fs';
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const targetStr = `{resumeOrJD.trim() && (
                  <button 
                    onClick={() => handleDomainClick('Personalized')}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 "
                  >
                    <Play className="w-5 h-5" />
                    Start Resume/JD Interview
                  </button>
                )}`;

const replacement = `{resumeOrJD.trim().length > 0 ? (
                  <button 
                    onClick={() => handleDomainClick('Personalized')}
                    className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                  >
                    <Play className="w-5 h-5" />
                    Start Resume/JD Interview
                  </button>
                ) : null}`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replacement);
  fs.writeFileSync('src/components/LandingPage.tsx', code);
  console.log("Successfully patched button visibility.");
} else {
  console.log("Could not find target string.");
}
