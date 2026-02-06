const mongoose = require('mongoose');

const ayahSchema = new mongoose.Schema({
    surahNumber: { type: Number, required: true, ref: 'Surah' },
    ayahNumber: { type: Number, required: true }, // Ayah number within Surah
    text: {
        uthmani: { type: String, required: true }, // Saudi style
        indoPak: { type: String, required: true }, // Indo-Pak style
    },
    juz: { type: Number, required: true },
    page: { type: Number },
    // Translations will be stored in a separate collection or linked here
});

// Compound index for efficient lookup
ayahSchema.index({ surahNumber: 1, ayahNumber: 1 }, { unique: true });

module.exports = mongoose.model('Ayah', ayahSchema);
