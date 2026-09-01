import fs from 'fs';

let content = fs.readFileSync('src/components/HRQuestionsSection.tsx', 'utf8');

const target1 = `  const [activeFilter, setActiveFilter] = useState<'All' | 'Fresher' | 'Technical' | 'HR' | 'Situational'>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filters = ['All', 'Fresher', 'Technical', 'HR', 'Situational'];
  const filteredQuestions = hrQuestions.filter(q => activeFilter === 'All' || q.category === activeFilter);`;

const replacement1 = `  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Show all questions since the filter UI was removed
  const filteredQuestions = hrQuestions;`;

if(content.includes(target1)) {
  content = content.replace(target1, replacement1);
  fs.writeFileSync('src/components/HRQuestionsSection.tsx', content);
  console.log("HRQuestionsSection patched for unused vars.");
} else {
  console.log("Target not found!");
}
