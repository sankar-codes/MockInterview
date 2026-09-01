import fs from 'fs';
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const target = `  const domainStats = interviews.reduce((acc: any, curr) => {
    const domain = curr.domain;
    if (!acc[domain]) acc[domain] = { name: domain, count: 0, totalScore: 0 };
    acc[domain].count += 1;
    acc[domain].totalScore += (curr.feedback?.overallScore || 0);
    return acc;
  }, {});`;

const replacement = `  const domainStats = interviews.reduce((acc: any, curr) => {
    const domain = curr.domain;
    const score = curr.feedback?.overallScore || 0;
    const date = curr.createdAt?.toDate ? curr.createdAt.toDate() : (curr.createdAt ? new Date(curr.createdAt) : new Date());
    
    if (!acc[domain]) acc[domain] = { name: domain, count: 0, totalScore: 0, maxScore: 0, latestDate: date };
    
    acc[domain].count += 1;
    acc[domain].totalScore += score;
    if (score > acc[domain].maxScore) {
      acc[domain].maxScore = score;
      acc[domain].latestDate = date;
    }
    return acc;
  }, {});

  // Calculate certifications (Top score >= 80 per domain)
  const certifications = Object.values(domainStats)
    .filter((d: any) => d.maxScore >= 80)
    .map((d: any) => ({
      domain: d.name,
      score: d.maxScore,
      date: d.latestDate,
    }))
    .sort((a, b) => b.score - a.score);`;

if(content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/components/Dashboard.tsx', content);
  console.log("domainStats updated.");
} else {
  console.log("Target not found!");
}
