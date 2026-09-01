import fs from 'fs';
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

code = code.replace(
  'className="bg-[#151619]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sticky top-6"',
  'className="bg-[#151619]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto custom-scrollbar"'
);

fs.writeFileSync('src/components/LandingPage.tsx', code);
