import fs from 'fs';

let content = fs.readFileSync('src/types.ts', 'utf8');

// Update Personas
content = content.replace(
  "export type InterviewerPersona = 'Friendly' | 'Stern' | 'Technical Expert';",
  "export type InterviewerPersona = 'Friendly' | 'Stern' | 'Technical Expert' | 'Professional' | 'Strict' | 'HR';"
);

// Add some domains if missing
content = content.replace(
  "  | 'System Design'",
  "  | 'Data Structures and Algorithms (DSA)'\n  | 'Database Management System (DBMS)'\n  | 'Operating Systems (OS)'\n  | 'Computer Networks'\n  | 'Object-Oriented Programming (OOP)'\n  | 'Python Programming'\n  | 'Java Programming'\n  | 'JavaScript Programming'\n  | 'C/C++ Programming'\n  | 'System Design'"
);

fs.writeFileSync('src/types.ts', content);
