const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  pathway: { type: String, required: true },
  type: { type: String, required: true },
  questions: [{ type: String }],
  answers: [{ type: String }],
  currentQuestionIndex: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: 3600 } // Session expires in 1 hour
});

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
