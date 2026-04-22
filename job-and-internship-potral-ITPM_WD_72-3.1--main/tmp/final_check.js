const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });
const Job = require('./backend/models/Job');

async function checkReact() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const reactJobs = await Job.find({ 
            $or: [
                { title: /react/i },
                { requiredSkills: /react/i },
                { skills: /react/i }
            ]
        }).lean();
        
        console.log('--- REACT JOBS FOUND: ' + reactJobs.length + ' ---');
        reactJobs.forEach(j => {
            console.log(`Title: ${j.title}, Status: "${j.status}", Start: ${j.startAt}, End: ${j.expiresAt}`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkReact();
