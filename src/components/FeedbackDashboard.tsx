import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Target, Award, Zap, CheckCircle2, ArrowRight, RefreshCcw, Volume2, VolumeX, Square, ArrowLeft, Download, Loader2 } from 'lucide-react';
import { Domain, InterviewQuestion, InterviewFeedback } from '../types';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import { generateFinalFeedback } from '../services/geminiService';
import confetti from 'canvas-confetti';
import { cn } from '../lib/utils';

interface FeedbackDashboardProps {
  domain: Domain;
  questions: InterviewQuestion[];
  onRestart: () => void;
}

export const FeedbackDashboard: React.FC<FeedbackDashboardProps> = ({ domain, questions, onRestart }) => {
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadFeedback();
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const loadFeedback = async () => {
    const result = await generateFinalFeedback(domain, questions);
    setFeedback(result);
    setLoading(false);
    if (result.overallScore > 70) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f97316', '#ef4444', '#ffffff']
      });
    }
  };

  
  
  const handleDownloadPDF = () => {
    if (!feedback) return;
    setIsExporting(true);
    
    setTimeout(() => {
      try {
        const doc = new jsPDF();
        
        // Title
        doc.setFontSize(22);
        doc.setTextColor(249, 115, 22); // Orange
        doc.text('Interview Performance Report', 14, 20);
        
        // Meta
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`Domain: ${domain}`, 14, 30);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 38);
        
        // Scores
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('Scores', 14, 50);
        
        autoTable(doc, {
          startY: 55,
          head: [['Metric', 'Score']],
          body: [
            ['Overall Score', `${feedback.overallScore}/100`],
            ['Technical Score', `${feedback.technicalScore}/100`],
            ['Communication Score', `${feedback.communicationScore}/100`],
            ['Confidence Score', `${feedback.confidenceScore}/100`]
          ],
          theme: 'grid',
          headStyles: { fillColor: [249, 115, 22] },
        });
        
        // Summary & Readiness
        let nextY = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.setTextColor(249, 115, 22);
        doc.text('Summary', 14, nextY);
        
        doc.setFontSize(11);
        doc.setTextColor(50, 50, 50);
        const summaryLines = doc.splitTextToSize(feedback.summary, 180);
        doc.text(summaryLines, 14, nextY + 8);
        
        nextY += 8 + (summaryLines.length * 6) + 10;
        
        if (feedback.interviewReadiness) {
          doc.setFontSize(14);
          doc.setTextColor(249, 115, 22);
          doc.text('Interview Readiness', 14, nextY);
          
          doc.setFontSize(11);
          doc.setTextColor(50, 50, 50);
          const readinessLines = doc.splitTextToSize(feedback.interviewReadiness, 180);
          doc.text(readinessLines, 14, nextY + 8);
          nextY += 8 + (readinessLines.length * 6) + 10;
        }
        
        // Strengths & Weaknesses
        if (nextY > 250) {
          doc.addPage();
          nextY = 20;
        }
        
        if (feedback.strengths && feedback.strengths.length > 0) {
          doc.setFontSize(14);
          doc.setTextColor(40, 167, 69); // Green
          doc.text('Strengths', 14, nextY);
          
          doc.setFontSize(11);
          doc.setTextColor(50, 50, 50);
          feedback.strengths.forEach((s, i) => {
            const lines = doc.splitTextToSize(`• ${s}`, 180);
            doc.text(lines, 14, nextY + 8 + (i * 6));
          });
          nextY += 8 + (feedback.strengths.length * 6) + 10;
        }
        
        if (feedback.weaknesses && feedback.weaknesses.length > 0) {
          if (nextY > 250) { doc.addPage(); nextY = 20; }
          
          doc.setFontSize(14);
          doc.setTextColor(220, 53, 69); // Red
          doc.text('Areas for Improvement', 14, nextY);
          
          doc.setFontSize(11);
          doc.setTextColor(50, 50, 50);
          feedback.weaknesses.forEach((w, i) => {
            const lines = doc.splitTextToSize(`• ${w}`, 180);
            doc.text(lines, 14, nextY + 8 + (i * 6));
          });
          nextY += 8 + (feedback.weaknesses.length * 6) + 10;
        }
        
        // Recommended Topics
        if (feedback.recommendedTopics && feedback.recommendedTopics.length > 0) {
          if (nextY > 250) { doc.addPage(); nextY = 20; }
          
          doc.setFontSize(14);
          doc.setTextColor(0, 123, 255); // Blue
          doc.text('Recommended Topics to Study', 14, nextY);
          
          doc.setFontSize(11);
          doc.setTextColor(50, 50, 50);
          feedback.recommendedTopics.forEach((t, i) => {
            const lines = doc.splitTextToSize(`• ${t}`, 180);
            doc.text(lines, 14, nextY + 8 + (i * 6));
          });
          nextY += 8 + (feedback.recommendedTopics.length * 6) + 10;
        }
        
        // Detailed Q&A
        doc.addPage();
        doc.setFontSize(18);
        doc.setTextColor(249, 115, 22);
        doc.text('Detailed Q&A Breakdown', 14, 20);
        
        let qaY = 30;
        
        questions.forEach((q, index) => {
          if (qaY > 250) {
            doc.addPage();
            qaY = 20;
          }
          
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 0, 0);
          const qLines = doc.splitTextToSize(`Q${index + 1}: ${q.text}`, 180);
          doc.text(qLines, 14, qaY);
          qaY += (qLines.length * 6) + 4;
          
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.setTextColor(80, 80, 80);
          const aLines = doc.splitTextToSize(`Your Answer: ${q.userResponse || 'No response'}`, 180);
          doc.text(aLines, 14, qaY);
          qaY += (aLines.length * 5) + 4;
          
          if (q.aiEvaluation) {
            doc.setTextColor(40, 167, 69); // Greenish
            const fLines = doc.splitTextToSize(`Feedback: ${q.aiEvaluation}`, 180);
            doc.text(fLines, 14, qaY);
            qaY += (fLines.length * 5) + 4;
          }
          
          if (q.correctAnswer) {
            doc.setTextColor(0, 123, 255);
            const caLines = doc.splitTextToSize(`Ideal Answer: ${q.correctAnswer}`, 180);
            doc.text(caLines, 14, qaY);
            qaY += (caLines.length * 5) + 4;
          }
          
          qaY += 6; // Spacing between questions
        });
        
        doc.save(`Interview_Report_${domain.replace(/[^a-z0-9]/gi, '_')}.pdf`);
      } catch (error) {
        console.error("Failed to generate PDF:", error);
      } finally {
        setIsExporting(false);
      }
    }, 100);
  };

  const speakSummary = () => {
    if (!feedback) return;
    
    // Stop any current speech
    window.speechSynthesis.cancel();
    
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const text = `Your overall score is ${feedback.overallScore} percent. ${feedback.summary}. Here are some suggestions for improvement: ${feedback.suggestions.join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a good voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) || 
                          voices.find(v => v.lang.startsWith('en'));
    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Zap className="w-12 h-12 text-orange-500" />
        </motion.div>
        <p className="mt-4 text-gray-400 font-mono tracking-widest uppercase">Analyzing Performance...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-6xl mx-auto" id="report-content">
        <header className="flex justify-between items-end mb-12">
          <div className="flex items-start gap-4">
            <button 
              onClick={onRestart}
              className="mt-2 p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all hide-on-print"
              title="Back to Home"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-5xl font-bold tracking-tighter mb-2">INTERVIEW REPORT</h1>
              <p className="text-gray-400 uppercase tracking-widest font-mono">{domain} • COMPLETED</p>
            </div>
          </div>
          
          <div className="flex gap-4 hide-on-print">
            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border border-orange-500/20 rounded-xl transition-all disabled:opacity-50"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {isExporting ? 'Generating...' : 'Export PDF'}
            </button>
            <button
              onClick={onRestart}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
            >
              <RefreshCcw className="w-4 h-4" /> New Interview
            </button>
          </div>

        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl shadow-orange-500/20"
          >
            <Trophy className="w-16 h-16 mb-6 text-white/90" />
            <div className="text-8xl font-black mb-2">{feedback?.overallScore}</div>
            <div className="text-xl font-bold uppercase tracking-widest opacity-80">Overall Score</div>
            <div className="mt-8 w-full h-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${feedback?.overallScore}%` }}
                className="h-full bg-white"
              />
            </div>
          </motion.div>

          {/* Metrics Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Communication', score: feedback?.communicationScore, icon: <Zap className="w-5 h-5" /> },
              { label: 'Technical', score: feedback?.technicalScore, icon: <Target className="w-5 h-5" /> },
              { label: 'Confidence', score: feedback?.confidenceScore, icon: <Award className="w-5 h-5" /> },
            ].map((metric, idx) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#151619] border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4 text-orange-500">
                  {metric.icon}
                  <span className="text-sm font-bold uppercase tracking-wider">{metric.label}</span>
                </div>
                <div className="text-4xl font-bold mb-2">{metric.score}%</div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.score}%` }}
                    className="h-full bg-orange-500"
                  />
                </div>
              </motion.div>
            ))}

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="md:col-span-3 bg-[#151619] border border-white/10 rounded-2xl p-8"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" /> Executive Summary
                <button 
                  onClick={speakSummary}
                  className={cn(
                    "ml-auto p-2 rounded-lg transition-all hide-on-print",
                    isSpeaking ? "bg-orange-500 text-white animate-pulse" : "bg-white/5 text-gray-400 hover:bg-white/10"
                  )}
                  title={isSpeaking ? "Stop Reading" : "Read Summary"}
                >
                  {isSpeaking ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </h3>
              <p className="text-gray-400 leading-relaxed text-lg italic">
                "{feedback?.summary}"
              </p>
            </motion.div>
          </div>
        </div>

        {/* Suggestions & History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#151619] border border-white/10 rounded-2xl p-8"
          >
            
            <h3 className="text-xl font-bold mb-6 uppercase tracking-widest text-orange-500">Improvement Plan</h3>
            <ul className="space-y-4">
              {feedback?.suggestions.map((suggestion, i) => (
                <li key={i} className="flex gap-4 items-start group">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-orange-500 shrink-0 group-hover:scale-150 transition-transform" />
                  <p className="text-gray-300 group-hover:text-white transition-colors">{suggestion}</p>
                </li>
              ))}
            </ul>
            
            {feedback?.strengths && feedback.strengths.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-bold mb-4 uppercase tracking-widest text-green-500">Strengths Demonstrated</h4>
                <ul className="space-y-3">
                  {feedback.strengths.map((s, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <div className="mt-2 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                      <p className="text-gray-400 text-sm">{s}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {feedback?.weaknesses && feedback.weaknesses.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-bold mb-4 uppercase tracking-widest text-red-500">Areas for Improvement</h4>
                <ul className="space-y-3">
                  {feedback.weaknesses.map((w, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <div className="mt-2 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                      <p className="text-gray-400 text-sm">{w}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {feedback?.recommendedTopics && feedback.recommendedTopics.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-bold mb-4 uppercase tracking-widest text-blue-500">Recommended Topics to Study</h4>
                <ul className="space-y-3">
                  {feedback.recommendedTopics.map((t, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <div className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      <p className="text-gray-400 text-sm">{t}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {feedback?.interviewReadiness && (
              <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl">
                <h4 className="text-xs font-black mb-2 uppercase tracking-widest text-gray-500">Interview Readiness</h4>
                <p className="text-sm font-semibold text-white">{feedback.interviewReadiness}</p>
              </div>
            )}

          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#151619] border border-white/10 rounded-2xl p-8"
          >
            <h3 className="text-xl font-bold mb-6 uppercase tracking-widest text-orange-500">Question Breakdown</h3>
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
              {questions.map((q, i) => (
                <div key={q.id} className="border-b border-white/5 pb-4 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-gray-500">Q{i + 1}</span>
                    <span className={cn(
                      "text-xs font-bold px-2 py-0.5 rounded",
                      (q.score || 0) > 70 ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"
                    )}>
                      {q.score}%
                    </span>
                  </div>
                  <p className="text-sm font-medium mb-2">{q.text}</p>
                  <p className="text-xs text-gray-500 line-clamp-2 italic mb-2">"{q.userResponse}"</p>
                  
                  {q.speakingMetrics && (
                    <div className="mb-3 grid grid-cols-3 gap-2 p-2 bg-white/[0.02] border border-white/5 rounded-lg text-center font-mono">
                      <div>
                        <p className="text-[8px] uppercase font-black text-gray-500 text-left pl-1">Speech Pace</p>
                        <p className="text-[10px] font-bold text-gray-300 text-left pl-1">{q.speakingMetrics.wpm} <span className="text-[8px] text-gray-500 font-medium">WPM</span></p>
                      </div>
                      <div>
                        <p className="text-[8px] uppercase font-black text-gray-500 text-left pl-1">Verbal Fillers</p>
                        <p className="text-[10px] font-bold text-gray-300 text-left pl-1">{q.speakingMetrics.fillerCount} <span className="text-[8px] text-gray-500 font-medium">uses</span></p>
                      </div>
                      <div>
                        <p className="text-[8px] uppercase font-black text-gray-500 text-left pl-1">Duration</p>
                        <p className="text-[10px] font-bold text-gray-300 text-left pl-1">{q.speakingMetrics.durationSeconds}s</p>
                      </div>
                    </div>
                  )}

                  {q.pronunciationFeedback && (
                    <div className="mt-2 p-2 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                      <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-1">Articulation & Clarity</p>
                      <p className="text-[10px] text-gray-400 italic">{q.pronunciationFeedback}</p>
                    </div>
                  )}
                  {q.conceptExplanation && (
                    <div className="mt-2 p-2 bg-purple-500/5 border border-purple-500/10 rounded-lg">
                      <p className="text-[9px] font-bold text-purple-400 uppercase tracking-widest mb-1">Conceptual Breakdown</p>
                      <p className="text-[10px] text-gray-400 leading-relaxed">{q.conceptExplanation}</p>
                    </div>
                  )}
                  {q.keyDifferences && (
                    <div className="mt-2 p-2 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                      <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-1">Key Differences</p>
                      <p className="text-[10px] text-gray-400 leading-relaxed">{q.keyDifferences}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
