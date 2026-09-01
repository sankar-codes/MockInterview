import fs from 'fs';

let content = fs.readFileSync('src/components/HRQuestionsSection.tsx', 'utf8');

const target = `<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-orange-500" />
          HR & Frequently Asked Questions
        </h2>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar scroll-smooth [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter as any)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap",
                activeFilter === filter 
                  ? "bg-orange-500 text-white" 
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>`;

const replacement = `<div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-orange-500" />
          HR & Frequently Asked Questions
        </h2>
      </div>`;

if(content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/components/HRQuestionsSection.tsx', content);
  console.log("HRQuestionsSection patched.");
} else {
  console.log("Target not found!");
}
