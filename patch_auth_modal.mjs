import fs from 'fs';

let content = fs.readFileSync('src/components/AuthModal.tsx', 'utf8');

// Add imports
if (!content.includes("import { auth, googleProvider } from '../lib/firebase'")) {
  content = content.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { auth, googleProvider } from '../lib/firebase';\nimport { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';");
}

// Modify handleGoogleLogin
content = content.replace(
  `    // mock provider
    const provider = {};
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      onClose();`,
  `    try {
      await signInWithPopup(auth, googleProvider);
      onClose();`
);

// Modify handleEmailAuth
content = content.replace(
  `    try {
      if (isSignUp) {
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      onClose();`,
  `    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();`
);

fs.writeFileSync('src/components/AuthModal.tsx', content);
console.log("AuthModal.tsx patched for Firebase Auth.");
