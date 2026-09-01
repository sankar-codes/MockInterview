import fs from 'fs';

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const newCompanies = `const companies: { name: Domain; logo: string; description: string; color: string; tags: string[]; difficulty: 'Easy' | 'Medium' | 'Hard'; category: 'MAANG' | 'Service' | 'Consulting' | 'Product' }[] = [
  { name: 'Google' as Domain, logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', description: 'Advanced Data Structures, Algorithms, and System Design.', color: '#4285F4', tags: ['Hard', 'DSA', 'System Design'], difficulty: 'Hard', category: 'MAANG' },
  { name: 'Amazon' as Domain, logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', description: 'Leadership principles and complex problem solving.', color: '#FF9900', tags: ['Hard', 'Leadership', 'DSA'], difficulty: 'Hard', category: 'MAANG' },
  { name: 'Microsoft' as Domain, logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg', description: 'System design, core fundamentals, and coding.', color: '#00A4EF', tags: ['Medium-Hard', 'OS', 'System Design'], difficulty: 'Hard', category: 'MAANG' },
  { name: 'Meta' as Domain, logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg', description: 'High-scale architecture, networking, and behavioral.', color: '#0668E1', tags: ['Hard', 'Scale', 'Behavioral'], difficulty: 'Hard', category: 'MAANG' },
  { name: 'Apple' as Domain, logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', description: 'Low-level systems, hardware-software integration.', color: '#A2AAAD', tags: ['Hard', 'Systems', 'Hardware'], difficulty: 'Hard', category: 'MAANG' },
  { name: 'TCS' as Domain, logo: 'https://upload.wikimedia.org/wikipedia/en/b/b1/Tata_Consultancy_Services.svg', description: 'Technical basics and aptitude rounds.', color: '#004b8d', tags: ['Easy-Medium', 'Aptitude', 'Core Tech'], difficulty: 'Medium', category: 'Service' },
  { name: 'Infosys' as Domain, logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg', description: 'Puzzles, aptitude, and basic programming.', color: '#007cc3', tags: ['Easy-Medium', 'Logic', 'Programming'], difficulty: 'Medium', category: 'Service' },
  { name: 'Wipro' as Domain, logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg', description: 'Core fundamentals, logical reasoning, and HR.', color: '#000000', tags: ['Easy-Medium', 'Core Tech', 'Reasoning'], difficulty: 'Medium', category: 'Service' },
  { name: 'Tech Mahindra' as Domain, logo: 'https://upload.wikimedia.org/wikipedia/commons/3/32/TM_Logo_Color_Pos_RGB.svg', description: 'Basic programming, networks, and communication.', color: '#e31837', tags: ['Easy-Medium', 'Networks', 'Tech'], difficulty: 'Medium', category: 'Service' },
  { name: 'Accenture' as Domain, logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg', description: 'Cognitive, technical, and communication assessment.', color: '#a100ff', tags: ['Medium', 'Cognitive', 'Communication'], difficulty: 'Medium', category: 'Consulting' },
  { name: 'IBM' as Domain, logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg', description: 'Cloud, AI, logic, and enterprise systems.', color: '#0530ad', tags: ['Medium-Hard', 'Cloud', 'Logic'], difficulty: 'Hard', category: 'Consulting' },
  { name: 'Capgemini' as Domain, logo: 'https://upload.wikimedia.org/wikipedia/en/7/7c/Capgemini_New_logo.svg', description: 'Data structures, database management, and reasoning.', color: '#0070ad', tags: ['Medium', 'DBMS', 'Reasoning'], difficulty: 'Medium', category: 'Consulting' },
  { name: 'Zoho' as Domain, logo: 'https://upload.wikimedia.org/wikipedia/commons/3/30/ZOHO_logo_2023.svg', description: 'Advanced programming, C/C++, and hands-on coding.', color: '#e72027', tags: ['Hard', 'Programming', 'Advanced Logic'], difficulty: 'Hard', category: 'Product' }
];`;

const newDomains = `const domains: { name: Domain; icon: React.ReactNode; description: string }[] = [
  { name: 'Frontend Development', icon: <Code className="w-8 h-8" />, description: 'React, Vue, CSS, and modern web interfaces.' },
  { name: 'Backend Development', icon: <Server className="w-8 h-8" />, description: 'Node.js, Python, APIs, and microservices.' },
  { name: 'Fullstack Development', icon: <Layout className="w-8 h-8" />, description: 'End-to-end web application development.' },
  { name: 'Mobile App Development', icon: <Smartphone className="w-8 h-8" />, description: 'iOS, Android, React Native, and Flutter.' },
  { name: 'DevOps & SRE', icon: <Cloud className="w-8 h-8" />, description: 'CI/CD, Kubernetes, AWS, and infrastructure.' },
  { name: 'AI & Machine Learning', icon: <Brain className="w-8 h-8" />, description: 'Neural networks, NLP, and computer vision.' },
  { name: 'Electrical Engineering', icon: <Zap className="w-8 h-8" />, description: 'Power systems, machines, and control systems.' },
  { name: 'Electronics & Communication Engineering', icon: <Cpu className="w-8 h-8" />, description: 'Microprocessors, DSP, and analog circuits.' },
  { name: 'Mechanical Engineering', icon: <Wrench className="w-8 h-8" />, description: 'Thermodynamics, fluid mechanics, and manufacturing.' },
  { name: 'Civil Engineering', icon: <Building2 className="w-8 h-8" />, description: 'Structural analysis, concrete, and surveying.' },
  { name: 'Chemical Engineering', icon: <FlaskConical className="w-8 h-8" />, description: 'Process engineering, transport phenomena.' },
  { name: 'Data Engineering', icon: <Database className="w-8 h-8" />, description: 'ETL, data pipelines, and big data systems.' },
  { name: 'Software Testing & QA', icon: <ShieldAlert className="w-8 h-8" />, description: 'Automation, manual testing, and QA strategies.' },
  { name: 'UI/UX Design', icon: <Monitor className="w-8 h-8" />, description: 'User research, wireframing, and prototyping.' },
  { name: 'Cybersecurity', icon: <Shield className="w-8 h-8" />, description: 'Penetration testing, cryptography, and security.' }
];`;

content = content.replace(/const companies[\s\S]*?\];/, newCompanies);
content = content.replace(/const domains[\s\S]*?\];/, newDomains);

fs.writeFileSync('src/components/LandingPage.tsx', content);

