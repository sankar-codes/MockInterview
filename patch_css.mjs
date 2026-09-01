import fs from 'fs';

let content = fs.readFileSync('src/index.css', 'utf8');
content = content.replace('.custom-scrollbar::-webkit-scrollbar {\\n  width: 6px;\\n}', '.custom-scrollbar::-webkit-scrollbar {\\n  width: 6px;\\n  height: 6px;\\n}');

fs.writeFileSync('src/index.css', content);
console.log("CSS patched.");
