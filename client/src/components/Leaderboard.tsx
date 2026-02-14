'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, TrendingUp, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import clsx from 'clsx';
import { CornerFlourish } from './patterns';

interface LeaderboardUser {
    id: string;
    display_name: string;
    total_minutes: number;
    current_streak: number;
}

export default function Leaderboard() {
    const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaders = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('id, display_name, total_minutes, current_streak')
                    .order('total_minutes', { ascending: false })
                    .limit(10);

                if (error) throw error;
                setLeaders(data || []);
            } catch (err) {
                console.error('Failed to fetch leaderboard', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaders();
    }, []);

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6 relative">
            <div className="absolute -top-10 -right-10 opacity-5 dark:opacity-10 text-amber-500 pointer-events-none rotate-90">
                <CornerFlourish className="w-48 h-48" />
            </div>

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
                        Global Leaders <Trophy className="text-amber-500 drop-shadow-lg" size={32} />
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                        Top dedicated reciters in the community
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {leaders.map((user, i) => {
                    const isTop3 = i < 3;
                    const RankIcon = i === 0 ? Crown : i === 1 ? Medal : i === 2 ? Medal : Trophy;
                    const rankColor = i === 0 ? 'text-amber-500' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-orange-400' : 'text-slate-300 dark:text-slate-600';
                    const gradient = i === 0 ? 'from-amber-500/20 to-yellow-500/20' : i === 1 ? 'from-slate-400/20 to-slate-500/20' : i === 2 ? 'from-orange-400/20 to-red-400/20' : '';

                    return (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0, x: -20, y: 10 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={clsx(
                                "group relative overflow-hidden rounded-3xl p-4 sm:p-5 flex items-center justify-between transition-all duration-300",
                                isTop3 ? "glass-card border border-white/40 dark:border-white/10" : "bg-white/50 dark:bg-white/5 border border-transparent hover:bg-white/80 dark:hover:bg-white/10"
                            )}
                        >
                            {/* Rank BG Gradient */}
                            {isTop3 && (
                                <div className={clsx(
                                    "absolute inset-0 opacity-10 dark:opacity-20 bg-gradient-to-r",
                                    gradient
                                )} />
                            )}

                            <div className="relative z-10 flex items-center gap-4 sm:gap-6">
                                <div className={clsx(
                                    "w-12 h-12 flex items-center justify-center font-black text-xl rounded-2xl shadow-inner",
                                    isTop3 ? "bg-white/80 dark:bg-black/20 backdrop-blur-md" : "bg-slate-100 dark:bg-slate-800",
                                    rankColor
                                )}>
                                    {i + 1}
                                </div>

                                <div>
                                    <div className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                        {user.display_name || 'Anonymous User'}
                                        {i === 0 && <Crown size={16} className="text-amber-500 fill-amber-500" />}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                                        <span className="flex items-center gap-1">
                                            <TrendingUp size={12} /> {user.current_streak} day streak
                                        </span>
                                        {i === 0 && (
                                            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                                <Sparkles size={12} /> Top Reciter
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="relative z-10 text-right">
                                <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                    {Math.round(user.total_minutes).toLocaleString()}
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    Minutes
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
