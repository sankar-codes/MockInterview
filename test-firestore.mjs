import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);
const auth = getAuth(app);

async function test() {
  try {
    // We cannot easily sign in without credentials, so let's just make an unauthenticated request.
    // It should fail with permission-denied, which means it reached the server.
    const q = query(collection(db, 'interviews'), where('uid', '==', 'test-uid'));
    await getDocs(q);
    console.log("Success");
  } catch (e) {
    console.log("Error:", e.code, e.message);
  }
}
test();
