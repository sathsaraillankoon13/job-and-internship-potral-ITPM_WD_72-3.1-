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
        avatar: 'https://scontent.fcmb3-2.fna.fbcdn.net/v/t39.30808-1/660599448_2463788510735969_9058267699023690857_n.jpg?stp=dst-jpg_s160x160_tt6&_nc_cat=109&ccb=1-7&_nc_sid=1d2534&_nc_eui2=AeEPT04RUZA0scld8RjnqIoLFVAdMWReDRMVUB0xZF4NE0wonZfobLwUDK1xMShP4fTZKzQXw1o37o9QIo6Og8hb&_nc_ohc=UIL-hyEGrBgQ7kNvwHp1kBg&_nc_oc=AdpTjbaHMfY29cYij_ru611NLzKp-UySDoQLeMtYyJln6rRSaeuv7JhcpvvHWkEwI-CbqfFgKdwiQEcMvxRhf_dZ&_nc_zt=24&_nc_ht=scontent.fcmb3-2.fna&_nc_gid=YL_kWaDFSwSpnMQMuEGSKw&_nc_ss=7a3a8&oh=00_Af3UVs9zcXGvsHlaasbE3wpbqtrgienUKWlbedMiv813tQ&oe=69DB2816',
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
        avatar: 'https://scontent.fcmb12-1.fna.fbcdn.net/v/t39.30808-6/615410763_122235247226121171_5606892820658726998_n.jpg?stp=dst-jpg_s590x590_tt6&_nc_cat=106&ccb=1-7&_nc_sid=dd6889&_nc_eui2=AeHVFKHc8a_0b_fSnEmjjm25Fu8K4DjQVygW7wrgONBXKHTSMnRfuiyv47jr1DT3DiswWAuFQ4DG142w7xWHDCVS&_nc_ohc=hbXZT32WMgUQ7kNvwGToREL&_nc_oc=AdoaiNdGCNgPCRpzYowR0gae9-j-ZayoSwa86_vANh4ls2Z6mXFodHF51XAZ0V6CC7fUw3jVLLBjTSvmHHsNr-Rs&_nc_zt=23&_nc_ht=scontent.fcmb12-1.fna&_nc_gid=0nSAprJJ_60R9XriXsNPFg&_nc_ss=7a3a8&oh=00_Af0YQbRE7UjVTjYcIkTI7VAhrUkeqbqdsu--CjmXNn5E4w&oe=69DAF02',
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
        avatar: 'https://scontent.fcmb11-3.fna.fbcdn.net/v/t39.30808-6/658149197_122266799846252962_2481610273064537735_n.jpg?stp=dst-jpg_s590x590_tt6&_nc_cat=107&ccb=1-7&_nc_sid=7b2446&_nc_eui2=AeG5o1OkV_o3JVneWUHJS8h4kvB_bY7o062S8H9tjujTrd5LyeGSWRerzzaM2kNfpDMZvJ8kXS-5z4ZsuSihRxLd&_nc_ohc=ePcsvZogJoAQ7kNvwEVzlhl&_nc_oc=AdpWKctSlKLaQXaNMtI69GflKvs90VEScK2Lhtq5R_MnSYYeiWV5IMur0Q9NmVEbPg_bi3BH4HTdlyPVdJOScC5W&_nc_zt=23&_nc_ht=scontent.fcmb11-3.fna&_nc_gid=68lJLyeg1zjH6-nQmOewhw&_nc_ss=7a3a8&oh=00_Af0nJAdYAQSn3ImzrIixDaxHJ6Z4DaBJ9gl2s9CiBsyTOw&oe=69DAECAB',
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
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedDB();
