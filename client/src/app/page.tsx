'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Moon, Sun, User as UserIcon, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

import { useAuthStore } from '@/store/authStore';
import { useActivityTracker } from '@/hooks/useActivityTracker';
import { useReadingPositionTracker } from '@/hooks/useReadingPositionTracker';

import AuthModal from '@/components/AuthModal';
import UserDashboard from '@/components/UserDashboard';
import Leaderboard from '@/components/Leaderboard';
import HeroSection from '@/components/HeroSection';

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, init } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leaderboard'>('dashboard');

  useActivityTracker();
  useReadingPositionTracker();

  useEffect(() => {
    setMounted(true);
    init();
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative overflow-hidden bg-[hsl(var(--bg-luminous-start))] dark:bg-[hsl(var(--bg-twilight-start))] transition-colors duration-500">

      {/* Navigation Header - Floating & Glassmorphic */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 transition-all duration-300 pointer-events-none">
        <div className="max-w-7xl mx-auto pointer-events-auto">
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-full px-4 sm:px-6 py-3 border border-white/20 dark:border-white/10 shadow-lg shadow-black/5 flex items-center justify-between">

            {/* Logo Area */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white shrink-0">
                <BookOpen size={20} className="fill-current" />
              </div>
              <div className="hidden xs:block">
                <h1 className="text-xl font-black bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent tracking-tight">
                  HazaQuran
                </h1>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2.5 rounded-full bg-slate-100/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 hover:text-amber-600 dark:hover:text-amber-400 transition-all hover:scale-105 active:scale-95"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {isAuthenticated ? (
                <>
                  <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-100/50 dark:bg-emerald-900/30 border border-emerald-200/50 dark:border-emerald-800/50">
                    <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                      {user?.current_streak || 0} Day Streak
                    </span>
                  </div>

                  <button
                    onClick={() => router.push('/profile')}
                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-slate-700 shadow-md hover:scale-105 transition-transform"
                    title="Profile"
                  >
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                      <UserIcon size={20} />
                    </div>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setIsAuthOpen(true);
                  }}
                  className="px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:scale-105 transition-transform shadow-lg whitespace-nowrap"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content Area */}
      <div className="relative z-10 -mt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {isAuthenticated && (
            <div className="space-y-8">
              {/* Dashboard Tabs */}
              <div className="flex justify-center mb-14">
                <div className="p-1.5 rounded-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-xl inline-flex">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={clsx(
                      "px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300",
                      activeTab === 'dashboard'
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    My Activity
                  </button>
                  <button
                    onClick={() => setActiveTab('leaderboard')}
                    className={clsx(
                      "px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300",
                      activeTab === 'leaderboard'
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    Global Ranking
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'dashboard' ? <UserDashboard /> : <Leaderboard />}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}