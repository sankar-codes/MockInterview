import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  `  const [showAuthModal, setShowAuthModal] = useState(false);\n\n  useEffect(() => {\n    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {\n      setUser(currentUser);\n      if (currentUser) {`,
  `  const [showAuthModal, setShowAuthModal] = useState(false);\n  const [isAuthLoading, setIsAuthLoading] = useState(true);\n\n  useEffect(() => {\n    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {\n      setUser(currentUser);\n      setIsAuthLoading(false);\n      if (currentUser) {`
);

content = content.replace(
  `  const onViewInterview = (interview: any) => {\n    setSelectedDomain(interview.domain);\n    setInterviewResults(interview.questions);\n    setView('feedback');\n  };\n\n  return (`,
  `  const onViewInterview = (interview: any) => {\n    setSelectedDomain(interview.domain);\n    setInterviewResults(interview.questions);\n    setView('feedback');\n  };\n\n  if (isAuthLoading) {\n    return (\n      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">\n        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />\n      </div>\n    );\n  }\n\n  return (`
);

fs.writeFileSync('src/App.tsx', content);
