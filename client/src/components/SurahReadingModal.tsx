'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen } from 'lucide-react';

interface SurahReadingModalProps {
    isOpen: boolean;
    onClose: () => void;
    surahId: number;
    surahName: string;
    surahNameArabic: string;
    verses: any[];
}

export default function SurahReadingModal({
    isOpen,
    onClose,
    surahId,
    surahName,
    surahNameArabic,
    verses
}: SurahReadingModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[2000] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative bg-[#fffdf0] dark:bg-[#1a1816] w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="sticky top-0 z-50 bg-[#fffdf0]/95 dark:bg-[#1a1816]/95 backdrop-blur-xl border-b border-slate-300 dark:border-slate-700 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <BookOpen size={24} className="text-emerald-600 dark:text-emerald-400" />
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{surahName}</h2>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 font-uthmani mt-1">{surahNameArabic}</p>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Text Content - Traditional Quran Page Style */}
                    <div className="flex-1 overflow-y-auto px-8 py-12 bg-[#fffdf0] dark:bg-[#1a1816]">
                        <div className="max-w-3xl mx-auto">
                            {/* Bismillah */}
                            {surahId !== 1 && surahId !== 9 && (
                                <div className="text-center mb-12">
                                    <p className="text-5xl md:text-6xl font-uthmani text-slate-900 dark:text-slate-100 leading-relaxed">
                                        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                                    </p>
                                    <div className="mt-4 w-24 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto" />
                                </div>
                            )}

                            {/* Verses - Black ink on white/cream background */}
                            <div className="space-y-8">
                                {verses.map((verse: any) => (
                                    <div key={verse.id} className="text-right">
                                        <p className="text-4xl md:text-5xl font-uthmani text-slate-900 dark:text-slate-100 leading-[2.5]">
                                            {verse.text_uthmani}
                                            <span className="inline-block mx-2 text-3xl text-emerald-600 dark:text-emerald-400">
                                                {' '}﴿{verse.verse_key.split(':')[1]}﴾
                                            </span>
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* End Ornament */}
                            <div className="text-center mt-16 mb-8">
                                <div className="text-4xl text-emerald-600 dark:text-emerald-400">
                                    ۞
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-4 font-bold">
                                    صَدَقَ ٱللَّٰهُ ٱلْعَظِيمُ
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
