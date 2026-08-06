import fs from 'fs';

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

// Add SUPPORTED_LANGUAGES to imports
content = content.replace(
  "import { Domain, InterviewerPersona } from '../types';",
  "import { Domain, InterviewerPersona, SUPPORTED_LANGUAGES } from '../types';"
);

// Update LandingPageProps
content = content.replace(
  "onStart: (domain: Domain, resumeOrJD?: string, difficulty?: 'Easy' | 'Medium' | 'Hard', persona?: InterviewerPersona) => void;",
  "onStart: (domain: Domain, resumeOrJD?: string, difficulty?: 'Easy' | 'Medium' | 'Hard', persona?: InterviewerPersona, language?: string) => void;"
);

// Add language state
content = content.replace(
  "const [persona, setPersona] = useState<InterviewerPersona>('Friendly');",
  "const [persona, setPersona] = useState<InterviewerPersona>('Friendly');\n  const [language, setLanguage] = useState('en-US');"
);

// Update onStart calls
content = content.replace(
  "onStart(domain, resumeOrJD, companyDifficulty, persona);",
  "onStart(domain, resumeOrJD, companyDifficulty, persona, language);"
);

content = content.replace(
  "onStart('Personalized', resumeOrJD, 'Medium', persona)",
  "onStart('Personalized', resumeOrJD, 'Medium', persona, language)"
);

// Add Language Selector UI before Persona Selector
const languageUI = `
      {/* Language Selector */}
      <div className="w-full max-w-4xl mb-12 flex flex-col items-center gap-6 sm:gap-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/10">
            <span className="text-orange-500 font-bold">🌐</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">Choose Interview Language</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 w-full">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={\`p-3 rounded-xl border transition-all \${
                language === lang.code 
                  ? 'bg-orange-500 text-white border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]' 
                  : 'bg-[#151619] text-gray-400 border-white/5 hover:border-white/20 hover:bg-white/5'
              }\`}
            >
              <span className="text-sm font-semibold">{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interviewer Persona Selector */}`;

content = content.replace(
  "{/* Interviewer Persona Selector */}",
  languageUI
);

fs.writeFileSync('src/components/LandingPage.tsx', content);
