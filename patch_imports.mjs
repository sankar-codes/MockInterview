import fs from 'fs';
let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

if (content.includes('import { Briefcase')) {
  if (!content.includes('Layers,')) {
    content = content.replace("import { Briefcase,", "import { Briefcase, Layers, Wifi,");
    fs.writeFileSync('src/components/LandingPage.tsx', content);
    console.log("Imports updated.");
  }
}
