const Job = require("../models/Job");
const JobSubmission = require("../models/JobSubmission");

const sampleJobs = [
  { title: "Frontend Developer Intern", category: "IT", location: "Remote", description: "Build responsive interfaces using React and CSS.", salaryStipend: "LKR 35,000/mo", skills: ["React", "TypeScript", "CSS"], experienceLevel: "Entry Level", applicationDeadline: "2026-04-10" },
  { title: "Backend Engineer", category: "IT", location: "Colombo", description: "Develop APIs and integrate databases for production systems.", salaryStipend: "LKR 180,000/mo", skills: ["Node.js", "Express", "MongoDB"], experienceLevel: "Mid Level", applicationDeadline: "2026-04-22" },
  { title: "QA Automation Engineer", category: "IT", location: "Kandy", description: "Automate regression testing and improve release quality.", salaryStipend: "LKR 115,000/mo", skills: ["Selenium", "Jest", "API Testing"], experienceLevel: "Entry Level", applicationDeadline: "2026-04-18" },
  { title: "Cloud Support Intern", category: "IT", location: "Hybrid", description: "Assist in cloud operations and platform monitoring.", salaryStipend: "LKR 28,000/mo", skills: ["AWS", "Linux", "Troubleshooting"], experienceLevel: "No Experience", applicationDeadline: "2026-04-12" },
  { title: "Social Media Coordinator", category: "Marketing", location: "Remote", description: "Plan campaigns and manage social channels.", salaryStipend: "LKR 85,000/mo", skills: ["Content Writing", "SEO", "Analytics"], experienceLevel: "Entry Level", applicationDeadline: "2026-04-16" },
  { title: "Brand Strategist", category: "Marketing", location: "Colombo", description: "Shape brand messaging across digital campaigns.", salaryStipend: "LKR 140,000/mo", skills: ["Branding", "Campaign Planning", "Copywriting"], experienceLevel: "Mid Level", applicationDeadline: "2026-04-25" },
  { title: "Digital Marketing Intern", category: "Marketing", location: "Remote", description: "Support paid campaigns and social content creation.", salaryStipend: "LKR 30,000/mo", skills: ["Meta Ads", "Canva", "SEO"], experienceLevel: "No Experience", applicationDeadline: "2026-04-09" },
  { title: "Growth Marketing Analyst", category: "Marketing", location: "Hybrid", description: "Analyze campaign performance and optimize funnels.", salaryStipend: "LKR 125,000/mo", skills: ["Google Analytics", "Excel", "A/B Testing"], experienceLevel: "Mid Level", applicationDeadline: "2026-04-20" },
  { title: "Finance Analyst", category: "Finance", location: "Colombo", description: "Prepare reports and support financial planning.", salaryStipend: "LKR 120,000/mo", skills: ["Excel", "Financial Modeling", "Reporting"], experienceLevel: "Entry Level", applicationDeadline: "2026-04-15" },
  { title: "Accounts Assistant", category: "Finance", location: "Kandy", description: "Handle reconciliations and daily accounting tasks.", salaryStipend: "LKR 95,000/mo", skills: ["Accounting", "ERP", "Excel"], experienceLevel: "Entry Level", applicationDeadline: "2026-04-14" },
  { title: "Investment Associate", category: "Finance", location: "Colombo", description: "Analyze portfolio performance and market opportunities.", salaryStipend: "LKR 160,000/mo", skills: ["Research", "Excel", "Risk Analysis"], experienceLevel: "Mid Level", applicationDeadline: "2026-04-24" },
  { title: "Finance Intern", category: "Finance", location: "Remote", description: "Support budgeting and invoice processing tasks.", salaryStipend: "LKR 32,000/mo", skills: ["Accounting", "Data Entry", "Excel"], experienceLevel: "No Experience", applicationDeadline: "2026-04-11" },
  { title: "UI/UX Design Intern", category: "Design", location: "Hybrid", description: "Create wireframes and prototypes for mobile-first products.", salaryStipend: "LKR 25,000/mo", skills: ["Figma", "Wireframing", "Prototyping"], experienceLevel: "No Experience", applicationDeadline: "2026-04-08" },
  { title: "Product Designer", category: "Design", location: "Remote", description: "Design clean product flows and improve user experiences.", salaryStipend: "LKR 155,000/mo", skills: ["UX Research", "Figma", "Design Systems"], experienceLevel: "Mid Level", applicationDeadline: "2026-04-23" },
  { title: "Graphic Design Intern", category: "Design", location: "Colombo", description: "Create visual assets for digital and print campaigns.", salaryStipend: "LKR 27,000/mo", skills: ["Illustrator", "Photoshop", "Typography"], experienceLevel: "No Experience", applicationDeadline: "2026-04-13" },
  { title: "Motion Designer", category: "Design", location: "Hybrid", description: "Produce animated visuals for marketing and product teams.", salaryStipend: "LKR 145,000/mo", skills: ["After Effects", "Animation", "Branding"], experienceLevel: "Mid Level", applicationDeadline: "2026-04-26" },
  { title: "DevOps Engineer", category: "Engineering", location: "Colombo", description: "Maintain CI/CD pipelines and cloud deployments.", salaryStipend: "LKR 190,000/mo", skills: ["Docker", "Kubernetes", "AWS"], experienceLevel: "Mid Level", applicationDeadline: "2026-04-21" },
  { title: "Machine Learning Engineer", category: "Engineering", location: "Remote", description: "Build models and productionize ML systems.", salaryStipend: "LKR 200,000/mo", skills: ["Python", "TensorFlow", "MLOps"], experienceLevel: "Mid Level", applicationDeadline: "2026-04-27" },
  { title: "Software Engineering Intern", category: "Engineering", location: "Hybrid", description: "Support feature development and code reviews.", salaryStipend: "LKR 34,000/mo", skills: ["JavaScript", "Git", "REST APIs"], experienceLevel: "Entry Level", applicationDeadline: "2026-04-17" },
  { title: "Data Platform Engineer", category: "Engineering", location: "Kandy", description: "Build scalable data pipelines and warehousing solutions.", salaryStipend: "LKR 175,000/mo", skills: ["SQL", "Airflow", "Spark"], experienceLevel: "Mid Level", applicationDeadline: "2026-04-29" },
];

