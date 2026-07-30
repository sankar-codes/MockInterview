import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

const regex = /app\.listen\(PORT, "0\.0\.0\.0", \(\) => \{\s*console\.log\(`Server running on http:\/\/localhost:\$\{PORT\}`\);\s*\}\);\s*\}/s;

const replacement = `if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(\`Server running on http://localhost:\${PORT}\`);
    });
  }
}`;

code = code.replace(regex, replacement);
if (!code.includes('export default app;')) {
  code += '\nexport default app;';
}
fs.writeFileSync('server.ts', code);
