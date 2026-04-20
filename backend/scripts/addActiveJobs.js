const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from one level up
dotenv.config({ path: path.join(__dirname, '../.env') });

const Job = require('../models/Job');

const newJobs = [
    {
        title: "Senior Python Developer",
        opportunityType: "Full-time",
        category: "IT",
        department: "Engineering",
        location: "Remote",
        description: "We are looking for a Senior Python Developer to build scalable backend services and data pipelines. Experience with Django/FastAPI and PostgreSQL is required.",
        requiredSkills: ["Python", "Django", "PostgreSQL", "REST API"],
        salaryStipend: "LKR 250,000 - 350,000",
        experienceLevel: "Senior",
        workMode: "Remote",
        minEducation: "Bachelor's Degree",
        eligibleYear: "Graduates",
        startAt: new Date(),
        expiresAt: new Date("2026-05-30")
    },
    {
        title: "React Frontend Engineer",
        opportunityType: "Full-time",
        category: "IT",
        department: "Product",
        location: "Colombo",
        description: "Join our frontend team to build beautiful and performant user interfaces using React, Redux, and Tailwind CSS. Focus on user experience and accessibility.",
        requiredSkills: ["React", "JavaScript", "Tailwind CSS", "Redux"],
        salaryStipend: "LKR 180,000 - 280,000",
        experienceLevel: "Mid-Level",
        workMode: "Hybrid",
        minEducation: "Bachelor's Degree",
        eligibleYear: "Graduates",
        startAt: new Date(),
        expiresAt: new Date("2026-05-25")
    },
    {
        title: "Node.js Backend Developer",
        opportunityType: "Full-time",
        category: "IT",
        department: "Platform",
        location: "Kandy",
        description: "Build efficient and scalable backend systems using Node.js and Express. Experience with MongoDB and Microservices architecture is a plus.",
        requiredSkills: ["Node.js", "Express", "MongoDB", "JavaScript"],
        salaryStipend: "LKR 150,000 - 250,000",
        experienceLevel: "Junior/Mid",
        workMode: "On-site",
        minEducation: "Bachelor's Degree",
        eligibleYear: "3rd/4th Year",
        startAt: new Date(),
        expiresAt: new Date("2026-05-20")
    },
    {
        title: "Junior Java Developer",
        opportunityType: "Full-time",
        category: "IT",
        department: "Enterprise Solutions",
        location: "Colombo",
        description: "Great opportunity for early career developers to work on enterprise Java applications using Spring Boot and Hibernate.",
        requiredSkills: ["Java", "Spring Boot", "SQL", "Hibernate"],
        salaryStipend: "LKR 100,000 - 150,000",
        experienceLevel: "Junior",
        workMode: "On-site",
        minEducation: "Bachelor's Degree",
        eligibleYear: "Graduates",
        startAt: new Date(),
        expiresAt: new Date("2026-06-15")
    },
    {
        title: "Data Science Intern",
        opportunityType: "Internship",
        category: "IT",
        department: "Data Science",
        location: "Remote",
        description: "Help us build machine learning models and analyze data to improve our platform. Proficiency in Python and familiarity with Pandas/Scikit-learn is required.",
        requiredSkills: ["Python", "Pandas", "Machine Learning", "Data Analysis"],
        salaryStipend: "LKR 40,000",
        experienceLevel: "Intern",
        workMode: "Remote",
        minEducation: "Undergraduate",
        eligibleYear: "2nd/3rd Year",
        startAt: new Date(),
        expiresAt: new Date("2026-05-15")
    },
    {
        title: "UI/UX Designer",
        opportunityType: "Full-time",
        category: "Design",
        department: "UX Design",
        location: "Hybrid",
        description: "Design intuitive and engaging user experiences for our web and mobile platforms. Strong portfolio in Figma and user research is a must.",
        requiredSkills: ["Figma", "UI/UX", "Prototyping", "Adobe XD"],
        salaryStipend: "LKR 170,000 - 240,000",
        experienceLevel: "Mid-Level",
        workMode: "Hybrid",
        minEducation: "Degree in Design or related",
        eligibleYear: "Graduates",
        startAt: new Date(),
        expiresAt: new Date("2026-06-10")
    },
    {
        title: "Software Engineer (Full Stack)",
        opportunityType: "Full-time",
        category: "IT",
        department: "Core Engineering",
        location: "Colombo",
        description: "Flexible role for a developer who enjoys both backend and frontend. Stack: MERN (MongoDB, Express, React, Node.js).",
        requiredSkills: ["React", "Node.js", "MongoDB", "JavaScript"],
        salaryStipend: "LKR 200,000 - 300,000",
        experienceLevel: "Mid-Level",
        workMode: "Hybrid",
        minEducation: "Bachelor's Degree",
        eligibleYear: "Graduates",
        startAt: new Date(),
        expiresAt: new Date("2026-06-05")
    }
];

const addJobs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
        console.log("Connected to MongoDB for job seeding...");

        for (const jobData of newJobs) {
            await Job.findOneAndUpdate(
                { title: jobData.title },
                { $set: jobData },
                { upsert: true, new: true }
            );
            console.log(`- Upserted: ${jobData.title}`);
        }

        console.log("Job seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding jobs:", error.message);
        process.exit(1);
    }
};

addJobs();
