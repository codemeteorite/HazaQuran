'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useAudioStore } from '@/store/audioStore';
import { ArrowLeft, Bookmark, Play, Pause, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { getAyahStats } from '@/utils/hasanat';
import SwipeableBook from '@/components/SwipeableBook';

interface AyahData {
    surahId: number;
    ayahNumber: number;
    text_uthmani: string;
    translation: string;
    surahName: string;
    surahArabic: string;
}

export default function SavedAyahsPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const { isPlaying, currentSurah, currentAyah, actions } = useAudioStore();
    const [ayahsData, setAyahsData] = useState<AyahData[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/');
            return;
        }
        fetchAyahsData();
    }, [isAuthenticated, user?.saved_ayah]);

    const fetchAyahsData = async () => {
        if (!user?.saved_ayah || user.saved_ayah.length === 0) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            console.log('📚 Fetching ayahs for:', user.saved_ayah);

            const ayahsWithData = await Promise.all(
                user.saved_ayah.map(async (saved: any) => {
                    try {
                        const verseKey = `${saved.surahId}:${saved.ayahNumber}`;
                        const url = `https://api.quran.com/api/v4/quran/verses/uthmani?verse_key=${verseKey}`;
                        const translationUrl = `https://api.quran.com/api/v4/quran/translations/131?verse_key=${verseKey}`;
                        const chapterUrl = `https://api.quran.com/api/v4/chapters/${saved.surahId}`;

                        const [verseRes, translationRes, chapterRes] = await Promise.all([
                            fetch(url),
                            fetch(translationUrl),
                            fetch(chapterUrl)
                        ]);

                        const verseData = await verseRes.json();
                        const translationData = await translationRes.json();
                        const chapterData = await chapterRes.json();

                        const arabicText = verseData?.verses?.[0]?.text_uthmani || '';
                        let translation = translationData?.translations?.[0]?.text || 'Translation not available';
                        translation = translation.replace(/<[^>]*>/g, '');

                        return {
                            surahId: saved.surahId,
                            ayahNumber: saved.ayahNumber,
                            text_uthmani: arabicText,
                            translation: translation,
                            surahName: chapterData?.chapter?.name_simple || 'Al-Fatihah',
                            surahArabic: chapterData?.chapter?.name_arabic || 'الفاتحة'
                        };
                    } catch (error) {
                        console.error('❌ Failed to fetch ayah:', saved, error);
                        return null;
                    }
                })
            );

            const validAyahs = ayahsWithData.filter(ayah => ayah !== null) as AyahData[];
            setAyahsData(validAyahs);
        } catch (err) {
            console.error('❌ Failed to fetch ayahs data', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePlay = (surahId: number, ayahNumber: number) => {
        const isCurrentAyah = currentSurah === surahId && currentAyah === ayahNumber;

        if (isCurrentAyah && isPlaying) {
            actions.pause();
        } else {
            actions.play(surahId, ayahNumber, 300);
        }
    };

    if (!user) return null;

    // Create page components for the book
    const bookPages = ayahsData.map((ayah, index) => {
        const stats = getAyahStats(ayah.text_uthmani);
        return (
            <PageContent
                key={`page-${index}`}
                ayah={ayah}
                stats={stats}
                pageNumber={index + 1}
                onPlay={handlePlay}
                isPlaying={currentSurah === ayah.surahId && currentAyah === ayah.ayahNumber && isPlaying}
            />
        );
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--bg-luminous-start))] via-[hsl(var(--bg-luminous-mid))] to-[hsl(var(--bg-luminous-end))] dark:from-[hsl(var(--bg-twilight-start))] dark:via-[hsl(var(--bg-twilight-mid))] dark:to-[hsl(var(--bg-twilight-end))] pb-20 overflow-hidden">
            {/* Animated Floating Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-transparent dark:from-amber-500/20 dark:via-orange-500/20 blur-3xl rounded-full"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, -50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-rose-500/10 via-coral-500/10 to-transparent dark:from-rose-500/20 dark:via-coral-500/20 blur-3xl rounded-full"
                />
            </div>

            {/* Header with Organic Shape */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b-4 border-amber-200/50 dark:border-slate-800/50 shadow-xl">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <motion.button
                                onClick={() => router.back()}
                                whileHover={{ scale: 1.1, rotate: -5 }}
                                whileTap={{ scale: 0.95 }}
                                className="group p-3 rounded-3xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-600 dark:text-amber-400 hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300"
                            >
                                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            </motion.button>
                            <div>
                                <h1 className="text-3xl font-black bg-gradient-to-r from-amber-600 via-orange-500 to-coral-500 bg-clip-text text-transparent tracking-tight">
                                    My Sacred Collection
                                </h1>
                                <p className="text-sm text-slate-600 dark:text-slate-400 font-bold">
                                    ✨ {ayahsData.length} {ayahsData.length === 1 ? 'Ayah' : 'Ayahs'} Preserved
                                </p>
                            </div>
                        </div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-coral-500 text-white text-sm font-black shadow-xl shadow-amber-500/30"
                        >
                            Page {currentPage + 1}-{Math.min(currentPage + 2, ayahsData.length)}
                        </motion.div>
                    </div>
                </div>
            </header>

            <main className="relative max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
                {loading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-32"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                            <Loader2 className="text-amber-600 mb-4" size={56} />
                        </motion.div>
                        <p className="text-slate-600 dark:text-slate-400 font-bold text-lg">Opening your sacred book...</p>
                    </motion.div>
                ) : ayahsData.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-32 text-center"
                    >
                        <motion.div
                            animate={{
                                rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center mb-8 shadow-2xl"
                        >
                            <Bookmark size={48} className="text-amber-600 dark:text-amber-400" />
                        </motion.div>
                        <h2 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-4">
                            Your Book Awaits
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-md text-lg font-medium">
                            Start collecting ayahs that resonate with your soul ✨
                        </p>
                    </motion.div>
                ) : (
                    <div className="max-w-6xl mx-auto">
                        {/* Page Counter & Swipe Hint */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 text-center"
                        >
                            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-2 border-amber-200/50 dark:border-amber-900/20 font-bold text-slate-700 dark:text-slate-300 shadow-lg">
                                <span className="text-amber-600 dark:text-amber-400">📖</span>
                                Pages {currentPage + 1}-{Math.min(currentPage + 2, ayahsData.length)} of {ayahsData.length}
                                <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                                    Swipe to turn →
                                </span>
                            </div>
                        </motion.div>

                        {/* Swipeable Book */}
                        <SwipeableBook
                            pages={bookPages}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </main>
        </div>
    );
}

// Page Content Component
function PageContent({ ayah, stats, pageNumber, onPlay, isPlaying }: {
    ayah: AyahData;
    stats: any;
    pageNumber: number;
    onPlay: (surahId: number, ayahNumber: number) => void;
    isPlaying: boolean;
}) {
    return (
        <div className="h-[500px] md:h-[600px] flex flex-col p-6 md:p-12">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 md:mb-8 pb-4 border-b-2 border-amber-200/50 dark:border-amber-900/30"
            >
                <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-1">
                    {ayah.surahName}
                </h2>
                <p className="text-lg md:text-xl font-uthmani text-amber-700 dark:text-amber-400 mb-3">
                    {ayah.surahArabic}
                </p>
                <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                    <div className="px-3 md:px-4 py-1.5 md:py-2 rounded-2xl bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-950/40 dark:to-orange-950/40 border-2 border-amber-200 dark:border-amber-900/30">
                        <span className="text-xs md:text-sm font-black text-amber-700 dark:text-amber-400">
                            Ayah {ayah.ayahNumber}
                        </span>
                    </div>
                    <motion.button
                        onClick={() => onPlay(ayah.surahId, ayah.ayahNumber)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={clsx(
                            "p-2 md:p-2.5 rounded-2xl transition-all duration-300 shadow-lg",
                            isPlaying
                                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/40"
                                : "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400"
                        )}
                    >
                        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                    </motion.button>
                </div>
            </motion.div>

            {/* Arabic Text - Centered */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="flex-1 flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-white/80 to-amber-50/60 dark:from-slate-800/60 dark:to-amber-950/30 rounded-3xl shadow-xl border-2 border-amber-100/50 dark:border-amber-900/20"
            >
                <p className="text-4xl md:text-5xl lg:text-6xl font-uthmani text-center leading-[3.5rem] md:leading-[4.5rem] lg:leading-[5rem] text-slate-900 dark:text-white">
                    {ayah.text_uthmani}
                </p>
            </motion.div>

            {/* Hasanat Stats */}
            {stats && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4 md:mt-6 flex items-center justify-center gap-3 text-sm md:text-base"
                >
                    <Sparkles size={20} className="text-amber-500 animate-pulse" />
                    <span className="font-black text-amber-700 dark:text-amber-400">
                        {stats.formatted} Hasanat
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                        • {stats.letters} letters
                    </span>
                </motion.div>
            )}

            {/* Page Number */}
            <div className="mt-4 text-center text-amber-500/60 dark:text-amber-600/40 font-bold text-sm">
                {pageNumber}
            </div>
        </div>
    );
}
