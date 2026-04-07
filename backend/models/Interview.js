const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  candidateId: String,
  candidateName: String,
  role: String,
  date: String,
  time: String,
  type: String,
  status: { type: String, default: 'Pending' }
});

interviewSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
  }
});

module.exports = mongoose.model('Interview', interviewSchema);
