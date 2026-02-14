'use client';

import { useEffect, useState } from 'react';
import { useSurahCache } from '@/hooks/useSurahCache';
import { useAudioStore } from '@/store/audioStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudDownload, CheckCircle2, WifiOff } from 'lucide-react';

interface OfflineSyncProps {
    surahId: number;
    surahData: any;
}

export default function OfflineSync({ surahId, surahData }: OfflineSyncProps) {
    const { downloadSurah } = useSurahCache();
    const { reciterUrl, cachingSurahId, cachingProgress } = useAudioStore();
    const [isSynced, setIsSynced] = useState(false);
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        setIsOnline(navigator.onLine);
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        if (cachingSurahId === surahId && cachingProgress === 100) {
            setIsSynced(true);
            // Hide the indicator after 3 seconds
            const timer = setTimeout(() => setIsSynced(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [cachingSurahId, surahId, cachingProgress]);

    return (
        <AnimatePresence>
            {!isOnline && (
                <motion.div
                    key="offline-notice"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-slate-800 text-white flex items-center gap-3 shadow-2xl border border-white/10"
                >
                    <WifiOff size={18} className="text-red-400" />
                    <span className="text-sm font-medium">Offline Mode • Using cached data</span>
                </motion.div>
            )}

            {(cachingSurahId === surahId && cachingProgress < 100) && (
                <motion.div
                    key="syncing-progress"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed bottom-32 left-8 z-50 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-emerald-500/20 flex items-center gap-3"
                >
                    <div className="relative w-8 h-8">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="50%" cy="50%" r="40%" className="stroke-slate-200 dark:stroke-slate-800 fill-none" strokeWidth="3" />
                            <circle cx="50%" cy="50%" r="40%" className="stroke-emerald-500 fill-none" strokeWidth="3" strokeDasharray={`${cachingProgress * 0.25} 100`} strokeLinecap="round" />
                        </svg>
                        <CloudDownload size={12} className="absolute inset-0 m-auto text-emerald-500" />
                    </div>
                    <div className="text-xs">
                        <p className="font-bold text-slate-900 dark:text-white">Syncing for offline</p>
                        <p className="text-slate-500">{cachingProgress}% downloaded</p>
                    </div>
                </motion.div>
            )}

            {isSynced && (
                <motion.div
                    key="synced-ok"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="fixed bottom-32 left-8 z-50 px-4 py-2 rounded-xl bg-emerald-500 text-white shadow-xl flex items-center gap-2"
                >
                    <CheckCircle2 size={16} />
                    <span className="text-xs font-bold">Available Offline</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
