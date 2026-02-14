I               maxMinutes = mins;
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