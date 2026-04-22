const mongoose = require('mongoose');

const interviewResultSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  pathway: { type: String, required: true },
  type: { type: String, required: true },
  date: { type: Date, default: Date.now },
  overallScore: { type: Number, required: true },
  overallFeedback: { type: String, required: true },
  detailedResults: [
    {
      question: { type: String, required: true },
      userAnswer: { type: String, required: true },
      aiScore: { type: Number, required: true },
      aiFeedback: { type: String, required: true },
      modelAnswer: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model('InterviewResult', interviewResultSchema);
