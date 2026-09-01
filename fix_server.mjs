import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

// Undo the `}); }` mess
code = code.replace(/  \}\); \}/g, '  });');

// Undo the `if (!process.env.VERCEL) { app.listen` mess
code = code.replace(/if \(!process\.env\.VERCEL\) \{ app\.listen\(PORT, "0\.0\.0\.0", \(\) => \{/g, 'app.listen(PORT, "0.0.0.0", () => {');

// Clean up any extra `export default app;`
code = code.replace(/export default app;\n/g, '');
code = code.replace(/export default app;/g, '');

// Now we apply the correct changes to the end of the file
// Find the exact block we want to replace
const target = `  app.listen(PORT, "0.0.0.0", () => {
    console.log(\`Server running on http://localhost:\${PORT}\`);
  });
}
startServer();`;

const replacement = `  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(\`Server running on http://localhost:\${PORT}\`);
    });
  }
}
startServer();

export default app;`;

code = code.replace(target, replacement);

fs.writeFileSync('server.ts', code);
