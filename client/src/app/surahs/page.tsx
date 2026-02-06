'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    BookOpen,
    Grid3x3,
    List,
    Filter,
    ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useAuthStore } from '@/store/authStore';

// ReciterSelect removed

const SurahCard = dynamic(() => import('@/components/SurahCard').then(mod => mod.SurahCard), {
    ssr: false,
    loading: () => <div className="h-40 sm:h-48 md:h-56 rounded-xl sm:rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 animate-pulse" />
});

export default function SurahsPage() {
    const router = useRouter();
    const [surahs, setSurahs] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('id');
    const [filterType, setFilterType] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [favorites, setFavorites] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const { init } = useAuthStore();

    useEffect(() => {
        init();
        fetchSurahs();
        const savedFavorites = localStorage.getItem('quran-favorites');
        if (savedFavorites) {
            try {
                setFavorites(JSON.parse(savedFavorites));
            } catch (e) {
                console.error('Failed to parse favorites:', e);
            }
        }
    }, []);

    const fetchSurahs = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('https://api.quran.com/api/v4/chapters', {
                cache: 'force-cache'
            });
            const data = await res.json();
            setSurahs(data.chapters);
        } catch (error) {
            console.error('Failed to fetch surahs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredSurahs = surahs
        .filter((surah) => {
            const matchesSearch =
                surah.name_simple.toLowerCase().includes(searchQuery.toLowerCase()) ||
                surah.name_arabic.includes(searchQuery) ||
                surah.translated_name.name.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesFilter =
                filterType === 'all' ||
                (filterType === 'favorites' ? favorites.includes(surah.id) : surah.revelation_place === (filterType === 'makkah' ? 'makkah' : 'madinah'));

            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            if (sortBy === 'name') return a.name_simple.localeCompare(b.name_simple);
            if (sortBy === 'revelation') return a.revelation_order - b.revelation_order;
            return a.id - b.id;
        });

    return (
        <div className="min-h-screen pb-32">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/')}
                            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-xl font-black bg-gradient-to-r from-emerald-600 to-cyan-500 bg-clip-text text-transparent">
                            Browse Surahs
                        </h1>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 pt-20 sm:pt-24 pb-32">
                {/* Search & Filters */}
                <div className="mb-10 space-y-6">
                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                        <div className="flex-1">
                            <div className="relative group">
                                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors w-4.5 h-4.5 sm:w-5 sm:h-5" />
                                <input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search surah..."
                                    className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700/50 rounded-xl sm:rounded-2xl focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500/50 text-slate-900 dark:text-white transition-all text-sm sm:text-base shadow-sm font-medium"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl sm:rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={clsx(
                                        "px-3 py-2 rounded-md sm:rounded-lg flex items-center gap-1 sm:gap-2 transition-all text-sm",
                                        viewMode === 'grid'
                                            ? "bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400 font-semibold"
                                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                                    )}
                                >
                                    <Grid3x3 size={16} />
                                    <span className="hidden sm:inline">Grid</span>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={clsx(
                                        "px-3 py-2 rounded-md sm:rounded-lg flex items-center gap-1 sm:gap-2 transition-all text-sm",
                                        viewMode === 'list'
                                            ? "bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400 font-semibold"
                                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                                    )}
                                >
                                    <List size={16} />
                                    <span className="hidden sm:inline">List</span>
                                </button>
                            </div>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700/50 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500 transition-all shadow-sm cursor-pointer"
                            >
                                <option value="id">Number</option>
                                <option value="name">Name</option>
                                <option value="revelation">Revelation</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        {['all', 'makkah', 'madinah', 'favorites'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={clsx(
                                    "px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all border-2 capitalize",
                                    filterType === type
                                        ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                                        : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 hover:border-emerald-500/50"
                                )}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Surah Grid/List */}
                <div className="relative min-h-[400px]">
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="h-40 sm:h-48 md:h-56 rounded-xl sm:rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 animate-pulse" />
                            ))}
                        </div>
                    ) : filteredSurahs.length > 0 ? (
                        <div className={clsx(
                            viewMode === 'grid'
                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                                : "flex flex-col gap-4 sm:gap-5 max-w-4xl mx-auto"
                        )}>
                            <AnimatePresence>
                                {filteredSurahs.map((surah) => (
                                    <motion.div
                                        key={surah.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                    >
                                        <SurahCard
                                            surah={surah}
                                            isFavorite={favorites.includes(surah.id)}
                                            onToggleFavorite={() => {
                                                setFavorites(prev =>
                                                    prev.includes(surah.id)
                                                        ? prev.filter(id => id !== surah.id)
                                                        : [...prev, surah.id]
                                                );
                                            }}
                                            viewMode={viewMode}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                                <Search size={32} className="text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No surahs found</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-xs">
                                We couldn't find any surahs matching "{searchQuery}". Try a different search term.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
