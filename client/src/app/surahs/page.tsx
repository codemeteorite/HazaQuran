'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Grid3x3,
    List,
    ArrowLeft,
    Heart,
    MapPin,
    Sparkles,
    TrendingUp,
    X,
    Filter
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useAuthStore } from '@/store/authStore';
import { FloatingParticles, CornerFlourish, IslamicStar } from '@/components/patterns';

const SurahCard = dynamic(() => import('@/components/SurahCard').then(mod => mod.SurahCard), {
    ssr: false,
    loading: () => <div className="h-64 rounded-[2.5rem] bg-slate-100/50 dark:bg-slate-800/50 animate-pulse" />
});

export default function SurahsPage() {
    const router = useRouter();
    const [surahs, setSurahs] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('id');
    const [filterType, setFilterType] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isLoading, setIsLoading] = useState(true);
    const { init, user, toggleLike } = useAuthStore();

    useEffect(() => {
        init();
        fetchSurahs();
    }, []);

    const fetchSurahs = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('https://api.quran.com/api/v4/chapters', {
                cache: 'force-cache'
            });
            if (!res.ok) throw new Error(`API returned ${res.status}`);
            const data = await res.json();
            setSurahs(data.chapters || []);
        } catch (error) {
            console.error('Failed to fetch surahs:', error);
            setSurahs([]);
        } finally {
            setIsLoading(false);
        }
    };

    const isFavorite = (surahId: number) => {
        return user?.liked_surahs?.includes(surahId) || false;
    };

    const handleToggleFavorite = (surahId: number) => {
        if (!user) {
            // Optional: Show login modal or toast
            return;
        }
        toggleLike(surahId);
    };

    const filteredSurahs = surahs
        .filter((surah) => {
            const matchesSearch =
                surah.name_simple.toLowerCase().includes(searchQuery.toLowerCase()) ||
                surah.name_arabic.includes(searchQuery) ||
                surah.translated_name.name.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesFilter =
                filterType === 'all' ||
                (filterType === 'favorites' ? isFavorite(surah.id) :
                    filterType === 'makkah' ? surah.revelation_place === 'makkah' :
                        surah.revelation_place === 'madinah');

            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            if (sortBy === 'name') return a.name_simple.localeCompare(b.name_simple);
            if (sortBy === 'revelation') return a.revelation_order - b.revelation_order;
            return a.id - b.id;
        });

    const filterOptions = [
        { id: 'all', label: 'All Surahs', icon: Sparkles, color: 'text-slate-600 dark:text-slate-400' },
        { id: 'favorites', label: 'Favorites', icon: Heart, color: 'text-rose-500' },
        { id: 'makkah', label: 'Makkan', icon: MapPin, color: 'text-amber-600' },
        { id: 'madinah', label: 'Medinan', icon: TrendingUp, color: 'text-emerald-600' }
    ];

    return (
        <div className="min-h-screen bg-[hsl(var(--bg-luminous-start))] dark:bg-[hsl(var(--bg-twilight-start))] transition-colors duration-500 pb-32">

            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <FloatingParticles count={12} />
                <div className="absolute top-0 right-0 opacity-20 dark:opacity-5 text-amber-500">
                    <IslamicStar size={300} className="translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="absolute bottom-0 left-0 opacity-20 dark:opacity-5 text-emerald-500">
                    <CornerFlourish className="w-64 h-64 text-emerald-500" />
                </div>
            </div>

            {/* Floating Header */}
            <div className="sticky top-0 z-40 pt-4 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] border border-white/20 dark:border-white/10 shadow-lg shadow-black/5 p-4 sm:p-6 transition-all duration-300">

                    {/* Top Row: Title & Actions */}
                    <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/')}
                                className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all hover:scale-105 active:scale-95"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-cyan-500 bg-clip-text text-transparent">
                                    Discover
                                </h1>
                                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                                    {filteredSurahs.length} Surahs available
                                </p>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Search size={20} className="text-slate-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name or number..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500/50 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all shadow-inner font-medium text-lg placeholder:text-slate-400"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>

                        {/* View Toggle */}
                        <div className="flex p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            {[
                                { id: 'grid', icon: Grid3x3 },
                                { id: 'list', icon: List }
                            ].map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() => setViewMode(mode.id as 'grid' | 'list')}
                                    className={clsx(
                                        "p-3 rounded-xl transition-all duration-300",
                                        viewMode === mode.id
                                            ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm scale-110"
                                            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    )}
                                >
                                    <mode.icon size={20} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide mask-fade-right">
                        {filterOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => setFilterType(option.id)}
                                className={clsx(
                                    "px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap flex items-center gap-2 transition-all duration-300 border-2",
                                    filterType === option.id
                                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-lg shadow-slate-900/10 scale-105"
                                        : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-200 dark:hover:border-emerald-800"
                                )}
                            >
                                <option.icon size={16} className={clsx(
                                    filterType === option.id ? "text-current" : option.color
                                )} />
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Surahs Grid */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {isLoading ? (
                    <div className={clsx(
                        "grid gap-6",
                        viewMode === 'grid'
                            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
                            : "grid-cols-1"
                    )}>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-64 rounded-[2.5rem] bg-slate-100/50 dark:bg-slate-800/50 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className={clsx(
                        "grid gap-6 transition-all duration-500",
                        viewMode === 'grid'
                            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
                            : "grid-cols-1"
                    )}>
                        <AnimatePresence mode="popLayout">
                            {filteredSurahs.map((surah, index) => (
                                <motion.div
                                    key={surah.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                    transition={{
                                        duration: 0.4,
                                        delay: Math.min(index * 0.05, 0.5),
                                        ease: [0.34, 1.56, 0.64, 1]
                                    }}
                                >
                                    <SurahCard
                                        surah={surah}
                                        isFavorite={isFavorite(surah.id)}
                                        onToggleFavorite={() => handleToggleFavorite(surah.id)}
                                        viewMode={viewMode}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {!isLoading && filteredSurahs.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-block p-6 rounded-full bg-slate-100 dark:bg-slate-800 mb-4 animate-bounce">
                            <Search size={40} className="text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            No surahs moved you?
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400">
                            Try adjusting your search terms or filters
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
