import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { useAudioStore } from './audioStore';

interface AuthState {
    user: any | null;
    isAuthenticated: boolean;
    loading: boolean;
    init: () => Promise<void>;
    login: (email: string, password: string) => Promise<any>;
    register: (displayName: string, email: string, password: string) => Promise<any>;
    logout: () => Promise<void>;
    syncActivity: (minutes: number, surahId?: number, reciterId?: string) => Promise<any>;
    toggleLike: (surahId: number) => Promise<void>;
    toggleBookmark: (surahId: number, ayahNumber: number) => Promise<void>;
    updateProfile: (updates: any) => Promise<void>;
    updateReadingPosition: (surahNumber: number, ayahNumber: number) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    loading: true,

    init: async () => {
        try {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError) {
                console.error('Session error:', sessionError);
                set({ user: null, isAuthenticated: false, loading: false });
                return;
            }

            if (session?.user) {
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profileError) {
                    console.error('Profile fetch error:', profileError);
                    set({ user: session.user, isAuthenticated: true, loading: false });
                } else {
                    useAudioStore.getState().actions.syncBookmarks(profile.saved_ayah || []);
                    set({
                        user: { ...session.user, ...profile },
                        isAuthenticated: true,
                        loading: false
                    });

                    // Update last activity date if needed
                    try {
                        const today = new Date().toISOString().split('T')[0];
                        const lastActivity = profile?.last_activity_date
                            ? new Date(profile.last_activity_date).toISOString().split('T')[0]
                            : null;

                        if (!lastActivity || lastActivity !== today) {
                            const now = new Date().toISOString();
                            const { data: updated, error: updErr } = await supabase
                                .from('profiles')
                                .update({
                                    last_activity_date: today,
                                    updated_at: now
                                })
                                .eq('id', session.user.id)
                                .select()
                                .single();
                            if (!updErr && updated) {
                                set({ user: { ...session.user, ...updated } });
                            }
                        }
                    } catch (e) {
                        console.warn('Error updating last_activity_date:', e);
                    }
                }
            } else {
                set({ user: null, isAuthenticated: false, loading: false });
            }
        } catch (err) {
            console.error('Auth init error:', err);
            set({ user: null, isAuthenticated: false, loading: false });
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.id);

            if (session?.user) {
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profileError) {
                    console.error('Profile fetch error on auth change:', profileError);
                    set({ user: session.user, isAuthenticated: true });
                } else {
                    useAudioStore.getState().actions.syncBookmarks(profile.saved_ayah || []);
                    set({
                        user: { ...session.user, ...profile },
                        isAuthenticated: true
                    });
                }
            } else {
                set({ user: null, isAuthenticated: false });
            }
        });
    },

    login: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        if (profileError) {
            console.error('Profile fetch error on login:', profileError);
            set({ user: data.user, isAuthenticated: true });
        } else {
            set({ user: { ...data.user, ...profile }, isAuthenticated: true });
        }

        return data;
    },

    register: async (displayName: string, email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    display_name: displayName,
                    created_at: new Date().toISOString()
                }
            }
        });
        if (error) throw error;
        return data;
    },

    logout: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Logout error:', error);
            throw error;
        }
        set({ user: null, isAuthenticated: false });
    },

    syncActivity: async (minutes: number, surahId?: number, reciterId?: string) => {
        const { user, isAuthenticated } = get();

        if (!isAuthenticated || !user?.id) {
            console.warn('Cannot sync activity: User not authenticated');
            return null;
        }

        if (minutes <= 0) {
            console.log('No minutes to sync');
            return null;
        }

        try {
            // First, get fresh data from database to avoid race conditions
            const { data: freshProfile, error: fetchError } = await supabase
                .from('profiles')
                .select('total_minutes, current_streak, last_activity_date')
                .eq('id', user.id)
                .single();

            if (fetchError) {
                // Silently fail if session invalid or network error, as local state is still usable
                if (fetchError.code !== 'PGRST116') { // unexpected error
                    console.warn('Profile sync skipped:', fetchError.message);
                }
                // Fall back to local state if fetch fails
                const currentTotalMinutes = user.total_minutes || 0;
                const currentStreak = user.current_streak || 0;
                const lastActivityDate = user.last_activity_date;

                return await updateActivity(
                    user.id,
                    currentTotalMinutes,
                    currentStreak,
                    lastActivityDate,
                    minutes,
                    surahId,
                    reciterId,
                    set,
                    user
                );
            }

            return await updateActivity(
                user.id,
                freshProfile.total_minutes || 0,
                freshProfile.current_streak || 0,
                freshProfile.last_activity_date,
                minutes,
                surahId,
                reciterId,
                set,
                user
            );
        } catch (err) {
            console.error('❌ Activity sync failed:', err);
            return null;
        }
    },

    toggleLike: async (surahId: number) => {
        const { user, isAuthenticated } = get();
        if (!isAuthenticated || !user?.id) return;

        try {
            const likedSurahs = user.liked_surahs || [];
            const newLiked = likedSurahs.includes(surahId)
                ? likedSurahs.filter((id: number) => id !== surahId)
                : [...likedSurahs, surahId];

            const { data, error } = await supabase
                .from('profiles')
                .update({
                    liked_surahs: newLiked,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id)
                .select()
                .single();

            if (error) throw error;
            set({ user: { ...user, ...data } });
        } catch (err) {
            console.error('Like toggle failed:', err);
        }
    },

    toggleBookmark: async (surahId: number, ayahNumber: number) => {
        const { user, isAuthenticated } = get();
        if (!isAuthenticated || !user?.id) return;

        try {
            const savedAyah = user.saved_ayah || [];
            const exists = savedAyah.some((a: any) => a.surahId === surahId && a.ayahNumber === ayahNumber);

            let newSaved;
            if (exists) {
                newSaved = savedAyah.filter((a: any) => !(a.surahId === surahId && a.ayahNumber === ayahNumber));
            } else {
                const ayahId = `ayah-${surahId}-${ayahNumber}-${Date.now()}`;
                const newAyah = {
                    id: ayahId,
                    surahId,
                    ayahNumber,
                    savedAt: new Date().toISOString()
                };
                newSaved = [...savedAyah, newAyah];
            }

            const { data, error } = await supabase
                .from('profiles')
                .update({
                    saved_ayah: newSaved,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id)
                .select()
                .single();

            if (error) throw error;

            // Sync with audioStore immediately
            useAudioStore.getState().actions.syncBookmarks(newSaved);

            set({ user: { ...user, ...data } });
            console.log('✅ Bookmark toggled successfully:', { surahId, ayahNumber, total: newSaved.length });
        } catch (err) {
            console.error('❌ Bookmark toggle failed:', err);
        }
    },

    updateProfile: async (updates: any) => {
        const { user, isAuthenticated } = get();
        if (!isAuthenticated || !user?.id) return;

        try {
            const { data, error } = await supabase
                .from('profiles')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id)
                .select()
                .single();

            if (error) throw error;
            set({ user: { ...user, ...data } });
        } catch (err) {
            console.error('Profile update failed:', err);
            throw err;
        }
    },

    updateReadingPosition: async (surahNumber: number, ayahNumber: number) => {
        const { user, isAuthenticated } = get();
        if (!isAuthenticated || !user?.id) return;

        try {
            const { data, error } = await supabase
                .from('profiles')
                .update({
                    last_surah_number: surahNumber,
                    last_ayah_number: ayahNumber,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id)
                .select()
                .single();

            if (error) throw error;
            set({ user: { ...user, ...data } });
        } catch (err: any) {
            console.error('Failed to update reading position:', err.message || err);
            // Fallback: update local state anyway so UI feels responsive
            set((state) => ({
                user: {
                    ...state.user,
                    last_surah_number: surahNumber,
                    last_ayah_number: ayahNumber
                }
            }));
        }
    }
}));

