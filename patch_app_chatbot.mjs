import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('import { ChatbotWidget }')) {
  content = content.replace(
    "import { Dashboard } from './components/Dashboard';",
    "import { Dashboard } from './components/Dashboard';\nimport { ChatbotWidget } from './components/ChatbotWidget';"
  );
  
  content = content.replace(
    "</main>\n    </div>\n  );\n}",
    "</main>\n      <ChatbotWidget />\n    </div>\n  );\n}"
  );

  fs.writeFileSync('src/App.tsx', content);
  console.log("Chatbot added to App.tsx");
} else {
  console.log("Chatbot already present in App.tsx");
}
