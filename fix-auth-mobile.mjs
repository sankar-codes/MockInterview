import fs from 'fs';

let content = fs.readFileSync('src/components/AuthModal.tsx', 'utf8');

content = content.replace(/const isMobile = \/iPhone\|iPad\|iPod\|Android\/i\.test\(navigator\.userAgent\);\s*try \{\s*if \(isMobile\) \{\s*await signInWithRedirect\(auth, provider\);\s*\} else \{\s*await signInWithPopup\(auth, provider\);\s*\}\s*onClose\(\);/g, 
`try {
      await signInWithPopup(auth, provider);
      onClose();`);

fs.writeFileSync('src/components/AuthModal.tsx', content);
