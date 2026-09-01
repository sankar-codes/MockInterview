import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('src/firebase-applet-config.json', 'utf8'));

const envVars = [
  `VITE_FIREBASE_API_KEY="${firebaseConfig.apiKey}"`,
  `VITE_FIREBASE_AUTH_DOMAIN="${firebaseConfig.authDomain}"`,
  `VITE_FIREBASE_PROJECT_ID="${firebaseConfig.projectId}"`,
  `VITE_FIREBASE_STORAGE_BUCKET="${firebaseConfig.storageBucket}"`,
  `VITE_FIREBASE_MESSAGING_SENDER_ID="${firebaseConfig.messagingSenderId}"`,
  `VITE_FIREBASE_APP_ID="${firebaseConfig.appId}"`,
  `VITE_FIREBASE_DATABASE_ID="${firebaseConfig.firestoreDatabaseId}"`,
].join('\n');

const envExampleVars = [
  `VITE_FIREBASE_API_KEY=""`,
  `VITE_FIREBASE_AUTH_DOMAIN=""`,
  `VITE_FIREBASE_PROJECT_ID=""`,
  `VITE_FIREBASE_STORAGE_BUCKET=""`,
  `VITE_FIREBASE_MESSAGING_SENDER_ID=""`,
  `VITE_FIREBASE_APP_ID=""`,
  `VITE_FIREBASE_DATABASE_ID=""`,
].join('\n');

// Write .env
fs.writeFileSync('.env', envVars + '\n');

// Append to .env.example
let envExample = fs.readFileSync('.env.example', 'utf8');
if (!envExample.includes('VITE_FIREBASE_API_KEY')) {
  envExample += '\n# Firebase Configuration\n' + envExampleVars + '\n';
  fs.writeFileSync('.env.example', envExample);
}

console.log(".env and .env.example updated");
