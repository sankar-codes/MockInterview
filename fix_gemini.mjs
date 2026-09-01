import fs from 'fs';
let code = fs.readFileSync('src/services/geminiService.ts', 'utf8');

const replacement = `  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate question');
  }
  return response.json();`;

code = code.replace(/  if \(\!response\.ok\) throw new Error\('Failed to generate question'\);\n  return response\.json\(\);/g, replacement);

const replacement2 = `  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to evaluate response');
  }
  return response.json();`;

code = code.replace(/  if \(\!response\.ok\) throw new Error\('Failed to evaluate response'\);\n  return response\.json\(\);/g, replacement2);

const replacement3 = `  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate feedback');
  }
  return response.json();`;

code = code.replace(/  if \(\!response\.ok\) throw new Error\('Failed to generate feedback'\);\n  return response\.json\(\);/g, replacement3);

const replacement4 = `  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate roadmap');
  }
  return response.json();`;

code = code.replace(/  if \(\!response\.ok\) throw new Error\('Failed to generate roadmap'\);\n  return response\.json\(\);/g, replacement4);

fs.writeFileSync('src/services/geminiService.ts', code);
