import fs from 'fs';

let content = fs.readFileSync('src/types.ts', 'utf8');

// Replace the entire Domain type
content = content.replace(/export type Domain =[\s\S]*?;/m, 'export type Domain = string;');

fs.writeFileSync('src/types.ts', content);
