const mongoose = require('mongoose');

const mockQuestionSchema = new mongoose.Schema({
  pathway: {
    type: String,
    required: true,
    index: true
  },
  interviewType: {
    type: String,
    enum: ['Technical', 'Behavioral', 'HR'],
    required: true,
    index: true
  },
  questionText: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('MockQuestion', mockQuestionSchema);
