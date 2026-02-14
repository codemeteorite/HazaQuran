'use client';

import { useState, useEffect, useRef } from 'react';
import { useAudioStore } from '@/store/audioStore';
import { useAuthStore } from '@/store/authStore';
import { Play, Pause, BookOpen, Bookmark, Check, Copy, Share2, MoreHorizontal } from 'lucide-react';
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

export default function AyahCard({
    surahNumber,
    ayahNumber,
    textUthmani,
    trans,
    tafsir,
    surahVerseCount
}: AyahCardProps) {
    const { isPlaying, currentSurah, currentAyah, actions, progress, duration, isAutoscrollDisabled, isReadingMode } = useAudioStore();
    const { bookmarks, toggleBookmark } = useAuthStore();
    const cardRef = useRef<HTMLDivElement>(null);

    const isActive = currentSurah === surahNumber && currentAyah === ayahNumber;
    const isBookmarked = (bookmarks || []).some(b => b.surahId === surahNumber && b.ayahNumber === ayahNumber);
    const isLastAyah = ayahNumber === surahVerseCount;
    const [showActions, setShowActions] = useState(false);
    const [copied, setCopied] = useState(false);

    // Trigger celebration when last ayah is viewed
    const handleViewportEnter = () => {
        if (isLastAyah) {
            actions.setSurahCompleted(true);
        }
    };

    // Auto-scroll logic
    useEffect(() => {
        if (isActive && cardRef.current && !isAutoscrollDisabled) {
            cardRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, [isActive, isAutoscrollDisabled]);

    const handlePlayPause = () => {
        if (isActive && isPlaying) {
            actions.pause();
        } else {
            actions.play(surahNumber, ayahNumber, surahVerseCount);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(`${textUthmani}\n\n${trans} [${surahNumber}:${ayahNumber}]`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            id={`ayah-${surahNumber}-${ayahNumber}`}
            ref={cardRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            onViewportEnter={handleViewportEnter}
            transition={{ duration: 0.5 }}
            className={clsx(
                "relative group rounded-[2.5rem] p-6 sm:p-10 mb-8 transition-all duration-500",
                isActive
                    ? "bg-white/80 dark:bg-slate-900/80 shadow-[0_0_50px_-10px_rgba(16,185,129,0.2)] dark:shadow-[0_0_50px_-10px_rgba(16,185,129,0.1)] border-2 border-emerald-500/30 ring-4 ring-emerald-500/5 backdrop-blur-xl"
                    : "bg-white/40 dark:bg-slate-900/40 hover:bg-white/60 dark:hover:bg-slate-900/60 border border-slate-200/50 dark:border-white/5 hover:border-emerald-500/20 shadow-sm backdrop-blur-sm"
            )}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            {/* Active Glow Ambient */}
            {isActive && (
                <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/5 via-cyan-500/5 to-purple-500/5 pointer-events-none" />
            )}

            <div className="relative z-10 flex flex-col gap-8">
                {/* Header: Number & Actions */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className={clsx(
                            "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-sm sm:text-base font-bold transition-all duration-300",
                            isActive
                                ? "bg-gradient-to-br from-emerald-500 to-cyan-600 text-white shadow-lg shadow-emerald-500/30"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-emerald-100/50 dark:group-hover:bg-emerald-500/20 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                        )}>
                            {ayahNumber}
                        </div>
                        {isBookmarked && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                            >
                                <Bookmark size={16} fill="currentColor" />
                            </motion.div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handlePlayPause}
                            className={clsx(
                                "p-2.5 rounded-xl transition-all duration-300",
                                isActive
                                    ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 sm:opacity-0 group-hover:opacity-100"
                            )}
                        >
                            {isActive && isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                        </button>
                    </div>
                </div>

                {/* Arabic Text */}
                <div
                    className={clsx(
                        "text-right leading-[1.8] sm:leading-[2.2] font-uthmani transition-all duration-500",
                        isActive
                            ? "text-slate-900 dark:text-white drop-shadow-sm scale-[1.02]"
                            : "text-slate-800 dark:text-slate-200"
                    )}
                    style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
                >
                    {textUthmani}
                </div>

                {/* Translation */}
                {!isReadingMode && trans && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={clsx(
                            "text-lg sm:text-xl leading-relaxed transition-colors duration-300 pl-4 border-l-4",
                            isActive
                                ? "text-slate-700 dark:text-slate-300 border-emerald-500/50"
                                : "text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800"
                        )}
                    >
                        {trans}
                    </motion.div>
                )}

                {/* Bottom Actions Bar */}
                <motion.div
                    className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                    <button
                        onClick={() => toggleBookmark(String(surahNumber), String(ayahNumber))}
                        className={clsx(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
                            isBookmarked
                                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                                : "bg-slate-50 dark:bg-slate-800/50 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        )}
                    >
                        <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
                        {isBookmarked ? "Saved" : "Save"}
                    </button>

                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-slate-50 dark:bg-slate-800/50 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                    >
                        {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                        {copied ? "Copied" : "Copy"}
                    </button>

                    <button className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                        <Share2 size={16} />
                    </button>

                    <button className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                        <MoreHorizontal size={16} />
                    </button>
                </motion.div>

                {/* Active Progress Line */}
                {isActive && duration > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 overflow-hidden rounded-b-[2.5rem]">
                        <motion.div
                            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                            initial={{ width: '0%' }}
                            animate={{ width: `${(progress / duration) * 100}%` }}
                            transition={{ ease: "linear", duration: 0.1 }}
                        />
                    </div>
                )}
            </div>
        </motion.div>
    );
}
