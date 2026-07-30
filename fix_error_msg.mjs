import fs from 'fs';
let code = fs.readFileSync('src/components/InterviewSession.tsx', 'utf8');

const replacement = `<main className="flex-1 flex flex-col items-center p-6 gap-6 overflow-hidden">
        {errorMsg && (
          <div className="w-full max-w-4xl p-4 bg-red-500/10 border border-red-500 text-red-500 rounded-lg text-center mb-4">
            <AlertCircle className="w-5 h-5 inline-block mr-2" />
            {errorMsg}
          </div>
        )}`;

code = code.replace(
  /<main className="flex-1 flex flex-col items-center p-6 gap-6 overflow-hidden">/,
  replacement
);

fs.writeFileSync('src/components/InterviewSession.tsx', code);
