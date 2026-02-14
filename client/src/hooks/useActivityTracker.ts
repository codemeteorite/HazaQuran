'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useAudioStore } from '@/store/audioStore';

export function useActivityTracker() {
    const { isAuthenticated, syncActivity, user } = useAuthStore();
    const { isPlaying, currentSurah } = useAudioStore();
    
    const accumulatedSeconds = useRef(0);
    const isTrackingRef = useRef(false);
    const lastSyncTimeRef = useRef(Date.now());
    const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Function to sync activity
    const syncAccumulatedActivity = useCallback(async () => {
        if (accumulatedSeconds.current >= 60) { // At least 1 minute
            const mins = Math.floor(accumulatedSeconds.current / 60);
            const remainingSeconds = accumulatedSeconds.current % 60;
            
            console.log(`🔄 Attempting to sync ${mins} minutes (from ${accumulatedSeconds.current} seconds)`);
            
            try {
                await syncActivity(
                    mins,
                    currentSurah || undefined
                );
                
                // Reset only the minutes we synced
                accumulatedSeconds.current = remainingSeconds;
                lastSyncTimeRef.current = Date.now();
                console.log(`✅ Synced ${mins} minutes successfully. Remaining: ${remainingSeconds} seconds`);
            } catch (error) {
                console.error('❌ Failed to sync activity:', error);
                // Don't reset on error, try again later
            }
        }
    }, [syncActivity, currentSurah]);

    // Start tracking on user interaction
    const startTracking = useCallback(() => {
        if (!isTrackingRef.current) {
            isTrackingRef.current = true;
            console.log('👤 Activity tracking started');
        }
        
        // Clear existing inactivity timeout
        if (inactivityTimeoutRef.current) {
            clearTimeout(inactivityTimeoutRef.current);
        }
        
        // Set new inactivity timeout (5 minutes of no interaction = stop tracking)
        inactivityTimeoutRef.current = setTimeout(() => {
            // Sync any remaining activity before pausing
            if (accumulatedSeconds.current >= 30) { // At least 30 seconds
                syncAccumulatedActivity();
            }
            isTrackingRef.current = false;
            console.log('⏸️ Activity tracking paused (5m inactivity)');
        }, 5 * 60 * 1000); // 5 minutes
    }, [syncAccumulatedActivity]);

    // Effect for setting up event listeners
    useEffect(() => {
        if (!isAuthenticated || !user) {
            console.log('🚫 User not authenticated, stopping tracker');
            if (timerRef.current) clearInterval(timerRef.current);
            if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
            return;
        }

        console.log('✅ Activity tracker initialized for user:', user.id);
        console.log('Current user stats:', {
            total_minutes: user.total_minutes,
            streak: user.current_streak,
            last_activity: user.last_activity_date
        });

        // Add event listeners for user interaction
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click', 'mousemove'];
        events.forEach(event => {
            window.addEventListener(event, startTracking, { passive: true });
        });

        // Initial tracking start
        startTracking();

        // Timer that runs every second
        timerRef.current = setInterval(() => {
            if (isTrackingRef.current || isPlaying) {
                const prevSeconds = accumulatedSeconds.current;
                accumulatedSeconds.current += 1;
                
                // Log progress every minute
                if (Math.floor(accumulatedSeconds.current / 60) > Math.floor(prevSeconds / 60)) {
                    const mins = Math.floor(accumulatedSeconds.current / 60);
                    console.log(`⏱️ Accumulated: ${mins} minute${mins !== 1 ? 's' : ''} (${accumulatedSeconds.current} seconds)`);
                }
            }
        }, 1000);

        // Sync interval - check every minute
        const syncInterval = setInterval(() => {
            syncAccumulatedActivity();
        }, 60 * 1000); // Every 1 minute

        // Cleanup function
        return () => {
            console.log('🧹 Cleaning up activity tracker');
            
            events.forEach(event => {
                window.removeEventListener(event, startTracking);
            });

            clearInterval(syncInterval);
            if (timerRef.current) clearInterval(timerRef.current);
            if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);

            // Final sync on cleanup
            if (accumulatedSeconds.current >= 30) { // Sync if at least 30 seconds
                const mins = Math.floor(accumulatedSeconds.current / 60);
                if (mins > 0) {
                    console.log(`🏁 Final sync on cleanup: ${mins} minutes`);
                    syncActivity(mins, currentSurah || undefined);
                }
            }
        };
    }, [isAuthenticated, isPlaying, syncAccumulatedActivity, startTracking, syncActivity, currentSurah, user]);

    // Separate effect for handling page visibility
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // Page is hidden, sync immediately if we have enough activity
                if (accumulatedSeconds.current >= 30) {
                    const mins = Math.floor(accumulatedSeconds.current / 60);
                    if (mins > 0) {
                        console.log(`📱 Page hidden, syncing ${mins} minutes`);
                        syncActivity(mins, currentSurah || undefined);
                    }
                }
                // Pause tracking when page is hidden
                isTrackingRef.current = false;
            } else {
                // Page is visible again
                console.log('📱 Page visible, resuming tracking');
                startTracking();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [syncActivity, currentSurah, startTracking]);

    return null;
}