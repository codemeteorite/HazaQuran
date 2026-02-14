import { create } from 'zustand';

export const RECITERS = {
    maher: { name: 'Maher Al Muaiqly', url: 'https://everyayah.com/data/MaherAlMuaiqly128kbps', country: 'Saudi Arabia', style: 'Murattal', description: 'Imam of Masjid al-Haram with a soul-soothing voice.' },
    sudais: { name: 'Abdurrahman As-Sudais', url: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps', country: 'Saudi Arabia', style: 'Murattal', description: 'Chief Imam of the Grand Mosque in Mecca.' },
    shuraim: { name: 'Saud Ash-Shuraim', url: 'https://everyayah.com/data/Saood_ash-Shuraym_128kbps', country: 'Saudi Arabia', style: 'Murattal', description: 'Well known for his deep and resonant recitation.' },
    dosari: { name: 'Yasser Al-Dosari', url: 'https://everyayah.com/data/Yasser_Ad-Dussary_128kbps', country: 'Saudi Arabia', style: 'Murattal', description: 'Famous for his unique and emotional recitation style.' },
    juhainy: { name: 'Abdullah Al-Juhainy', url: 'https://everyayah.com/data/Abdullah_Matroud_128kbps', country: 'Saudi Arabia', style: 'Murattal', description: 'Former Imam of Masjid al-Haram with a distinctive voice.' },
};

interface AudioState {
    isPlaying: boolean;
    currentSurah: number | null;
    currentAyah: number | null;
    currentSurahVerses: number | null;
    reciterUrl: string;
    isRepeatAyah: boolean;
    playbackSpeed: number;
    progress: number;
    duration: number;
    volume: number;
    seekTo: number | null;
    cachingSurahId: number | null;
    cachingProgress: number;
    isCollapsed: boolean;
    isAutoscrollDisabled: boolean;
    isReadingMode: boolean;
    bookmarks: string[]; // "surah:ayah" format
    favoriteReciters: string[]; // IDs
    isAppBackground: boolean;
    isSurahCompleted: boolean;
    actions: {
        play: (surah: number, ayah: number, verseCount: number) => void;
        setSurahCompleted: (completed: boolean) => void;
        pause: () => void;
        setReciter: (url: string) => void;
        nextAyah: () => void;
        prevAyah: () => void;
        toggleRepeatAyah: () => void;
        setPlaybackSpeed: (speed: number) => void;
        setProgress: (progress: number) => void;
        setDuration: (duration: number) => void;
        setVolume: (volume: number) => void;
        seek: (time: number) => void;
        setCachingStatus: (surahId: number | null, progress: number) => void;
        toggleIsCollapsed: () => void;
        setAutoscrollDisabled: (disabled: boolean) => void;
        toggleReadingMode: () => void;
        toggleBookmark: (surah: number, ayah: number) => void;
        syncBookmarks: (savedAyahs: any[]) => void;
        toggleFavoriteReciter: (id: string) => void;
    };
}

export const useAudioStore = create<AudioState>()((set, get) => ({
    isPlaying: false,
    currentSurah: null,
    currentAyah: null,
    currentSurahVerses: null,
    isSurahCompleted: false,
    isAppBackground: false,
    reciterUrl: RECITERS.maher.url,
    isRepeatAyah: false,
    playbackSpeed: 1,
    progress: 0,
    duration: 0,
    volume: 0.8,
    seekTo: null,
    cachingSurahId: null,
    cachingProgress: 0,
    isCollapsed: false,
    isAutoscrollDisabled: false,
    isReadingMode: false,
    bookmarks: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('hazaquran-bookmarks') || '[]') : [],
    favoriteReciters: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('hazaquran-favorite-reciters') || '[]') : [],
    actions: {
        setSurahCompleted: (completed: boolean) => set({ isSurahCompleted: completed }),
        play: (surah: number, ayah: number, verseCount: number) => set({ isPlaying: true, currentSurah: surah, currentAyah: ayah, currentSurahVerses: verseCount, isCollapsed: false, isSurahCompleted: false }),
        pause: () => set({ isPlaying: false }),
        setReciter: (url: string) => set({ reciterUrl: url }),
        toggleRepeatAyah: () => set((state) => ({ isRepeatAyah: !state.isRepeatAyah })),
        setPlaybackSpeed: (speed: number) => set({ playbackSpeed: speed }),
        nextAyah: () => {
            const { currentSurah, currentAyah, isRepeatAyah } = get();
            if (currentSurah && currentAyah) {
                if (isRepeatAyah) {
                    return;
                }
                set({ currentAyah: currentAyah + 1 });
            }
        },
        prevAyah: () => {
            const { currentSurah, currentAyah } = get();
            if (currentSurah && currentAyah && currentAyah > 1) {
                set({ currentAyah: currentAyah - 1 });
            }
        },
        setProgress: (progress: number) => set({ progress }),
        setDuration: (duration: number) => set({ duration }),
        setVolume: (volume: number) => set({ volume }),
        seek: (time: number) => set({ seekTo: time }),
        setCachingStatus: (surahId: number | null, progress: number) => set({ cachingSurahId: surahId, cachingProgress: progress }),
        toggleIsCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
        setAutoscrollDisabled: (disabled: boolean) => set({ isAutoscrollDisabled: disabled }),
        toggleReadingMode: () => set((state) => ({ isReadingMode: !state.isReadingMode })),
        toggleBookmark: (surah, ayah) => set((state) => {
            const id = `${surah}:${ayah}`;
            const newBookmarks = state.bookmarks.includes(id)
                ? state.bookmarks.filter(b => b !== id)
                : [...state.bookmarks, id];
            if (typeof window !== 'undefined') {
                localStorage.setItem('hazaquran-bookmarks', JSON.stringify(newBookmarks));
            }
            return { bookmarks: newBookmarks };
        }),
        syncBookmarks: (savedAyahs: any[]) => set(() => {
            if (!Array.isArray(savedAyahs)) return { bookmarks: [] };
            const newBookmarks = savedAyahs.map(a => `${a.surahId}:${a.ayahNumber}`);
            if (typeof window !== 'undefined') {
                localStorage.setItem('hazaquran-bookmarks', JSON.stringify(newBookmarks));
            }
            return { bookmarks: newBookmarks };
        }),
        toggleFavoriteReciter: (id: string) => set((state) => {
            const newFavorites = state.favoriteReciters.includes(id)
                ? state.favoriteReciters.filter(f => f !== id)
                : [...state.favoriteReciters, id];
            if (typeof window !== 'undefined') {
                localStorage.setItem('hazaquran-favorite-reciters', JSON.stringify(newFavorites));
            }
            return { favoriteReciters: newFavorites };
        }),
    },
}));
