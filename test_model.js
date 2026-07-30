import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

async function test() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const res = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: 'Hello'
    });
    console.log('Success:', res.text);
  } catch (e) {
    console.error('Error:', e.message);
  }
}
test();
