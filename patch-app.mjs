import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add language state
content = content.replace(
  "const [resumeOrJD, setResumeOrJD] = useState<string>('');",
  "const [resumeOrJD, setResumeOrJD] = useState<string>('');\n  const [language, setLanguage] = useState('en-US');"
);

// Add language param to handleStart
content = content.replace(
  "const handleStart = (domain: Domain, jd?: string, diff: 'Easy' | 'Medium' | 'Hard' = 'Medium', selectedPersona: InterviewerPersona = 'Friendly') => {",
  "const handleStart = (domain: Domain, jd?: string, diff: 'Easy' | 'Medium' | 'Hard' = 'Medium', selectedPersona: InterviewerPersona = 'Friendly', selectedLanguage: string = 'en-US') => {"
);

content = content.replace(
  "setPersona(selectedPersona);",
  "setPersona(selectedPersona);\n    setLanguage(selectedLanguage);"
);

// Pass language to InterviewSession
content = content.replace(
  "<InterviewSession \n            domain={selectedDomain} \n            difficulty={difficulty}\n            persona={persona}\n            resumeOrJD={resumeOrJD}",
  "<InterviewSession \n            domain={selectedDomain} \n            difficulty={difficulty}\n            persona={persona}\n            resumeOrJD={resumeOrJD}\n            language={language}"
);

fs.writeFileSync('src/App.tsx', content);
