import fs from 'fs';
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

code = code.replace(
  "animate-in fade-in zoom-in duration-300",
  ""
);

fs.writeFileSync('src/components/LandingPage.tsx', code);
