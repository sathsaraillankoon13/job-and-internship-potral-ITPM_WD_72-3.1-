const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: String,
  avatar: String,
  location: String,
  experience: Number,
  education: String,
  skills: [String],
  matchScore: Number,
  shortlisted: { type: Boolean, default: false }
});

candidateSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
  }
});

module.exports = mongoose.model('Candidate', candidateSchema);
