import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

const effectOld = `  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    const saved = localStorage.getItem('interviews');
    if (saved) {
      setPastInterviews(JSON.parse(saved));
    }
    return () => unsubscribe();
  }, []);`;

const effectNew = `  useEffect(() => {
    if (!isConfigured || !auth) {
      setIsAuthLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    const saved = localStorage.getItem('interviews');
    if (saved) {
      setPastInterviews(JSON.parse(saved));
    }
    return () => unsubscribe();
  }, []);`;

content = content.replace(effectOld, effectNew);

// Also patch handleLogout just in case
const logoutOld = `const handleLogout = async () => { await signOut(auth); };`;
const logoutNew = `const handleLogout = async () => { if (auth) await signOut(auth); };`;
content = content.replace(logoutOld, logoutNew);

fs.writeFileSync('src/App.tsx', content);
console.log("App.tsx effect fixed");
