'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User as UserIcon,
    Clock,
    Flame,
    Sparkles,
    ArrowLeft,
    Heart,
    Bookmark,
    Settings,
    LogOut,
    Edit2,
    Save,
    Calendar,
    Trophy,
    Music
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { RECITERS } from '@/store/audioStore';
import clsx from 'clsx';

export default function ProfilePage() {
    const router = useRouter();
    const { user, isAuthenticated, logout, updateProfile } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [surahList, setSurahList] = useState<any[]>([]);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/');
        }
        setNewName(user?.display_name || '');
        fetchSurahs();
    }, [isAuthenticated, user]);

    const fetchSurahs = async () => {
        try {
            const res = await fetch('https://api.quran.com/api/v4/chapters');
            const data = await res.json();
            setSurahList(data.chapters);
        } catch (err) {
            console.error('Failed to fetch surahs', err);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateProfile({ display_name: newName });
            setIsEditing(false);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) return null;

    const totalHours = Math.floor((user.total_minutes || 0) / 60);
    const remainingMins = (user.total_minutes || 0) % 60;
    const hasanath = (user.total_minutes || 0) * 10;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pb-20">
            {/* Header */}
            <header className="px-6 py-6 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl sticky top-0 z-40">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/10 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Profile</h1>
                    <button
                        onClick={logout}
                        className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-100 transition-all"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
                {/* Hero Profile Section */}
                <section className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-cyan-500/10 blur-3xl -z-10 rounded-full" />
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="relative group">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-500">
                                <UserIcon size={64} className="text-white" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center border border-slate-100 dark:border-slate-700">
                                <Trophy size={20} className="text-amber-500" />
                            </div>
                        </div>

                        <div className="text-center md:text-left flex-1">
                            <AnimatePresence mode="wait">
                                {isEditing ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex items-center gap-3 justify-center md:justify-start"
                                    >
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="text-3xl font-black bg-transparent border-b-2 border-emerald-500 focus:outline-none text-slate-900 dark:text-white px-2 py-1 max-w-[300px]"
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="p-2 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                                        >
                                            {isSaving ? <Sparkles className="animate-spin" size={20} /> : <Save size={20} />}
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-xl active:scale-95 transition-all"
                                        >
                                            <ArrowLeft size={20} />
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="group flex items-center gap-4 justify-center md:justify-start"
                                    >
                                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                                            {user.display_name || 'Servant of Allah'}
                                        </h2>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 opacity-0 group-hover:opacity-100 transition-all hover:text-emerald-500"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg mt-2">{user.email}</p>
                            <div className="flex items-center gap-2 mt-4 text-xs font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-4 py-1.5 rounded-full w-fit mx-auto md:mx-0">
                                <Calendar size={12} /> Member Since {new Date(user.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Grid */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Spiritual Hours', value: `${totalHours}h ${remainingMins}m`, icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                        { label: 'Current Streak', value: `${user.current_streak || 0} Days`, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                        { label: 'Hasanat Earned', value: hasanath.toLocaleString(), icon: Sparkles, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                        { label: 'Saved Ayahs', value: (user.saved_ayah?.length || 0).toString(), icon: Bookmark, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50"
                        >
                            <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-xs font-black", stat.bg)}>
                                <stat.icon className={stat.color} size={20} />
                            </div>
                            <div className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
                            <div className="text-xl font-black text-slate-900 dark:text-white">{stat.value}</div>
                        </motion.div>
                    ))}
                </section>

                {/* Extended Details Section */}
                <section className="space-y-8 bg-transparent">


                    {/* Quick Stats */}
                    <div className="glass-card p-8 rounded-[2rem] border border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-br from- emerald-500/5 to-cyan-500/5">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Badges & Ranks</h3>
                        <div className="flex flex-wrap gap-3">
                            <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-2">
                                <span className="text-xl">🏆</span>
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Qari Apprentice</span>
                            </div>
                            <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-2">
                                <span className="text-xl">🔥</span>
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Fast Starter</span>
                            </div>
                            <div className="px-4 py-2 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-600 flex items-center gap-2 opacity-50">
                                <span className="text-xl grayscale">👑</span>
                                <span className="text-sm font-bold text-slate-400">Quran Master</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content Lists */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Liked Surahs */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-rose-500">
                                <Heart size={20} fill="currentColor" />
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Liked Surahs</h3>
                            </div>
                            <span className="text-xs font-black bg-rose-500/10 text-rose-500 px-3 py-1 rounded-full uppercase tracking-widest">
                                {user.liked_surahs?.length || 0}
                            </span>
                        </div>
                        <div className="grid gap-3">
                            {(user.liked_surahs || []).slice(0, 5).map((id: number) => {
                                const surah = surahList.find(s => s.id === id);
                                return (
                                    <button
                                        key={id}
                                        onClick={() => router.push(`/surahs?id=${id}`)}
                                        className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:scale-[1.02] transition-all hover:shadow-lg active:scale-95 group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-sm font-black text-slate-400 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                                                {id}
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold text-slate-900 dark:text-white">{surah?.name_simple || 'Loading...'}</div>
                                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{surah?.revelation_place || 'Quran'}</div>
                                            </div>
                                        </div>
                                        <div className="font-uthmani text-2xl text-emerald-600 group-hover:scale-110 transition-transform">{surah?.name_arabic}</div>
                                    </button>
                                );
                            })}
                            {(!user.liked_surahs || user.liked_surahs.length === 0) && (
                                <div className="p-8 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800 text-center text-slate-400 font-medium">
                                    No liked surahs yet. Hearts add light!
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Saved Ayahs */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-cyan-500">
                                <Bookmark size={20} fill="currentColor" />
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Saved Ayahs</h3>
                            </div>
                            <span className="text-xs font-black bg-cyan-500/10 text-cyan-500 px-3 py-1 rounded-full uppercase tracking-widest">
                                {user.saved_ayah?.length || 0}
                            </span>
                        </div>
                        <div className="grid gap-3">
                            {(user.saved_ayah || []).slice(0, 3).map((ayah: any, i: number) => {
                                const surah = surahList.find(s => s.id === ayah.surahId);
                                return (
                                    <button
                                        key={i}
                                        onClick={() => router.push(`/surahs?id=${ayah.surahId}&ayah=${ayah.ayahNumber}`)}
                                        className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:scale-[1.02] transition-all hover:shadow-lg active:scale-95 group"
                                    >
                                        <div className="text-left">
                                            <div className="font-bold text-slate-900 dark:text-white">Surah {surah?.name_simple || ayah.surahId}</div>
                                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ayah {ayah.ayahNumber}</div>
                                        </div>
                                        <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 text-cyan-500 opacity-0 group-hover:opacity-100 transition-all">
                                            <ArrowLeft size={16} className="rotate-180" />
                                        </div>
                                    </button>
                                );
                            })}
                            {(user.saved_ayah?.length || 0) > 3 && (
                                <button
                                    onClick={() => router.push('/profile/saved-ayahs')}
                                    className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    View All Saved Ayahs
                                </button>
                            )}
                            {(!user.saved_ayah || user.saved_ayah.length === 0) && (
                                <div className="p-8 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800 text-center text-slate-400 font-medium">
                                    No saved ayahs yet. Jewels of wisdom await!
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
