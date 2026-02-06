const User = require('../models/User');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -verificationOTP -otpExpires');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.toggleLikeSurah = async (req, res) => {
    try {
        const { surahId } = req.params;
        const user = await User.findById(req.user.id);

        const index = user.likedSurahs.indexOf(surahId);
        if (index > -1) {
            user.likedSurahs.splice(index, 1);
        } else {
            user.likedSurahs.push(surahId);
        }

        await user.save();
        res.json(user.likedSurahs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateGoals = async (req, res) => {
    try {
        const { dailyMinutesGoal } = req.body;
        const user = await User.findById(req.user.id);
        user.goals.dailyMinutesGoal = dailyMinutesGoal;
        await user.save();
        res.json(user.goals);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
