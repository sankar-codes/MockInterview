import fs from 'fs';

let lp = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');
lp = lp.replace(/import \{ onAuthStateChanged, User \} from 'firebase\/auth';/g, '');
lp = lp.replace(/import \{ auth \} from '\.\.\/firebase';/g, '');
fs.writeFileSync('src/components/LandingPage.tsx', lp);

let am = fs.readFileSync('src/components/AuthModal.tsx', 'utf8');
am = am.replace(/import \{ signInWithPopup.*?\} from 'firebase\/auth';/g, '');
am = am.replace(/import \{ auth \} from '\.\.\/firebase';/g, '');
// Change handleAuth to just close the modal or act as a local mock
am = am.replace(/const handleAuth = async \(e: React\.FormEvent\) => \{[\s\S]*?\} catch \(err: any\) \{[\s\S]*?\}\n  \};/g, `const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };`);
am = am.replace(/const handleGoogleSignIn = async \(\) => \{[\s\S]*?\} catch \(err: any\) \{[\s\S]*?\}\n  \};/g, `const handleGoogleSignIn = async () => {
    onClose();
  };`);

fs.writeFileSync('src/components/AuthModal.tsx', am);
