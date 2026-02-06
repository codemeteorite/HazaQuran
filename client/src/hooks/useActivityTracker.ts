'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useAudioStore } from '@/store/audioStore';

export function useActivityTracker() {
    const { isAuthenticated, syncActivity } = useAuthStore();
    const { isPlaying } = useAudioStore();
    const accumulatedSeconds = useRef(0);
    const syncInterval = useRef<any>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            if (syncInterval.current) clearInterval(syncInterval.current);
            return;
        }

        // Timer that runs every second if music is playing
        const timer = setInterval(() => {
            if (isPlaying) {
                accumulatedSeconds.current += 1;
            }
        }, 1000);

        // Sync with backend every 60 seconds of accumulated time
        syncInterval.current = setInterval(() => {
            if (accumulatedSeconds.current >= 60) {
                const mins = Math.floor(accumulatedSeconds.current / 60);
                syncActivity(mins);
                accumulatedSeconds.current %= 60;
            }
        }, 30000); // Check every 30s but only sync if > 1 min

        return () => {
            clearInterval(timer);
            clearInterval(syncInterval.current);
        };
    }, [isAuthenticated, isPlaying, syncActivity]);

    // Final sync on unmount/tab close
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (isAuthenticated && accumulatedSeconds.current >= 30) {
                const mins = Math.max(1, Math.round(accumulatedSeconds.current / 60));
                // Note: navigator.sendBeacon could be used here for more reliability
                syncActivity(mins);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isAuthenticated, syncActivity]);
}
