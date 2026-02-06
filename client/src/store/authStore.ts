import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface AuthState {
    user: any;
    isAuthenticated: boolean;
    loading: boolean;
    init: () => Promise<void>;
    login: (email: any, password: any) => Promise<any>;
    register: (displayName: any, email: any, password: any) => Promise<any>;
    logout: () => Promise<void>;
    syncActivity: (minutes: number, surahId?: number, reciterId?: string) => Promise<any>;
    toggleLike: (surahId: any) => Promise<void>;
    toggleBookmark: (surahId: number, ayahNumber: number) => Promise<void>;
    updateProfile: (updates: any) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    loading: true,

    init: async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                set({
                    user: { ...session.user, ...profile },
                    isAuthenticated: true,
                    loading: false
                });
            } else {
                set({ user: null, isAuthenticated: false, loading: false });
            }
        } catch (err) {
            set({ user: null, isAuthenticated: false, loading: false });
        }

        // Listen for auth changes
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                set({ user: { ...session.user, ...profile }, isAuthenticated: true });
            } else {
                set({ user: null, isAuthenticated: false });
            }
        });
    },

    login: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        set({ user: { ...data.user, ...profile }, isAuthenticated: true });
        return data;
    },

    register: async (displayName, email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { display_name: displayName }
            }
        });
        if (error) throw error;
        return data;
    },

    logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false });
    },

    syncActivity: async (minutes, surahId, reciterId) => {
        const { user, isAuthenticated } = get();
        if (!isAuthenticated || !user) return;

        try {
            const newMinutes = (user.total_minutes || 0) + minutes;
            const today = new Date().toISOString().split('T')[0];

            // Basic streak logic
            let newStreak = user.current_streak || 0;
            if (user.last_activity_date) {
                const last = new Date(user.last_activity_date);
                const prev = new Date();
                prev.setDate(prev.getDate() - 1);

                if (last.toISOString().split('T')[0] === prev.toISOString().split('T')[0]) {
                    newStreak += 1;
                } else if (last.toISOString().split('T')[0] !== today) {
                    newStreak = 1;
                }
            } else {
                newStreak = 1;
            }

            const updates: any = {
                total_minutes: newMinutes,
                current_streak: newStreak,
                last_activity_date: today,
                updated_at: new Date().toISOString()
            };

            if (surahId) updates.most_listened_surah = surahId;
            if (reciterId) updates.favorite_reciter = reciterId;

            const { data, error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id)
                .select()
                .single();

            if (error) throw error;

            set({ user: { ...user, ...data } });
            return data;
        } catch (err) {
            console.error('Activity sync failed', err);
        }
    },

    toggleLike: async (surahId) => {
        const { user, isAuthenticated } = get();
        if (!isAuthenticated || !user) return;

        try {
            const likedSurahs = user.liked_surahs || [];
            const newLiked = likedSurahs.includes(surahId)
                ? likedSurahs.filter((id: number) => id !== surahId)
                : [...likedSurahs, surahId];

            const { data, error } = await supabase
                .from('profiles')
                .update({ liked_surahs: newLiked })
                .eq('id', user.id)
                .select()
                .single();

            if (error) throw error;
            set({ user: { ...user, ...data } });
        } catch (err) {
            console.error('Like toggle failed', err);
        }
    },

    toggleBookmark: async (surahId, ayahNumber) => {
        const { user, isAuthenticated } = get();
        if (!isAuthenticated || !user) return;

        try {
            const savedAyahs = user.saved_ayahs || [];
            const exists = savedAyahs.some((a: any) => a.surahId === surahId && a.ayahNumber === ayahNumber);

            const newSaved = exists
                ? savedAyahs.filter((a: any) => !(a.surahId === surahId && a.ayahNumber === ayahNumber))
                : [...savedAyahs, { surahId, ayahNumber, savedAt: new Date().toISOString() }];

            const { data, error } = await supabase
                .from('profiles')
                .update({ saved_ayahs: newSaved })
                .eq('id', user.id)
                .select()
                .single();

            if (error) throw error;
            set({ user: { ...user, ...data } });
        } catch (err) {
            console.error('Bookmark toggle failed', err);
        }
    },

    updateProfile: async (updates) => {
        const { user, isAuthenticated } = get();
        if (!isAuthenticated || !user) return;

        try {
            const { data, error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id)
                .select()
                .single();

            if (error) throw error;
            set({ user: { ...user, ...data } });
        } catch (err) {
            console.error('Profile update failed', err);
            throw err;
        }
    }
}));
