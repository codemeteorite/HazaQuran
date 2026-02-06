'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, Play, BookOpen, Globe } from 'lucide-react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useAudioStore } from '@/store/audioStore';
import { useSurahCache } from '@/hooks/useSurahCache';
import { AnimatePresence } from 'framer-motion';

interface SurahCardProps {
    surah: any;
    isFavorite: boolean;
    onToggleFavorite: () => void;
    viewMode: 'grid' | 'list';
}

export const SurahCard = ({ surah, isFavorite, onToggleFavorite, viewMode }: SurahCardProps) => {
    const router = useRouter();
    const { downloadSurah } = useSurahCache();
    const currentReciterUrl = useAudioStore((state) => state.reciterUrl);

    return (
        <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={clsx(
                "group relative overflow-hidden rounded-3xl border transition-all duration-300",
                "bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm",
                "border-slate-200 dark:border-slate-800",
                "hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10",
                viewMode === 'list' && "flex items-center justify-between p-6",
                viewMode === 'grid' && "p-6"
            )}
        >
            {/* Favorite Button */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleFavorite();
                }}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-xl flex items-center justify-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:border-primary/30 transition-colors"
            >
                <Heart
                    size={18}
                    className={clsx(
                        "transition-colors",
                        isFavorite
                            ? "text-rose-500 fill-rose-500"
                            : "text-slate-400 hover:text-rose-400"
                    )}
                />
            </button>

            <div
                className="block cursor-pointer"
                onClick={async (e) => {
                    e.preventDefault();
                    // Proactively cache surah before navigation/play
                    await downloadSurah(surah.id, currentReciterUrl, surah.verses_count);
                    router.push(`/surah/${surah.id}`);
                }}
            >
                <div className={clsx(
                    "flex",
                    viewMode === 'list' && "items-center gap-6",
                    viewMode === 'grid' && "flex-col gap-4"
                )}>
                    {/* Number Badge */}
                    <div className="relative">
                        <div className={clsx(
                            "rounded-2xl bg-gradient-to-br from-primary/10 to-emerald-500/10",
                            "border border-primary/20",
                            "flex items-center justify-center relative overflow-hidden",
                            viewMode === 'grid' && "w-16 h-16",
                            viewMode === 'list' && "w-14 h-14"
                        )}>
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                                {surah.id}
                            </span>

                            {/* Caching Progress Overlay */}
                            <AnimatePresence>
                                {useAudioStore.getState().cachingSurahId === surah.id && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center"
                                    >
                                        <div className="text-[10px] font-bold text-primary-foreground bg-primary rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                                            {useAudioStore.getState().cachingProgress}%
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Decorative Elements */}
                            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary/10" />
                            <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-emerald-500/10" />
                        </div>

                        {/* Revelation Type Badge */}
                        <div className={clsx(
                            "absolute -bottom-2 -right-2 px-2 py-1 rounded-lg text-xs font-medium border backdrop-blur-sm",
                            surah.revelation_place === 'makkah'
                                ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                                : "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
                        )}>
                            {surah.revelation_place === 'makkah' ? 'M' : 'Md'}
                        </div>
                    </div>

                    {/* Content */}
                    <div className={clsx(
                        "flex-1",
                        viewMode === 'grid' && "space-y-4",
                        viewMode === 'list' && "flex items-center justify-between"
                    )}>
                        <div className={clsx(
                            viewMode === 'list' && "flex-1"
                        )}>
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                                    {surah.name_simple}
                                </h3>
                                <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400">
                                    {surah.verses_count} verses
                                </span>
                            </div>

                            <p className="text-slate-600 dark:text-slate-400 mb-1">
                                {surah.translated_name.name}
                            </p>

                            <p className="font-uthmani text-2xl text-slate-800 dark:text-slate-200">
                                {surah.name_arabic}
                            </p>
                        </div>

                        {/* Stats */}
                        <div className={clsx(
                            "flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400",
                            viewMode === 'grid' && "mt-4 pt-4 border-t border-slate-100 dark:border-slate-800",
                            viewMode === 'list' && "flex-shrink-0"
                        )}>
                            <span className="flex items-center gap-1">
                                <Globe size={14} />
                                {surah.revelation_place === 'makkah' ? 'Meccan' : 'Medinan'}
                            </span>
                            <span className="flex items-center gap-1">
                                <BookOpen size={14} />
                                #{surah.revelation_order}
                            </span>
                            <span className="flex items-center gap-1">
                                <Play size={14} />
                                Listen
                            </span>
                        </div>
                    </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
        </motion.div>
    );
};
