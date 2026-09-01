import fs from 'fs';

let content = fs.readFileSync('src/types.ts', 'utf8');

const replacement = `export type Domain = 
  | 'Generative AI'
  | 'Machine Learning'
  | 'Deep Learning'
  | 'Natural Language Processing (NLP)'
  | 'Computer Vision'
  | 'Large Language Models (LLMs)'
  | 'Prompt Engineering'
  | 'AI Agents'
  | 'Retrieval-Augmented Generation (RAG)'
  | 'AI-assisted Software Development'
  | 'Frontend Development'`;

content = content.replace(`export type Domain = \n  | 'Frontend Development'`, replacement);
fs.writeFileSync('src/types.ts', content);
console.log("types patched.");
