const mongoose = require('mongoose');
require('dotenv').config();
const UserResult = require('./models/UserResult');
const Job = require('./models/Job');

async function debug() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const userId = '67f4077c57700a43093952ba'; // Standard test user ID often used in this repo
        
        const latestAssessment = await UserResult.findOne({}).sort({ date: -1 });
        console.log('Latest Assessment overall:', JSON.stringify({
            userId: latestAssessment?.userId,
            quizTitle: latestAssessment?.quizTitle,
            percentage: latestAssessment?.percentage,
            date: latestAssessment?.date
        }, null, 2));

        const jobs = await Job.find({}).limit(5);
        console.log('Sample Jobs:', JSON.stringify(jobs.map(j => ({
            title: j.title,
            requiredSkills: j.requiredSkills,
            category: j.category
        })), null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debug();