const sampleSubmissions = [
  { title: "Frontend Developer Intern", firstName: "Nimal", lastName: "Perera", university: "University of Moratuwa", coverLetter: "I am passionate about frontend engineering and eager to contribute to your product team with strong React fundamentals and communication skills.", studentEmail: "nimal.perera@example.com", phone: "0771234567", year: 3, resumeFile: "/uploads/seed-resume-1.pdf", appliedDate: "2026-03-22T09:00:00.000Z" },
  { title: "Backend Engineer", firstName: "Ayesha", lastName: "Khan", university: "University of Colombo", coverLetter: "I enjoy building reliable APIs and have practical experience with Node.js and MongoDB projects through internships and university coursework.", studentEmail: "ayesha.khan@example.com", phone: "0771234568", year: 4, resumeFile: "/uploads/seed-resume-2.pdf", appliedDate: "2026-03-24T11:15:00.000Z" },
  { title: "UI/UX Design Intern", firstName: "Sachini", lastName: "Silva", university: "SLIIT", coverLetter: "Designing user-centered interfaces is my focus, and I can contribute with Figma prototyping, usability testing, and visual communication skills.", studentEmail: "sachini.silva@example.com", phone: "0771234569", year: 2, resumeFile: "/uploads/seed-resume-3.pdf", appliedDate: "2026-03-27T13:10:00.000Z" },
  { title: "Finance Analyst", firstName: "Tharindu", lastName: "Fernando", university: "University of Sri Jayewardenepura", coverLetter: "I have a strong analytical background in finance and would like to support your team with modeling, reporting, and attention to detail.", studentEmail: "tharindu.fernando@example.com", phone: "0771234570", year: 4, resumeFile: "/uploads/seed-resume-4.pdf", appliedDate: "2026-03-30T10:30:00.000Z" },
  { title: "Motion Designer", firstName: "Piumi", lastName: "Jayasena", university: "NSBM", coverLetter: "I am excited to apply my motion design experience in branding and animation to create engaging visual stories for your campaigns.", studentEmail: "piumi.jayasena@example.com", phone: "0771234571", year: 3, resumeFile: "/uploads/seed-resume-5.pdf", appliedDate: "2026-04-01T08:45:00.000Z" },
  { title: "DevOps Engineer", firstName: "Kasun", lastName: "Bandara", university: "Informatics Institute of Technology", coverLetter: "Automation and platform reliability are my strengths, and I am ready to contribute through CI/CD and cloud infrastructure practices.", studentEmail: "kasun.bandara@example.com", phone: "0771234572", year: 4, resumeFile: "/uploads/seed-resume-6.pdf", appliedDate: "2026-04-02T14:05:00.000Z" },
  { title: "Digital Marketing Intern", firstName: "Madhavi", lastName: "Abeysekara", university: "University of Kelaniya", coverLetter: "I can support campaign execution with research-backed content and social media analytics while continuously learning from your team.", studentEmail: "madhavi.abeysekara@example.com", phone: "0771234573", year: 2, resumeFile: "/uploads/seed-resume-7.pdf", appliedDate: "2026-04-03T10:10:00.000Z" },
  { title: "Data Platform Engineer", firstName: "Yasiru", lastName: "Dissanayake", university: "University of Peradeniya", coverLetter: "I have hands-on experience in data engineering pipelines and would like to help optimize scalable data platform workflows.", studentEmail: "yasiru.dissanayake@example.com", phone: "0771234574", year: 4, resumeFile: "/uploads/seed-resume-8.pdf", appliedDate: "2026-04-04T12:30:00.000Z" },
  { title: "Brand Strategist", firstName: "Anjali", lastName: "Peris", university: "APIIT", coverLetter: "My interest is in crafting cohesive brand narratives and translating market insights into strategic communication plans for growth.", studentEmail: "anjali.peris@example.com", phone: "0771234575", year: 3, resumeFile: "/uploads/seed-resume-9.pdf", appliedDate: "2026-04-05T09:15:00.000Z" },
  { title: "Graphic Design Intern", firstName: "Pasindu", lastName: "Ranaweera", university: "University of the Visual and Performing Arts", coverLetter: "I bring strong visual design fundamentals and am eager to collaborate on impactful digital and print assets for your team.", studentEmail: "pasindu.ranaweera@example.com", phone: "0771234576", year: 2, resumeFile: "/uploads/seed-resume-10.pdf", appliedDate: "2026-04-05T13:45:00.000Z" },
];

