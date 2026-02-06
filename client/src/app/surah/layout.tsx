import SurahSidebar from '@/components/SurahSidebar';

async function getSurahs() {
    const res = await fetch('https://api.quran.com/api/v4/chapters', { cache: 'force-cache' });
    if (!res.ok) throw new Error('Failed to fetch surahs');
    const data = await res.json();

    // Normalize type for the sidebar component
    return data.chapters.map((s: any) => ({
        ...s,
        type: s.revelation_place === 'makkah' ? 'meccan' : 'medinan'
    }));
}

export default async function SurahLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const surahs = await getSurahs();

    return (
        <div className="container mx-auto px-4 py-8 flex gap-8">
            <SurahSidebar surahs={surahs} />
            <div className="flex-1 min-w-0">
                {children}
            </div>
        </div>
    );
}
