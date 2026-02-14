'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Flame, Clock, Target, Trophy, ChevronRight, BarChart2, Sparkles, Bookmark, Zap } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import clsx from 'clsx';
import { CornerFlourish } from './patterns';

const isRamadan = () => {
    // Ramadan 2026: Feb 17 - Mar 18
    const now = new Date();
    const start = new Date(2026, 1, 17);
    const end = new Date(2026, 2, 18);
    return now >= start && now <= end;
};

export default function UserDashboard() {
    const router = useRouter();
    const { user } = useAuthStore();

    if (!user) return null;

    const totalMinutes = user.total_minutes || 0;
    const todayMinutes = user.today_minutes || 0;
    const currentStreak = user.current_streak || 0;
    const lastSurahNumber = user.last_surah_number;
    const lastAyahNumber = user.last_ayah_number;
    const dailyGoal = 5; // 5 minutes needed for streak
    const hasanath = totalMinutes * 10;

    const progress = Math.min((todayMinutes / dailyGoal) * 100, 100);
    const ramadanActive = isRamadan();
    const streakQualified = todayMinutes >= 5;
    const hasReadingHistory = lastSurahNumber && lastAyahNumber;

    const cards = [
        {
            label: 'Current Streak',
            value: `${currentStreak}`,
            unit: 'Days',
            icon: Flame,
            gradient: 'from-orange-500 to-amber-500',
            bg: 'bg-orange-500/10',
            lightBg: 'bg-orange-50',
            border: 'border-orange-500/20',
            iconColor: 'text-orange-500',
            subtext: streakQualified ? 'Goal Met 🔥' : 'Need 5 mins'
        },
        {
            label: 'Total Hasanat',
            value: hasanath.toLocaleString(),
            unit: '',
            icon: Sparkles,
            gradient: 'from-yellow-400 to-amber-500',
            bg: 'bg-amber-500/10',
            lightBg: 'bg-amber-50',
            border: 'border-amber-500/20',
            iconColor: 'text-amber-500'
        },
        {
            label: 'Total Tilawah',
            value: `${totalMinutes}`,
            unit: 'Mins',
            icon: Clock,
            gradient: 'from-emerald-400 to-teal-500',
            bg: 'bg-emerald-500/10',
            lightBg: 'bg-emerald-50',
            border: 'border-emerald-500/20',
            iconColor: 'text-emerald-500'
        },
        {
            label: 'Today',
            value: `${todayMinutes}`,
            unit: 'Mins',
            icon: Target,
            gradient: 'from-cyan-400 to-blue-500',
            bg: 'bg-cyan-500/10',
            lightBg: 'bg-cyan-50',
            border: 'border-cyan-500/20',
            iconColor: 'text-cyan-500',
            subtext: `Target: ${dailyGoal}m`
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="relative">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight"
                        >
                            Salem, {user.display_name || user.email?.split('@')[0]}
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-slate-500 dark:text-slate-400 font-medium mt-1"
                        >
                            Your spiritual journey continues
                        </motion.p>
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
                                <div className="text-xs font-black uppercase tracking-widest opacity-90">Ramadan Boost</div>
                                <div className="text-sm font-bold">70x Hasanat Multiplier 🌙</div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Decorative BG touch */}
                <div className="absolute -top-20 -left-20 opacity-5 dark:opacity-10 text-emerald-500 pointer-events-none">
                    <CornerFlourish className="w-64 h-64 rotate-180" />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={clsx(
                            "glass-card p-5 rounded-[2rem] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group",
                            "border border-white/40 dark:border-white/5",
                            card.lightBg, "dark:bg-transparent", // Tinted bg in light mode
                            card.border
                        )}
                    >
                        {/* Hover Gradient */}
                        <div className={clsx(
                            "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br",
                            card.gradient
                        )} />

                        <div className="relative z-10">
                            <div className={clsx(
                                "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-inner",
                                card.bg
                            )}>
                                {/* Use direct text color instead of gradient text for visibility */}
                                <card.icon className={card.iconColor} size={24} />
                            </div>

                            <div className="text-xs font-bold text-slate-500 dark:text-slate-500 mb-1 uppercase tracking-wider">
                                {card.label}
                            </div>

                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                    {card.value}
                                </span>
                                {card.unit && (
                                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{card.unit}</span>
                                )}
                            </div>

                            {card.subtext && (
                                <div className={clsx(
                                    "mt-2 text-[10px] font-black uppercase tracking-wider inline-block px-2 py-1 rounded-full",
                                    streakQualified && card.label === 'Current Streak'
                                        ? "bg-emerald-200/50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                                        : "bg-slate-200/50 dark:bg-slate-800 text-slate-600 dark:text-slate-500"
                                )}>
                                    {card.subtext}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Daily Goal & Action */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Progress Card */}
                <div className="lg:col-span-2 glass-card p-8 rounded-[2.5rem] relative overflow-hidden group border border-emerald-500/10 bg-slate-50 dark:bg-transparent">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                        <BarChart2 size={160} />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
                        {/* Circular Progress */}
                        <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
                            <svg className="w-full h-full transform -rotate-90 drop-shadow-lg">
                                <circle
                                    cx="50%" cy="50%" r="42%"
                                    className="stroke-slate-200 dark:stroke-slate-800 fill-none"
                                    strokeWidth="12"
                                />
                                <motion.circle
                                    initial={{ strokeDasharray: "0 1000" }}
                                    animate={{ strokeDasharray: `${progress * 2.64} 1000` }} // 2.64 approx for r=42%
                                    transition={{ duration: 1.5, ease: "circOut" }}
                                    cx="50%" cy="50%" r="42%"
                                    className="stroke-emerald-500 fill-none"
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white">{Math.round(progress)}%</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Goal</span>
                            </div>
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider mb-4 border border-emerald-500/20">
                                <Zap size={14} fill="currentColor" /> Daily Goal
                            </div>

                            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 leading-tight">
                                {streakQualified ? (
                                    <>You're on fire! 🔥 <br /><span className="text-slate-500 dark:text-slate-400 text-base font-normal">Daily streak goal achieved. Keep going!</span></>
                                ) : (
                                    <>Keep the momentum! 🚀 <br /><span className="text-slate-500 dark:text-slate-400 text-base font-normal">{5 - todayMinutes} more minutes to hit your streak.</span></>
                                )}
                            </h3>

                            <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                                <button
                                    onClick={() => hasReadingHistory
                                        ? router.push(`/surah/${lastSurahNumber}?ayah=${lastAyahNumber}&autoplay=true`)
                                        : router.push('/surahs')
                                    }
                                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                                >
                                    {hasReadingHistory ? 'Continue Reading' : 'Start Reading'}
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Saved Ayahs Snippet */}
                <div className="glass-card p-6 rounded-[2.5rem] relative overflow-hidden group border border-amber-500/10 flex flex-col bg-amber-50/50 dark:bg-transparent">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                                <Bookmark size={20} />
                            </div>
                            <span className="font-bold text-slate-900 dark:text-white">Saved</span>
                        </div>
                        <button
                            onClick={() => router.push('/profile/saved-ayahs')}
                            className="text-xs font-bold text-slate-400 hover:text-amber-500 transition-colors"
                        >
                            View All
                        </button>
                    </div>

                    <div className="flex-1 space-y-3">
                        {user.saved_ayah && user.saved_ayah.length > 0 ? (
                            user.saved_ayah.slice(0, 2).map((ayah: any) => (
                                <button
                                    key={ayah.id}
                                    onClick={() => router.push(`/surah/${ayah.surahId}?ayah=${ayah.ayahNumber}&autoplay=true`)}
                                    className="w-full p-4 rounded-2xl bg-white/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 hover:bg-amber-50 dark:hover:bg-amber-900/40 transition-all text-left group/item shadow-sm"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
                                                Surah {ayah.surahId} : {ayah.ayahNumber}
                                            </div>
                                            <div className="text-[10px] text-slate-400">
                                                {new Date(ayah.savedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <ChevronRight size={14} className="text-amber-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                <Bookmark size={32} className="text-slate-200 dark:text-slate-700 mb-2" />
                                <p className="text-sm text-slate-400">No saved ayahs yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
