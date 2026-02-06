'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Moon,
  Sun,
  TrendingUp,
  User as UserIcon,
  Trophy,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useAuthStore } from '@/store/authStore';
import AuthModal from '@/components/AuthModal';
import UserDashboard from '@/components/UserDashboard';
import Leaderboard from '@/components/Leaderboard';
import { useActivityTracker } from '@/hooks/useActivityTracker';

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, init, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leaderboard'>('dashboard');

  useActivityTracker();

  useEffect(() => {
    setMounted(true);
    init();
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 sm:w-[500px] sm:h-[500px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[100px] animate-pulse-glow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 sm:w-[500px] sm:h-[500px] bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-[100px] animate-pulse-glow" />
      </div>

      <div className="relative z-10">
        {/* Navigation Header */}
        <header className="px-4 py-4 sm:py-6 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl sticky top-0 z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <BookOpen className="text-white" size={20} />
              </div>
              <div className="hidden xs:block">
                <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-cyan-500 bg-clip-text text-transparent">
                  HazaQuran
                </h1>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">
                  Premium Edition
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/10 transition-all hover:scale-105 active:scale-95"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={logout}
                    className="hidden sm:block px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-rose-100 dark:hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                  >
                    Logout
                  </button>
                  <button
                    onClick={() => router.push('/profile')}
                    className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all active:scale-95"
                    title="View Profile"
                  >
                    <UserIcon size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setIsAuthOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-emerald-100 dark:hover:bg-emerald-500/10 transition-all"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setIsAuthOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-12 sm:py-16 pb-32">
          {/* Main Hero Action */}
          <section className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-cyan-600 rounded-[2.5rem] p-8 sm:p-14 text-white relative overflow-hidden shadow-[0_32px_64px_-16px_rgba(16,185,129,0.3)] group"
            >
              {/* Abstract Decorations */}
              <div className="absolute top-0 right-0 p-12 opacity-10 blur-2xl group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                <BookOpen size={400} />
              </div>
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-[80px] pointer-events-none" />

              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md mb-8 border border-white/20">
                  <Sparkles size={16} className="text-emerald-200" />
                  <span className="text-xs font-black uppercase tracking-[0.2em]">Divine Experience</span>
                </div>

                <h2 className="text-4xl sm:text-6xl font-black mb-8 leading-[1.1] tracking-tight">
                  Tune in to the <br />
                  <span className="text-emerald-200">Noble Words.</span>
                </h2>

                <p className="text-lg sm:text-xl text-emerald-50/80 mb-10 font-medium leading-relaxed">
                  Experience crystal-clear audio, track your spiritual growth, and join the global journey of reflection.
                </p>

                <button
                  onClick={() => router.push('/surahs')}
                  className="group/btn px-10 py-5 rounded-[2rem] bg-white text-emerald-600 font-black text-lg flex items-center gap-4 hover:bg-emerald-50 hover:shadow-2xl hover:shadow-white/20 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 shadow-xl"
                >
                  اقرأ <ArrowRight size={24} className="group-hover/btn:translate-x-2 transition-transform" />
                </button>
              </div>
            </motion.div>
          </section>

          {/* User Experience Section */}
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex bg-slate-100/80 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 w-full sm:w-auto">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: UserIcon },
                  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={clsx(
                      "flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all",
                      activeTab === tab.id
                        ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xl shadow-emerald-500/5"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                    )}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {!isAuthenticated && (
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                  <Sparkles size={16} className="text-amber-500" />
                  Join 10,000+ users tracking their journey
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' ? (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {!isAuthenticated ? (
                    <div className="glass-card p-12 sm:p-20 rounded-[3rem] text-center border-dashed border-2 border-slate-200 dark:border-slate-800 bg-slate-100/20 dark:bg-slate-900/10">
                      <div className="w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-inner">
                        <TrendingUp size={48} className="text-emerald-500" />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Start Your Streak</h3>
                      <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-sm mx-auto font-medium text-lg leading-relaxed">
                        Track your daily minutes, earn rewards, and visualize your progress on the global stage.
                      </p>
                      <button
                        onClick={() => {
                          setAuthMode('register');
                          setIsAuthOpen(true);
                        }}
                        className="px-10 py-4 rounded-2xl bg-slate-900 dark:bg-emerald-500 text-white font-black hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-emerald-500/20"
                      >
                        Create Your Free Profile
                      </button>
                    </div>
                  ) : (
                    <UserDashboard />
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="leaderboard"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Leaderboard />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}