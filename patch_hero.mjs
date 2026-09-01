import fs from 'fs';

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const target = `        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
          Master Your <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Interview.</span>
        </h1>`;

const replacement = `        <motion.h1 
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
        </motion.h1>`;

if(content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/components/LandingPage.tsx', content);
  console.log("Hero updated successfully.");
} else {
  console.log("Target not found!");
}
