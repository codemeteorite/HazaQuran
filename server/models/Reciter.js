const mongoose = require('mongoose');

const reciterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subfolder: { type: String, required: true }, // Folder name in EveryAyah source
    bitrate: { type: String, default: '128kbps' },
    style: { type: String }, // e.g., Murattal, Mujawwad
});

module.exports = mongoose.model('Reciter', reciterSchema);
