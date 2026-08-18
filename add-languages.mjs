import fs from 'fs';

let content = fs.readFileSync('src/types.ts', 'utf8');

content = content.replace(
  "{ code: 'te-IN', name: 'Telugu' }",
  "{ code: 'te-IN', name: 'Telugu' },\n  { code: 'ml-IN', name: 'Malayalam' },\n  { code: 'kn-IN', name: 'Kannada' }"
);

fs.writeFileSync('src/types.ts', content);
