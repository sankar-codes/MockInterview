import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /console\.error\("Authentication error:", error\);\n\s*setAuthError\(error\.message\);/g,
  `console.error("Authentication error:", error);
        if (error.code === 'auth/network-request-failed') {
          setAuthError("Network error. This usually happens if you have an ad-blocker enabled, or if you're viewing this in a preview iframe. Please try opening the app in a new tab, or disable your ad-blocker.");
        } else {
          setAuthError(error.message);
        }`
);

fs.writeFileSync('src/App.tsx', content);
