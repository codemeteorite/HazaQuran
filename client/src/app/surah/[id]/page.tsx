import { notFound } from 'next/navigation';
import SurahPageClient from './SurahPageClient';

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

export default async function SurahPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ view?: string }> }) {
    const { id } = await params;
    const { view } = await searchParams;
    const data = await getSurah(id);

    if (!data) {
        return notFound();
    }

    const { info, verses } = data;

    return <SurahPageClient id={id} view={view} info={info} verses={verses} />;
}
