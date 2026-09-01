import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

const regex = /  app\.listen\(PORT, "0\.0\.0\.0", \(\) => \{\n    console\.log\(`Server running on http:\/\/localhost:\$\{PORT\}`\);\n  \}\);\n\}\nstartServer\(\);/s;

const replacement = `  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(\`Server running on http://localhost:\${PORT}\`);
    });
  }
}
startServer();

export default app;`;

code = code.replace(regex, replacement);
fs.writeFileSync('server.ts', code);
