import fs from 'fs';

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

// Add import
if (!content.includes('HRQuestionsSection')) {
  content = content.replace("import { Domain, InterviewerPersona, SUPPORTED_LANGUAGES } from '../types';", "import { Domain, InterviewerPersona, SUPPORTED_LANGUAGES } from '../types';\nimport { HRQuestionsSection } from './HRQuestionsSection';");
}

// Insert component
const target = `          {/* Quizzes & Assessments */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <FlaskConical className="w-6 h-6 text-orange-500" />
              Coding & Assessments
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'C Programming (Quiz)', icon: <Terminal className="w-6 h-6" />, desc: 'Pointers, memory, and syntax.' },
                { name: 'Java Programming (Quiz)', icon: <FileCode className="w-6 h-6" />, desc: 'Core Java, OOP, collections.' },
                { name: 'Python Programming (Quiz)', icon: <FileText className="w-6 h-6" />, desc: 'List comprehensions, decorators.' },
                { name: 'Aptitude & Reasoning', icon: <Brain className="w-6 h-6" />, desc: 'Logical, quantitative, and verbal.' }
              ].map((quiz) => (
                <button
                  key={quiz.name}
                  onClick={() => handleDomainClick(quiz.name as Domain)}
                  className="p-4 rounded-xl bg-black/40 border border-white/5 hover:border-orange-500/50 hover:bg-[#151619] transition-all text-left flex items-center gap-4 group"
                >
                  <div className="p-2 bg-white/5 rounded-lg text-gray-400 group-hover:text-orange-500 transition-colors">
                    {quiz.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{quiz.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{quiz.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <HRQuestionsSection />
`;

content = content.replace(/\{\/\* Quizzes & Assessments \*\/\}[\s\S]*?<\/section>/, target);
fs.writeFileSync('src/components/LandingPage.tsx', content);
console.log("LandingPage patched for HR Questions.");
