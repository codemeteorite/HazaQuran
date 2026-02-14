'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioStore } from '@/store/audioStore';
import { X, Share2, Award, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SurahCelebration({ surahName }: { surahName: string }) {
    const { isSurahCompleted, actions } = useAudioStore();
    const [showConfetti, setShowConfetti] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isSurahCompleted) {
            setShowConfetti(true);
        } else {
            setShowConfetti(false);
        }
    }, [isSurahCompleted]);

    const handleClose = () => {
        actions.setSurahCompleted(false);
    };

    if (!isSurahCompleted) return null;

    // Generate random flowers/particles
    const particles = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100, // percentage
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2,
        icon: ['🌸', '🌺', '🌹', '✨', '🍃', '💫'][Math.floor(Math.random() * 6)]
    }));

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4"
            >
                {/* Falling Flowers */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {particles.map((p) => (
                        <motion.div
                            key={p.id}
                            initial={{ y: -50, x: `${p.x}vw`, opacity: 0, rotate: 0 }}
                            animate={{
                                y: '110vh',
                                opacity: [0, 1, 1, 0],
                                rotate: 360
                            }}
                            transition={{
                                duration: p.duration,
                                delay: p.delay,
                                ease: 'linear',
                                repeat: Infinity
                            }}
                            className="absolute text-2xl md:text-3xl"
                        >
                            {p.icon}
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ scale: 0.8, y: 50, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    className="relative bg-white dark:bg-slate-900 w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 text-center overflow-hidden"
                >
                    {/* Glow Effect */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative z-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.2 }}
                            className="w-20 h-20 mx-auto bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-6"
                        >
                            <Award size={40} strokeWidth={2.5} />
                        </motion.div>

                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Mashallah!</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-8">
                            You've completed <span className="text-emerald-500 font-bold">{surahName}</span>
                        </p>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <button
                                onClick={() => {
                                    handleClose();
                                    router.push('/surahs');
                                }}
                                className="py-3 px-4 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                Back to List
                            </button>
                            <button
                                onClick={handleClose}
                                className="py-3 px-4 rounded-xl font-bold bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/30 transition-colors"
                            >
                                Continue
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
