'use client';

import { useState } from 'react';
import SurahHeader from '@/components/SurahHeader';
import AyahCard from '@/components/AyahCard';
import OfflineSync from '@/components/OfflineSync';
import SurahContent from '@/components/SurahContent';
import SurahAutoPlayer from '@/components/SurahAutoPlayer';
import SurahCelebration from '@/components/SurahCelebration';
import SurahReadingModal from '@/components/SurahReadingModal';
import { FloatingParticles, CornerFlourish, IslamicStar } from '@/components/patterns';

interface SurahPageClientProps {
    id: string;
    view?: string;
    info: any;
    verses: any[];
}

export default function SurahPageClient({ id, view, info, verses }: SurahPageClientProps) {
    const [isReadingModalOpen, setIsReadingModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[hsl(var(--bg-luminous-start))] dark:bg-[hsl(var(--bg-twilight-start))] transition-colors duration-500 pb-32">

            <SurahAutoPlayer surahId={Number(id)} verseCount={info.verses_count} />
            <SurahCelebration surahName={info.name_simple} />

            <SurahReadingModal
                isOpen={isReadingModalOpen}
                onClose={() => setIsReadingModalOpen(false)}
                surahId={Number(id)}
                surahName={info.name_simple}
                surahNameArabic={info.name_arabic}
                verses={verses}
            />

            {/* Luminous Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <FloatingParticles count={15} />
                <div className="absolute top-0 left-0 opacity-10 text-emerald-500">
                    <CornerFlourish className="w-64 h-64" />
                </div>
                <div className="absolute top-1/3 right-0 opacity-5 text-amber-500">
                    <IslamicStar size={400} className="translate-x-1/2" />
                </div>
            </div>

            <SurahHeader
                surahId={Number(id)}
                surahName={info.name_simple}
                translatedName={info.translated_name.name}
                verseCount={info.verses_count}
                onReadClick={() => setIsReadingModalOpen(true)}
            />

            <OfflineSync
                surahId={Number(id)}
                surahData={{ info, verses }}
            />

            <SurahContent surahId={Number(id)}>
                <div className="relative z-10 max-w-4xl mx-auto px-4 pt-12 sm:pt-16">
                    {/* Bismillah Header */}
                    <div className="text-center mb-16 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

                        <h1 className="relative text-6xl md:text-8xl font-uthmani mb-6 text-emerald-600 dark:text-emerald-400 drop-shadow-sm leading-relaxed">
                            {info.bismillah_pre ? "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ" : info.name_arabic}
                        </h1>

                        <div className="flex flex-col items-center gap-2">
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                {info.name_simple}
                            </h2>
                            <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                                <span className="h-px w-12 bg-gradient-to-r from-transparent to-slate-300 dark:to-slate-700" />
                                <p className="text-sm font-bold uppercase tracking-[0.2em]">
                                    {info.revelation_place} • {info.verses_count} Ayahs
                                </p>
                                <span className="h-px w-12 bg-gradient-to-l from-transparent to-slate-300 dark:to-slate-700" />
                            </div>
                        </div>
                    </div>

                    {/* Verses List */}
                    <div className="md:space-y-4 snap-y snap-mandatory h-[calc(100vh-140px)] overflow-y-auto md:h-auto md:overflow-visible no-scrollbar pb-24 md:pb-0">
                        {verses.map((verse: any) => (
                            <div key={verse.id} className="snap-center min-h-[75vh] md:min-h-0 flex items-center justify-center p-2 md:p-0">
                                <div className="w-full">
                                    <AyahCard
                                        surahNumber={Number(id)}
                                        ayahNumber={Number(verse.verse_key.split(':')[1])}
                                        textUthmani={verse.text_uthmani}
                                        trans={verse.translations?.find((t: any) => t.resource_id === 131)?.text?.replace(/<[^>]*>?/gm, '') || verse.translations?.[0]?.text?.replace(/<[^>]*>?/gm, '')}
                                        surahVerseCount={info.verses_count}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </SurahContent>
        </div>
    );
}
