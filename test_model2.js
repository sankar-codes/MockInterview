import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

async function test() {
  try {
    const ai = new GoogleGenAI({ apiKey: "AIzaSy..." }); // Just a fake key to test
    const res = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: 'Hello'
    });
    console.log('Success:', res.text);
  } catch (e) {
    console.log('Error name:', e.name);
    console.log('Error message:', e.message);
    console.log('Error status:', e.status);
  }
}
test();
