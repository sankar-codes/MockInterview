import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `
    if (user) {
      try {
        const newInterview = {
          id: Date.now().toString(),
          uid: user.uid,
          domain: selectedDomain,
          questions: questions,
          feedback: {
            overallScore: Math.round(questions.reduce((acc, q) => acc + (q.score || 0), 0) / questions.length),
          },
          status: 'completed',
          createdAt: new Date().toISOString(),
        };
        const saved = localStorage.getItem('interviews');
        const past = saved ? JSON.parse(saved) : [];
        const updated = [newInterview, ...past];
        localStorage.setItem('interviews', JSON.stringify(updated));
        setPastInterviews(updated);
      } catch (error) {
        console.error('Error saving interview locally:', error);
      }
    }
`;

content = content.replace(/    if \(user\) \{\n      try \{\n        await addDoc\(collection\(db, 'interviews'\), \{[\s\S]*?\}\);\n      \} catch \(error\) \{[\s\S]*?\}\n    \}/, replacement);

fs.writeFileSync('src/App.tsx', content);
