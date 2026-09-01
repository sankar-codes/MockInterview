import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /\{\/\* Auth Modal \*\/\}[\s\S]*?\{view === 'landing' && <LandingPage/m,
  "{/* Auth Modal */}\n      {showAuthModal && (\n        <AuthModal onClose={() => setShowAuthModal(false)} />\n      )}\n\n      <main>\n        {view === 'landing' && <LandingPage"
);

fs.writeFileSync('src/App.tsx', content);
