'use client';

import { useEffect, useRef } from 'react';
import { useAudioStore } from '@/store/audioStore';
import { useSurahCache } from '@/hooks/useSurahCache';

const GlobalAudioEngine = () => {
    const {
        isPlaying,
        currentSurah,
        currentAyah,
        currentSurahVerses,
        reciterUrl,
        isRepeatAyah,
        playbackSpeed,
        volume,
        seekTo,
        actions,
    } = useAudioStore();

    const { downloadSurah, prefetchAyahs } = useSurahCache();
    const audioRef = useRef<HTMLAudioElement>(null);

    // Ayah Buffering Logic
    useEffect(() => {
        if (currentSurah && currentAyah && reciterUrl && currentSurahVerses) {
            // Buffer the next 10 ayahs
            prefetchAyahs(currentSurah, currentAyah + 1, reciterUrl, 10, currentSurahVerses);
        }
    }, [currentSurah, currentAyah, reciterUrl, currentSurahVerses, prefetchAyahs]);

    // Proactive Caching logic removed - now permission based

    const formatNum = (num: number) => num.toString().padStart(3, '0');

    const audioSrc =
        currentSurah && currentAyah
            ? `${reciterUrl}/${formatNum(currentSurah)}${formatNum(currentAyah)}.mp3`
            : undefined;

    const audioCtxRef = useRef<AudioContext | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

    // Initialize Web Audio
    useEffect(() => {
        if (!audioRef.current || gainNodeRef.current) return;

        const initWebAudio = () => {
            try {
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                const ctx = new AudioContextClass();
                const gain = ctx.createGain();
                const source = ctx.createMediaElementSource(audioRef.current!);

                source.connect(gain);
                gain.connect(ctx.destination);

                audioCtxRef.current = ctx;
                gainNodeRef.current = gain;
                sourceNodeRef.current = source;
            } catch (e) {
                console.warn('Web Audio API init failed (likely CORS or browser restriction):', e);
            }
        };

        const handleInteraction = () => {
            initWebAudio();
            window.removeEventListener('click', handleInteraction);
        };
        window.addEventListener('click', handleInteraction);
        return () => window.removeEventListener('click', handleInteraction);
    }, []);

    // Handle Playback Rate and Volume
    useEffect(() => {
        if (!audioRef.current) return;
        audioRef.current.playbackRate = playbackSpeed;

        if (gainNodeRef.current) {
            gainNodeRef.current.gain.value = volume;
            audioRef.current.volume = 1.0; // Keep element at max, let GainNode handle scaling/boost
        } else {
            audioRef.current.volume = Math.min(volume, 1.0);
        }
    }, [playbackSpeed, volume]);

    // Handle Play/Pause
    useEffect(() => {
        if (!audioRef.current) return;

        if (isPlaying && audioSrc) {
            if (audioCtxRef.current?.state === 'suspended') {
                audioCtxRef.current.resume();
            }
            audioRef.current.play().catch(() => { });
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, audioSrc]);

    // Handle Seeking from store
    useEffect(() => {
        if (audioRef.current && seekTo !== null) {
            audioRef.current.currentTime = seekTo;
        }
    }, [seekTo]);

    const handleEnded = () => {
        if (isRepeatAyah && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        } else if (currentAyah && currentSurahVerses && currentAyah < currentSurahVerses) {
            actions.nextAyah();
        } else {
            // Last ayah audio finished - just pause
            actions.pause();
        }
    };

    const onTimeUpdate = () => {
        if (audioRef.current) {
            actions.setProgress(audioRef.current.currentTime);
        }
    };

    const onLoadedMetadata = () => {
        if (audioRef.current) {
            actions.setDuration(audioRef.current.duration);
        }
    };

    return (
        <audio
            ref={audioRef}
            src={audioSrc}
            onEnded={handleEnded}
            onTimeUpdate={onTimeUpdate}
            onLoadedMetadata={onLoadedMetadata}
            preload="auto"
            crossOrigin="anonymous"
        />
    );
};

export default GlobalAudioEngine;
