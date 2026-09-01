import fs from 'fs';

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const replacement = `          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto mt-20 pt-8 pb-12 border-t border-white/10 text-center flex flex-col items-center justify-center gap-2 relative z-10">
        <div className="flex items-center gap-2 text-gray-400 font-medium">
          <span>Powered By</span>
          <span className="text-orange-500 font-black tracking-wider text-lg">SCT</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Empowering candidates with AI-driven mock interviews and real-time feedback.
        </p>
        <p className="text-xs text-gray-600 mt-1">
          &copy; ${new Date().getFullYear()} AI Mock Interviewer. All rights reserved.
        </p>
      </footer>
    </div>
  );
};`;

const regex = /<\/section>\s*<\/div>\s*<\/div>\s*<\/div>\s*\);\s*};\s*$/;
if(regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/components/LandingPage.tsx', content);
  console.log("Footer added successfully.");
} else {
  console.log("Target not found!");
}
