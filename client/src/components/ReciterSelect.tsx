'use client';

import { useState, useMemo } from 'react';
import { useAudioStore, RECITERS } from '@/store/audioStore';
import { Search, Mic2, Check, Star, Globe, Volume2 } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface Reciter {
    id: string;
    name: string;
    url: string;
    country?: string;
    style?: string;
    description?: string;
    favorite?: boolean;
}

export default function ReciterSelect() {
    const { reciterUrl, favoriteReciters, actions } = useAudioStore();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const activeReciter = Object.values(RECITERS).find(r => r.url === reciterUrl);

    const filteredReciters = useMemo(() => {
        const allReciters = Object.entries(RECITERS).map(([id, reciter]) => ({
            id,
            ...reciter,
            favorite: favoriteReciters.includes(id)
        }));

        return allReciters.filter(reciter =>
            reciter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (reciter.style && reciter.style.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (reciter.country && reciter.country.toLowerCase().includes(searchQuery.toLowerCase()))
        ).sort((a, b) => {
            if (a.favorite && !b.favorite) return -1;
            if (!a.favorite && b.favorite) return 1;
            return 0;
        });
    }, [searchQuery, favoriteReciters]);

    return (
        <div className="relative">
            {/* Trigger Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                    setIsOpen(true);
                    actions.setAutoscrollDisabled(true);
                }}
                className="
                  flex items-center gap-2.5 px-3 py-2
                  rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 
                  border border-emerald-500/20 hover:border-emerald-500/40
                  transition-all duration-300
                "
            >
                <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                    <Mic2 size={14} className="text-white" />
                </div>

                <div className="text-left min-w-0 pr-1">
                    <p className="font-bold text-slate-900 dark:text-white text-[13px] line-clamp-1 leading-none">
                        {activeReciter?.name || 'Reciter'}
                    </p>
                </div>
            </motion.button>

            {/* Modal Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                setIsOpen(false);
                                actions.setAutoscrollDisabled(false);
                            }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="
                                fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                                w-[92%] sm:w-full sm:max-w-2xl z-[1001]
                                max-h-[85vh] sm:max-h-[80vh] flex flex-col
                            "
                        >
                            <div className="
                                rounded-3xl overflow-hidden
                                bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900
                                border border-emerald-500/20
                                shadow-2xl shadow-black/50
                                flex flex-col h-full
                            ">
                                {/* Header */}
                                <div className="p-6 border-b border-slate-100 dark:border-white/10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Select Reciter</h2>
                                            <p className="text-slate-500 dark:text-slate-400">Choose your preferred recitation style</p>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setIsOpen(false);
                                                actions.setAutoscrollDisabled(false);
                                            }}
                                            className="
                                                w-10 h-10 rounded-xl flex items-center justify-center
                                                bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10
                                                text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white
                                                transition-colors
                                            "
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    {/* Search */}
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                        <input
                                            autoFocus
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search by name, country, or style..."
                                            className="
                                                w-full pl-12 pr-4 py-3 rounded-xl
                                                bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10
                                                text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500
                                                focus:outline-none focus:border-emerald-500/50
                                                transition-colors
                                            "
                                        />
                                    </div>
                                </div>

                                {/* Reciter List */}
                                <div className="flex-1 overflow-y-auto p-4 pt-12 scrollbar-thin scrollbar-thumb-emerald-500/20">
                                    <div className="space-y-4">
                                        {filteredReciters.map((reciter) => (
                                            <motion.div
                                                key={reciter.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className={clsx(
                                                    "group relative p-4 rounded-2xl cursor-pointer",
                                                    "transition-all duration-300",
                                                    reciterUrl === reciter.url
                                                        ? "bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30"
                                                        : "bg-slate-50/50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-transparent hover:border-slate-200 dark:hover:border-white/10"
                                                )}
                                                onClick={() => {
                                                    actions.setReciter(reciter.url);
                                                    setIsOpen(false);
                                                    actions.setAutoscrollDisabled(false);
                                                }}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        {/* Avatar */}
                                                        <div className={clsx(
                                                            "w-14 h-14 rounded-xl flex items-center justify-center",
                                                            "bg-gradient-to-br from-slate-800 to-slate-900",
                                                            reciterUrl === reciter.url && "ring-2 ring-emerald-500"
                                                        )}>
                                                            <Volume2 size={24} className={
                                                                reciterUrl === reciter.url ? "text-emerald-400" : "text-slate-400"
                                                            } />
                                                        </div>

                                                        {/* Info */}
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <h3 className={clsx(
                                                                    "font-bold text-lg",
                                                                    reciterUrl === reciter.url ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"
                                                                )}>
                                                                    {reciter.name}
                                                                </h3>

                                                                {reciter.favorite && (
                                                                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                                                )}
                                                            </div>

                                                            <div className="flex items-center gap-3 mt-1">
                                                                {reciter.country && (
                                                                    <span className="flex items-center gap-1 text-sm text-slate-400">
                                                                        <Globe size={12} />
                                                                        {reciter.country}
                                                                    </span>
                                                                )}

                                                                {reciter.style && (
                                                                    <span className="text-sm text-slate-500">
                                                                        {reciter.style}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {reciter.description && (
                                                                <p className="text-sm text-slate-500 mt-2 max-w-md">
                                                                    {reciter.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Selection indicator */}
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                actions.toggleFavoriteReciter(reciter.id);
                                                            }}
                                                            className={clsx(
                                                                "p-2 rounded-lg transition-colors",
                                                                reciter.favorite
                                                                    ? "text-yellow-500 hover:text-yellow-400"
                                                                    : "text-slate-500 hover:text-slate-300"
                                                            )}
                                                        >
                                                            <Star size={18} fill={reciter.favorite ? "currentColor" : "none"} />
                                                        </button>

                                                        {reciterUrl === reciter.url && (
                                                            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                                                                <Check size={16} className="text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {filteredReciters.length === 0 && (
                                        <div className="py-16 text-center">
                                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                                                <Search size={32} className="text-slate-500" />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-400 mb-2">No reciters found</h3>
                                            <p className="text-slate-500">Try a different search term</p>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="p-6 border-t border-slate-100 dark:border-white/10">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-slate-500">
                                            {filteredReciters.length} reciters available
                                        </p>

                                        <button
                                            onClick={() => {
                                                setIsOpen(false);
                                                actions.setAutoscrollDisabled(false);
                                            }}
                                            className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors"
                                        >
                                            Done
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
