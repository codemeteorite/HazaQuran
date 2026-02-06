const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    displayName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String }, // Optional for Google users
    googleId: { type: String, unique: true, sparse: true },
    profileImage: { type: String },

    // Account Verification
    isVerified: { type: Boolean, default: false },
    verificationOTP: { type: String },
    otpExpires: { type: Date },

    preferences: {
        reciterId: { type: String, default: 'default_reciter' },
        scriptStyle: { type: String, enum: ['uthmani', 'indoPak'], default: 'uthmani' },
        darkMode: { type: Boolean, default: false },
        translationLanguage: { type: String, default: 'en' }
    },

    likedSurahs: [{ type: Number }], // Array of Surah numbers

    bookmarks: [{
        surahNumber: Number,
        ayahNumber: Number,
        addedAt: { type: Date, default: Date.now }
    }],

    stats: {
        totalMinutes: { type: Number, default: 0 },
        todayMinutes: { type: Number, default: 0 },
        hasanath: { type: Number, default: 0 },
        currentStreak: { type: Number, default: 0 },
        maxStreak: { type: Number, default: 0 },
        lastActivityDate: { type: String } // Store as YYYY-MM-DD for easy streak check
    },

    goals: {
        dailyMinutesGoal: { type: Number, default: 10 }
    },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
