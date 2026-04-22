const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        validate: [arrayLimit, '{PATH} must have exactly 4 options'],
        required: true
    },
    correctAnswer: {
        type: String, // e.g., 'A', 'B', 'C', 'D' or the text itself, but 'A'/'B' is better for MCQ logic
        required: true
    },
    pathway: {
        type: String,
        required: true
    },
    testDomain: {
        type: String,
        required: true
    },
    skill: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        required: true
    },
    explanation: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

function arrayLimit(val) {
    return val.length === 4;
}

module.exports = mongoose.model('Question', questionSchema);
    