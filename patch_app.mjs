import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add imports
if (!content.includes("import { auth } from './lib/firebase'")) {
  content = content.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { auth } from './lib/firebase';\nimport { onAuthStateChanged, signOut } from 'firebase/auth';");
}

// Modify state
content = content.replace(
  "const [user, setUser] = useState<any>({ uid: \"local-user\", email: \"guest@example.com\" });",
  "const [user, setUser] = useState<any>(null);"
);

// Modify useEffect to include onAuthStateChanged
content = content.replace(
  "useEffect(() => {",
  `useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });`
);

content = content.replace(
  "setIsAuthLoading(false);",
  "setIsAuthLoading(false);"
); // just checking if it exists

content = content.replace(
  `    const saved = localStorage.getItem('interviews');
    if (saved) {
      setPastInterviews(JSON.parse(saved));
    }
  }, []);`,
  `    const saved = localStorage.getItem('interviews');
    if (saved) {
      setPastInterviews(JSON.parse(saved));
    }
    return () => unsubscribe();
  }, []);`
);


// update handleLogout
content = content.replace(
  "const handleLogout = () => { /* No-op */ };",
  "const handleLogout = async () => { await signOut(auth); };"
);

// Initially set isAuthLoading to true so it shows loader until onAuthStateChanged fires once
content = content.replace(
  "const [isAuthLoading, setIsAuthLoading] = useState(false);",
  "const [isAuthLoading, setIsAuthLoading] = useState(true);"
);

fs.writeFileSync('src/App.tsx', content);
console.log("App.tsx patched for Firebase Auth.");
