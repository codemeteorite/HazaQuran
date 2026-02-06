'use client';

import { useCallback } from 'react';
import { useAudioStore } from '@/store/audioStore';

export function useSurahCache() {
    const { actions } = useAudioStore();

    const downloadSurah = useCallback(async (surahId: number, reciterUrl: string, verseCount: number) => {
        if (!('caches' in window)) return;

        actions.setCachingStatus(surahId, 0);
        const cache = await caches.open('hazaquran-audio-cache');

        let downloaded = 0;
        const formatNum = (num: number) => num.toString().padStart(3, '0');

        // Create chunks to avoid overwhelming the browser
        const CHUNK_SIZE = 5;
        for (let i = 1; i <= verseCount; i += CHUNK_SIZE) {
            const chunk = [];
            for (let j = i; j < i + CHUNK_SIZE && j <= verseCount; j++) {
                const url = `${reciterUrl}/${formatNum(surahId)}${formatNum(j)}.mp3`;
                chunk.push(url);
            }

            await Promise.all(chunk.map(async (url) => {
                try {
                    const response = await cache.match(url);
                    if (!response) {
                        await cache.add(url);
                    }
                    downloaded++;
                    const progress = Math.round((downloaded / verseCount) * 100);
                    actions.setCachingStatus(surahId, progress);
                } catch (error) {
                    console.error(`Failed to cache ayah: ${url}`, error);
                }
            }));
        }

        actions.setCachingStatus(surahId, 100);
    }, [actions]);

    const cacheSurahData = useCallback(async (surahId: number, data: any) => {
        if (!('caches' in window)) return;
        const cache = await caches.open('hazaquran-data-cache');
        const url = `/api/offline/surah/${surahId}`;
        const response = new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' }
        });
        await cache.put(url, response);
    }, []);

    const getOfflineSurah = useCallback(async (surahId: number) => {
        if (!('caches' in window)) return null;
        const cache = await caches.open('hazaquran-data-cache');
        const url = `/api/offline/surah/${surahId}`;
        const response = await cache.match(url);
        if (!response) return null;
        return await response.json();
    }, []);

    const prefetchAyahs = useCallback(async (surahId: number, startAyah: number, reciterUrl: string, count: number = 10, totalVerses: number) => {
        if (!('caches' in window)) return;

        const cache = await caches.open('hazaquran-audio-cache');
        const formatNum = (num: number) => num.toString().padStart(3, '0');

        const ayahsToFetch = [];
        for (let i = startAyah; i < startAyah + count && i <= totalVerses; i++) {
            const url = `${reciterUrl}/${formatNum(surahId)}${formatNum(i)}.mp3`;
            ayahsToFetch.push(url);
        }

        await Promise.all(ayahsToFetch.map(async (url) => {
            try {
                const response = await cache.match(url);
                if (!response) {
                    await cache.add(url);
                }
            } catch (e) {
                // Silent fail for prefetch
            }
        }));
    }, []);

    return { downloadSurah, prefetchAyahs, cacheSurahData, getOfflineSurah };
}
