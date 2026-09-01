import fs from 'fs';
let gitignore = fs.readFileSync('.gitignore', 'utf8');

if (!gitignore.includes('src/firebase-applet-config.json')) {
  gitignore += '\nsrc/firebase-applet-config.json\n';
}
if (!gitignore.includes('.env\n') && !gitignore.includes('*.env')) {
  gitignore += '.env\n';
}

fs.writeFileSync('.gitignore', gitignore);
console.log(".gitignore updated");
