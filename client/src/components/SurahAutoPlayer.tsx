'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAudioStore } from '@/store/audioStore';

interface SurahAutoPlayerProps {
    surahId: number;
    verseCount: number;
}

export default function SurahAutoPlayer({ surahId, verseCount }: SurahAutoPlayerProps) {
    const searchParams = useSearchParams();
    const { actions } = useAudioStore();
    const hasAttemptedPlay = useRef(false);

    useEffect(() => {
        const shouldAutoplay = searchParams.get('autoplay') === 'true';

        if (shouldAutoplay && !hasAttemptedPlay.current) {
            hasAttemptedPlay.current = true;

            // Short timeout to ensure store hydration
            setTimeout(() => {
                actions.play(surahId, 1, verseCount);
            }, 100);
        }
    }, [searchParams, surahId, verseCount, actions]);

    return null;
}
