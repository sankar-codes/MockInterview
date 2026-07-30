import fs from 'fs';
let content = fs.readFileSync('src/firebase.ts', 'utf8');

content = content.replace(
  /apiKey: \(import\.meta as any\)\.env\.VITE_FIREBASE_API_KEY \|\| localConfig\.apiKey,/g,
  'apiKey: localConfig.apiKey,'
).replace(
  /authDomain: \(import\.meta as any\)\.env\.VITE_FIREBASE_AUTH_DOMAIN \|\| localConfig\.authDomain,/g,
  'authDomain: localConfig.authDomain,'
).replace(
  /projectId: \(import\.meta as any\)\.env\.VITE_FIREBASE_PROJECT_ID \|\| localConfig\.projectId,/g,
  'projectId: localConfig.projectId,'
).replace(
  /storageBucket: \(import\.meta as any\)\.env\.VITE_FIREBASE_STORAGE_BUCKET \|\| localConfig\.storageBucket,/g,
  'storageBucket: localConfig.storageBucket,'
).replace(
  /messagingSenderId: \(import\.meta as any\)\.env\.VITE_FIREBASE_MESSAGING_SENDER_ID \|\| localConfig\.messagingSenderId,/g,
  'messagingSenderId: localConfig.messagingSenderId,'
).replace(
  /appId: \(import\.meta as any\)\.env\.VITE_FIREBASE_APP_ID \|\| localConfig\.appId,/g,
  'appId: localConfig.appId,'
).replace(
  /measurementId: \(import\.meta as any\)\.env\.VITE_FIREBASE_MEASUREMENT_ID \|\| localConfig\.measurementId,/g,
  'measurementId: localConfig.measurementId,'
).replace(
  /firestoreDatabaseId: \(import\.meta as any\)\.env\.VITE_FIREBASE_DATABASE_ID \|\| localConfig\.firestoreDatabaseId/g,
  'firestoreDatabaseId: localConfig.firestoreDatabaseId'
);

fs.writeFileSync('src/firebase.ts', content);
