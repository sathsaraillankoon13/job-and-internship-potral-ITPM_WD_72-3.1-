const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  university: { type: String, default: '' },
  degree: { type: String, default: '' },
  bio: { type: String, default: '' },
  role: { type: String, default: 'student', enum: ['student', 'admin', 'employer'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
