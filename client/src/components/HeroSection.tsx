'use client';

import { motion } from 'framer-motion';
import { Sparkles, BookOpen, ArrowRight, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { IslamicStar, FloatingParticles, ArabesqueCurl, HexagonPattern } from './patterns';

import clsx from 'clsx';

export default function HeroSection() {
    const router = useRouter();

    return (
        <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[hsl(var(--bg-luminous-start))] via-[hsl(var(--bg-luminous-mid))] to-[hsl(var(--bg-luminous-end))] dark:from-[hsl(var(--bg-twilight-start))] dark:via-[hsl(var(--bg-twilight-mid))] dark:to-[hsl(var(--bg-twilight-end))] transition-colors duration-1000">

            {/* Animated Sunrise/Sunset Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 dark:from-indigo-900/40 dark:via-purple-900/40 dark:to-slate-900/40 animate-[sunrise-flow_20s_ease-in-out_infinite] mix-blend-overlay" />

            {/* Floating Islamic Patterns */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <FloatingParticles count={15} />

                <motion.div
                    initial={{ opacity: 0, rotate: 0 }}
                    animate={{ opacity: 0.1, rotate: 360 }}
                    transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-40 -left-40 text-amber-500 dark:text-amber-400"
                >
                    <IslamicStar size={400} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, rotate: 0 }}
                    animate={{ opacity: 0.1, rotate: -360 }}
                    transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-40 -right-40 text-emerald-500 dark:text-emerald-400"
                >
                    <IslamicStar size={500} />
                </motion.div>

                <div className="absolute top-1/4 right-[10%] opacity-20 dark:opacity-10 text-rose-500">
                    <HexagonPattern className="w-24 h-24" />
                </div>

                <div className="absolute bottom-1/3 left-[10%] opacity-20 dark:opacity-10 text-turquoise-500">
                    <ArabesqueCurl className="w-32 h-32 transform rotate-12" />
                </div>
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-8"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-amber-200/50 dark:border-amber-900/30 text-amber-700 dark:text-amber-400 font-bold text-sm shadow-xl shadow-amber-500/10"
                    >
                        <Sparkles size={16} className="animate-pulse" />
                        <span>Experience the Holy Quran Reimagined</span>
                    </motion.div>

                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight">
                        <span className="block bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
                            Find Peace in
                        </span>
                        <span className="block bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent mt-2 pb-4">
                            Every Verse
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                        A handcrafted spiritual journey designed to uplift your soul.
                        Immerse yourself in the divine words with a vibrant, modern experience.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                        <motion.button
                            onClick={() => router.push('/surahs')}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative px-8 py-4 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Start Reading
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.button>

                        <motion.button
                            onClick={() => router.push('/profile')}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="group px-8 py-4 rounded-3xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-700 dark:text-slate-200 font-bold text-lg border-2 border-slate-200/50 dark:border-slate-700/50 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 flex items-center gap-2"
                        >
                            <BookOpen size={20} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                            My Collection
                        </motion.button>
                    </div>

                    {/* Floating Cards Demo */}
                    <div className="relative h-20 mt-12 hidden md:block">
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute left-1/4 -bottom-10 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 -rotate-6"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">114</div>
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase">Surah</div>
                                    <div className="font-bold text-slate-900 dark:text-white">An-Nas</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute right-1/4 -bottom-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 rotate-3"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold">1</div>
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase">Surah</div>
                                    <div className="font-bold text-slate-900 dark:text-white">Al-Fatihah</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
