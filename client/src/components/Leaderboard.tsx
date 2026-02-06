'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, TrendingUp } from 'lucide-react';
import axios from 'axios';
import clsx from 'clsx';

export default function Leaderboard() {
    const [leaders, setLeaders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaders = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/users/leaderboard');
                setLeaders(res.data);
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
            <div className="space-y-4 animate-pulse">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/50" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                        Global Tilwah <Trophy className="text-amber-500" size={24} />
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">Top listeners of the community</p>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                    <button className="px-3 py-1.5 text-xs font-bold rounded-md bg-white dark:bg-slate-700 shadow-sm text-emerald-600">All Time</button>
                    <button className="px-3 py-1.5 text-xs font-bold rounded-md text-slate-500">Weekly</button>
                </div>
            </div>

            <div className="space-y-3">
                {leaders.map((user, i) => (
                    <motion.div
                        key={user._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={clsx(
                            "glass-card p-4 rounded-2xl flex items-center justify-between hover:scale-[1.01] transition-transform",
                            i === 0 && "border-amber-500/30 bg-amber-500/[0.02]",
                            i === 1 && "border-slate-400/30 bg-slate-400/[0.02]",
                            i === 2 && "border-orange-400/30 bg-orange-400/[0.02]"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-8 text-center font-black text-slate-400">
                                {i === 0 ? <Crown className="text-amber-500 mx-auto" size={20} /> :
                                    i === 1 ? <Medal className="text-slate-400 mx-auto" size={20} /> :
                                        i === 2 ? <Medal className="text-orange-400 mx-auto" size={20} /> :
                                            i + 1}
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/10 flex items-center justify-center font-bold text-emerald-600">
                                {user.displayName[0].toUpperCase()}
                            </div>
                            <div>
                                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    {user.displayName}
                                    {user.stats?.currentStreak > 0 && (
                                        <span className="text-[10px] bg-orange-500/10 text-orange-500 px-1.5 rounded-full py-0.5 border border-orange-500/20">
                                            {user.stats.currentStreak} 🔥
                                        </span>
                                    )}
                                </div>
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                    <TrendingUp size={10} /> Reciting
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-black text-slate-900 dark:text-white">
                                {user.stats?.totalMinutes || 0}
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Mins</div>
                        </div>
                    </motion.div>
                ))}

                {leaders.length === 0 && (
                    <div className="py-12 text-center text-slate-500">
                        No reciters yet. Be the first!
                    </div>
                )}
            </div>
        </div>
    );
}
