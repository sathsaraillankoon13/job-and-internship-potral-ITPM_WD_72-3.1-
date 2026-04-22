const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

const Job = require('./backend/models/Job');

async function debug() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');
        
        const jobs = await Job.find({}).lean();
        console.log('--- ALL JOBS ---');
        jobs.forEach(j => {
            console.log(`ID: ${j._id}, Title: ${j.title}, Status: "${j.status}", RequiredSkills: [${j.requiredSkills}], Skills: [${j.skills}]`);
        });
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debug();
