import fs from 'fs';

let contentTypes = fs.readFileSync('src/types.ts', 'utf8');

const newTypes = `  | 'Software Development'
  | 'Web Development'
  | 'Mobile App Development'
  | 'Artificial Intelligence (AI)'
  | 'Machine Learning (ML)'
  | 'Deep Learning'
  | 'Data Science'
  | 'Data Analytics'
  | 'Cloud Computing'
  | 'DevOps'
  | 'Cybersecurity'
  | 'Database / Data Engineering'
  | 'Full-Stack Development'
  | 'IoT'
  | 'Blockchain / Web3'
  | 'Game Development'
  | 'UI/UX & Frontend'
  | 'Software Testing / QA'
  | 'Networking'
  | 'System Administration'
`;

contentTypes = contentTypes.replace("export type Domain = ", "export type Domain = \n" + newTypes);
fs.writeFileSync('src/types.ts', contentTypes);

let contentLanding = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

// I will insert the new domains in the LandingPage domains array.
const target = `const domains: { name: Domain; icon: React.ReactNode; description: string; industry: string }[] = [`;

const newDomains = `const domains: { name: Domain; icon: React.ReactNode; description: string; industry: string }[] = [
  { name: 'Software Development', icon: <Code className="w-8 h-8" />, description: 'Java, Python, C++, C#', industry: 'Software Engineering' },
  { name: 'Web Development', icon: <Layout className="w-8 h-8" />, description: 'HTML, CSS, JavaScript, React, Node.js', industry: 'Software Engineering' },
  { name: 'Mobile App Development', icon: <Smartphone className="w-8 h-8" />, description: 'Flutter, Dart, Kotlin, Java', industry: 'Software Engineering' },
  { name: 'Artificial Intelligence (AI)', icon: <Brain className="w-8 h-8" />, description: 'Python, OpenAI/Gemini APIs, LLMs', industry: 'Data & AI' },
  { name: 'Machine Learning (ML)', icon: <Network className="w-8 h-8" />, description: 'Python, Scikit-learn, TensorFlow', industry: 'Data & AI' },
  { name: 'Deep Learning', icon: <Cpu className="w-8 h-8" />, description: 'PyTorch, TensorFlow', industry: 'Data & AI' },
  { name: 'Data Science', icon: <LineChart className="w-8 h-8" />, description: 'Python, Pandas, NumPy, SQL', industry: 'Data & AI' },
  { name: 'Data Analytics', icon: <PieChart className="w-8 h-8" />, description: 'SQL, Excel, Power BI, Tableau', industry: 'Data & AI' },
  { name: 'Cloud Computing', icon: <Cloud className="w-8 h-8" />, description: 'AWS, Azure, Google Cloud', industry: 'IT & Infrastructure' },
  { name: 'DevOps', icon: <Wrench className="w-8 h-8" />, description: 'Git, Docker, Kubernetes, Jenkins', industry: 'IT & Infrastructure' },
  { name: 'Cybersecurity', icon: <ShieldAlert className="w-8 h-8" />, description: 'Linux, Networking, SIEM, Python', industry: 'IT & Infrastructure' },
  { name: 'Database / Data Engineering', icon: <Database className="w-8 h-8" />, description: 'MySQL, PostgreSQL, MongoDB', industry: 'Data & AI' },
  { name: 'Full-Stack Development', icon: <Layers className="w-8 h-8" />, description: 'MERN, Python, Java', industry: 'Software Engineering' },
  { name: 'IoT', icon: <Wifi className="w-8 h-8" />, description: 'Arduino, Raspberry Pi, Python', industry: 'Software Engineering' },
  { name: 'Blockchain / Web3', icon: <Link2 className="w-8 h-8" />, description: 'Solidity, Ethereum', industry: 'Software Engineering' },
  { name: 'Game Development', icon: <Gamepad className="w-8 h-8" />, description: 'Unity, Unreal Engine, C#', industry: 'Software Engineering' },
  { name: 'UI/UX & Frontend', icon: <Monitor className="w-8 h-8" />, description: 'Figma, HTML, CSS, React', industry: 'Software Engineering' },
  { name: 'Software Testing / QA', icon: <ShieldAlert className="w-8 h-8" />, description: 'Selenium, Postman, JUnit', industry: 'Software Engineering' },
  { name: 'Networking', icon: <Network className="w-8 h-8" />, description: 'TCP/IP, CCNA, Linux', industry: 'IT & Infrastructure' },
  { name: 'System Administration', icon: <Server className="w-8 h-8" />, description: 'Linux, Windows Server, Shell', industry: 'IT & Infrastructure' },
`;

if (contentLanding.includes(target)) {
  contentLanding = contentLanding.replace(target, newDomains);
  // Add missing imports
  if (!contentLanding.includes('Layers')) {
    contentLanding = contentLanding.replace("import { Briefcase,", "import { Briefcase, Layers, Wifi, ");
  }
  fs.writeFileSync('src/components/LandingPage.tsx', contentLanding);
  console.log("Domains updated successfully.");
} else {
  console.log("Could not find domains target in LandingPage.tsx");
}
