import { notFound } from 'next/navigation';
import SurahHeader from '@/components/SurahHeader';
import AyahCard from '@/components/AyahCard';
import OfflineSync from '@/components/OfflineSync';

async function getSurah(id: string) {
    try {
        const [infoRes, versesRes] = await Promise.all([
            fetch(`https://api.quran.com/api/v4/chapters/${id}`, { cache: 'force-cache' }),
            fetch(`https://api.quran.com/api/v4/verses/by_chapter/${id}?fields=text_uthmani&translations=131,20&per_page=300`, { cache: 'force-cache' })
        ]);

        if (!infoRes.ok || !versesRes.ok) {
            return null;
        }

        const info = await infoRes.json();
        const verses = await versesRes.json();

        if (!info.chapter || !verses.verses) return null;

        return { info: info.chapter, verses: verses.verses };
    } catch (error) {
        console.error("Error fetching surah:", error);
        return null;
    }
}

export default async function SurahPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params; // Await params for Next.js 15+
    const data = await getSurah(id);

    if (!data) {
        return notFound();
    }

    const { info, verses } = data;

    return (
        <div className="min-h-screen pb-32">
            <SurahHeader
                surahId={Number(id)}
                surahName={info.name_simple}
                translatedName={info.translated_name.name}
                verseCount={info.verses_count}
            />

            <OfflineSync
                surahId={Number(id)}
                surahData={data}
            />

            <div className="max-w-4xl mx-auto px-4 pt-20 sm:pt-28">
                <div className="text-center mb-16">
                    <h1 className="text-7xl font-uthmani mb-6 text-emerald-600 dark:text-primary leading-relaxed">
                        {info.name_arabic}
                    </h1>
                    <div className="flex flex-col items-center gap-2">
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            {info.name_simple}
                        </h2>
                        <div className="flex items-center gap-3">
                            <span className="h-px w-8 bg-emerald-500/30" />
                            <p className="text-lg font-medium text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">
                                {info.translated_name.name} • {info.verses_count} Ayahs
                            </p>
                            <span className="h-px w-8 bg-emerald-500/30" />
                        </div>
                    </div>
                </div>
                {verses.map((verse: any) => (
                    <AyahCard
                        key={verse.id}
                        surahNumber={Number(id)}
                        ayahNumber={Number(verse.verse_key.split(':')[1])}
                        textUthmani={verse.text_uthmani}
                        trans={verse.translations?.find((t: any) => t.resource_id === 131)?.text?.replace(/<[^>]*>?/gm, '') || verse.translations?.[0]?.text?.replace(/<[^>]*>?/gm, '')}
                        surahVerseCount={info.verses_count}
                    />
                ))}
            </div>
        </div>
    );
}
