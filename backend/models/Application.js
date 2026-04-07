const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  candidateName: { type: String, required: true },
  location: String,
  avatar: String,
  skills: [String],
  education: String,
  appliedDate: String,
  status: { type: String, default: 'Pending' },
  jobId: Number
});

applicationSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
  }
});

module.exports = mongoose.model('Application', applicationSchema);
