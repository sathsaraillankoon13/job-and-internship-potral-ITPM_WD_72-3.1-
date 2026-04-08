const mongoose = require('mongoose');

const userResultSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    quizTitle: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    timeTaken: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Passed', 'Failed'],
        required: true
    },
    // Store question set and answers for "View Details" linking
    questions: {
        type: Array,
        required: true
    },
    selectedAnswers: {
        type: Object,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('UserResult', userResultSchema);
