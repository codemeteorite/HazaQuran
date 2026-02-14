'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useActivityTracker } from '@/hooks/useActivityTracker';
import { useReadingPositionTracker } from '@/hooks/useReadingPositionTracker';

export function Providers({ children }: { children: ReactNode }) {
    const initAuth = useAuthStore((state) => state.init);

    // Initialize auth on mount
    useEffect(() => {
        console.log('🔄 Initializing auth store...');
        initAuth();
    }, [initAuth]);

    // Run global trackers
    useActivityTracker();
    useReadingPositionTracker();

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="hazaquran-theme"
        >
            {children}
        </ThemeProvider>
    );
}