import fs from 'fs';

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const target = `<div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">`;
const replacement = `<div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar scroll-smooth [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">`;

if(content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/components/LandingPage.tsx', content);
  console.log("Mask updated.");
} else {
  console.log("Target not found!");
}
