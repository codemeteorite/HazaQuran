'use client';

import { useCallback, useRef, useState } from 'react';
import { useAudioStore } from '@/store/audioStore';

interface CacheProgress {
  surahId: number;
  progress: number;
  status: 'idle' | 'caching' | 'completed' | 'error';
}

export function useSurahCache() {
    const abortControllerRef = useRef<AbortController | null>(null);
    const [activeDownloads, setActiveDownloads] = useState<Set<number>>(new Set());
    
    const downloadSurah = useCallback(async (
        surahId: number, 
        reciterUrl: string, 
        verseCount: number
    ): Promise<boolean> => {
        // Check if already downloading
        if (activeDownloads.has(surahId)) {
            console.log(`Surah ${surahId} is already being cached`);
            return false;
        }

        // Cancel previous download if exists
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        // Check if Cache API is supported
        if (!('caches' in window)) {
            console.warn('Cache API not supported');
            return false;
        }

        try {
            // Add to active downloads
            setActiveDownloads(prev => new Set(prev).add(surahId));
            
            // Get store and set initial caching status
            const store = useAudioStore.getState();
            store.actions.setCachingStatus(surahId, 0);
            
            const cache = await caches.open('hazaquran-audio');
            let downloaded = 0;
            const formatNum = (num: number) => num.toString().padStart(3, '0');

            // Create chunks to avoid overwhelming the browser
            const CHUNK_SIZE = 5;
            const failedUrls: Array<{url: string, error: string}> = [];

            for (let i = 1; i <= verseCount; i += CHUNK_SIZE) {
                // Check if download was aborted
                if (signal.aborted) {
                    console.log('Surah caching aborted');
                    store.actions.setCachingStatus(0, 0);
                    return false;
                }

                const chunk = [];
                for (let j = i; j < i + CHUNK_SIZE && j <= verseCount; j++) {
                    const url = `${reciterUrl}/${formatNum(surahId)}${formatNum(j)}.mp3`;
                    chunk.push(url);
                }

                const results = await Promise.allSettled(
                    chunk.map(async (url) => {
                        try {
                            // Skip if already cached
                            const cached = await cache.match(url);
                            if (cached) {
                                downloaded++;
                                const progress = Math.round((downloaded / verseCount) * 100);
                                store.actions.setCachingStatus(surahId, progress);
                                return;
                            }

                            // Fetch with timeout
                            const timeoutPromise = new Promise((_, reject) => 
                                setTimeout(() => reject(new Error('Timeout')), 10000)
                            );
                            
                            const fetchPromise = fetch(url, { 
                                signal,
                                mode: 'cors',
                                credentials: 'omit'
                            });
                            
                            const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;
                            
                            if (response.ok) {
                                await cache.put(url, response.clone());
                                downloaded++;
                                const progress = Math.round((downloaded / verseCount) * 100);
                                store.actions.setCachingStatus(surahId, progress);
                            } else {
                                throw new Error(`HTTP ${response.status}`);
                            }
                        } catch (error) {
                            if (error instanceof Error && error.name === 'AbortError') {
                                throw error;
                            }
                            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
                            failedUrls.push({ url, error: errorMsg });
                            console.warn(`Failed to cache: ${url}`, error);
                        }
                    })
                );

                // Check for abort
                if (results.some(result => 
                    result.status === 'rejected' && 
                    result.reason?.name === 'AbortError'
                )) {
                    throw new Error('Download aborted');
                }

                // Small delay between chunks
                if (i + CHUNK_SIZE <= verseCount) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
            }

            // Update final status
            const success = failedUrls.length === 0;
            if (success) {
                store.actions.setCachingStatus(surahId, 100);
                console.log(`Successfully cached Surah ${surahId}`);
            } else {
                const finalProgress = Math.round((downloaded / verseCount) * 100);
                store.actions.setCachingStatus(surahId, finalProgress);
                console.warn(`Partially cached Surah ${surahId}: ${downloaded}/${verseCount} verses`);
            }
            
            return success;

        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                console.log('Surah caching was cancelled');
            } else {
                console.error('Error caching surah:', error);
                const store = useAudioStore.getState();
                store.actions.setCachingStatus(surahId, -1);
            }
            return false;
        } finally {
            // Remove from active downloads
            setActiveDownloads(prev => {
                const next = new Set(prev);
                next.delete(surahId);
                return next;
            });
            abortControllerRef.current = null;
        }
    }, [activeDownloads]);

    const getCachedAudio = useCallback(async (
        surahId: number, 
        ayahNumber: number, 
        reciterUrl: string
    ): Promise<Response | null> => {
        if (!('caches' in window)) return null;
        
        try {
            const cache = await caches.open('hazaquran-audio');
            const formatNum = (num: number) => num.toString().padStart(3, '0');
            const url = `${reciterUrl}/${formatNum(surahId)}${formatNum(ayahNumber)}.mp3`;
            
            // Try to get from cache first
            const cached = await cache.match(url);
            if (cached) {
                return cached;
            }
            
            // If not cached, try to fetch it
            const response = await fetch(url, { 
                mode: 'cors',
                credentials: 'omit'
            });
            
            if (response.ok) {
                // Cache for future use
                await cache.put(url, response.clone());
                return response;
            }
            
            return null;
        } catch (error) {
            console.error('Error getting cached audio:', error);
            return null;
        }
    }, []);

    const prefetchAyahs = useCallback(async (
        surahId: number, 
        startAyah: number, 
        reciterUrl: string, 
        count: number = 3,
        totalVerses: number
    ): Promise<void> => {
        if (!('caches' in window) || activeDownloads.has(surahId)) return;

        try {
            const cache = await caches.open('hazaquran-audio');
            const formatNum = (num: number) => num.toString().padStart(3, '0');

            const prefetchPromises = [];
            for (let i = startAyah; i < startAyah + count && i <= totalVerses; i++) {
                const url = `${reciterUrl}/${formatNum(surahId)}${formatNum(i)}.mp3`;
                
                prefetchPromises.push(
                    (async () => {
                        try {
                            const cached = await cache.match(url);
                            if (!cached) {
                                // Use low priority fetch
                                const controller = new AbortController();
                                const timeoutId = setTimeout(() => controller.abort(), 5000);
                                
                                const response = await fetch(url, {
                                    signal: controller.signal,
                                    priority: 'low',
                                    mode: 'cors',
                                    credentials: 'omit'
                                });
                                
                                clearTimeout(timeoutId);
                                
                                if (response.ok) {
                                    await cache.put(url, response.clone());
                                }
                            }
                        } catch (error) {
                            // Silently fail for prefetch
                        }
                    })()
                );
            }

            // Don't await - let it run in background
            Promise.allSettled(prefetchPromises).catch(() => {});
            
        } catch (error) {
            // Don't throw for background prefetch
        }
    }, [activeDownloads]);

    const isAyahCached = useCallback(async (
        surahId: number, 
        ayahNumber: number, 
        reciterUrl: string
    ): Promise<boolean> => {
        if (!('caches' in window)) return false;
        
        try {
            const cache = await caches.open('hazaquran-audio');
            const formatNum = (num: number) => num.toString().padStart(3, '0');
            const url = `${reciterUrl}/${formatNum(surahId)}${formatNum(ayahNumber)}.mp3`;
            
            const cached = await cache.match(url);
            return !!cached;
        } catch (error) {
            return false;
        }
    }, []);

    const isSurahCached = useCallback(async (
        surahId: number, 
        reciterUrl: string, 
        verseCount: number
    ): Promise<number> => {
        if (!('caches' in window)) return 0;
        
        try {
            const cache = await caches.open('hazaquran-audio');
            const formatNum = (num: number) => num.toString().padStart(3, '0');
            
            // Check sample of verses (first, middle, last)
            const checkPoints = [
                1,
                Math.floor(verseCount / 2),
                verseCount
            ].filter((n, i, arr) => n > 0 && arr.indexOf(n) === i);
            
            const cacheChecks = await Promise.all(
                checkPoints.map(async (ayahNum) => {
                    const url = `${reciterUrl}/${formatNum(surahId)}${formatNum(ayahNum)}.mp3`;
                    const cached = await cache.match(url);
                    return cached ? 1 : 0;
                })
            );
            
            // Calculate cached percentage based on sample
            const cachedCount = cacheChecks.reduce((sum: number, val: number) => sum + val, 0);
            return Math.round((cachedCount / checkPoints.length) * 100);
        } catch (error) {
            return 0;
        }
    }, []);

    const clearAudioCache = useCallback(async (): Promise<boolean> => {
        if (!('caches' in window)) return false;
        
        try {
            // Cancel any ongoing downloads
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            
            // Clear active downloads
            setActiveDownloads(new Set());
            
            // Delete cache
            const deleted = await caches.delete('hazaquran-audio');
            return deleted;
        } catch (error) {
            console.error('Failed to clear cache:', error);
            return false;
        }
    }, []);

    const cancelCurrentDownload = useCallback((): boolean => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            return true;
        }
        return false;
    }, []);

    const getCacheInfo = useCallback(async (): Promise<{
        size: number;
        surahs: number[];
    }> => {
        if (!('caches' in window)) {
            return { size: 0, surahs: [] };
        }
        
        try {
            const cache = await caches.open('hazaquran-audio');
            const keys = await cache.keys();
            
            // Extract surah IDs from cached URLs
            const surahIds = new Set<number>();
            keys.forEach(request => {
                const match = request.url.match(/\/(\d{3})(\d{3})\.mp3$/);
                if (match) {
                    const surahId = parseInt(match[1], 10);
                    if (!isNaN(surahId)) {
                        surahIds.add(surahId);
                    }
                }
            });
            
            return {
                size: keys.length,
                surahs: Array.from(surahIds).sort((a, b) => a - b)
            };
        } catch (error) {
            console.error('Error getting cache info:', error);
            return { size: 0, surahs: [] };
        }
    }, []);

    return { 
        downloadSurah,
        getCachedAudio,
        prefetchAyahs,
        isAyahCached,
        isSurahCached,
        clearAudioCache,
        cancelCurrentDownload,
        getCacheInfo,
        activeDownloads: Array.from(activeDownloads)
    };
}