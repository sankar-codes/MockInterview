import fs from 'fs';
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');
let newLines = ["import React, { useState, useEffect } from 'react';"];
let start = false;
for (let line of lines) {
  if (line.includes("import { LandingPage }")) start = true;
  if (start) newLines.push(line);
}
fs.writeFileSync('src/App.tsx', newLines.join('\n'));
