'use client';

import { motion } from 'framer-motion';
import type { MouseEvent } from 'react';
import { Heart, Play, BookOpen, Sparkles, MapPin } from 'lucide-react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useAudioStore } from '@/store/audioStore';
import { useSurahCache } from '@/hooks/useSurahCache';
import { QuatrefoilPattern } from './patterns';

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
    const cachingSurahId = useAudioStore((state) => state.cachingSurahId);
    const cachingProgress = useAudioStore((state) => state.cachingProgress);

    const estimatedHasanat = surah.verses_count * 40;

    const handleCardClick = (e: MouseEvent) => {
        e.preventDefault();
        router.push(`/surah/${surah.id}?autoplay=true`);
    };

    const isCaching = cachingSurahId === surah.id;
    const isMakkan = surah.revelation_place === 'makkah';

    // Unique vibrant gradients based on revelation place
    const gradients = {
        makkah: {
            bg: 'from-amber-50 via-orange-50/80 to-coral-50/60',
            bgDark: 'dark:from-amber-950/30 dark:via-orange-950/20 dark:to-coral-950/10',
            border: 'border-amber-200/50 dark:border-amber-900/30',
            hoverBorder: 'hover:border-amber-400/60 dark:hover:border-amber-500/50',
            shadow: 'shadow-amber-200/40 dark:shadow-amber-950/30',
            hoverShadow: 'hover:shadow-amber-400/40 dark:hover:shadow-amber-500/40',
            accent: 'text-amber-600 dark:text-amber-400',
            accentBg: 'bg-amber-100 dark:bg-amber-950/40',
            overlay: 'group-hover:from-amber-500/15 group-hover:via-orange-500/10 group-hover:to-coral-500/15',
        },
        madinah: {
            bg: 'from-emerald-50 via-turquoise-50/80 to-cyan-50/60',
            bgDark: 'dark:from-emerald-950/30 dark:via-turquoise-950/20 dark:to-cyan-950/10',
            border: 'border-emerald-200/50 dark:border-emerald-900/30',
            hoverBorder: 'hover:border-emerald-400/60 dark:hover:border-emerald-500/50',
            shadow: 'shadow-emerald-200/40 dark:shadow-emerald-950/30',
            hoverShadow: 'hover:shadow-emerald-400/40 dark:hover:shadow-emerald-500/40',
            accent: 'text-emerald-600 dark:text-emerald-400',
            accentBg: 'bg-emerald-100 dark:bg-emerald-950/40',
            overlay: 'group-hover:from-emerald-500/15 group-hover:via-turquoise-500/10 group-hover:to-cyan-500/15',
        }
    };

    const colors = isMakkan ? gradients.makkah : gradients.madinah;

    if (viewMode === 'list') {
        return (
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: 6, transition: { duration: 0.2 } }}
                className={clsx(
                    "group relative overflow-hidden cursor-pointer",
                    "rounded-3xl transition-all duration-500",
                    "bg-gradient-to-r", colors.bg, colors.bgDark,
                    "border-2", colors.border, colors.hoverBorder,
                    colors.shadow, colors.hoverShadow,
                    "p-6 flex items-center justify-between"
                )}
                onClick={handleCardClick}
            >
                {/* Gradient Overlay */}
                <div className={clsx(
                    "absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent",
                    colors.overlay,
                    "transition-all duration-700 pointer-events-none opacity-0 group-hover:opacity-100"
                )} />

                <div className="relative flex items-center gap-6 flex-1">
                    {/* Number Badge */}
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={clsx(
                            "flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center",
                            "bg-gradient-to-br", colors.accentBg,
                            "border-2", colors.border,
                            "shadow-lg"
                        )}
                    >
                        <span className={clsx("text-xl font-black", colors.accent)}>
                            {surah.id}
                        </span>
                    </motion.div>

                    <div className="flex-1">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">
                            {surah.name_simple}
                        </h3>
                        <p className="text-2xl font-uthmani text-slate-700 dark:text-slate-300 mb-2">
                            {surah.name_arabic}
                        </p>
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className={clsx("text-sm font-bold", colors.accent)}>
                                <MapPin size={14} className="inline mr-1" />
                                {isMakkan ? 'Makkan' : 'Medinan'}
                            </span>
                            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                • {surah.verses_count} Ayahs
                            </span>
                        </div>
                    </div>
                </div>

                {/* Favorite Button */}
                <motion.button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onToggleFavorite();
                    }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    className={clsx(
                        "relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center",
                        "bg-white/90 dark:bg-slate-800/90 backdrop-blur-md",
                        "border-2", colors.border,
                        "hover:scale-110 active:scale-95 transition-all duration-300",
                        "shadow-lg"
                    )}
                >
                    <Heart
                        size={20}
                        className={clsx(
                            "transition-all duration-300",
                            isFavorite
                                ? "text-rose-500 fill-rose-500 animate-[heartbeat_1.5s_ease-in-out_infinite]"
                                : "text-slate-400 hover:text-rose-400"
                        )}
                    />
                </motion.button>
            </motion.div>
        );
    }

    // Grid View - Asymmetric design with unique shapes
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            whileHover={{
                y: -12,
                rotate: isMakkan ? -2 : 2,
                scale: 1.03,
                transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }
            }}
            className={clsx(
                "group relative overflow-hidden cursor-pointer",
                "rounded-[2.5rem] transition-all duration-500",
                "bg-gradient-to-br", colors.bg, colors.bgDark,
                "border-3", colors.border, colors.hoverBorder,
                colors.shadow, colors.hoverShadow,
                "p-8"
            )}
            onClick={handleCardClick}
            style={{
                borderRadius: isMakkan ? '2.5rem 2.5rem 2rem 3rem' : '2.5rem 3rem 2.5rem 2rem'
            }}
        >
            {/* Floating Pattern Decoration */}
            <div className="absolute top-4 left-4 opacity-20 dark:opacity-10">
                <QuatrefoilPattern size={40} className={colors.accent} />
            </div>

            {/* Gradient Overlay on Hover */}
            <div className={clsx(
                "absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent",
                colors.overlay,
                "transition-all duration-700 pointer-events-none opacity-0 group-hover:opacity-100"
            )} />

            {/* Favorite Button */}
            <motion.button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleFavorite();
                }}
                whileHover={{ scale: 1.15, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                className={clsx(
                    "absolute top-4 right-4 z-10 w-14 h-14 rounded-[1.2rem] flex items-center justify-center",
                    "bg-white/90 dark:bg-slate-800/90 backdrop-blur-md",
                    "border-2", colors.border,
                    "transition-all duration-300 shadow-xl"
                )}
            >
                <Heart
                    size={22}
                    className={clsx(
                        "transition-all duration-300",
                        isFavorite
                            ? "text-rose-500 fill-rose-500 animate-[heartbeat_1.5s_ease-in-out_infinite]"
                            : "text-slate-400 group-hover:text-rose-400"
                    )}
                />
            </motion.button>

            <div className="relative flex flex-col h-full">
                {/* Number Badge - Asymmetric position */}
                <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    className={clsx(
                        "mb-6 w-20 h-20 rounded-[1.5rem] flex items-center justify-center self-start",
                        "bg-gradient-to-br", colors.accentBg,
                        "border-2", colors.border,
                        "shadow-xl"
                    )}
                >
                    <span className={clsx("text-2xl font-black", colors.accent)}>
                        {surah.id}
                    </span>
                </motion.div>

                {/* Surah Name */}
                <div className="mb-6">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                        {surah.name_simple}
                    </h3>
                    <p className="text-3xl font-uthmani text-slate-700 dark:text-slate-300 leading-relaxed">
                        {surah.name_arabic}
                    </p>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-2">
                        {surah.translated_name?.name || ''}
                    </p>
                </div>

                {/* Stats - Organic layout */}
                <div className="mt-auto space-y-3">
                    <motion.div
                        whileHover={{ x: 4 }}
                        className={clsx(
                            "inline-flex items-center gap-2 px-4 py-2 rounded-2xl",
                            colors.accentBg,
                            "border", colors.border
                        )}
                    >
                        <MapPin size={16} className={colors.accent} />
                        <span className={clsx("text-sm font-black", colors.accent)}>
                            {isMakkan ? 'Makkan' : 'Medinan'}
                        </span>
                    </motion.div>

                    <div className="flex items-center gap-4 flex-wrap">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-2"
                        >
                            <BookOpen size={18} className={colors.accent} />
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                {surah.verses_count} Ayahs
                            </span>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-2"
                        >
                            <Sparkles size={18} className="text-amber-500 animate-pulse" />
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                ~{(estimatedHasanat / 1000).toFixed(0)}k+
                            </span>
                        </motion.div>
                    </div>
                </div>

                {/* Caching Progress */}
                {isCaching && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4"
                    >
                        <div className="h-2 bg-white/50 dark:bg-slate-800/50 rounded-full overflow-hidden">
                            <motion.div
                                className={clsx("h-full bg-gradient-to-r",
                                    isMakkan
                                        ? "from-amber-500 to-orange-500"
                                        : "from-emerald-500 to-cyan-500"
                                )}
                                initial={{ width: 0 }}
                                animate={{ width: `${cachingProgress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                            Caching... {cachingProgress}%
                        </p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};
