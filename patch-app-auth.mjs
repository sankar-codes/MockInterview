import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
content = content.replace(
  "import { LandingPage } from './components/LandingPage';",
  "import { LandingPage } from './components/LandingPage';\nimport { AuthModal } from './components/AuthModal';"
);

// Remove the auth state logic from App.tsx
content = content.replace(
  /  \/\/ Email Auth State[\s\S]*?const \[authError, setAuthError\] = useState\(''\);/,
  "  const [showAuthModal, setShowAuthModal] = useState(false);"
);

// Remove the handleGoogleLogin and handleEmailAuth from App.tsx
content = content.replace(
  /  const handleGoogleLogin = async \(\) => \{[\s\S]*?const handleEmailAuth = async \(e: React.FormEvent\) => \{[\s\S]*?setAuthLoading\(false\);\n    \}\n  \};/,
  ""
);

// Replace the modal render with AuthModal component
content = content.replace(
  /\{\/\* Auth Modal \*\/\}(.|\n)*?\n      \}/,
  "{/* Auth Modal */}\n      {showAuthModal && (\n        <AuthModal onClose={() => setShowAuthModal(false)} />\n      )}"
);

fs.writeFileSync('src/App.tsx', content);
