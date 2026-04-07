const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    questionId: String,
    userAnswer: String,
    score: Number,
    feedback: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', resultSchema);