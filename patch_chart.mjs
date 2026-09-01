import fs from 'fs';

let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const targetLogic = `  // Progress over time
  const timelineData = [...interviews]
    .sort((a, b) => a.createdAt?.toDate() - b.createdAt?.toDate())
    .map((i, index) => ({
      name: \`Int \${index + 1}\`,
      score: i.feedback?.overallScore || 0
    }));`;

const replacementLogic = `  // Progress over time (last 10)
  const sortedInterviews = [...interviews].sort((a, b) => {
    const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
    const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
    return dateA - dateB;
  });
  const last10Interviews = sortedInterviews.slice(-10);
  const timelineData = last10Interviews.map((i, index) => ({
    name: \`Int \${sortedInterviews.length - last10Interviews.length + index + 1}\`,
    score: i.feedback?.overallScore || 0
  }));`;

const targetTitle = `<TrendingUp className="w-5 h-5 text-blue-500" /> Learning Curve`;
const replacementTitle = `<TrendingUp className="w-5 h-5 text-blue-500" /> Score Progress (Last 10)`;

if(content.includes(targetLogic)) {
  content = content.replace(targetLogic, replacementLogic);
  if(content.includes(targetTitle)) {
    content = content.replace(targetTitle, replacementTitle);
    fs.writeFileSync('src/components/Dashboard.tsx', content);
    console.log("Chart updated successfully.");
  } else {
    console.log("Title target not found!");
  }
} else {
  console.log("Logic target not found!");
}
