'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Search,
    Star,
    Filter,
    ChevronRight
} from 'lucide-react';
import clsx from 'clsx';

interface Surah {
    id: number;
    name_simple: string;
    name_arabic: string;
    translated_name: { name: string };
    verses_count: number;
    type: 'meccan' | 'medinan';
}

interface SurahSidebarProps {
    surahs: Surah[];
    favorites?: number[];
}

export default function SurahSidebar({ surahs, favorites = [] }: SurahSidebarProps) {
    const pathname = usePathname();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'meccan' | 'medinan'>('all');
    const [sortBy, setSortBy] = useState<'id' | 'name' | 'verses'>('id');
    const [isCollapsed, setIsCollapsed] = useState(false);

    const filteredSurahs = useMemo(() => {
        return surahs
            .filter(surah => {
                const matchesSearch =
                    surah.name_simple.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    surah.name_arabic.includes(searchQuery) ||
                    surah.translated_name.name.toLowerCase().includes(searchQuery.toLowerCase());

                const matchesFilter =
                    filterType === 'all' ||
                    surah.type === filterType;

                return matchesSearch && matchesFilter;
            })
            .sort((a, b) => {
                if (sortBy === 'name') return a.name_simple.localeCompare(b.name_simple);
                if (sortBy === 'verses') return b.verses_count - a.verses_count;
                return a.id - b.id;
            });
    }, [surahs, searchQuery, filterType, sortBy]);

    return (
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={clsx(
                "sticky top-6 h-[calc(100vh-3rem)] transition-all duration-300 z-40 hidden lg:block",
                isCollapsed ? "w-20" : "w-80"
            )}
        >
            {/* Collapse Toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="
          absolute -right-3 top-6 z-10
          w-6 h-12 rounded-r-lg
          bg-slate-900
          border border-white/10 border-l-0
          flex items-center justify-center
          hover:bg-slate-800
          transition-all
        "
            >
                <ChevronRight className={clsx(
                    "text-slate-400 transition-transform",
                    isCollapsed ? "rotate-180" : ""
                )} size={16} />
            </button>

            <div className={clsx(
                "h-full rounded-2xl border border-white/10",
                "bg-slate-950/50 backdrop-blur-xl shadow-2xl overflow-hidden",
                "transition-all duration-300 flex flex-col",
                isCollapsed ? "p-2" : "p-4"
            )}>
                {isCollapsed ? (
                    // Collapsed View
                    <div className="flex flex-col items-center space-y-4 pt-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                            <BookOpen size={20} className="text-emerald-400" />
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar w-full flex flex-col items-center">
                            {surahs.map(surah => (
                                <Link
                                    key={surah.id}
                                    href={`/surah/${surah.id}`}
                                    title={surah.name_simple}
                                    className={clsx(
                                        "block w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                        "text-xs font-bold transition-colors",
                                        pathname === `/surah/${surah.id}`
                                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                                            : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                                    )}
                                >
                                    {surah.id}
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : (
                    // Expanded View
                    <>
                        {/* Header */}
                        <div className="mb-6 shrink-0">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                    <BookOpen size={24} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Surahs</h2>
                                    <p className="text-sm text-slate-400">114 chapters</p>
                                </div>
                            </div>

                            {/* Search */}
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search surah..."
                                    className="
                    w-full pl-10 pr-4 py-2.5 rounded-xl
                    bg-white/5 border border-white/10
                    text-white placeholder:text-slate-500
                    focus:outline-none focus:border-emerald-500/50
                    transition-colors
                  "
                                />
                            </div>

                            {/* Filters */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <button
                                    onClick={() => setFilterType('all')}
                                    className={clsx(
                                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
                                        filterType === 'all'
                                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                            : "bg-white/5 text-slate-400 border-transparent hover:bg-white/10"
                                    )}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setFilterType('meccan')}
                                    className={clsx(
                                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
                                        filterType === 'meccan'
                                            ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                            : "bg-white/5 text-slate-400 border-transparent hover:bg-white/10"
                                    )}
                                >
                                    Meccan
                                </button>
                                <button
                                    onClick={() => setFilterType('medinan')}
                                    className={clsx(
                                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
                                        filterType === 'medinan'
                                            ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                            : "bg-white/5 text-slate-400 border-transparent hover:bg-white/10"
                                    )}
                                >
                                    Medinan
                                </button>
                            </div>

                            {/* Sort */}
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Filter size={14} />
                                <span>Sort by:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="
                    bg-transparent text-slate-300 
                    focus:outline-none cursor-pointer hover:text-white transition-colors
                  "
                                >
                                    <option value="id" className="bg-slate-900">Number</option>
                                    <option value="name" className="bg-slate-900">Name</option>
                                    <option value="verses" className="bg-slate-900">Verses</option>
                                </select>
                            </div>
                        </div>

                        {/* Surah List */}
                        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                            {filteredSurahs.map((surah) => {
                                const isFavorite = favorites.includes(surah.id);
                                const isActive = pathname === `/surah/${surah.id}`;

                                return (
                                    <motion.div
                                        key={surah.id}
                                        whileHover={{ x: 4 }}
                                        className="relative"
                                    >
                                        <Link
                                            href={`/surah/${surah.id}`}
                                            className={clsx(
                                                "group block p-3 rounded-xl transition-all duration-300 border",
                                                isActive
                                                    ? "bg-emerald-500/10 border-emerald-500/30"
                                                    : "bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10"
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    {/* Number */}
                                                    <div className={clsx(
                                                        "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold border-2 transition-all",
                                                        isActive
                                                            ? "bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/30"
                                                            : "bg-slate-800/50 text-slate-400 border-slate-700 group-hover:border-emerald-500/50"
                                                    )}>
                                                        {surah.id}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className={clsx(
                                                                "font-semibold transition-colors truncate",
                                                                isActive ? "text-white" : "text-slate-300 group-hover:text-white"
                                                            )}>
                                                                {surah.name_simple}
                                                            </h3>
                                                            {isFavorite && (
                                                                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                                            )}
                                                        </div>
                                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                                                            {surah.verses_count} verses • {surah.type}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Arabic name */}
                                                <div className="text-right shrink-0">
                                                    <p className={clsx(
                                                        "font-uthmani text-lg transition-colors",
                                                        isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-400"
                                                    )}>
                                                        {surah.name_arabic}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Stats */}
                        <div className="mt-4 pt-4 border-t border-white/10 shrink-0">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-center">
                                    <p className="text-[10px] text-slate-500 uppercase">Visible</p>
                                    <p className="text-sm font-bold text-white">{filteredSurahs.length}</p>
                                </div>
                                <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-center">
                                    <p className="text-[10px] text-slate-500 uppercase">Filtered</p>
                                    <p className="text-sm font-bold text-emerald-400">{114 - filteredSurahs.length}</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
}
