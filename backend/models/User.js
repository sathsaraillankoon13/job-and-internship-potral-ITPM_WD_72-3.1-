const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  university: { type: String, default: '' },
  degree: { type: String, default: '' },
  bio: { type: String, default: '' },
  role: { type: String, default: 'student', enum: ['student', 'admin', 'employer'] },
  type: { type: String },
  status: { type: String, default: 'active' },
  verificationCode: { type: String },
  phoneNumber: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
