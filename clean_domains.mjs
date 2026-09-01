import fs from 'fs';

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

// The array starts at: const domains: { name: Domain; icon: React.ReactNode; description: string; industry: string }[] = [
// and ends at ]; before export const LandingPage

const startIndex = content.indexOf('const domains: { name: Domain; icon: React.ReactNode; description: string; industry: string }[] = [');
const endIndex = content.indexOf('];', startIndex) + 2;

const arrayString = content.substring(startIndex, endIndex);

// Let's just create a completely fresh, duplicate-free array based on everything we have.
// We can use a Map to keep the last seen entry for each domain name.
const itemRegex = /{ name: '([^']+)',[\s\S]*?},?/g;
let match;
const uniqueDomains = new Map();

while ((match = itemRegex.exec(arrayString)) !== null) {
  uniqueDomains.set(match[1], match[0].replace(/,$/, '')); // Store the object string
}

let newArrayString = 'const domains: { name: Domain; icon: React.ReactNode; description: string; industry: string }[] = [\n';
for (const val of uniqueDomains.values()) {
  newArrayString += `  ${val},\n`;
}
newArrayString = newArrayString.replace(/,\n$/, '\n];');

content = content.slice(0, startIndex) + newArrayString + content.slice(endIndex);
fs.writeFileSync('src/components/LandingPage.tsx', content);
console.log("Cleaned duplicates.");
