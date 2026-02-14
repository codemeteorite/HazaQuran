'use client';

import { useState, useRef, useEffect } from 'react';
import { useAudioStore } from '@/store/audioStore';
import { Play, Pause, SkipForward, SkipBack, Repeat, Volume2, ChevronUp, ChevronDown, X } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import WaveformVisualizer from './WaveformVisualizer';
import ReciterSelect from './ReciterSelect';

export default function AudioPlayer() {
    const {
        isPlaying,
        currentSurah,
        currentAyah,
        currentSurahVerses,
        isRepeatAyah,
        playbackSpeed,
        actions,
        progress,
        duration,
        volume,
        isCollapsed,
        reciterUrl
    } = useAudioStore();

    const [volumeLevel, setVolumeLevel] = useState(volume * 100);
    const progressRef = useRef<HTMLDivElement>(null);

    const hasTrack = currentSurah !== null;
    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleProgressClick = (e: React.MouseEvent) => {
        if (!progressRef.current || !duration) return;
        const rect = progressRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = (clickX / rect.width) * 100;
        const newTime = (percentage / 100) * duration;
        actions.seek(newTime);
    };

    // Sync local volume state with store
    useEffect(() => {
        setVolumeLevel(volume * 100);
    }, [volume]);

    // Prevent hydration mismatch
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (!hasTrack && isCollapsed) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[1000]">
            <AnimatePresence mode="wait">
                {isCollapsed ? (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="absolute bottom-6 right-6 z-50"
                    >
                        <button
                            onClick={actions.toggleIsCollapsed}
                            className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-4 rounded-full shadow-2xl shadow-emerald-500/20 border border-slate-200 dark:border-slate-700 flex items-center gap-3 hover:scale-105 transition-transform"
                        >
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-sm font-bold">Now Playing</span>
                            <ChevronUp size={16} />
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="relative"
                    >
                        {/* Minimized Toggle Handle */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex justify-center">
                            <button
                                onClick={actions.toggleIsCollapsed}
                                className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-6 py-2 rounded-t-2xl border-t border-x border-slate-200 dark:border-slate-700 shadow-lg text-slate-500 hover:text-emerald-500 transition-colors"
                            >
                                <ChevronDown size={20} />
                            </button>
                        </div>

                        {/* Main Player Container */}
                        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-700 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] pb-6 pt-4 px-4 sm:px-6">
                            <div className="max-w-5xl mx-auto">

                                {/* Progress Bar */}
                                <div
                                    ref={progressRef}
                                    onClick={handleProgressClick}
                                    className="relative h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full cursor-pointer group mb-6 overflow-hidden"
                                >
                                    <motion.div
                                        className="absolute top-0 left-0 bottom-0 bg-emerald-500"
                                        initial={{ width: '0%' }}
                                        animate={{ width: `${duration > 0 ? (progress / duration) * 100 : 0}%` }}
                                        transition={{ ease: "linear", duration: 0.1 }}
                                    />
                                    {/* Seek Handle */}
                                    <div
                                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                                        style={{ left: `${duration > 0 ? (progress / duration) * 100 : 0}%` }}
                                    />
                                </div>

                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                                    {/* Track Info */}
                                    <div className="flex items-center gap-3 w-full md:w-1/3">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-emerald-100 to-cyan-100 dark:from-emerald-900/30 dark:to-cyan-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-base sm:text-lg shadow-inner shrink-0">
                                            {currentSurah}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-bold text-slate-900 dark:text-white truncate text-sm sm:text-base">
                                                Surah {currentSurah}
                                            </h3>
                                            <p className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                                                Ayah {currentAyah} • {reciterUrl.split('/').pop()?.replace(/-/g, ' ') || 'Mishary Rashid'}
                                            </p>
                                        </div>
                                        {/* Mobile Reciter Select */}
                                        <div className="md:hidden">
                                            <ReciterSelect />
                                        </div>
                                    </div>

                                    {/* Playback Controls */}
                                    <div className="flex items-center justify-center gap-4 w-full md:w-1/3">
                                        <button
                                            onClick={actions.toggleRepeatAyah}
                                            className={clsx(
                                                "p-2 rounded-lg transition-colors",
                                                isRepeatAyah
                                                    ? "text-emerald-500 bg-emerald-500/10"
                                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                            )}
                                        >
                                            <Repeat size={18} />
                                        </button>

                                        <button
                                            onClick={actions.prevAyah}
                                            className="text-slate-400 hover:text-emerald-500 transition-colors p-2"
                                            disabled={!hasTrack}
                                        >
                                            <SkipBack size={24} fill="currentColor" />
                                        </button>

                                        <button
                                            onClick={() => {
                                                if (hasTrack) {
                                                    if (isPlaying) {
                                                        actions.pause();
                                                    } else {
                                                        actions.play(currentSurah!, currentAyah!, currentSurahVerses!);
                                                    }
                                                }
                                            }}
                                            className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all hover:scale-105"
                                        >
                                            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                                        </button>

                                        <button
                                            onClick={actions.nextAyah}
                                            className="text-slate-400 hover:text-emerald-500 transition-colors p-2"
                                            disabled={!hasTrack}
                                        >
                                            <SkipForward size={24} fill="currentColor" />
                                        </button>

                                        <div className="relative group">
                                            <button
                                                onClick={() => actions.setPlaybackSpeed(playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : 1)}
                                                className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors w-10 text-center"
                                            >
                                                {playbackSpeed}x
                                            </button>
                                        </div>
                                    </div>

                                    {/* Volume & Reciter */}
                                    <div className="hidden md:flex items-center justify-end gap-4 w-1/3">
                                        <div className="flex items-center gap-2 group">
                                            <Volume2 size={16} className="text-slate-400" />
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={volumeLevel}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value);
                                                    setVolumeLevel(val);
                                                    actions.setVolume(val / 100);
                                                }}
                                                className="w-24 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 opacity-50 group-hover:opacity-100 transition-opacity"
                                            />
                                        </div>
                                        <ReciterSelect />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
