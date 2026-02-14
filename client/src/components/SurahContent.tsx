'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface SurahContentProps {
    surahId: number;
    children: React.ReactNode;
}

export default function SurahContent({ surahId, children }: SurahContentProps) {
    const searchParams = useSearchParams();

    useEffect(() => {
        const targetAyah = searchParams.get('ayah');
        if (targetAyah) {
            // Wait for the DOM to fully render
            const timer = setTimeout(() => {
                const ayahElement = document.getElementById(`ayah-${surahId}-${targetAyah}`);
                if (ayahElement) {
                    ayahElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [surahId, searchParams]);

    return <>{children}</>;
}
