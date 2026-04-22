const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./config/db');

const Candidate = require('./models/Candidate');
const Application = require('./models/Application');
const Interview = require('./models/Interview');

const candidatesData = [
    {
        name: 'Pramod Fernando',
        role: 'Senior React Developer',
        avatar: 'https://scontent.fcmb12-1.fna.fbcdn.net/v/t39.30808-6/554994846_1833053284273829_887629382923116272_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=e06c5d&_nc_eui2=AeELrgeh25cacCedDmJzyunLaenBvgepDF5p6cG-B6kMXtQZfKCv_0ezfWHsjwIqpqxNDJMO7MN5Eu_ZkNa1TByP&_nc_ohc=2UnisaQysvMQ7kNvwEL9MNC&_nc_oc=AdrQzOla5oahlzL86zRIVxQva5fsIJcC3saD_RkWbN6FYg5MvQALXdKALoAQVC_FVkkogudRhY9m7lNWcKzwbE8l&_nc_zt=23&_nc_ht=scontent.fcmb12-1.fna&_nc_gid=ccgu_l5dg_7avaReoAsghw&_nc_ss=7a32e&oh=00_AfwUuGSx4O93g5WSqakL4jRTVdywhtWsSVIqM4syCs30MQ&oe=69C86D27',
        location: 'Colombo, Sri Lanka',
        experience: 5,
        education: 'MSc in Software Engineering',
        skills: ['React', 'Node.js', 'Typescript', 'AWS'],
        matchScore: 95,
        shortlisted: true,
    },
    {
        name: 'Kasuni Rathnayake',
        role: 'Backend Engineer',
        avatar: 'https://scontent.fcmb12-1.fna.fbcdn.net/v/t39.30808-6/615410763_122235247226121171_5606892820658726998_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=dd6889&_nc_eui2=AeHVFKHc8a_0b_fSnEmjjm25Fu8K4DjQVygW7wrgONBXKHTSMnRfuiyv47jr1DT3DiswWAuFQ4DG142w7xWHDCVS&_nc_ohc=QiqTYgiZM0EQ7kNvwGQ4nkO&_nc_oc=AdrwGkCFBrGpU46_xozWcf7myE06m4MJwrsIQN4kU25VQLZY4icbTzrdKRYlKrJkStYQvO_hsrTfGaRXU3ADwQm7&_nc_zt=23&_nc_ht=scontent.fcmb12-1.fna&_nc_gid=FUj4Nxq3fThy0auhD8xawQ&_nc_ss=7a32e&oh=00_AfwZhcR-lpvfXDZA5Jx_SeWlGuxo5KjO25JEBiP2jj7V9Q&oe=69C842EF',
        location: 'Kandy, Sri Lanka',
        experience: 3,
        education: 'BSc in Computer Science',
        skills: ['Java', 'Spring Boot', 'MySQL', 'Docker'],
        matchScore: 88,
        shortlisted: false,
    },
    {
        name: 'Amanda Silva',
        role: 'Full Stack Developer',
        avatar: 'https://scontent.fcmb12-1.fna.fbcdn.net/v/t39.30808-6/541640355_122097020853008546_5807935231373936346_n.jpg?stp=dst-jpg_s590x590_tt6&_nc_cat=106&ccb=1-7&_nc_sid=7b2446&_nc_eui2=AeE0qJ_DjIUuhua_q0WZVaBDPiZ0u83C-YY-JnS7zcL5hi3373UpqETCwNlAXz6b1VuvxypBnwk5NuvsPjrjJrhn&_nc_ohc=KEWoaLX5P-0Q7kNvwH-19Km&_nc_oc=Adojbzgzg0Km-2QpaQTnTd74bYxtxtV2vI_cF8fe9dyrs6a9hV-_XvtuBr_J4AE5-HNFVORBMsOvoYb8OQQ0wFVB&_nc_zt=23&_nc_ht=scontent.fcmb12-1.fna&_nc_gid=DiWavaElwXptDneu-fssWQ&_nc_ss=7a32e&oh=00_Afyr-fv1zxLuq2RUSV73sqqDwV-8vhZ29NKtEhGqwSVigQ&oe=69C83D25',
        location: 'Colombo, Sri Lanka',
        experience: 4,
        education: 'BSc in Software Engineering',
        skills: ['React', 'Java', 'Python', 'PostgreSQL'],
        matchScore: 92,
        shortlisted: true,
    }
];

const seedDB = async () => {
    try {
        await connectDB();
        await Candidate.deleteMany({});
        await Application.deleteMany({});
        await Interview.deleteMany({});
        
        await Candidate.insertMany(candidatesData);
        console.log('Database Seeded!');
        process.exit();
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}

seedDB();
