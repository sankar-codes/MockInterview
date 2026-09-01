const fs = require('fs');

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const target1 = '<div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar scroll-smooth [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">';
const replacement1 = '<div className="flex items-center gap-2 overflow-x-auto pb-3 custom-scrollbar scroll-smooth [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">';

content = content.replace(target1, replacement1);
content = content.replace(target1, replacement1); // two instances
fs.writeFileSync('src/components/LandingPage.tsx', content);
console.log("LandingPage patched.");
