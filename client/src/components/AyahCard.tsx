'use client';

import { useState, useEffect, useRef } from 'react';
import { useAudioStore } from '@/store/audioStore';
import { Play, Pause, BookOpen, Bookmark, BookmarkCheck } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface AyahCardProps {
    surahNumber: number;
    ayahNumber: number;
    textUthmani: string;
    trans?: string;
    tafsir?: string;
    surahVerseCount: number;
}

const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const AyahCard = ({
    surahNumber,
    ayahNumber,
    textUthmani,
    trans,
    tafsir,
    surahVerseCount
}: AyahCardProps) => {
    const { isPlaying, currentSurah, currentAyah, actions, progress, duration, isAutoscrollDisabled, isReadingMode, bookmarks } = useAudioStore();
    const cardRef = useRef<HTMLDivElement>(null);

    const isActive = currentSurah === surahNumber && currentAyah === ayahNumber;
    const isBookmarked = bookmarks.includes(`${surahNumber}:${ayahNumber}`);
    const [showTafsir, setShowTafsir] = useState(false);

    useEffect(() => {
        if (isActive && cardRef.current && !isAutoscrollDisabled) {
            cardRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, [isActive, isAutoscrollDisabled]);

    const ayahProgress = isActive && duration > 0 ? (progress / duration) * 100 : 0;

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={clsx(
                "relative group overflow-hidden rounded-3xl p-8 mb-6 transition-all duration-300",
                isActive
                    ? "bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/40 dark:to-slate-900/80 border-2 border-emerald-500/30 shadow-[0_0_40px_-5px_rgba(16,185,129,0.15)]"
                    : "bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 hover:border-emerald-500/20 shadow-sm hover:shadow-md"
            )}
        >
            {/* Active ayah progress bar */}
            {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                        initial={{ width: '0%' }}
                        animate={{ width: `${ayahProgress}%` }}
                        transition={{ duration: 0.1 }}
                    />
                </div>
            )}

            {/* Glow effects */}
            <div className={clsx(
                "absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl transition-opacity duration-500",
                isActive
                    ? "opacity-30 bg-emerald-500/30"
                    : "opacity-0 group-hover:opacity-20 bg-emerald-500/20"
            )} />

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={clsx(
                                "relative w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border-2 transition-all duration-300",
                                isActive
                                    ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-500/30"
                                    : "bg-slate-800/50 text-slate-400 border-slate-700 group-hover:border-emerald-500/50"
                            )}
                        >
                            {ayahNumber}
                            {isActive && isPlaying && (
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500"
                                />
                            )}
                        </motion.div>

                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                                Surah {surahNumber} • Ayah {ayahNumber}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {isActive ? (isPlaying ? 'Now Playing' : 'Paused') : 'Click to play'}
                            </p>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                        {/* Play/Pause */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                                isActive && isPlaying
                                    ? actions.pause()
                                    : actions.play(surahNumber, ayahNumber, surahVerseCount)
                            }
                            className={clsx(
                                "w-12 h-12 rounded-full flex items-center justify-center border transition-all relative overflow-hidden group",
                                isActive && isPlaying
                                    ? "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
                                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                            )}
                        >
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            {isActive && isPlaying ? (
                                <Pause size={20} className="relative z-10" />
                            ) : (
                                <Play size={20} className="relative z-10 ml-0.5" />
                            )}
                        </motion.button>

                        {/* Bookmark Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => actions.toggleBookmark(surahNumber, ayahNumber)}
                            className={clsx(
                                "w-10 h-10 rounded-lg flex items-center justify-center border transition-colors",
                                isBookmarked
                                    ? "bg-amber-500/20 text-amber-500 border-amber-500/30 shadow-lg shadow-amber-500/10"
                                    : "bg-slate-800/50 text-slate-400 border-slate-700 hover:border-amber-500/30"
                            )}
                        >
                            {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                        </motion.button>

                        {/* Tafsir toggle */}
                        {tafsir && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowTafsir(!showTafsir)}
                                className={clsx(
                                    "w-10 h-10 rounded-lg flex items-center justify-center border transition-colors",
                                    showTafsir
                                        ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                                        : "bg-slate-800/50 text-slate-400 border-slate-700 hover:border-purple-500/30"
                                )}
                            >
                                <BookOpen size={18} />
                            </motion.button>
                        )}

                    </div>
                </div>
            </div>

            {/* Quran Text */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8"
            >
                <p
                    dir="rtl"
                    className={clsx(
                        "text-4xl leading-relaxed font-uthmani text-right mb-6 transition-colors",
                        isActive ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"
                    )}
                >
                    {textUthmani}
                </p>

                {trans && !isReadingMode && (
                    <div className="border-l-4 border-emerald-500/30 pl-6 py-2">
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed italic">
                            "{trans}"
                        </p>
                    </div>
                )}
            </motion.div>

            {/* Tafsir section */}
            <AnimatePresence>
                {showTafsir && tafsir && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-slate-100 dark:bg-slate-900/50 rounded-xl p-6 border border-emerald-500/10 dark:border-purple-500/20">
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen size={18} className="text-emerald-600 dark:text-purple-400" />
                                <h4 className="font-bold text-emerald-900 dark:text-purple-300">Tafsir</h4>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                {tafsir}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Audio timeline for active ayah */}
            {isActive && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 pt-6 border-t border-white/10"
                >
                    <div className="flex items-center justify-between text-sm text-slate-500 mb-2 font-mono">
                        <span>{formatTime(progress)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                    <div
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const clickX = e.clientX - rect.left;
                            const percentage = (clickX / rect.width) * 100;
                            const newTime = (percentage / 100) * duration;
                            actions.seek(newTime);
                        }}
                        className="h-2 bg-slate-800 rounded-full overflow-hidden cursor-pointer"
                    >
                        <motion.div
                            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                            initial={{ width: '0%' }}
                            animate={{ width: `${ayahProgress}%` }}
                        />
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default AyahCard;
