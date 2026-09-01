import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, Layers, Wifi, Code, Database, UserCheck, Play, Smartphone, Settings, Brain, Shield, Cloud, Cpu, FileText, Sparkles, Layout, Server, Monitor, Gamepad, BarChart3, ClipboardList, LineChart, Link2, PieChart, Network, Zap, Megaphone, Landmark, Wrench, Lightbulb, Building2, FlaskConical, CircuitBoard, Terminal, FileCode, Code2, User as UserIcon, UserPlus, UserMinus, ShieldAlert, Microscope, Upload, File, Loader2, Search , Eye, BookOpen, MessageSquare } from 'lucide-react';
import { Domain, InterviewerPersona, SUPPORTED_LANGUAGES } from '../types';
import { HRQuestionsSection } from './HRQuestionsSection';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerSrc from 'pdfjs-dist/build/pdf.worker.min.js?url';
import { cn } from '../lib/utils';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

interface LandingPageProps {
  onStart: (domain: Domain, resumeOrJD?: string, difficulty?: 'Easy' | 'Medium' | 'Hard', persona?: InterviewerPersona, language?: string) => void;
  user: any | null;
}

const companies: { name: Domain; logo: string; description: string; color: string; tags: string[]; difficulty: 'Easy' | 'Medium' | 'Hard'; category: 'MAANG' | 'Service' | 'Consulting' | 'Product' }[] = [
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
];

