import fs from 'fs';
let content = fs.readFileSync('tsconfig.json', 'utf8');
const data = JSON.parse(content);
data.compilerOptions.types = ["vite/client"];
fs.writeFileSync('tsconfig.json', JSON.stringify(data, null, 2));
