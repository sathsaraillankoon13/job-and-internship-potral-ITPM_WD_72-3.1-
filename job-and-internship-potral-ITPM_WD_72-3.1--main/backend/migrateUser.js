const mongoose = require('mongoose');
require('dotenv').config();
const UserResult = require('./models/UserResult');
const InterviewResult = require('./models/InterviewResults');

mongoose.connect(process.env.MONGODB_URI, { family: 4 }).then(async () => {
  const result1 = await UserResult.updateMany({ userId: 'guest_user' }, { $set: { userId: '660b13d2f2b3a0c5c8e3b123' } });
  const result2 = await InterviewResult.updateMany({ userId: 'guest_user' }, { $set: { userId: '660b13d2f2b3a0c5c8e3b123' } });
  console.log('Migrated Assessment records:', result1.modifiedCount);
  console.log('Migrated Interview records:', result2.modifiedCount);
  mongoose.connection.close();
}).catch(console.error);
