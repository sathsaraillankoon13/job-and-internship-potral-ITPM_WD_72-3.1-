const mongoose = require('mongoose');
require('dotenv').config();

const Job = require('./models/Job');

async function debug() {
    try {
        console.log('Connecting with URI:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');
        
        const jobs = await Job.find({}).lean();
        console.log('--- ALL JOBS ---');
        console.log(JSON.stringify(jobs.map(j => ({
            id: j._id,
            title: j.title,
            status: j.status,
            requiredSkills: j.requiredSkills,
            skills: j.skills,
            expiresAt: j.expiresAt,
            applicationDeadline: j.applicationDeadline
        })), null, 2));
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debug();
