import React, { useState, useEffect } from 'react';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { InterviewSession } from './components/InterviewSession';
import { FeedbackDashboard } from './components/FeedbackDashboard';
import { Dashboard } from './components/Dashboard';
import { ChatbotWidget } from './components/ChatbotWidget';
import { Domain, InterviewQuestion, InterviewerPersona } from './types';
import { LogIn, LogOut, LayoutDashboard, User as UserIcon, Play, Mail, X, Loader2, Eye, EyeOff, Download } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState<'landing' | 'session' | 'feedback' | 'dashboard'>('landing');
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [persona, setPersona] = useState<InterviewerPersona>('Friendly');
  const [resumeOrJD, setResumeOrJD] = useState<string>('');
  const [language, setLanguage] = useState('en-US');
  const [interviewResults, setInterviewResults] = useState<InterviewQuestion[]>([]);
  const [pastInterviews, setPastInterviews] = useState<any[]>([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    const saved = localStorage.getItem('interviews');
    if (saved) {
      setPastInterviews(JSON.parse(saved));
    }
    return () => unsubscribe();
  }, []);



  const handleLogout = async () => { await signOut(auth); };

  const handleStart = (domain: Domain, jd?: string, diff: 'Easy' | 'Medium' | 'Hard' = 'Medium', selectedPersona: InterviewerPersona = 'Friendly', selectedLanguage: string = 'en-US') => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setSelectedDomain(domain);
    setDifficulty(diff);
    setPersona(selectedPersona);
    setLanguage(selectedLanguage);
    if (jd) setResumeOrJD(jd);
    setView('session');
  };

  const handleComplete = async (questions: InterviewQuestion[]) => {
    setInterviewResults(questions);
    setView('feedback');


    if (user) {
      try {
        const newInterview = {
          id: Date.now().toString(),
          uid: user.uid,
          domain: selectedDomain,
          questions: questions,
          feedback: {
            overallScore: Math.round(questions.reduce((acc, q) => acc + (q.score || 0), 0) / questions.length),
          },
          status: 'completed',
          createdAt: new Date().toISOString(),
        };
        const saved = localStorage.getItem('interviews');
        const past = saved ? JSON.parse(saved) : [];
        const updated = [newInterview, ...past];
        localStorage.setItem('interviews', JSON.stringify(updated));
        setPastInterviews(updated);
      } catch (error) {
        console.error('Error saving interview locally:', error);
      }
    }

  };

  const handleRestart = () => {
    setView('landing');
    setSelectedDomain(null);
    setInterviewResults([]);
    setResumeOrJD('');
  };

  const onViewInterview = (interview: any) => {
    setSelectedDomain(interview.domain);
    setInterviewResults(interview.questions);
    setView('feedback');
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation Bar */}
      <nav className="p-4 border-b border-white/10 flex justify-between items-center bg-[#151619]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleRestart}>
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-black text-white">AI</div>
          <span className="font-bold tracking-tighter text-lg sm:text-xl">MOCK INTERVIEW</span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Desktop Links */}
          <div className="hidden sm:flex items-center gap-4">
            <button 
              onClick={handleRestart}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
            >
              Home
            </button>
            {user && (
              <button 
                onClick={() => setView('dashboard')}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </button>
            )}
          </div>

          {user ? (
            <div className="relative">
              {/* Profile Trigger (Mobile & Desktop) */}
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10 hover:border-orange-500/50 transition-all"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-sm font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div 
                  onMouseLeave={() => setShowProfileMenu(false)}
                  onDoubleClick={() => setShowProfileMenu(false)}
                  className="absolute right-0 mt-2 w-64 bg-[#151619] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <div 
                    className="fixed inset-0 z-[-1]" 
                    onClick={() => setShowProfileMenu(false)}
                  />
                  
                  {/* User Details Section */}
                  <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-3 mb-2">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border border-white/10" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-lg font-bold">
                          {user.email?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-white truncate">
                          {user.displayName || 'User'}
                        </span>
                        <span className="text-xs text-gray-500 truncate">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="py-1">
                    <button 
                      onClick={() => {
                        handleRestart();
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <Play className="w-4 h-4" /> Home
                    </button>
                    <button 
                      onClick={() => {
                        setView('dashboard');
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </button>
                  </div>

                  <div className="h-px bg-white/5 my-1" />
                  
                  <div className="py-1">
                    <button 
                      onClick={() => {
                        handleLogout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-all"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all"
            >
              <LogIn className="w-4 h-4" /> Sign In
            </button>
          )}

          {/* Desktop Logout Button */}
          {user && (
            <button 
              onClick={handleLogout} 
              className="hidden sm:flex p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-red-500 transition-all"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      <main>
        {view === 'landing' && <LandingPage onStart={handleStart} user={user} />}
        {view === 'session' && selectedDomain && (
          <InterviewSession 
            domain={selectedDomain} 
            difficulty={difficulty}
            persona={persona}
            resumeOrJD={resumeOrJD}
            language={language}
            onComplete={handleComplete} 
            onCancel={handleRestart}
          />
        )}
        {view === 'feedback' && selectedDomain && (
          <FeedbackDashboard 
            domain={selectedDomain} 
            questions={interviewResults} 
            onRestart={handleRestart} 
          />
        )}
        {view === 'dashboard' && (
          <Dashboard 
            interviews={pastInterviews} 
            onViewInterview={onViewInterview}
            onBack={handleRestart}
          />
        )}
      </main>
      <ChatbotWidget />
    </div>
  );
}
