'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useAudioStore } from '@/store/audioStore';
import { useSurahCache } from '@/hooks/useSurahCache';
import { ArrowLeft, Book, Eye, EyeOff, Download, CheckCircle2, CloudDownload, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

// Dynamically import ReciterSelect removed

interface SurahHeaderProps {
    surahId: number;
    surahName: string;
    translatedName: string;
    verseCount: number;
}

export default function SurahHeader({ surahId, surahName, translatedName, verseCount }: SurahHeaderProps) {
    const { isReadingMode, actions, reciterUrl, cachingSurahId, cachingProgress } = useAudioStore();
    const { downloadSurah } = useSurahCache();

    const isCaching = cachingSurahId === surahId && cachingProgress < 100;
    const isDone = cachingSurahId === surahId && cachingProgress === 100;

    return (
        <header className="sticky top-0 z-[60] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
                    <Link
                        href="/surahs"
                        className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all font-bold flex items-center gap-2 shrink-0"
                    >
                        <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                        <span className="hidden md:inline">Back</span>
                    </Link>

                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden xs:block" />

                    <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                        <div className="overflow-hidden min-w-0">
                            <h1 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white leading-tight truncate">
                                {surahName}
                            </h1>
                            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide truncate">
                                {translatedName}
                            </p>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => downloadSurah(surahId, reciterUrl, verseCount)}
                            disabled={isCaching}
                            className={clsx(
                                "hidden sm:flex p-1.5 sm:p-2 rounded-lg transition-all border shrink-0",
                                isDone
                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                    : isCaching
                                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                        : "bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 border-transparent hover:text-emerald-500"
                            )}
                            title="Download Surah for Offline Use"
                        >
                            {isDone ? (
                                <CheckCircle2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                            ) : isCaching ? (
                                <Loader2 size={16} className="animate-spin sm:w-[18px] sm:h-[18px]" />
                            ) : (
                                <Download size={16} className="sm:w-[18px] sm:h-[18px]" />
                            )}
                        </motion.button>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    <button
                        onClick={() => actions.toggleReadingMode()}
                        className={clsx(
                            "flex items-center justify-center p-2 sm:px-4 sm:py-2 rounded-xl border transition-all duration-300 font-bold text-sm",
                            isReadingMode
                                ? "bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/20"
                                : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-200 dark:hover:bg-white/10"
                        )}
                        title={isReadingMode ? "Disable Reading Mode" : "Enable Reading Mode"}
                    >
                        {isReadingMode ? <Eye size={18} /> : <EyeOff size={18} />}
                        <span className="hidden lg:inline ml-2">Reading Mode</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