const domains: { name: Domain; icon: React.ReactNode; description: string; industry: string }[] = [
  { name: 'Software Development', icon: <Code className="w-8 h-8" />, description: 'Java, Python, C++, C#', industry: 'Software Engineering' },
  { name: 'Web Development', icon: <Layout className="w-8 h-8" />, description: 'HTML, CSS, JavaScript, React, Node.js', industry: 'Software Engineering' },
  { name: 'Mobile App Development', icon: <Smartphone className="w-8 h-8" />, description: 'iOS, Android, React Native, and Flutter.', industry: 'Software Engineering' },
  { name: 'Artificial Intelligence (AI)', icon: <Brain className="w-8 h-8" />, description: 'Python, OpenAI/Gemini APIs, LLMs', industry: 'Data & AI' },
  { name: 'Machine Learning (ML)', icon: <Network className="w-8 h-8" />, description: 'Python, Scikit-learn, TensorFlow', industry: 'Data & AI' },
  { name: 'Deep Learning', icon: <Network className="w-8 h-8" />, description: 'Neural networks, PyTorch, and TensorFlow.', industry: 'AI' },
  { name: 'Data Science', icon: <LineChart className="w-8 h-8" />, description: 'Statistical analysis, ML models, and predictive analytics.', industry: 'Data & AI' },
  { name: 'Data Analytics', icon: <BarChart3 className="w-8 h-8" />, description: 'Data visualization, SQL, and reporting.', industry: 'Data & AI' },
  { name: 'Cloud Computing', icon: <Cloud className="w-8 h-8" />, description: 'AWS, Azure, Google Cloud', industry: 'IT & Infrastructure' },
  { name: 'DevOps', icon: <Wrench className="w-8 h-8" />, description: 'Git, Docker, Kubernetes, Jenkins', industry: 'IT & Infrastructure' },
  { name: 'Cybersecurity', icon: <Shield className="w-8 h-8" />, description: 'Penetration testing, cryptography, and security.', industry: 'IT & Cloud' },
  { name: 'Database / Data Engineering', icon: <Database className="w-8 h-8" />, description: 'MySQL, PostgreSQL, MongoDB', industry: 'Data & AI' },
  { name: 'Full-Stack Development', icon: <Layers className="w-8 h-8" />, description: 'MERN, Python, Java', industry: 'Software Engineering' },
  { name: 'IoT', icon: <Wifi className="w-8 h-8" />, description: 'Arduino, Raspberry Pi, Python', industry: 'Software Engineering' },
  { name: 'Blockchain / Web3', icon: <Link2 className="w-8 h-8" />, description: 'Solidity, Ethereum', industry: 'Software Engineering' },
  { name: 'Game Development', icon: <Gamepad className="w-8 h-8" />, description: 'Unity, Unreal Engine, and graphics programming.', industry: 'Software Engineering' },
  { name: 'UI/UX & Frontend', icon: <Monitor className="w-8 h-8" />, description: 'Figma, HTML, CSS, React', industry: 'Software Engineering' },
  { name: 'Software Testing / QA', icon: <ShieldAlert className="w-8 h-8" />, description: 'Selenium, Postman, JUnit', industry: 'Software Engineering' },
  { name: 'Networking', icon: <Network className="w-8 h-8" />, description: 'TCP/IP, CCNA, Linux', industry: 'IT & Infrastructure' },
  { name: 'System Administration', icon: <Server className="w-8 h-8" />, description: 'Linux, Windows Server, Shell', industry: 'IT & Infrastructure' },
  { name: 'Generative AI', icon: <Sparkles className="w-8 h-8" />, description: 'Image, text, and audio generation models.', industry: 'AI' },
  { name: 'Machine Learning', icon: <Brain className="w-8 h-8" />, description: 'Predictive modeling, classification, and regression.', industry: 'AI' },
  { name: 'Natural Language Processing (NLP)', icon: <MessageSquare className="w-8 h-8" />, description: 'Text analysis, transformers, and sentiment analysis.', industry: 'AI' },
  { name: 'Computer Vision', icon: <Eye className="w-8 h-8" />, description: 'Image recognition, object detection, and OpenCV.', industry: 'AI' },
  { name: 'Large Language Models (LLMs)', icon: <BookOpen className="w-8 h-8" />, description: 'GPT, Claude, Gemini, and model fine-tuning.', industry: 'AI' },
  { name: 'Prompt Engineering', icon: <Terminal className="w-8 h-8" />, description: 'Context window optimization and few-shot prompting.', industry: 'AI' },
  { name: 'AI Agents', icon: <Cpu className="w-8 h-8" />, description: 'Autonomous agents, LangChain, and tool use.', industry: 'AI' },
  { name: 'Retrieval-Augmented Generation (RAG)', icon: <Database className="w-8 h-8" />, description: 'Vector databases, embeddings, and context retrieval.', industry: 'AI' },
  { name: 'AI-assisted Software Development', icon: <Code2 className="w-8 h-8" />, description: 'Copilot, Cursor, and AI-driven workflow automation.', industry: 'AI' },
  { name: 'Frontend Development', icon: <Code className="w-8 h-8" />, description: 'React, Vue, CSS, and modern web interfaces.', industry: 'Software Engineering' },
  { name: 'Backend Development', icon: <Server className="w-8 h-8" />, description: 'Node.js, Python, APIs, and microservices.', industry: 'Software Engineering' },
  { name: 'Fullstack Development', icon: <Layout className="w-8 h-8" />, description: 'End-to-end web application development.', industry: 'Software Engineering' },
  { name: 'Software Testing & QA', icon: <ShieldAlert className="w-8 h-8" />, description: 'Automation, manual testing, and QA strategies.', industry: 'Software Engineering' },
  { name: 'AI & Machine Learning', icon: <Brain className="w-8 h-8" />, description: 'Neural networks, NLP, and computer vision.', industry: 'Data & AI' },
  { name: 'Data Engineering', icon: <Database className="w-8 h-8" />, description: 'ETL, data pipelines, and big data systems.', industry: 'Data & AI' },
  { name: 'DevOps & SRE', icon: <Cloud className="w-8 h-8" />, description: 'CI/CD, Kubernetes, AWS, and infrastructure.', industry: 'IT & Cloud' },
  { name: 'Cloud Architecture', icon: <Network className="w-8 h-8" />, description: 'System design, scalable infrastructure, and cloud patterns.', industry: 'IT & Cloud' },
  { name: 'Blockchain Development', icon: <Link2 className="w-8 h-8" />, description: 'Smart contracts, Web3, and decentralized apps.', industry: 'IT & Cloud' },
  { name: 'Electrical Engineering', icon: <Zap className="w-8 h-8" />, description: 'Power systems, machines, and control systems.', industry: 'Core Engineering' },
  { name: 'Electronics & Communication Engineering', icon: <Cpu className="w-8 h-8" />, description: 'Microprocessors, DSP, and analog circuits.', industry: 'Core Engineering' },
  { name: 'Mechanical Engineering', icon: <Wrench className="w-8 h-8" />, description: 'Thermodynamics, fluid mechanics, and manufacturing.', industry: 'Core Engineering' },
  { name: 'Civil Engineering', icon: <Building2 className="w-8 h-8" />, description: 'Structural analysis, concrete, and surveying.', industry: 'Core Engineering' },
  { name: 'Chemical Engineering', icon: <FlaskConical className="w-8 h-8" />, description: 'Process engineering, transport phenomena.', industry: 'Core Engineering' },
  { name: 'Embedded Systems', icon: <CircuitBoard className="w-8 h-8" />, description: 'Microcontrollers, RTOS, and firmware development.', industry: 'Core Engineering' },
  { name: 'UI/UX Design', icon: <Monitor className="w-8 h-8" />, description: 'User research, wireframing, and prototyping.', industry: 'Design & Product' },
  { name: 'Product Management', icon: <ClipboardList className="w-8 h-8" />, description: 'Roadmapping, agile, and product strategy.', industry: 'Design & Product' },
  { name: 'Project Management', icon: <Briefcase className="w-8 h-8" />, description: 'Scrum, resource allocation, and delivery.', industry: 'Design & Product' },
  { name: 'Sales & Marketing', icon: <Megaphone className="w-8 h-8" />, description: 'Digital marketing, SEO, and sales strategy.', industry: 'Business & Finance' },
  { name: 'Business Analysis', icon: <PieChart className="w-8 h-8" />, description: 'Requirements gathering and stakeholder management.', industry: 'Business & Finance' },
  { name: 'Finance & Accounting', icon: <Landmark className="w-8 h-8" />, description: 'Financial modeling, accounting principles.', industry: 'Business & Finance' }
];

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, user }) => {
  const [resumeOrJD, setResumeOrJD] = useState('');
  const [persona, setPersona] = useState<InterviewerPersona>('Friendly');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [language, setLanguage] = useState('en-US');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'MAANG' | 'Service' | 'Consulting' | 'Product'>('All');
  const [activeIndustry, setActiveIndustry] = useState<string>('Software Engineering');
  
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const filteredCompanies = companies.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file.');
      return;
    }

    setIsUploading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      }
      setResumeOrJD(fullText.trim());
      if (textareaRef.current) {
        textareaRef.current.value = fullText.trim();
      }
    } catch (error) {
      console.error('Error parsing PDF:', error);
      alert('Failed to parse PDF. Please try copying and pasting the text instead.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDomainClick = (domain: Domain) => {
    onStart(domain, resumeOrJD, difficulty, persona, language);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 relative overflow-hidden flex flex-col items-center justify-start pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-900/20 via-[#0a0a0a] to-[#0a0a0a] -z-10" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 sm:mb-20 max-w-4xl mx-auto relative w-full"
      >
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-orange-500/20 rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] sm:text-sm font-bold mb-6"
        >
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
          {user ? `Welcome back, ${user.displayName || user.email?.split('@')[0]}!` : 'Master Your Interview'}
        </motion.div>

        <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black tracking-tighter mb-6 sm:mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/20 leading-[0.9]">
          MASTER THE <br className="hidden sm:block" /> INTERVIEW
        </h1>

        <p className="text-base sm:text-xl lg:text-2xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed px-4">
          The world's most advanced AI-powered interview simulator.
          <span className="text-white"> Real-time feedback, industry-specific paths.</span>
        </p>
      </motion.div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Sidebar - Settings & Resume */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#151619]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto custom-scrollbar">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-orange-500" />
              Interview Setup
            </h2>

            <div className="space-y-6">
              {/* Difficulty */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all appearance-none"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* Persona */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Interviewer Persona</label>
                <select
                  value={persona}
                  onChange={(e) => setPersona(e.target.value as InterviewerPersona)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all appearance-none"
                >
                  <option value="Friendly">Friendly & Supportive</option>
                  <option value="Professional">Professional & Objective</option>
                  <option value="Strict">Strict & Challenging</option>
                  <option value="Technical Expert">Deep Technical Expert</option>
                  <option value="HR">HR Manager</option>
                  <option value="Stern">Stern & Formal</option>
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Spoken Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all appearance-none"
                >
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                  ))}
                </select>
              </div>

              <hr className="border-white/5" />

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Resume / Context (Optional)
                </label>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full mb-3 border-2 border-dashed border-white/10 hover:border-orange-500/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-colors group cursor-pointer bg-white/[0.01] hover:bg-orange-500/5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
                  ) : (
                    <Upload className="w-6 h-6 text-orange-500 group-hover:scale-110 transition-transform" />
                  )}
                  <div className="text-center">
                    <p className="font-bold text-sm text-gray-300">{isUploading ? 'Parsing...' : 'Upload PDF'}</p>
                  </div>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf"
                  className="hidden"
                />

                <textarea
                  ref={textareaRef}
                  value={resumeOrJD}
                  onChange={(e) => setResumeOrJD(e.target.value)}
                  placeholder="Or paste your context here..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 min-h-[120px] text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all resize-y text-sm font-mono mb-4"
                />
                
                {resumeOrJD.trim().length > 0 ? (
                  <button 
                    onClick={() => handleDomainClick('Personalized')}
                    className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                  >
                    <Play className="w-5 h-5" />
                    Start Resume/JD Interview
                  </button>
                ) : null}
              </div>

            </div>
          </div>
        </div>

        {/* Right Content - Grids */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Companies Section */}
          <section>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Building2 className="w-6 h-6 text-orange-500" />
                Target Company
              </h2>
              
              <div className="flex items-center gap-2 overflow-x-auto pb-3 custom-scrollbar scroll-smooth [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
                {['All', 'MAANG', 'Service', 'Product', 'Consulting'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat as any)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap",
                      activeCategory === cat 
                        ? "bg-orange-500 text-white" 
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredCompanies.map((company) => (
                <button
                  key={company.name}
                  onClick={() => handleDomainClick(company.name)}
                  className="p-6 rounded-2xl bg-[#151619] border border-white/5 hover:border-orange-500/50 hover:bg-white/5 transition-all text-left flex flex-col gap-4 group relative overflow-hidden"
                >
                  <div 
                    className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl opacity-10 group-hover:opacity-30 transition-opacity rounded-bl-full"
                    style={{ backgroundImage: `linear-gradient(to bottom left, ${company.color}, transparent)` }}
                  />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-white p-2 flex items-center justify-center shadow-lg">
                      <img src={company.logo} alt={company.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">{company.name}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-black/50 px-2 py-0.5 rounded">
                          {company.difficulty}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400/80 bg-orange-500/10 px-2 py-0.5 rounded">
                          {company.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 relative z-10 line-clamp-2 leading-relaxed">{company.description}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Industry Domains Section */}
          <section>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-orange-500" />
                Domains by Industry
              </h2>
              <div className="flex items-center gap-2 overflow-x-auto pb-3 custom-scrollbar scroll-smooth [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
                {Array.from(new Set(domains.map(d => d.industry))).map((industry) => (
                  <button
                    key={industry}
                    onClick={() => setActiveIndustry(industry)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap",
                      activeIndustry === industry 
                        ? "bg-orange-500 text-white" 
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                    )}
                  >
                    {industry}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {domains.filter(d => d.industry === activeIndustry).map((domain) => (
                <button
                  key={domain.name}
                  onClick={() => handleDomainClick(domain.name)}
                  className="p-6 rounded-2xl bg-[#151619] border border-white/5 hover:border-orange-500/50 hover:bg-white/5 transition-all text-left flex items-start gap-4 group"
                >
                  <div className="p-3 bg-black/50 rounded-xl text-orange-500 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-lg">
                    {domain.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">{domain.name}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{domain.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

                    {/* Quizzes & Assessments */}
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

        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto mt-20 pt-8 pb-12 border-t border-white/10 text-center flex flex-col items-center justify-center gap-2 relative z-10">
        <div className="flex items-center gap-2 text-gray-400 font-medium">
          <span>Powered By</span>
          <span className="text-orange-500 font-black tracking-wider text-lg">SCT</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Empowering candidates with AI-driven mock interviews and real-time feedback.
        </p>
        <p className="text-xs text-gray-600 mt-1">
          &copy; 2026 AI Mock Interviewer. All rights reserved.
        </p>
      </footer>
    </div>
  );
};