function deriveOpportunityType(title) {
  return /intern/i.test(title) ? "Internship" : "Full-time";
}

function deriveDepartment(category) {
  if (category === "IT") return "Technology";
  if (category === "Marketing") return "Marketing";
  if (category === "Finance") return "Finance";
  if (category === "Design") return "Design";
  return "Engineering";
}

function deriveWorkMode(location) {
  if (String(location).toLowerCase() === "remote") return "Remote";
  if (String(location).toLowerCase() === "hybrid") return "Hybrid";
  return "On-site";
}

function buildJobSeedRecords() {
  const applicantCounts = new Map();
  sampleSubmissions.forEach((submission) => {
    applicantCounts.set(submission.title, (applicantCounts.get(submission.title) || 0) + 1);
  });

  const buildStartAt = (dateString, hours = 9, minutes = 0) => {
    const date = new Date(`${dateString}T00:00:00.000Z`);
    date.setUTCHours(hours, minutes, 0, 0);
    return date.toISOString();
  };

  const buildExpiresAt = (dateString, hours = 23, minutes = 59) => {
    const date = new Date(`${dateString}T00:00:00.000Z`);
    date.setUTCHours(hours, minutes, 59, 999);
    return date.toISOString();
  };

  return sampleJobs.map((job) => ({
    ...job,
    opportunityType: deriveOpportunityType(job.title),
    department: deriveDepartment(job.category),
    requiredSkills: job.skills,
    workMode: deriveWorkMode(job.location),
    minEducation: "Bachelor's Degree (Ongoing)",
    eligibleYear: "Any Year",
    minGPA: "",
    fieldOfStudy: "Relevant Field",
    eligibleCategories: ["Undergraduates", "Recent Graduates"],
    startAt: buildStartAt(job.applicationDeadline <= "2026-04-12" ? "2026-04-05" : job.applicationDeadline),
    expiresAt: buildExpiresAt(job.applicationDeadline),
    startDate: buildStartAt(job.applicationDeadline <= "2026-04-12" ? "2026-04-05" : job.applicationDeadline),
    applicationDeadline: buildExpiresAt(job.applicationDeadline),
    salary: job.salaryStipend,
    applicants: applicantCounts.get(job.title) || 0,
  }));
}

async function seedDatabase() {
  const seededJobs = buildJobSeedRecords();

  const upsertedJobs = [];
  for (const job of seededJobs) {
    const savedJob = await Job.findOneAndUpdate(
      { title: job.title },
      { $set: job },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );
    upsertedJobs.push(savedJob);
  }

  const jobByTitle = new Map(upsertedJobs.map((job) => [job.title, job]));

  for (const sampleSubmission of sampleSubmissions) {
    const job = jobByTitle.get(sampleSubmission.title);

    if (!job) {
      continue;
    }

    await JobSubmission.findOneAndUpdate(
      { jobId: job._id, studentEmail: sampleSubmission.studentEmail },
      {
        $set: {
          jobId: job._id,
          firstName: sampleSubmission.firstName,
          lastName: sampleSubmission.lastName,
          university: sampleSubmission.university,
          coverLetter: sampleSubmission.coverLetter,
          studentEmail: sampleSubmission.studentEmail,
          phone: sampleSubmission.phone,
          year: sampleSubmission.year,
          resumeFile: sampleSubmission.resumeFile,
          appliedDate: sampleSubmission.appliedDate,
        },
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );
  }

  const applicantCounts = new Map();
  for (const sampleSubmission of sampleSubmissions) {
    applicantCounts.set(sampleSubmission.title, (applicantCounts.get(sampleSubmission.title) || 0) + 1);
  }

  for (const job of upsertedJobs) {
    await Job.findByIdAndUpdate(job._id, {
      applicants: applicantCounts.get(job.title) || 0,
    });
  }
}

module.exports = seedDatabase;
