import fs from 'fs';
let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const target = `const domains: { name: Domain; icon: React.ReactNode; description: string; industry: string }[] = [`;
const replacement = `const domains: { name: Domain; icon: React.ReactNode; description: string; industry: string }[] = [
  { name: 'Generative AI', icon: <Sparkles className="w-8 h-8" />, description: 'Image, text, and audio generation models.', industry: 'AI' },
  { name: 'Machine Learning', icon: <Brain className="w-8 h-8" />, description: 'Predictive modeling, classification, and regression.', industry: 'AI' },
  { name: 'Deep Learning', icon: <Network className="w-8 h-8" />, description: 'Neural networks, PyTorch, and TensorFlow.', industry: 'AI' },
  { name: 'Natural Language Processing (NLP)', icon: <MessageSquare className="w-8 h-8" />, description: 'Text analysis, transformers, and sentiment analysis.', industry: 'AI' },
  { name: 'Computer Vision', icon: <Eye className="w-8 h-8" />, description: 'Image recognition, object detection, and OpenCV.', industry: 'AI' },
  { name: 'Large Language Models (LLMs)', icon: <BookOpen className="w-8 h-8" />, description: 'GPT, Claude, Gemini, and model fine-tuning.', industry: 'AI' },
  { name: 'Prompt Engineering', icon: <Terminal className="w-8 h-8" />, description: 'Context window optimization and few-shot prompting.', industry: 'AI' },
  { name: 'AI Agents', icon: <Cpu className="w-8 h-8" />, description: 'Autonomous agents, LangChain, and tool use.', industry: 'AI' },
  { name: 'Retrieval-Augmented Generation (RAG)', icon: <Database className="w-8 h-8" />, description: 'Vector databases, embeddings, and context retrieval.', industry: 'AI' },
  { name: 'AI-assisted Software Development', icon: <Code2 className="w-8 h-8" />, description: 'Copilot, Cursor, and AI-driven workflow automation.', industry: 'AI' },
`;

if(content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/components/LandingPage.tsx', content);
  console.log("Domains added.");
} else {
  console.log("Target not found!");
}
