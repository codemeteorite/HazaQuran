const Activity = require('../models/Activity');
const User = require('../models/User');

const getTodayStr = () => new Date().toISOString().split('T')[0];
const getYesterdayStr = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
};

const isRamadan = () => {
    // Ramadan 2026: Feb 17 - Mar 18
    const now = new Date();
    const start = new Date(2026, 1, 17); // Feb is 1
    const end = new Date(2026, 2, 18);   // Mar is 2
    return now >= start && now <= end;
};

exports.syncActivity = async (req, res) => {
    try {
        const { minutes } = req.body;
        const userId = req.user.id;
        const today = getTodayStr();

        // 1. Update/Create Daily Activity
        let activity = await Activity.findOne({ userId, date: today });
        if (activity) {
            activity.minutes += minutes;
            await activity.save();
        } else {
            activity = new Activity({ userId, date: today, minutes });
            await activity.save();
        }

        // 2. Update User Stats & Streak
        const user = await User.findById(userId);

        // Handle today's minutes reset on backend if needed
        if (user.stats.lastActivityDate !== today) {
            user.stats.todayMinutes = 0;

            const yesterday = getYesterdayStr();
            if (user.stats.lastActivityDate === yesterday) {
                user.stats.currentStreak += 1;
            } else {
                user.stats.currentStreak = 1;
            }
            user.stats.maxStreak = Math.max(user.stats.maxStreak, user.stats.currentStreak);
            user.stats.lastActivityDate = today;
        }

        user.stats.todayMinutes += minutes;
        user.stats.totalMinutes += minutes;

        // 3. Hasanath Calculation
        // Base: 10 Hasanath per minute
        // Ramadan: 70x multiplier -> 700 per minute
        const boost = isRamadan() ? 70 : 1;
        const earnedHasanath = minutes * 10 * boost;
        user.stats.hasanath += earnedHasanath;

        await user.save();

        res.json({
            todayMinutes: user.stats.todayMinutes,
            totalMinutes: user.stats.totalMinutes,
            hasanath: user.stats.hasanath,
            currentStreak: user.stats.currentStreak,
            isRamadan: isRamadan(),
            earnedHasanath
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getLeaderboard = async (req, res) => {
    try {
        const topUsers = await User.find({})
            .sort({ 'stats.totalMinutes': -1 })
            .limit(50)
            .select('displayName profileImage stats.totalMinutes stats.currentStreak');

        res.json(topUsers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
