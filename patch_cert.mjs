import fs from 'fs';
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const target = `      </div>

      {/* Roadmap Modal */}`;

const replacement = `      </div>

      {/* Certifications & Badges */}
      {certifications.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-[#151619] border border-white/10 rounded-3xl overflow-hidden"
        >
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-500" /> 
              Earned Certifications
            </h3>
            <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-xs font-bold rounded-full border border-yellow-500/20">
              {certifications.length} {certifications.length === 1 ? 'Badge' : 'Badges'}
            </span>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <div 
                key={index}
                className="relative bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border border-yellow-500/20 p-6 rounded-2xl flex flex-col items-center text-center group hover:from-yellow-500/20 transition-all"
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 p-1 mb-4 shadow-lg shadow-yellow-500/20 transform group-hover:scale-110 transition-transform">
                  <div className="w-full h-full bg-[#151619] rounded-full flex items-center justify-center">
                    <Award className="w-8 h-8 text-yellow-500" />
                  </div>
                </div>
                <h4 className="font-bold text-lg text-white mb-1 relative z-10">{cert.domain}</h4>
                <p className="text-sm text-yellow-500 font-bold mb-3 relative z-10">Score: {cert.score}%</p>
                <div className="text-xs font-mono text-gray-500 relative z-10">
                  Issued: {cert.date.toLocaleDateString()}
                </div>
                <div className="absolute top-2 right-2 opacity-50 group-hover:opacity-100 transition-opacity">
                  <CheckCircle2 className="w-5 h-5 text-yellow-500" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Roadmap Modal */}`;

if(content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/components/Dashboard.tsx', content);
  console.log("Certifications UI added.");
} else {
  console.log("Target not found!");
}
