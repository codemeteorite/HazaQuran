'use client';

import { motion } from 'framer-motion';
import { Flame, Clock, Target, Trophy, ChevronRight, BarChart2, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import clsx from 'clsx';

const isRamadan = () => {
    // Ramadan 2026: Feb 17 - Mar 18
    const now = new Date();
    const start = new Date(2026, 1, 17);
    const end = new Date(2026, 2, 18);
    return now >= start && now <= end;
};

export default function UserDashboard() {
    const { user } = useAuthStore();

    if (!user) return null;

    // Use Supabase profile fields or fallbacks
    const totalMinutes = user.total_minutes || 0;
    const currentStreak = user.current_streak || 0;
    const todayMinutes = 0; // TODO: Implement daily tracking logic
    const dailyGoal = 20; // Default goal
    const hasanath = totalMinutes * 10; // Simple calculation for now

    const progress = Math.min((todayMinutes / dailyGoal) * 100, 100);
    const ramadanActive = isRamadan();

    const cards = [
        { label: 'Current Streak', value: `${currentStreak} Days`, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { label: 'Total Hasanat', value: hasanath.toLocaleString(), icon: Sparkles, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        { label: 'Total Tilawah', value: `${totalMinutes} Mins`, icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Daily Goal', value: `${dailyGoal} Mins`, icon: Target, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                        Salem, {user.display_name || user.email?.split('@')[0]}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">Your spiritual journey progress</p>
                </div>

                {ramadanActive && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3 rounded-2xl text-white shadow-xl shadow-orange-500/20 flex items-center gap-3 border border-white/20"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center animate-pulse">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <div className="text-xs font-black uppercase tracking-widest">Ramadan Boost Active!</div>
                            <div className="text-sm font-bold">Hasanat are 70x the worth 🌙</div>
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={clsx(
                            "glass-card p-5 rounded-3xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group border border-slate-200/50 dark:border-slate-800/50",
                            card.label === 'Total Hasanath' && "bg-gradient-to-br from-yellow-500/5 to-amber-500/5 border-yellow-500/20"
                        )}
                    >
                        <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", card.bg)}>
                            <card.icon className={card.color} size={24} />
                        </div>
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">{card.label}</div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">{card.value}</div>

                        {card.label === 'Total Hasanath' && ramadanActive && (
                            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-yellow-500 text-[8px] font-black text-white uppercase animate-bounce">
                                70x
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Daily Goal Tracker */}
            <div className="glass-card p-8 rounded-[2rem] relative overflow-hidden group border border-emerald-500/10">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                    <BarChart2 size={160} />
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-8 relative">
                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="50%" cy="50%" r="42%"
                                className="stroke-slate-200 dark:stroke-slate-800 fill-none"
                                strokeWidth="12"
                            />
                            <motion.circle
                                initial={{ strokeDasharray: "0 1000" }}
                                animate={{ strokeDasharray: `${progress * 3.7} 1000` }}
                                transition={{ duration: 2, ease: "circOut" }}
                                cx="50%" cy="50%" r="42%"
                                className="stroke-emerald-500 fill-none"
                                strokeWidth="12"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-slate-900 dark:text-white">{Math.round(progress)}%</span>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center px-2">Goal<br />Progress</span>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-xl bg-emerald-500/10">
                                <Target className="text-emerald-500" size={24} />
                            </div>
                            <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Daily Spiritual Goal</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                            You've dedicated <span className="text-emerald-500 font-black">{todayMinutes}</span> of <span className="text-slate-900 dark:text-white font-black">{dailyGoal}</span> minutes to Quran today.
                        </h3>
                        <div className="flex flex-wrap items-center gap-4">
                            <button className="px-6 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-black hover:shadow-xl active:scale-95 transition-all flex items-center gap-2">
                                Adjust Daily Goal <ChevronRight size={18} />
                            </button>
                            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                <Trophy size={16} className="text-amber-500" />
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Next rank: <span className="text-slate-900 dark:text-white">Qari Apprentice</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
