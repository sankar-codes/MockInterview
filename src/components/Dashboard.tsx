import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { 
  TrendingUp, Award, Clock, Target, 
  ChevronRight, ArrowUpRight, History as HistoryIcon, Zap, ArrowLeft, X, Loader2, BookOpen, CheckCircle2 
} from 'lucide-react';
import { Domain } from '../types';
import { generateRoadmap } from '../services/geminiService';
import { cn } from '../lib/utils';

interface DashboardProps {
  interviews: any[];
  onViewInterview: (interview: any) => void;
  onBack: () => void;
}

const COLORS = ['#f97316', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'];

export const Dashboard: React.FC<DashboardProps> = ({ interviews, onViewInterview, onBack }) => {
  const [isRoadmapLoading, setIsRoadmapLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<{ title: string; steps: { title: string; description: string; resources: string[] }[] } | null>(null);
  const [showRoadmap, setShowRoadmap] = useState(false);

  // Calculate stats
  const totalInterviews = interviews.length;
  const avgScore = totalInterviews > 0 
    ? Math.round(interviews.reduce((acc, curr) => acc + (curr.feedback?.overallScore || 0), 0) / totalInterviews)
    : 0;
  
  // Group by domain for chart
  const domainStats = interviews.reduce((acc: any, curr) => {
    const domain = curr.domain;
    const score = curr.feedback?.overallScore || 0;
    const date = curr.createdAt?.toDate ? curr.createdAt.toDate() : (curr.createdAt ? new Date(curr.createdAt) : new Date());
    
    if (!acc[domain]) acc[domain] = { name: domain, count: 0, totalScore: 0, maxScore: 0, latestDate: date };
    
    acc[domain].count += 1;
    acc[domain].totalScore += score;
    if (score > acc[domain].maxScore) {
      acc[domain].maxScore = score;
      acc[domain].latestDate = date;
    }
    return acc;
  }, {});

  // Calculate certifications (Top score >= 80 per domain)
  const certifications = Object.values(domainStats)
    .filter((d: any) => d.maxScore >= 80)
    .map((d: any) => ({
      domain: d.name,
      score: d.maxScore,
      date: d.latestDate,
    }))
    .sort((a, b) => b.score - a.score);

  const chartData = Object.values(domainStats).map((d: any) => ({
    name: d.name.split(' ')[0], // Shorten name
    score: Math.round(d.totalScore / d.count),
    count: d.count
  }));

  // Progress over time (last 10)
  const sortedInterviews = [...interviews].sort((a, b) => {
    const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
    const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
    return dateA - dateB;
  });
  const last10Interviews = sortedInterviews.slice(-10);
  const timelineData = last10Interviews.map((i, index) => ({
    name: `Int ${sortedInterviews.length - last10Interviews.length + index + 1}`,
    score: i.feedback?.overallScore || 0
  }));

  const handleViewRoadmap = async () => {
    if (roadmap) {
      setShowRoadmap(true);
      return;
    }

    setIsRoadmapLoading(true);
    try {
      const data = await generateRoadmap(interviews);
      setRoadmap(data);
      setShowRoadmap(true);
    } catch (error) {
      console.error("Failed to generate roadmap:", error);
    } finally {
      setIsRoadmapLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div className="flex items-start gap-4">
          <button 
            onClick={onBack}
            className="mt-2 p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all"
            title="Back to Home"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl font-bold tracking-tighter">ANALYTICS DASHBOARD</h1>
            <p className="text-gray-500 font-mono text-sm uppercase tracking-widest mt-1">Performance Overview & Progress</p>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Sessions', value: totalInterviews, icon: <Clock className="w-5 h-5" />, color: 'text-blue-500' },
          { label: 'Average Score', value: `${avgScore}%`, icon: <Target className="w-5 h-5" />, color: 'text-orange-500' },
          { label: 'Top Domain', value: chartData.sort((a, b) => b.score - a.score)[0]?.name || 'N/A', icon: <Award className="w-5 h-5" />, color: 'text-yellow-500' },
          { label: 'Growth Rate', value: '+12%', icon: <TrendingUp className="w-5 h-5" />, color: 'text-green-500' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#151619] border border-white/10 p-6 rounded-2xl"
          >
            <div className={`p-2 w-fit rounded-lg bg-white/5 ${stat.color} mb-4`}>
              {stat.icon}
            </div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest font-mono">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Score by Category */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#151619] border border-white/10 p-8 rounded-3xl"
        >
          <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
            <Award className="w-5 h-5 text-orange-500" /> Proficiency by Category
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#151619', border: '1px solid #333', borderRadius: '12px' }}
                  itemStyle={{ color: '#f97316' }}
                />
                <Bar dataKey="score" fill="#f97316" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Progress Timeline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[#151619] border border-white/10 p-8 rounded-3xl"
        >
          <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" /> Score Progress (Last 10)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#151619', border: '1px solid #333', borderRadius: '12px' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity & Career Path */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#151619] border border-white/10 rounded-3xl overflow-hidden">
          <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <HistoryIcon className="w-5 h-5 text-gray-400" /> Recent Sessions
            </h3>
          </div>
          <div className="divide-y divide-white/5">
            {interviews.slice(0, 5).map((interview) => (
              <div 
                key={interview.id} 
                className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group"
                onClick={() => onViewInterview(interview)}
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-orange-500 font-bold">
                    {interview.feedback?.overallScore || 0}
                  </div>
                  <div>
                    <div className="font-bold text-lg group-hover:text-orange-500 transition-colors">{interview.domain}</div>
                    <div className="text-sm text-gray-500 font-mono">
                      {interview.createdAt?.toDate().toLocaleDateString()} • {interview.questions?.length} Questions
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Unique Feature: AI Career Path */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 p-8 rounded-3xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-32 h-32" />
          </div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" /> AI Career Path
          </h3>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            Based on your performance in <b>{chartData[0]?.name || 'various'}</b> domains, our AI suggests focusing on:
          </p>
          <div className="space-y-4">
            {chartData.slice(0, 3).map((d, i) => (
              <div key={i} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-sm font-medium">{d.name} Specialist</span>
                <ArrowUpRight className="w-4 h-4 text-gray-500" />
              </div>
            ))}
          </div>
          <button 
            onClick={handleViewRoadmap}
            disabled={isRoadmapLoading}
            className="mt-8 w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm flex items-center justify-center gap-2"
          >
            {isRoadmapLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Generating...
              </>
            ) : (
              'View Full Roadmap'
            )}
          </button>
        </motion.div>
      </div>

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

      {/* Roadmap Modal */}
      <AnimatePresence>
        {showRoadmap && roadmap && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#151619] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
              
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[#1a1b1e]">
                <div>
                  <h2 className="text-3xl font-bold tracking-tighter">{roadmap.title}</h2>
                  <p className="text-gray-500 font-mono text-xs uppercase tracking-widest mt-1">Your AI-Generated Career Path</p>
                </div>
                <button 
                  onClick={() => setShowRoadmap(false)}
                  className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />
                  <div className="space-y-12">
                    {roadmap.steps.map((step, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="relative pl-12"
                      >
                        <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center z-10">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                        </div>
                        
                        <div className="bg-white/5 border border-white/5 p-6 rounded-2xl hover:border-blue-500/30 transition-all group">
                          <h4 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{step.title}</h4>
                          <p className="text-gray-400 text-sm mb-4 leading-relaxed">{step.description}</p>
                          
                          <div className="flex flex-wrap gap-2">
                            {step.resources.map((res, j) => (
                              <span key={j} className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-lg border border-blue-500/20 flex items-center gap-1">
                                <BookOpen className="w-3 h-3" /> {res}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 p-6 rounded-2xl flex items-center gap-4">
                  <div className="p-3 bg-blue-500 rounded-xl">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold">Ready to take the next step?</h4>
                    <p className="text-sm text-gray-400">Complete more sessions to refine your roadmap and track your progress.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
