'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useAudioStore } from '@/store/audioStore';

export function useReadingPositionTracker() {
    const { isAuthenticated, updateReadingPosition } = useAuthStore();
    const { currentSurah, currentAyah } = useAudioStore();
    const lastSavedPosition = useRef<{ surah: number | null; ayah: number | null }>({ surah: null, ayah: null });
    const saveInterval = useRef<any>(null);

    useEffect(() => {
        if (!isAuthenticated || !currentSurah || !currentAyah) {
            if (saveInterval.current) clearInterval(saveInterval.current);
            return;
        }

        // Save reading position every 10 seconds if the position has changed
        saveInterval.current = setInterval(() => {
            if (
                currentSurah &&
                currentAyah &&
                (lastSavedPosition.current.surah !== currentSurah ||
                    lastSavedPosition.current.ayah !== currentAyah)
            ) {
                updateReadingPosition(currentSurah, currentAyah);
                lastSavedPosition.current = { surah: currentSurah, ayah: currentAyah };
            }
        }, 10000); // Save every 10 seconds

        return () => {
            if (saveInterval.current) clearInterval(saveInterval.current);
        };
    }, [isAuthenticated, currentSurah, currentAyah, updateReadingPosition]);

    // Save position on page unload
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (currentSurah && currentAyah) {
                updateReadingPosition(currentSurah, currentAyah);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [currentSurah, currentAyah, updateReadingPosition]);
}
