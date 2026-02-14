'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAudioStore } from '@/store/audioStore';
import { useSurahCache } from '@/hooks/useSurahCache';
import ReciterSelect from '@/components/ReciterSelect';
import { useAuthStore } from '@/store/authStore';
import { ArrowLeft, Eye, EyeOff, Download, CheckCircle2, User, Loader2, Heart, Play, MoreVertical } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface SurahHeaderProps {
    surahId: number;
    surahName: string;
    translatedName: string;
    verseCount: number;
    onReadClick?: () => void;
}

export default function SurahHeader({ surahId, surahName, translatedName, verseCount, onReadClick }: SurahHeaderProps) {
    const router = useRouter();
    const { isReadingMode, actions, reciterUrl, cachingSurahId, cachingProgress } = useAudioStore();
    const { downloadSurah } = useSurahCache();
    const { user, isAuthenticated, toggleLike } = useAuthStore();

    const isCaching = cachingSurahId === surahId && cachingProgress < 100;
    const isDone = cachingSurahId === surahId && cachingProgress === 100;
    const isLiked = (user?.liked_surahs || []).includes(surahId);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="sticky top-0 z-[60] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/20 dark:border-white/5 shadow-lg shadow-black/5"
        >
            <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Link
                        href="/surahs"
                        className="group p-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all active:scale-95"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                    </Link>

                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden xs:block" />

                    <div className="flex items-center gap-4 min-w-0">
                        <div className="flex flex-col">
                            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-none truncate">
                                {surahName}
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold tracking-wide mt-1 truncate">
                                {translatedName} • {verseCount} Ayahs
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => downloadSurah(surahId, reciterUrl, verseCount)}
                        disabled={isCaching}
                        className={clsx(
                            "flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-sm font-bold transition-all border",
                            isDone
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : isCaching
                                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700"
                        )}
                    >
                        {isDone ? (
                            <CheckCircle2 size={18} />
                        ) : isCaching ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span className="hidden xs:inline lg:inline">{cachingProgress}%</span>
                            </>
                        ) : (
                            <Download size={18} />
                        )}
                        <span className="hidden lg:inline ml-1">{isDone ? 'Offline Ready' : 'Download'}</span>
                    </motion.button>

                    <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                                if (isAuthenticated) {
                                    toggleLike(surahId);
                                }
                            }}
                            className={clsx(
                                "p-2 rounded-xl transition-all",
                                isLiked
                                    ? "bg-white dark:bg-slate-700 text-rose-500 shadow-sm"
                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            )}
                        >
                            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => actions.toggleReadingMode()}
                            className={clsx(
                                "p-2 rounded-xl transition-all",
                                isReadingMode
                                    ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            )}
                        >
                            {isReadingMode ? <Eye size={18} /> : <EyeOff size={18} />}
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.header>
    );
}
