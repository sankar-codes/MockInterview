import fs from 'fs';
let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');
content = content.replace("from 'lucide-react';", ", Eye, BookOpen, MessageSquare } from 'lucide-react';");
fs.writeFileSync('src/components/LandingPage.tsx', content);
