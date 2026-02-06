'use client';

import { motion } from 'framer-motion';
import { Loader2, AlertCircle, RefreshCw, BookOpen } from 'lucide-react';
import clsx from 'clsx';

interface LoadingStateProps {
    type?: 'ayah' | 'surah' | 'reciter';
    message?: string;
}

interface ErrorStateProps {
    message: string;
    onRetry?: () => void;
}

export const PremiumLoadingState = ({ type = 'ayah', message }: LoadingStateProps) => {
    const getContent = () => {
        switch (type) {
            case 'surah':
                return {
                    icon: <BookOpen size={48} className="text-emerald-500" />,
                    title: 'Loading Surah',
                    subtitle: 'Preparing beautiful recitation'
                };
            case 'reciter':
                return {
                    icon: <Loader2 size={48} className="text-emerald-500 animate-spin" />,
                    title: 'Loading Reciter',
                    subtitle: 'Fetching audio streams'
                };
            default:
                return {
                    icon: <Loader2 size={48} className="text-emerald-500 animate-spin" />,
                    title: 'Loading Ayah',
                    subtitle: message || 'Preparing recitation'
                };
        }
    };

    const content = getContent();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="min-h-[400px] flex flex-col items-center justify-center p-8"
        >
            {/* Animated background */}
            <div className="relative mb-12">
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity }
                    }}
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 blur-xl"
                />

                <div className="absolute inset-0 flex items-center justify-center">
                    {content.icon}
                </div>
            </div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center space-y-4"
            >
                <h3 className="text-2xl font-bold text-white">
                    {content.title}
                </h3>
                <p className="text-slate-400 max-w-sm">
                    {content.subtitle}
                </p>

                {/* Loading dots */}
                <div className="flex justify-center gap-2">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{ y: [0, -10, 0] }}
                            transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.2
                            }}
                            className="w-2 h-2 rounded-full bg-emerald-500"
                        />
                    ))}
                </div>
            </motion.div>

            {/* Decorative elements */}
            <div className="mt-12 grid grid-cols-3 gap-4 opacity-30">
                {[...Array(9)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.1
                        }}
                        className="w-4 h-4 rounded-full bg-emerald-500"
                    />
                ))}
            </div>
        </motion.div>
    );
};

export const PremiumErrorState = ({ message, onRetry }: ErrorStateProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-[400px] flex flex-col items-center justify-center p-8"
        >
            {/* Error illustration */}
            <div className="relative mb-8">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-red-500/10 to-rose-500/10 blur-2xl" />

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                        <AlertCircle size={64} className="text-rose-500" />
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-full bg-rose-500/20 blur-md"
                        />
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center space-y-6 max-w-md"
            >
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                        Something went wrong
                    </h3>
                    <p className="text-slate-400">
                        {message}
                    </p>
                </div>

                {onRetry && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onRetry}
                        className="
              inline-flex items-center gap-2
              px-6 py-3 rounded-xl
              bg-gradient-to-r from-rose-600 to-rose-700
              hover:from-rose-700 hover:to-rose-800
              text-white font-medium
              shadow-lg shadow-rose-500/20
              transition-all
            "
                    >
                        <RefreshCw size={18} />
                        Try Again
                    </motion.button>
                )}

                <div className="pt-6 border-t border-white/10">
                    <p className="text-sm text-slate-500">
                        If the problem persists, please check your connection or contact support.
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Skeleton Loader for Ayah Cards
export const AyahCardSkeleton = () => {
    return (
        <div className="relative overflow-hidden rounded-3xl p-8 mb-6 bg-slate-900/40 border border-white/10">
            <div className="space-y-6">
                {/* Header skeleton */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-800/50 animate-pulse" />
                        <div className="space-y-2">
                            <div className="h-4 w-32 bg-slate-800/50 rounded animate-pulse" />
                            <div className="h-3 w-24 bg-slate-800/50 rounded animate-pulse" />
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-slate-800/50 animate-pulse" />
                </div>

                {/* Text skeleton */}
                <div className="space-y-3">
                    <div className="h-8 bg-slate-800/50 rounded animate-pulse" />
                    <div className="h-8 bg-slate-800/50 rounded animate-pulse w-5/6" />
                    <div className="h-8 bg-slate-800/50 rounded animate-pulse w-4/6" />
                </div>

                {/* Translation skeleton */}
                <div className="pt-6 border-t border-white/10">
                    <div className="space-y-2">
                        <div className="h-4 w-16 bg-slate-800/50 rounded animate-pulse" />
                        <div className="h-4 bg-slate-800/50 rounded animate-pulse" />
                        <div className="h-4 bg-slate-800/50 rounded animate-pulse w-11/12" />
                    </div>
                </div>
            </div>

            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
    );
};
