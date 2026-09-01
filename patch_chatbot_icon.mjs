import fs from 'fs';
let content = fs.readFileSync('src/components/ChatbotWidget.tsx', 'utf8');
content = content.replace('<MessageCircle className="w-6 h-6 text-white" />', '<Bot className="w-6 h-6 text-white" />');
fs.writeFileSync('src/components/ChatbotWidget.tsx', content);
console.log("Chatbot icon updated.");
