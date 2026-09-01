import fs from 'fs';

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const target = `      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl flex flex-col items-center mb-16 text-center"
      >
        <div className="inline-flex items-center justify-center p-3 bg-orange-500/10 text-orange-500 rounded-2xl mb-6">
          <Sparkles className="w-8 h-8" />
        </div>
        <motion.h1 
          className="flex flex-col items-center justify-center font-black mb-8 tracking-tighter uppercase"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }}
        >
          <motion.span 
            variants={{
              hidden: { opacity: 0, y: 40, scale: 0.9 },
              visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } }
            }}
            className="text-[3.5rem] sm:text-[5rem] md:text-[6.5rem] lg:text-[7.5rem] leading-[0.9] text-white"
          >
            MASTER THE
          </motion.span>
          <motion.span 
            variants={{
              hidden: { opacity: 0, y: 40, scale: 0.9 },
              visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } }
            }}
            className="text-[4rem] sm:text-[6rem] md:text-[7.5rem] lg:text-[9rem] leading-[0.9] bg-gradient-to-b from-white via-gray-400 to-[#0a0a0a] bg-clip-text text-transparent pb-4"
          >
            INTERVIEW
          </motion.span>
        </motion.h1>
        <p className="text-xl text-gray-400 max-w-2xl mb-12">
          Practice with an advanced AI interviewer. Choose your domain, target company, or customize your setup to start preparing.
        </p>
      </motion.div>`;

const replacement = `      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 sm:mb-20 max-w-4xl mx-auto relative w-full"
      >
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-orange-500/20 rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] sm:text-sm font-bold mb-6"
        >
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
          {user ? \`Welcome back, \${user.displayName || user.email?.split('@')[0]}!\` : 'Master Your Interview'}
        </motion.div>

        <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black tracking-tighter mb-6 sm:mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/20 leading-[0.9]">
          MASTER THE <br className="hidden sm:block" /> INTERVIEW
        </h1>

        <p className="text-base sm:text-xl lg:text-2xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed px-4">
          The world's most advanced AI-powered interview simulator.
          <span className="text-white"> Real-time feedback, industry-specific paths.</span>
        </p>
      </motion.div>`;

if(content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/components/LandingPage.tsx', content);
  console.log("Hero exactly matched to Vercel site.");
} else {
  console.log("Target not found!");
}
