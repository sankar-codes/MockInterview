import fs from 'fs';
let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');
content = content.replace("} , Eye, BookOpen, MessageSquare }", ", Eye, BookOpen, MessageSquare }");
fs.writeFileSync('src/components/LandingPage.tsx', content);
