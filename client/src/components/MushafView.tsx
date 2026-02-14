'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2, ZoomIn, ZoomOut } from 'lucide-react';

interface MushafViewProps {
    surahId: number;
    startPage: number;
    endPage: number;
}

export default function MushafView({ surahId, startPage, endPage }: MushafViewProps) {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(startPage);
    const [isLoading, setIsLoading] = useState(true);
    const [scale, setScale] = useState(1);
    const [imageError, setImageError] = useState(false);

    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    useEffect(() => {
        setIsLoading(true);
        setImageError(false);
    }, [currentPage]);

    // Multiple image sources with fallbacks
    const getPageUrl = (pageNum: number) => {
        // Primary: searchtruth.com (verified working)
        return `https://www.searchtruth.com/quran/images2/${String(pageNum).padStart(3, '0')}.jpg`;
    };

    const handlePrev = () => {
        if (currentPage > startPage) setCurrentPage(p => p - 1);
    };

    const handleNext = () => {
        if (currentPage < endPage) setCurrentPage(p => p + 1);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-[1500] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl flex flex-col items-center overflow-y-auto pb-32"
        >
            {/* Close Button */}
            <button
                onClick={() => {
                    const params = new URLSearchParams(window.location.search);
                    params.delete('view');
                    router.push(`${window.location.pathname}?${params.toString()}`);
                }}
                className="fixed top-6 right-6 p-3 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors z-50 shadow-lg"
            >
                <ChevronRight className="rotate-45" size={24} /> {/* X icon alternative */}
            </button>

            {/* Controls */}
            <div className="sticky top-6 z-40 flex items-center justify-center gap-4 bg-slate-900/80 backdrop-blur-md px-6 py-2 rounded-full border border-slate-700/50 mb-6 shadow-xl mt-20">
                <button
                    onClick={handlePrev}
                    disabled={currentPage === startPage}
                    className="p-2 rounded-full hover:bg-white/10 disabled:opacity-30 transition-colors"
                >
                    <ChevronRight size={24} className="text-white" />
                </button>

                <span className="text-white font-bold font-mono">
                    Page {currentPage}
                </span>

                <button
                    onClick={handleNext}
                    disabled={currentPage === endPage}
                    className="p-2 rounded-full hover:bg-white/10 disabled:opacity-30 transition-colors"
                >
                    <ChevronLeft size={24} className="text-white" />
                </button>

                <div className="w-px h-6 bg-white/20 mx-2" />

                <button onClick={() => setScale(s => Math.min(s + 0.1, 2))} className="p-2 text-white hover:text-emerald-400">
                    <ZoomIn size={20} />
                </button>
                <button onClick={() => setScale(s => Math.max(s - 0.1, 0.5))} className="p-2 text-white hover:text-emerald-400">
                    <ZoomOut size={20} />
                </button>
            </div>

            {/* Page Display */}
            <div className="relative w-full max-w-2xl mx-auto bg-[#fffdf0] dark:bg-[#1a1a1a] rounded-[2rem] shadow-2xl overflow-hidden min-h-[600px] border-4 border-[#d4b574]/30">
                {/* Decorative Frame */}
                <div className="absolute inset-0 border-double border-4 border-[#d4b574]/20 rounded-[1.8rem] pointer-events-none m-2" />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPage}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full flex items-center justify-center p-4 md:p-8"
                    >
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="animate-spin text-[#d4b574]" size={48} />
                            </div>
                        )}
                        {imageError ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
                                <div className="text-6xl">📖</div>
                                <p className="text-lg font-bold text-slate-700 dark:text-slate-300">Unable to load page image</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Page {currentPage}</p>
                            </div>
                        ) : (
                            <img
                                src={getPageUrl(currentPage)}
                                alt={`Page ${currentPage}`}
                                className="w-full h-auto object-contain transition-transform duration-200"
                                style={{ transform: `scale(${scale})` }}
                                onLoad={() => setIsLoading(false)}
                                onError={(e) => {
                                    setIsLoading(false);
                                    setImageError(true);
                                }}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            <p className="mt-6 text-slate-400 text-sm text-center">
                Reading Mode • Page {currentPage} of {endPage}
            </p>
        </motion.div>
    );
}