// Helper function to update activity (separated for readability)
async function updateActivity(
    userId: string,
    currentTotalMinutes: number,
    currentStreak: number,
    lastActivityDate: string | null,
    minutes: number,
    surahId: number | undefined,
    reciterId: string | undefined,
    set: any,
    user: any
) {
    const newMinutes = currentTotalMinutes + minutes;
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();

    // Calculate new streak
    let newStreak = currentStreak;

    if (lastActivityDate) {
        const lastDate = new Date(lastActivityDate);
        const todayDate = new Date(today);

        // Calculate difference in days
        const diffTime = todayDate.getTime() - lastDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        console.log(`Streak calculation: Last activity: ${lastActivityDate}, Today: ${today}, Diff: ${diffDays} days`);

        if (diffDays === 0) {
            // Same day, keep same streak
            newStreak = currentStreak;
            console.log('Same day activity, streak unchanged:', currentStreak);
        } else if (diffDays === 1) {
            // Consecutive day, increment streak
            newStreak = currentStreak + 1;
            console.log('Consecutive day! Incrementing streak:', currentStreak, '→', newStreak);
        } else {
            // More than 1 day gap, reset streak to 1
            newStreak = 1;
            console.log('Streak broken! Resetting to 1');
        }
    } else {
        // First time activity
        newStreak = 1;
        console.log('First activity! Setting streak to 1');
    }

    // Build updates
    const updates: any = {
        total_minutes: newMinutes,
        current_streak: newStreak,
        last_activity_date: today,
        updated_at: now
    };

    // Handle Reciter Stats
    if (reciterId) {
        const currentStats = user.reciter_stats || {};
        const currentMinutes = currentStats[reciterId] || 0;
        const newMinutesForReciter = currentMinutes + minutes;

        updates.reciter_stats = {
            ...currentStats,
            [reciterId]: newMinutesForReciter
        };

        // Calculate favorite reciter
        let maxMinutes = newMinutesForReciter;
        let favoriteReciter = reciterId;

        Object.entries(updates.reciter_stats).forEach(([id, mins]: [string, any]) => {
            if (mins > maxMinutes) {
                maxMinutes = mins;
                favoriteReciter = id;
            }
        });

        updates.favorite_reciter = favoriteReciter;
    } else if (user.reciter_stats) {
        // Keep existing stats if no reciter provided this time
        // But maybe favorite changed? Unlikely if we didn't add minutes.
    }

    // Only update surah if provided
    if (surahId !== undefined && surahId !== null) {
        updates.most_listened_surah = surahId;
    }

    console.log(`📊 Syncing ${minutes} minutes for user ${userId}`);
    console.log(`Current total: ${currentTotalMinutes} → New total: ${newMinutes}`);
    console.log('Updates:', updates);

    // Update database
    const { data, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

    if (updateError) {
        console.error('❌ Activity sync error:', updateError);
        throw updateError;
    }

    console.log('✅ Activity synced successfully:', {
        total_minutes: data.total_minutes,
        current_streak: data.current_streak
    });

    // Update local state
    set({ user: { ...user, ...data } });
    return data;
}