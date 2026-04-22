const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('./models/Question');

dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            family: 4 // Use the same fix
        });
        console.log("Connected to MongoDB...");

        const count = await Question.countDocuments();
        console.log("Total questions in DB:", count);

        const sample = await Question.findOne();
        if (sample) {
            console.log("Sample Question Fields:");
            console.log("- pathway:", sample.pathway);
            console.log("- testDomain:", sample.testDomain);
            console.log("- skill:", sample.skill);
            console.log("- difficulty:", sample.difficulty);
        } else {
            console.log("No questions found in the database!");
        }

        mongoose.connection.close();
    } catch (error) {
        console.error("Error:", error);
    }
};

checkDB();
