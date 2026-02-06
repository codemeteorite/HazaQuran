'use client';

import { useState, useRef } from 'react';
import { useAudioStore } from '@/store/audioStore';
import { useSurahCache } from '@/hooks/useSurahCache';
import { Play, Pause, SkipForward, SkipBack, Repeat, Volume2, CloudDownload, CheckCircle2, Loader2 } from 'lucide-react';
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
        reciterUrl,
        cachingSurahId,
        cachingProgress
    } = useAudioStore();

    const { downloadSurah } = useSurahCache();

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

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[1000]">
            {/* Collapse Toggle Button */}
            <div className="mx-auto max-w-7xl px-6 relative">
                <button
                    onClick={actions.toggleIsCollapsed}
                    className={clsx(
                        "absolute -top-12 left-1/2 -translate-x-1/2",
                        "w-12 h-12 rounded-t-2xl flex items-center justify-center",
                        "bg-white dark:bg-slate-900 border-x border-t border-slate-200 dark:border-emerald-500/20 backdrop-blur-3xl",
                        "text-emerald-600 dark:text-emerald-500 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors shadow-2xl"
                    )}
                >
                    <motion.div
                        animate={{ rotate: isCollapsed ? 180 : 0 }}
                    >
                        {isCollapsed ? '↑' : '↓'}
                    </motion.div>
                </button>
            </div>

            <AnimatePresence>
                {!isCollapsed && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                    >
                        {/* Background blur effect */}
                        <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/90 backdrop-blur-3xl border-t border-slate-200 dark:border-slate-800" />

                        {/* Main player */}
                        <div className="relative mx-auto max-w-7xl px-6 py-4">
                            <div className="rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-emerald-500/20 shadow-2xl shadow-emerald-500/10 p-6">

                                {/* Top row: Info & Controls */}
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
                                    {/* Track info */}
                                    <div className="flex items-center gap-4 min-w-0 flex-1 w-full md:w-auto">
                                        <div className={clsx(
                                            "w-14 h-14 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0",
                                            hasTrack
                                                ? "bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/30"
                                                : "bg-slate-800/50"
                                        )}>
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                                            <span className="text-white font-bold text-lg relative z-10">
                                                {hasTrack ? currentSurah : '--'}
                                            </span>
                                        </div>

                                        <div className="min-w-0">
                                            <AnimatePresence mode="wait">
                                                {hasTrack ? (
                                                    <motion.div
                                                        key="playing"
                                                        initial={{ opacity: 0, y: 5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="flex items-center gap-4"
                                                    >
                                                        <div className="min-w-0">
                                                            <h3 className="font-bold text-slate-900 dark:text-white text-lg truncate">
                                                                Surah {currentSurah} • Ayah {currentAyah}
                                                            </h3>
                                                            <p className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                                                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                                Now Playing
                                                            </p>
                                                        </div>

                                                        {/* Sync Button / Progress */}
                                                        <div className="hidden md:block">
                                                            {cachingSurahId === currentSurah && cachingProgress < 100 ? (
                                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                                                    <Loader2 size={14} className="animate-spin" />
                                                                    <span className="text-[10px] font-black uppercase tracking-wider">{cachingProgress}% Synced</span>
                                                                </div>
                                                            ) : cachingSurahId === currentSurah && cachingProgress === 100 ? (
                                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                                    <CheckCircle2 size={14} />
                                                                    <span className="text-[10px] font-black uppercase tracking-wider">Available Offline</span>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => downloadSurah(currentSurah!, reciterUrl, currentSurahVerses!)}
                                                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 border border-slate-200 dark:border-white/10 transition-all hover:scale-105"
                                                                >
                                                                    <CloudDownload size={14} />
                                                                    <span className="text-[10px] font-black uppercase tracking-wider">Download for offline</span>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="idle"
                                                        initial={{ opacity: 0, y: 5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                    >
                                                        <h3 className="font-semibold text-slate-400">Ready to Play</h3>
                                                        <p className="text-sm text-slate-500">Select an ayah to begin</p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    {/* Center controls */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={actions.prevAyah}
                                            disabled={!hasTrack}
                                            className={clsx(
                                                "p-3 rounded-xl transition-all",
                                                hasTrack
                                                    ? "hover:bg-white/10 text-slate-300 hover:text-white"
                                                    : "text-slate-700 cursor-not-allowed"
                                            )}
                                        >
                                            <SkipBack size={20} />
                                        </button>

                                        <button
                                            onClick={() => {
                                                if (hasTrack) {
                                                    if (isPlaying) {
                                                        actions.pause();
                                                    } else {
                                                        // Explicitly use the extracted variables
                                                        actions.play(currentSurah!, currentAyah!, currentSurahVerses!);
                                                    }
                                                }
                                            }}
                                            disabled={!hasTrack}
                                            className={clsx(
                                                "w-16 h-16 rounded-full flex items-center justify-center transition-all relative group",
                                                hasTrack
                                                    ? "bg-gradient-to-br from-emerald-500 to-cyan-500 hover:scale-105 shadow-2xl shadow-emerald-500/30"
                                                    : "bg-slate-800/50 text-slate-600 cursor-not-allowed"
                                            )}
                                        >
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            {isPlaying ? (
                                                <Pause size={24} className="text-white relative z-10" />
                                            ) : (
                                                <Play size={24} className="text-white ml-1 relative z-10" />
                                            )}
                                        </button>

                                        <button
                                            onClick={actions.nextAyah}
                                            disabled={!hasTrack}
                                            className={clsx(
                                                "p-3 rounded-xl transition-all",
                                                hasTrack
                                                    ? "hover:bg-white/10 text-slate-300 hover:text-white"
                                                    : "text-slate-700 cursor-not-allowed"
                                            )}
                                        >
                                            <SkipForward size={20} />
                                        </button>
                                    </div>

                                    {/* Right side controls */}
                                    <div className="flex items-center gap-4 flex-1 justify-end w-full md:w-auto">
                                        {/* Volume */}
                                        <div className="hidden md:flex items-center gap-2 w-32">
                                            <Volume2 size={18} className="text-slate-400 shrink-0" />
                                            <input
                                                type="range"
                                                min="0"
                                                max="200"
                                                value={volumeLevel}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value);
                                                    setVolumeLevel(val);
                                                    actions.setVolume(val / 100);
                                                }}
                                                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                            />
                                            <span className="text-[10px] font-bold text-slate-500 w-8">{volumeLevel}%</span>
                                        </div>

                                        {/* Speed */}
                                        <button
                                            onClick={() => actions.setPlaybackSpeed(playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : playbackSpeed === 1.5 ? 0.75 : 1)}
                                            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors border border-slate-200 dark:border-white/10 shrink-0"
                                        >
                                            {playbackSpeed}x
                                        </button>

                                        {/* Reciter Select */}
                                        <div className="shrink-0">
                                            <ReciterSelect />
                                        </div>

                                        {/* Repeat */}
                                        <button
                                            onClick={actions.toggleRepeatAyah}
                                            className={clsx(
                                                "p-2 rounded-lg transition-colors",
                                                isRepeatAyah
                                                    ? "text-emerald-400 bg-emerald-500/20"
                                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                                            )}
                                        >
                                            <Repeat size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Progress bar */}
                                <div className="space-y-2">
                                    <div
                                        ref={progressRef}
                                        onClick={handleProgressClick}
                                        className="h-1.5 bg-slate-200 dark:bg-slate-800/50 rounded-full cursor-pointer relative group"
                                    >
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 relative"
                                            initial={{ width: '0%' }}
                                            animate={{ width: `${duration > 0 ? (progress / duration) * 100 : 0}%` }}
                                            transition={{ duration: 0.1 }}
                                        >
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
                                        </motion.div>

                                        {/* Hover preview */}
                                        <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="absolute top-0 left-0 w-full h-full bg-white/5 rounded-full" />
                                        </div>
                                    </div>

                                    <div className="flex justify-between text-xs text-slate-500 font-mono">
                                        <span>{formatTime(progress)}</span>
                                        <span>{formatTime(duration)}</span>
                                    </div>
                                </div>

                                {/* Waveform visualization */}
                                {hasTrack && (
                                    <div className="mt-4 opacity-50">
                                        <WaveformVisualizer isPlaying={isPlaying} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
