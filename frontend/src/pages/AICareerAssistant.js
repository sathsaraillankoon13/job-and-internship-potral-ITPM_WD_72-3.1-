import React, { useEffect, useRef, useState } from 'react';
import {
  Send,
  Bot,
  User,
  FileText,
  Briefcase,
  Sparkles,
  RotateCcw,
  Download,
} from 'lucide-react';
import '../styles/AICareerAssistant.css';
import { buildResumePdfBlob } from './aiAssistantResumePdf';

const CAREER_ROADMAPS = [
  {
    title: 'Full Stack Developer',
    demand: 'High',
    aliases: ['full stack', 'fullstack', 'software developer', 'software engineer', 'web developer'],
    overview:
      'Good fit if you want to build complete products across frontend, backend, APIs, and databases.',
    skills: [
      'HTML and CSS',
      'JavaScript or TypeScript',
      'React',
      'Node.js and Express',
      'REST APIs',
      'SQL and NoSQL databases',
      'Git and GitHub',
      'Testing and debugging',
    ],
    education: [
      'Best path: Software Engineering, Computer Science, or Information Technology degree.',
      'Alternative path: diploma or bootcamp plus strong project portfolio.',
      'Learn core fundamentals: data structures, OOP, DBMS, networking, and system design basics.',
    ],
    starterRoles: ['Frontend Developer Intern', 'Backend Intern', 'Junior Full Stack Developer'],
    certifications: ['AWS Cloud Practitioner', 'Postman API Fundamentals', 'Meta Front-End coursework'],
    projects: [
      'Build a job portal with authentication, dashboards, and admin tools.',
      'Create an e-commerce app with payments, orders, and analytics.',
      'Deploy a full stack app with CI/CD and cloud hosting.',
    ],
    futureDemand: [
      'Companies still need engineers who can ship features end to end.',
      'Demand is stronger for developers who can work with cloud and deployment workflows.',
      'AI tools increase productivity, but teams still need strong engineering judgment and debugging ability.',
    ],
    advice: [
      'Focus on deployed portfolio projects, not only tutorial code.',
      'Learn how to explain architecture and API decisions clearly.',
      'Show proof of impact: performance, users, features shipped, or bugs solved.',
    ],
    relatedRoles: ['Frontend Developer', 'Backend Developer', 'Product Engineer'],
  },
  {
    title: 'Data Analyst',
    demand: 'High',
    aliases: ['data analyst', 'analytics', 'business analyst', 'bi analyst', 'data analytics'],
    overview:
      'Good fit if you enjoy turning raw data into business insight, dashboards, and decision support.',
    skills: [
      'Excel and spreadsheets',
      'SQL',
      'Python',
      'Power BI or Tableau',
      'Data cleaning',
      'Statistics',
      'Data storytelling',
      'Business communication',
    ],
    education: [
      'Best path: Data Science, Statistics, Computer Science, IT, Business Analytics, or Economics.',
      'Learn descriptive statistics, probability, data visualization, and database fundamentals.',
      'Strengthen communication because analysts must explain insights to non-technical stakeholders.',
    ],
    starterRoles: ['Junior Data Analyst', 'Reporting Analyst', 'Business Intelligence Analyst'],
    certifications: ['Google Data Analytics', 'Microsoft Power BI Data Analyst', 'SQL certification coursework'],
    projects: [
      'Build a sales or HR dashboard with KPI tracking.',
      'Analyze a public dataset and present insights with visuals and recommendations.',
      'Create an ETL-style mini pipeline and document the cleaning process.',
    ],
    futureDemand: [
      'Organizations continue investing in dashboards, forecasting, and performance tracking.',
      'Demand is strongest when analytics skills are combined with domain knowledge and storytelling.',
      'Automation handles repetitive reporting, so interpretation and business thinking are more valuable.',
    ],
    advice: [
      'Show portfolio work with charts, dashboards, and business conclusions.',
      'Practice turning raw findings into short executive summaries.',
      'Learn enough SQL and Python to move beyond spreadsheet-only work.',
    ],
    relatedRoles: ['Business Analyst', 'BI Analyst', 'Product Analyst'],
  },
  {
    title: 'Cloud Engineer',
    demand: 'High',
    aliases: ['cloud engineer', 'cloud architect', 'cloud', 'aws engineer', 'azure engineer'],
    overview:
      'Good fit if you want to design, deploy, secure, and scale cloud infrastructure and services.',
    skills: [
      'AWS, Azure, or Google Cloud',
      'Linux',
      'Networking fundamentals',
      'Docker',
      'Infrastructure as Code',
      'Terraform',
      'Monitoring and logging',
      'Cloud security basics',
    ],
    education: [
      'Best path: IT, Computer Science, Software Engineering, or Networking.',
      'Learn operating systems, networking, security, and distributed systems basics.',
      'Hands-on cloud labs matter as much as formal education for entry roles.',
    ],
    starterRoles: ['Cloud Support Associate', 'Junior Cloud Engineer', 'Infrastructure Engineer'],
    certifications: ['AWS Cloud Practitioner', 'AWS Solutions Architect Associate', 'Microsoft Azure Fundamentals'],
    projects: [
      'Deploy a multi-tier app to the cloud with autoscaling and monitoring.',
      'Build Infrastructure as Code templates for repeatable environments.',
      'Set up secure cloud storage, IAM roles, alerts, and dashboards.',
    ],
    futureDemand: [
      'Cloud adoption remains strong across startups, enterprise teams, and AI platforms.',
      'Demand rises further when combined with automation, cost control, and security knowledge.',
      'Hybrid cloud and platform engineering skills are becoming more valuable.',
    ],
    advice: [
      'Use one main cloud provider first, then expand later.',
      'Learn cost optimization and security, not only deployment steps.',
      'Document your architecture diagrams and deployment decisions in portfolio projects.',
    ],
    relatedRoles: ['Site Reliability Engineer', 'Platform Engineer', 'DevOps Engineer'],
  },
  {
    title: 'DevOps Engineer',
    demand: 'High',
    aliases: ['devops', 'devops engineer', 'site reliability', 'sre', 'platform engineer'],
    overview:
      'Good fit if you like automation, CI/CD, infrastructure, reliability, and improving delivery speed.',
    skills: [
      'Linux',
      'Git and GitHub',
      'CI/CD pipelines',
      'Docker',
      'Kubernetes basics',
      'Terraform',
      'Monitoring and alerting',
      'Scripting with Bash or Python',
    ],
    education: [
      'Best path: Software Engineering, IT, Computer Science, or Networking.',
      'Understand software delivery, cloud infrastructure, version control, and operating systems.',
      'Learn reliability concepts such as SLAs, logging, observability, and incident response.',
    ],
    starterRoles: ['DevOps Intern', 'Build and Release Engineer', 'Cloud Operations Engineer'],
    certifications: ['AWS Developer or SysOps track', 'Docker and Kubernetes coursework', 'Terraform Associate'],
    projects: [
      'Create a CI/CD pipeline for testing, building, and deploying an app.',
      'Containerize a full stack project and deploy it with automated rollout.',
      'Build monitoring dashboards and alerts for uptime and performance.',
    ],
    futureDemand: [
      'Companies want faster release cycles with stable and observable systems.',
      'Demand is strong where cloud, automation, and security practices overlap.',
      'Platform and internal developer tooling roles are growing.',
    ],
    advice: [
      'Learn the full delivery lifecycle, not only deployment commands.',
      'Understand why reliability and rollback strategy matter.',
      'Show pipelines, logs, dashboards, and automation in your portfolio.',
    ],
    relatedRoles: ['Cloud Engineer', 'SRE', 'Platform Engineer'],
  },
  {
    title: 'UX Designer',
    demand: 'Medium to High',
    aliases: ['ux designer', 'ui designer', 'ui ux', 'product designer', 'designer'],
    overview:
      'Good fit if you enjoy research, problem solving, interface design, and improving user experience.',
    skills: [
      'Figma',
      'Wireframing',
      'Prototyping',
      'User research',
      'Information architecture',
      'Accessibility',
      'Visual hierarchy',
      'Design communication',
    ],
    education: [
      'Best path: UX Design, HCI, Graphic Design, IT, or Multimedia related degree.',
      'Build strong fundamentals in user research, usability testing, interaction design, and accessibility.',
      'A strong case-study portfolio is often more important than degree title alone.',
    ],
    starterRoles: ['UX Intern', 'UI Designer', 'Product Design Intern'],
    certifications: ['Google UX Design', 'Figma design systems coursework', 'Accessibility fundamentals'],
    projects: [
      'Redesign a broken user flow and justify each improvement with research.',
      'Build a mobile app case study from persona to prototype.',
      'Run a usability test and document findings with before/after improvements.',
    ],
    futureDemand: [
      'Digital products still need designers who can reduce friction and improve conversion.',
      'Demand is stronger for designers who combine UX thinking with product and business understanding.',
      'Accessibility and cross-device design continue to grow in importance.',
    ],
    advice: [
      'Build case studies that explain your thinking, not just final screens.',
      'Learn to defend design decisions with user evidence.',
      'Pair design work with basic frontend knowledge to improve collaboration.',
    ],
    relatedRoles: ['Product Designer', 'UI Designer', 'Interaction Designer'],
  },
  {
    title: 'Cybersecurity Analyst',
    demand: 'High',
    aliases: ['cybersecurity', 'security analyst', 'soc analyst', 'cyber security', 'infosec'],
    overview:
      'Good fit if you want to protect systems, investigate threats, and improve security posture.',
    skills: [
      'Networking',
      'Operating systems',
      'Security fundamentals',
      'Threat detection',
      'SIEM basics',
      'Incident response',
      'Vulnerability assessment',
      'Security documentation',
    ],
    education: [
      'Best path: Cybersecurity, IT, Networking, or Computer Science.',
      'Learn networking, authentication, encryption, risk management, and security operations basics.',
      'Lab work and hands-on practice are critical for employability.',
    ],
    starterRoles: ['SOC Analyst', 'Information Security Analyst', 'Security Operations Intern'],
    certifications: ['CompTIA Security+', 'Google Cybersecurity Certificate', 'ISC2 Certified in Cybersecurity'],
    projects: [
      'Build a home lab for log analysis and security monitoring.',
      'Document a vulnerability assessment and remediation plan.',
      'Create incident response playbooks for common attack scenarios.',
    ],
    futureDemand: [
      'Security demand remains strong because every digital business needs protection and compliance.',
      'Cloud security, IAM, and detection engineering are growing faster than basic monitoring alone.',
      'Threat analysis plus automation will be a strong combination going forward.',
    ],
    advice: [
      'Build hands-on labs instead of relying only on theory.',
      'Learn to write clear incident reports and remediation summaries.',
      'Combine security knowledge with cloud or scripting skills for stronger demand.',
    ],
    relatedRoles: ['SOC Engineer', 'Cloud Security Analyst', 'Security Engineer'],
  },
];

const CAREER_SUGGESTIONS = CAREER_ROADMAPS.map((roadmap) => roadmap.title);

const RESUME_STEPS = [
  {
    key: 'fullName',
    prompt: "What is your full name exactly as it should appear on the CV?",
  },
  {
    key: 'headline',
    prompt:
      'What professional headline fits you best? Example: Final Year Software Engineering Student | Full Stack Developer.',
  },
  {
    key: 'contact',
    prompt:
      'Share your contact line in one message. Include email, phone, city, LinkedIn, and portfolio if available.',
  },
  {
    key: 'summary',
    prompt:
      'Write a short professional summary in 2-4 sentences. Focus on your strengths, experience level, and career direction.',
  },
  {
    key: 'education',
    prompt:
      'List your education. Use one line per entry in this format: Degree | Institute | Year or Duration | Extra detail.',
  },
  {
    key: 'experience',
    prompt:
      'List experience, internships, leadership, freelance, or volunteer work. Use one line per entry: Role | Organization | Dates | Impact.',
  },
  {
    key: 'projects',
    prompt:
      'List your strongest projects. Use one line per entry: Project | Tech stack | Result or value delivered.',
  },
  {
    key: 'skills',
    prompt:
      'List your core skills separated by commas. Include technical skills first, then relevant soft skills.',
  },
  {
    key: 'certifications',
    prompt:
      'Add certifications, awards, or achievements. Use one line per entry as Title | Issuer | Year. If none, type "none".',
  },
];

const INITIAL_FLOW_STATE = { mode: null, step: 0, resumeData: {} };
const INITIAL_BOT_MESSAGE =
  "Hi! I'm your AI Career Assistant.\n\nI can help you build a resume or give career advice.\n\nWhat would you like to do?";

const now = () =>
  new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

const normalizeWhitespace = (value = '') => value.replace(/\s+/g, ' ').trim();

const splitMultiline = (value = '') =>
  value
    .split(/\r?\n/)
    .map((item) => normalizeWhitespace(item))
    .filter(Boolean);

const parseStructuredEntries = (value = '', noneAllowed = false) => {
  const lines = splitMultiline(value);

  if (noneAllowed && lines.length === 1 && /^none$/i.test(lines[0])) {
    return [];
  }

  return lines
    .map((line) => {
      const parts = line
        .split('|')
        .map((part) => normalizeWhitespace(part))
        .filter(Boolean);

      if (parts.length === 0) {
        return null;
      }

      if (parts.length === 1) {
        return {
          title: parts[0],
          subtitle: '',
          meta: '',
          detail: '',
        };
      }

      if (parts.length === 2) {
        return {
          title: parts[0],
          subtitle: parts[1],
          meta: '',
          detail: '',
        };
      }

      if (parts.length === 3) {
        return {
          title: parts[0],
          subtitle: parts[1],
          meta: parts[2],
          detail: '',
        };
      }

      return {
        title: parts[0],
        subtitle: parts[1],
        meta: parts[2],
        detail: parts.slice(3).join(' | '),
      };
    })
    .filter(Boolean);
};

const parseSkills = (value = '') =>
  value
    .split(/,|\r?\n/)
    .map((skill) => normalizeWhitespace(skill))
    .filter(Boolean);

const ensureSentence = (value = '') => {
  const trimmed = normalizeWhitespace(value);
  if (!trimmed) return '';
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
};

const buildProfessionalSummary = ({ summary, headline, skills, experience, projects }) => {
  const cleanedSummary = normalizeWhitespace(summary);

  if (cleanedSummary) {
    return ensureSentence(cleanedSummary);
  }

  const intro = headline
    ? `${headline} with a strong focus on delivering practical, high-quality work.`
    : 'Professionally driven candidate with a strong focus on delivering practical, high-quality work.';

  const strengths = skills.length
    ? `Core strengths include ${skills.slice(0, 6).join(', ')}.`
    : '';

  const evidence = experience.length
    ? 'Brings experience across projects, internships, or leadership responsibilities.'
    : projects.length
      ? 'Backed by hands-on academic and personal projects with measurable outcomes.'
      : '';

  return [intro, strengths, evidence].filter(Boolean).join(' ');
};

const buildProfessionalResumeData = (rawData) => {
  const skills = parseSkills(rawData.skills);
  const experience = parseStructuredEntries(rawData.experience);
  const projects = parseStructuredEntries(rawData.projects);
  const education = parseStructuredEntries(rawData.education);
  const certifications = parseStructuredEntries(rawData.certifications, true);

  return {
    fullName: normalizeWhitespace(rawData.fullName) || 'Candidate Name',
    headline:
      normalizeWhitespace(rawData.headline) ||
      'Emerging professional ready for internship and job opportunities',
    contactLine: normalizeWhitespace(rawData.contact),
    summary: buildProfessionalSummary({
      summary: rawData.summary,
      headline: rawData.headline,
      skills,
      experience,
      projects,
    }),
    education,
    experience,
    projects,
    skills,
    certifications,
  };
};

const getCareerRoadmapFromText = (text = '') => {
  const normalizedText = normalizeWhitespace(text).toLowerCase();

  if (!normalizedText) {
    return null;
  }

  return (
    CAREER_ROADMAPS.find((roadmap) =>
      roadmap.aliases.some((alias) => normalizedText.includes(alias))
    ) || null
  );
};

const toTitleCase = (value = '') =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

const extractCareerTarget = (text = '') => {
  const cleaned = normalizeWhitespace(text)
    .replace(
      /^(i\s*want\s*to\s*be(?:come)?|i\s*want\s*to\s*work\s*as|i\s*am\s*interested\s*in|how\s*to\s*become|how\s*can\s*i\s*become|roadmap\s*for|career\s*advice\s*for|job\s*role\s*as|target\s*role\s*is|become|role\s*[:\-]?)/i,
      ''
    )
    .replace(/[^a-zA-Z0-9+#/\-\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned;
};

const isValidCareerTarget = (value = '') => {
  const role = normalizeWhitespace(value);
  if (!role) return false;
  if (!/[a-zA-Z]/.test(role)) return false;

  const words = role.split(/\s+/).filter(Boolean);
  if (words.length > 6) return false;

  const allowedShortWords = new Set(['ui', 'ux', 'qa', 'hr', 'it', 'ai', 'ml', 'bi']);
  const meaningfulWords = words.filter(
    (word) => word.length > 1 || allowedShortWords.has(word.toLowerCase())
  );

  if (meaningfulWords.length === 0) return false;
  if (/^(.)\1+$/i.test(role.replace(/\s+/g, ''))) return false;

  return true;
};

const buildGenericRoleProfile = (role = '') => {
  const normalized = role.toLowerCase();

  if (/(data|analyst|analytics|scientist)/.test(normalized)) {
    return {
      overview:
        'This role focuses on collecting, analyzing, and interpreting data to guide better business and product decisions.',
      hardSkills: ['SQL and data querying', 'Python or R for analysis', 'Dashboarding with Power BI or Tableau'],
      softSkills: ['Analytical thinking', 'Clear business communication'],
      certifications: ['Google Data Analytics', 'Microsoft Power BI Data Analyst', 'SQL certification track'],
      projects: ['Build an end-to-end analytics dashboard', 'Analyze a real dataset and publish insights with recommendations'],
      market: 'Demand remains strong across finance, e-commerce, healthcare, and product teams.',
      salary: 'Typical range: USD 45,000 - 110,000 depending on region and experience.',
      educationPath: 'Build foundations in statistics, SQL, and business analytics with practical dashboard work.',
      nextAdvice: ['Practice converting raw analysis into business recommendations.'],
      relatedRoles: ['Business Analyst', 'BI Analyst', 'Product Analyst'],
    };
  }

  if (/(cloud|devops|sre|platform)/.test(normalized)) {
    return {
      overview:
        'This role builds and maintains reliable cloud infrastructure, deployment pipelines, and scalable services.',
      hardSkills: ['Cloud platform expertise (AWS/Azure/GCP)', 'CI/CD and automation', 'Containerization and orchestration'],
      softSkills: ['Problem solving under pressure', 'Cross-team collaboration'],
      certifications: ['AWS Solutions Architect Associate', 'Azure Fundamentals', 'Terraform Associate'],
      projects: ['Deploy a production-ready cloud app', 'Build CI/CD pipeline with monitoring and rollback'],
      market: 'Demand is high as companies modernize infrastructure and improve release velocity.',
      salary: 'Typical range: USD 70,000 - 160,000 depending on region and experience.',
      educationPath: 'Develop strong cloud, networking, Linux, and automation fundamentals through hands-on labs.',
      nextAdvice: ['Learn one cloud provider deeply before branching into multi-cloud tooling.'],
      relatedRoles: ['Cloud Engineer', 'Platform Engineer', 'SRE'],
    };
  }

  if (/(design|ux|ui|product designer)/.test(normalized)) {
    return {
      overview:
        'This role improves user experience by combining research, interaction design, and visual communication.',
      hardSkills: ['Figma and prototyping', 'User research and usability testing', 'Information architecture and accessibility'],
      softSkills: ['Empathy for users', 'Presentation and storytelling'],
      certifications: ['Google UX Design', 'Interaction Design Foundation courses', 'Accessibility fundamentals'],
      projects: ['Create a full UX case study', 'Redesign a user flow with measurable usability improvement'],
      market: 'Demand is steady to strong in product-led companies and digital service teams.',
      salary: 'Typical range: USD 50,000 - 130,000 depending on region and experience.',
      educationPath: 'Learn user research, interaction design, and usability testing with real case studies.',
      nextAdvice: ['Show decision-making process and measurable UX outcomes in your portfolio.'],
      relatedRoles: ['Product Designer', 'UI Designer', 'Interaction Designer'],
    };
  }

  return {
    overview:
      'This role typically requires domain expertise, practical project experience, and strong communication of results and impact.',
    hardSkills: ['Role-specific technical tools', 'Problem-solving methodology', 'Workflow and productivity systems'],
    softSkills: ['Communication and teamwork', 'Adaptability and continuous learning'],
    certifications: ['One foundational certification in your domain', 'One intermediate certification aligned to job descriptions'],
    projects: ['Build 2-3 portfolio projects that mirror real job tasks', 'Document outcomes, metrics, and lessons learned'],
    market: 'Market demand depends on region and specialization, but practical skills and proof of work significantly improve opportunities.',
    salary: 'Typical range varies widely by country, experience, and industry; review current local listings for accurate numbers.',
    educationPath: `Follow a focused learning path combining core theory and practical ${role} applications.`,
    nextAdvice: ['Track progress weekly and build public proof of your skills through portfolio work.'],
    relatedRoles: [`Junior ${role}`, `${role} Specialist`, `${role} Associate`],
  };
};

const buildFallbackCareerRoadmap = (roleInput = '') => {
  const role = toTitleCase(roleInput);
  const profile = buildGenericRoleProfile(role);

  return {
    title: role,
    demand: profile.market.includes('high') || profile.market.includes('High') ? 'High' : 'Medium to High',
    aliases: [role.toLowerCase()],
    overview: profile.overview,
    skills: [...profile.hardSkills, ...profile.softSkills],
    education: [
      `Recommended path: ${profile.educationPath || `Build core foundations aligned with ${role} responsibilities.`}`,
      'Focus on practical experience through projects, labs, and role-relevant assignments.',
    ],
    starterRoles: [`Junior ${role}`, `${role} Intern`, `${role} Associate`],
    certifications: profile.certifications,
    projects: profile.projects,
    futureDemand: [profile.market, profile.salary],
    advice: profile.nextAdvice,
    relatedRoles: profile.relatedRoles,
  };
};

const buildCareerStructuredData = (roadmap) => ({
  roleName: roadmap.title,
  demandLevel: `${roadmap.demand} Demand`,
  skills: roadmap.skills,
  educationPath: roadmap.education.join(' '),
  certifications: roadmap.certifications,
  portfolioProjects: roadmap.projects,
  nextAdvice: roadmap.advice,
  relatedRoles: roadmap.relatedRoles,
});

const CAREER_TOPIC_SEQUENCE = [
  { key: 'overview', label: 'Role Overview' },
  { key: 'coreTechnicalSkills', label: 'Core Technical Skills' },
  { key: 'essentialSoftSkills', label: 'Essential Soft Skills' },
  { key: 'educationDegrees', label: 'Education/Degrees' },
  { key: 'alternativePaths', label: 'Alternative Paths (Bootcamps/Self-learning)' },
  { key: 'jobMarketDemand', label: 'Job Market Demand' },
  { key: 'salaryExpectations', label: 'Salary Expectations' },
  { key: 'topCompanies', label: 'Top Global/Local Companies' },
  { key: 'essentialCertifications', label: 'Essential Certifications' },
  { key: 'portfolioProjects', label: 'Portfolio Projects' },
  { key: 'interviewTips', label: 'Interview Tips' },
  { key: 'networkingLinkedIn', label: 'Networking/LinkedIn Advice' },
];

const isNextConfirmation = (text = '') =>
  /^(ok|okay|yes|yep|yeah|next|continue|go ahead|move on|sure)$/i.test(normalizeWhitespace(text));

const isSummaryRequest = (text = '') =>
  /(give me my summary|what have we discussed so far|summary so far)/i.test(text.toLowerCase());

const isDoneRequest = (text = '') =>
  /(i am done|show me the full roadmap|view full roadmap)/i.test(text.toLowerCase());

const buildTopicContent = (topicKey, roadmap, structuredData) => {
  switch (topicKey) {
    case 'overview':
      return `${structuredData.roleName} is a practical path with strong growth potential. We focus on real problem-solving impact, not just theory.`;
    case 'coreTechnicalSkills':
      return `Core technical skills start with ${structuredData.skills.slice(0, 3).join(', ')}. Recruiters expect to see these skills proven through projects.`;
    case 'essentialSoftSkills':
      return `Essential soft skills are communication, ownership, and adaptability. Teams trust candidates who explain decisions clearly and collaborate well.`;
    case 'educationDegrees':
      return `A degree helps, but outcomes matter most. ${structuredData.educationPath}`;
    case 'alternativePaths':
      return `Bootcamps and self-learning can absolutely work. The key is a portfolio that proves consistent, job-ready depth.`;
    case 'jobMarketDemand':
      return `${structuredData.roleName} currently shows ${structuredData.demandLevel.toLowerCase()} in many regions. Demand rises for candidates with hands-on delivery experience.`;
    case 'salaryExpectations':
      return `Salary depends on region, stack, and impact. Employers pay more when we show production-level projects and clear communication.`;
    case 'topCompanies':
      return `Top opportunities come from product firms, SaaS startups, consulting teams, and enterprise groups. We should target companies aligned with our strengths.`;
    case 'essentialCertifications':
      return `Useful certifications include ${structuredData.certifications.slice(0, 3).join(', ')}. Treat them as credibility boosters, not replacements for projects.`;
    case 'portfolioProjects':
      return `High-value projects include ${structuredData.portfolioProjects.slice(0, 2).join(' and ')}. Recruiters want proof we can solve real problems end-to-end.`;
    case 'interviewTips':
      return `For interviews, answer with structure, measurable impact, and trade-off thinking. STAR storytelling helps us sound confident and practical.`;
    default:
      return `Networking and LinkedIn are our visibility engine. A strong profile and meaningful outreach can unlock hidden opportunities quickly.`;
  }
};

const buildCuriosityGap = (topicIndex) => {
  const nextTopic = CAREER_TOPIC_SEQUENCE[topicIndex + 1];
  const altTopic = CAREER_TOPIC_SEQUENCE[Math.min(topicIndex + 2, CAREER_TOPIC_SEQUENCE.length - 1)];
  if (!nextTopic) return '';
  return `We've unpacked this piece, but should we dive into ${nextTopic.label} next, or jump to ${altTopic.label} first?`;
};

const buildSequentialTopicMessage = (roadmap, structuredData, topicIndex, isShortTransition = false) => {
  const topic = CAREER_TOPIC_SEQUENCE[topicIndex] || CAREER_TOPIC_SEQUENCE[0];
  const intro = isShortTransition
    ? `I'll move to the next part, but I'd love to hear your specific thoughts or worries about this! For now, let's look at ${topic.label}...`
    : '';
  const core = buildTopicContent(topic.key, roadmap, structuredData);

  if (topicIndex < CAREER_TOPIC_SEQUENCE.length - 1) {
    const curiosity = buildCuriosityGap(topicIndex);
    return [intro, core, curiosity].filter(Boolean).join(' ');
  }

  return `${core} Great! We've covered all the key aspects of this career. I've compiled everything we discussed into a beautiful Summary Roadmap for you below.`;
};

const buildSuggestions = (topicIndex) => {
  const upcoming = CAREER_TOPIC_SEQUENCE.slice(topicIndex + 1, topicIndex + 4);
  while (upcoming.length < 3) {
    upcoming.push(CAREER_TOPIC_SEQUENCE[(topicIndex + upcoming.length + 1) % CAREER_TOPIC_SEQUENCE.length]);
  }

  return upcoming.slice(0, 3).map((topic) => `Can we explore ${topic.label} next for this role?`);
};

const buildCareerJsonState = (structuredData, topicIndex, coveredTopics, mentorMessageCount, isFinalSummary) => ({
  ...structuredData,
  currentTopic: CAREER_TOPIC_SEQUENCE[Math.min(topicIndex, CAREER_TOPIC_SEQUENCE.length - 1)]?.label,
  coveredTopics,
  mentorMessageCount,
  isFinalSummary,
  suggestions: buildSuggestions(topicIndex),
});

const buildHiddenJsonBlock = (jsonState) =>
  `\`\`\`json\n${JSON.stringify(jsonState, null, 2)}\n\`\`\``;

const buildMentorCareerMessage = (
  content,
  roadmap,
  structuredData,
  topicIndex = 0,
  coveredTopics = [],
  mentorMessageCount = 1,
  isFinalSummary = false
) => {
  const jsonState = buildCareerJsonState(
    structuredData,
    topicIndex,
    coveredTopics,
    mentorMessageCount,
    isFinalSummary
  );

  return {
    type: 'text',
    content,
    hiddenJson: jsonState,
    hiddenJsonBlock: buildHiddenJsonBlock(jsonState),
    roadmapData: roadmap,
  };
};

const identifyCareerTopic = (text = '') => {
  const t = text.toLowerCase();
  if (/(skill|skills)/.test(t)) return 'skills';
  if (/(education|degree|study|path)/.test(t)) return 'education';
  if (/(demand|market|salary|pay|package)/.test(t)) return 'demand';
  if (/(project|portfolio)/.test(t)) return 'projects';
  if (/(certification|certificate)/.test(t)) return 'certifications';
  if (/(next advice|advice|tips|guidance)/.test(t)) return 'advice';
  if (/(related|alternative|other role)/.test(t)) return 'related';
  if (/(full roadmap|detailed roadmap|view roadmap)/.test(t)) return 'full-roadmap';
  return 'unknown';
};

const buildCareerTopicReply = (topic, structuredData) => {
  const roleName = structuredData.roleName;

  switch (topic) {
    case 'skills':
      return `Great choice. For ${roleName}, start with these key skills: ${structuredData.skills
        .slice(0, 3)
        .join(', ')}.\nWhat would you like to know next? (e.g., Certifications, Future Demand, or Next Advice?)`;
    case 'education':
      return `Education path for ${roleName}: ${structuredData.educationPath}\nWhat would you like to know next? (e.g., Certifications, Future Demand, or Next Advice?)`;
    case 'demand':
      return `${roleName} has ${structuredData.demandLevel.toLowerCase()} right now in many markets. Keep your profile practical and portfolio-driven to stand out.\nWhat would you like to know next? (e.g., Certifications, Future Demand, or Next Advice?)`;
    case 'projects':
      return `Try these portfolio projects for ${roleName}: ${structuredData.portfolioProjects
        .slice(0, 3)
        .join(' | ')}\nWhat would you like to know next? (e.g., Certifications, Future Demand, or Next Advice?)`;
    case 'certifications':
      return `Top certifications for ${roleName}: ${structuredData.certifications
        .slice(0, 3)
        .join(', ')}.\nWhat would you like to know next? (e.g., Certifications, Future Demand, or Next Advice?)`;
    case 'advice':
      return `Next advice for ${roleName}: ${structuredData.nextAdvice
        .slice(0, 3)
        .join(' ')}\nWhat would you like to know next? (e.g., Certifications, Future Demand, or Next Advice?)`;
    case 'related':
      return `Related roles you can explore: ${structuredData.relatedRoles.slice(0, 3).join(', ')}.\nWhat would you like to know next? (e.g., Certifications, Future Demand, or Next Advice?)`;
    default:
      return `I can guide you one step at a time for ${roleName}. Ask about Skills, Education Path, Projects, Certifications, Future Demand, or Next Advice.`;
  }
};

const buildGrandFinaleMessage = () =>
  "You've got a great start! I've summarized everything we discussed into a beautiful Roadmap below for your reference.";

const buildCareerFollowUpAnswer = (questionText, structuredData) => {
  const question = questionText.toLowerCase();

  if (/salary|pay|income|package/.test(question)) {
    return `For ${structuredData.roleName}, demand is currently ${structuredData.demandLevel}. Salary varies by region and experience, so compare local job boards and recent postings for accurate ranges. Focus on portfolio quality and interview performance to maximize offers.`;
  }

  if (/certification|certificate/.test(question)) {
    return `Recommended certifications for ${structuredData.roleName}:\n- ${structuredData.certifications.join('\n- ')}\n\nPick one foundational and one intermediate certification, then apply both in portfolio projects.`;
  }

  if (/project|portfolio/.test(question)) {
    return `High-impact portfolio projects for ${structuredData.roleName}:\n- ${structuredData.portfolioProjects.join('\n- ')}\n\nDocument each project with problem statement, approach, and measurable outcomes.`;
  }

  if (/skill|learn/.test(question)) {
    return `Priority skills for ${structuredData.roleName}:\n- ${structuredData.skills.slice(0, 5).join('\n- ')}\n\nStart with fundamentals, then build one project per major skill area.`;
  }

  return `For ${structuredData.roleName}, keep your roadmap focused on three tracks: skills, proof-of-work projects, and interview readiness. If you want, I can break this into a 30-day action plan next.`;
};

const buildCareerAdviceMessages = (roadmap) => {
  const structuredData = buildCareerStructuredData(roadmap);

  return [
    buildMentorCareerMessage(
      buildSequentialTopicMessage(roadmap, structuredData, 0),
      roadmap,
      structuredData,
      0,
      [CAREER_TOPIC_SEQUENCE[0].label],
      1,
      false
    ),
  ];
};

const buildCareerDiscoveryPrompt = () =>
  `Tell me the job role you want to target. I can guide you for any valid role, even if it is not in the example list.\n\nExamples:\n- Full Stack Developer\n- Data Analyst\n- Cloud Engineer\n- DevOps Engineer\n- UX Designer\n- Cybersecurity Analyst`;

const detectIntent = (text) => {
  const t = text.toLowerCase();
  const mentionsResume = /\b(resume|cv|curriculum vitae)\b/.test(t);
  const careerRoadmap = getCareerRoadmapFromText(t);

  if (mentionsResume) return 'RESUME_BUILD';
  if (careerRoadmap) return 'CAREER';
  if (t.includes('job') || t.includes('career') || t.includes('advice') || t.includes('role')) return 'CAREER';
  if (t.includes('hello') || t.includes('hi') || t.includes('hey')) return 'GREET';
  if (t.includes('help')) return 'HELP';
  return 'UNKNOWN';
};

const getBotResponse = (intent, setState) => {
  switch (intent) {
    case 'GREET':
      return [
        {
          type: 'text',
          content:
            "Hello. I'm your AI Career Assistant. I can build your resume or give career advice. What would you like to do today?",
        },
      ];

    case 'HELP':
      return [
        {
          type: 'text',
          content:
            "Here is what I can do:\n\n- Build Resume: I collect your details, format them into a professional CV, and give you a PDF download.\n- Career Advice: I suggest roles, skills, and next steps.\n\nType a request or use the quick actions above.",
        },
      ];

    case 'RESUME_BUILD':
      setState({ mode: 'RESUME_BUILD', step: 0, resumeData: {} });
      return [
        {
          type: 'text',
          content:
            "Resume builder started. I'll collect enough information to turn it into a polished CV and a downloadable PDF.\n\n" +
            RESUME_STEPS[0].prompt,
        },
      ];

    case 'CAREER':
      setState({ mode: 'CAREER_DISCOVERY', step: 0, resumeData: {} });
      return [
        {
          type: 'text',
          content: buildCareerDiscoveryPrompt(),
        },
      ];

    default:
      return [
        {
          type: 'text',
          content:
            'I did not catch that. Try asking me to build a resume or give career advice.',
        },
      ];
  }
};

const ResumeSection = ({ title, children }) => (
  <section className="resume-preview-section">
    <div className="resume-preview-section-head">
      <h4>{title}</h4>
      <span />
    </div>
    {children}
  </section>
);

const ResumeEntryList = ({ entries }) => (
  <div className="resume-entry-list">
    {entries.map((entry, index) => (
      <article key={`${entry.title}-${index}`} className="resume-entry-card">
        <div className="resume-entry-topline">
          <div>
            <h5>{entry.title}</h5>
            {entry.subtitle ? <p>{entry.subtitle}</p> : null}
          </div>
          {entry.meta ? <span>{entry.meta}</span> : null}
        </div>
        {entry.detail ? <p className="resume-entry-detail">{entry.detail}</p> : null}
      </article>
    ))}
  </div>
);

const CareerCard = ({ data }) => {
  const career = data.careerData;

  return (
    <div className="career-card-msg">
      <div className="career-roadmap-shell">
        <div className="career-roadmap-hero">
          <div>
            <p className="career-roadmap-kicker">Career Advice</p>
            <h3>{career.title}</h3>
            <p className="career-roadmap-summary">{career.overview}</p>
          </div>
          <div className="career-demand-badge">{career.demand} Demand</div>
        </div>

        <div className="career-roadmap-grid">
          <div className="career-roadmap-main">
            <ResumeSection title="Skills To Develop">
              <div className="career-chips">
                {career.skills.map((skill) => (
                  <span key={skill} className="chip chip-blue">
                    {skill}
                  </span>
                ))}
              </div>
            </ResumeSection>

            <ResumeSection title="Education Path">
              <div className="career-tips">
                {career.education.map((item) => (
                  <p key={item} className="career-tip">
                    {item}
                  </p>
                ))}
              </div>
            </ResumeSection>

            <ResumeSection title="Good Entry Roles">
              <div className="career-chips">
                {career.starterRoles.map((role) => (
                  <span key={role} className="chip chip-purple">
                    {role}
                  </span>
                ))}
              </div>
            </ResumeSection>
          </div>

          <aside className="career-roadmap-side">
            <ResumeSection title="Future Job Demand">
              <div className="career-tips">
                {career.futureDemand.map((item) => (
                  <p key={item} className="career-tip">
                    {item}
                  </p>
                ))}
              </div>
            </ResumeSection>

            <ResumeSection title="Useful Certifications">
              <div className="career-tips">
                {career.certifications.map((item) => (
                  <p key={item} className="career-tip">
                    {item}
                  </p>
                ))}
              </div>
            </ResumeSection>

            <ResumeSection title="Portfolio Projects">
              <div className="career-tips">
                {career.projects.map((item) => (
                  <p key={item} className="career-tip">
                    {item}
                  </p>
                ))}
              </div>
            </ResumeSection>

            <ResumeSection title="Next Advice">
              <div className="career-tips">
                {career.advice.map((item) => (
                  <p key={item} className="career-tip">
                    {item}
                  </p>
                ))}
              </div>
            </ResumeSection>

            <ResumeSection title="Related Roles">
              <div className="career-chips">
                {career.relatedRoles.map((role) => (
                  <span key={role} className="chip chip-blue">
                    {role}
                  </span>
                ))}
              </div>
            </ResumeSection>
          </aside>
        </div>
      </div>
    </div>
  );
};

const ResumeCard = ({ data, onDownload }) => (
  <div className="resume-card-msg">
    <div className="resume-preview-shell">
      <div className="resume-preview-hero">
        <div className="resume-preview-hero-copy">
          <p className="resume-preview-kicker">Professional CV Draft</p>
          <h3>{data.resumeData.fullName}</h3>
          <p className="resume-preview-headline">{data.resumeData.headline}</p>
          <p className="resume-preview-contact">{data.resumeData.contactLine}</p>
        </div>
        <button
          type="button"
          className="resume-download-btn"
          onClick={() => onDownload(data.resumeData)}
        >
          <Download size={16} />
          Download PDF
        </button>
      </div>

      <ResumeSection title="Professional Summary">
        <p className="resume-summary-copy">{data.resumeData.summary}</p>
      </ResumeSection>

      <div className="resume-preview-grid">
        <div className="resume-preview-main">
          {data.resumeData.experience.length ? (
            <ResumeSection title="Experience">
              <ResumeEntryList entries={data.resumeData.experience} />
            </ResumeSection>
          ) : null}

          {data.resumeData.projects.length ? (
            <ResumeSection title="Projects">
              <ResumeEntryList entries={data.resumeData.projects} />
            </ResumeSection>
          ) : null}

          {data.resumeData.education.length ? (
            <ResumeSection title="Education">
              <ResumeEntryList entries={data.resumeData.education} />
            </ResumeSection>
          ) : null}
        </div>

        <aside className="resume-preview-side">
          {data.resumeData.skills.length ? (
            <ResumeSection title="Core Skills">
              <div className="resume-skill-grid">
                {data.resumeData.skills.map((skill) => (
                  <span key={skill} className="resume-skill-pill">
                    {skill}
                  </span>
                ))}
              </div>
            </ResumeSection>
          ) : null}

          {data.resumeData.certifications.length ? (
            <ResumeSection title="Certifications">
              <ResumeEntryList entries={data.resumeData.certifications} />
            </ResumeSection>
          ) : null}
        </aside>
      </div>
    </div>
  </div>
);

const AnalysisCard = ({ feedback }) => (
  <div className="analysis-card-msg">
    <p className="analysis-title">Resume Analysis</p>
    {feedback.map((item, index) => (
      <div key={index} className="analysis-item">
        <span className="analysis-icon">{item.icon}</span>
        <span className="analysis-text">{item.msg}</span>
      </div>
    ))}
  </div>
);

const Bubble = ({ msg, onDownloadResume }) => {
  const isUser = msg.from === 'user';
  const bubbleClasses = [
    'bubble',
    isUser ? 'bubble-user' : 'bubble-bot',
    msg.type === 'resume' ? 'bubble-resume' : '',
    msg.type === 'career' ? 'bubble-career' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`bubble-row ${isUser ? 'bubble-row-user' : 'bubble-row-bot'}`}>
      {!isUser ? (
        <div className="bot-avatar">
          <Bot size={16} strokeWidth={2.5} />
        </div>
      ) : null}

      <div className={bubbleClasses}>
        {msg.type === 'career' ? (
          <CareerCard data={msg} />
        ) : msg.type === 'resume' ? (
          <ResumeCard data={msg} onDownload={onDownloadResume} />
        ) : msg.type === 'analysis' ? (
          <AnalysisCard feedback={msg.feedback} />
        ) : (
          <pre className="bubble-text">{msg.content}</pre>
        )}
        {msg.hiddenJson ? (
          <pre className="bubble-hidden-json">{msg.hiddenJsonBlock || JSON.stringify(msg.hiddenJson, null, 2)}</pre>
        ) : null}
        <span className="bubble-time">{msg.time}</span>
      </div>

      {isUser ? (
        <div className="user-avatar">
          <User size={16} strokeWidth={2.5} />
        </div>
      ) : null}
    </div>
  );
};

const AICareerAssistant = () => {
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      type: 'text',
      time: now(),
      content: INITIAL_BOT_MESSAGE,
    },
  ]);
  const [input, setInput] = useState('');
  const [flowState, setFlowState] = useState(INITIAL_FLOW_STATE);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (message) => {
    setMessages((current) => [...current, { ...message, time: now() }]);
  };

  const addBotMessages = (botMessages) => {
    setTimeout(() => {
      botMessages.forEach((message, index) => {
        setTimeout(() => {
          setMessages((current) => [...current, { from: 'bot', time: now(), ...message }]);
        }, index * 250);
      });
    }, 300);
  };

  const handleDownloadResume = (resumeData) => {
    try {
      const blob = buildResumePdfBlob(resumeData);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const fileName =
        `${resumeData.fullName || 'resume'}-cv`
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') || 'resume-cv';

      link.href = url;
      link.download = `${fileName}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          from: 'bot',
          type: 'text',
          time: now(),
          content:
            'I could not generate the PDF just now. The preview is still available in the chat, and retrying the download should work.',
        },
      ]);
    }
  };

  const runIntent = (intent) => {
    const responses = getBotResponse(intent, setFlowState);
    addBotMessages(responses);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    addMessage({ from: 'user', type: 'text', content: text });
    setInput('');

    const { mode, step, resumeData } = flowState;

    if (mode === 'RESUME_BUILD') {
      const field = RESUME_STEPS[step].key;
      const updatedResumeData = { ...resumeData, [field]: text };

      if (step < RESUME_STEPS.length - 1) {
        setFlowState({
          mode: 'RESUME_BUILD',
          step: step + 1,
          resumeData: updatedResumeData,
        });
        addBotMessages([{ type: 'text', content: RESUME_STEPS[step + 1].prompt }]);
      } else {
        const professionalResume = buildProfessionalResumeData(updatedResumeData);
        setFlowState(INITIAL_FLOW_STATE);
        addBotMessages([
          {
            type: 'text',
            content:
              'I have enough information. I turned it into a cleaner, professional CV layout. Review it below and use the download button to save the PDF.',
          },
          {
            type: 'resume',
            resumeData: professionalResume,
          },
          {
            type: 'text',
            content:
              'If you want a stronger final version, rebuild it with quantified achievements, project outcomes, and direct profile links.',
          },
        ]);
      }
      return;
    }

    if (mode === 'CAREER_DISCOVERY') {
      const roadmap = getCareerRoadmapFromText(text);

      if (roadmap) {
        const structuredData = buildCareerStructuredData(roadmap);
        setFlowState({
          mode: 'CAREER_MENTOR',
          step: 0,
          resumeData: {
            roadmap,
            structuredData,
            topicIndex: 0,
            coveredTopics: [CAREER_TOPIC_SEQUENCE[0].label],
            mentorMessageCount: 1,
            finaleShown: false,
          },
        });
        addBotMessages(buildCareerAdviceMessages(roadmap));
      } else {
        const extractedRole = extractCareerTarget(text);

        if (isValidCareerTarget(extractedRole)) {
          const fallbackRoadmap = buildFallbackCareerRoadmap(extractedRole);
          const structuredData = buildCareerStructuredData(fallbackRoadmap);
          setFlowState({
            mode: 'CAREER_MENTOR',
            step: 0,
            resumeData: {
              roadmap: fallbackRoadmap,
              structuredData,
              topicIndex: 0,
              coveredTopics: [CAREER_TOPIC_SEQUENCE[0].label],
              mentorMessageCount: 1,
              finaleShown: false,
            },
          });
          addBotMessages(buildCareerAdviceMessages(fallbackRoadmap));
        } else {
          addBotMessages([
            {
              type: 'text',
              content:
                'Please provide a valid career target (job role), for example: Data Engineer, Product Manager, UI Designer, or Cloud Engineer.',
            },
          ]);
        }
      }
      return;
    }

    if (mode === 'CAREER_MENTOR') {
      const detectedIntent = detectIntent(text);
      if (detectedIntent === 'RESUME_BUILD') {
        runIntent(detectedIntent);
        return;
      }

      if (detectedIntent === 'CAREER') {
        const roadmap = getCareerRoadmapFromText(text);
        if (roadmap) {
          const structuredData = buildCareerStructuredData(roadmap);
          setFlowState({
            mode: 'CAREER_MENTOR',
            step: 0,
            resumeData: {
              roadmap,
              structuredData,
              topicIndex: 0,
              coveredTopics: [CAREER_TOPIC_SEQUENCE[0].label],
              mentorMessageCount: 1,
              finaleShown: false,
            },
          });
          addBotMessages(buildCareerAdviceMessages(roadmap));
          return;
        }

        const extractedRole = extractCareerTarget(text);
        if (isValidCareerTarget(extractedRole)) {
          const fallbackRoadmap = buildFallbackCareerRoadmap(extractedRole);
          const structuredData = buildCareerStructuredData(fallbackRoadmap);
          setFlowState({
            mode: 'CAREER_MENTOR',
            step: 0,
            resumeData: {
              roadmap: fallbackRoadmap,
              structuredData,
              topicIndex: 0,
              coveredTopics: [CAREER_TOPIC_SEQUENCE[0].label],
              mentorMessageCount: 1,
              finaleShown: false,
            },
          });
          addBotMessages(buildCareerAdviceMessages(fallbackRoadmap));
          return;
        }
      }

      const structuredData = resumeData?.structuredData;
      const roadmap = resumeData?.roadmap;
      const topicIndex = Number.isInteger(resumeData?.topicIndex) ? resumeData.topicIndex : 0;
      const coveredTopics = Array.isArray(resumeData?.coveredTopics) ? resumeData.coveredTopics : [CAREER_TOPIC_SEQUENCE[0].label];
      const mentorMessageCount = Number.isInteger(resumeData?.mentorMessageCount) ? resumeData.mentorMessageCount : 1;
      const finaleShown = Boolean(resumeData?.finaleShown);

      if (!structuredData || !roadmap) {
        addBotMessages([
          {
            type: 'text',
            content: 'Please share your target role clearly so I can guide you step by step.',
          },
        ]);
        return;
      }

      const isVeryShortInput = text.trim().split(/\s+/).filter(Boolean).length <= 2;
      if (isVeryShortInput && !isNextConfirmation(text) && !isSummaryRequest(text) && !isDoneRequest(text)) {
        const shortReply = `I want to guide you deeply, so give me one more line of context about ${roadmap.role || 'your target role'}. If you want me to continue directly, just type "ok".`;
        addBotMessages([
          buildMentorCareerMessage(
            shortReply,
            roadmap,
            structuredData,
            topicIndex,
            coveredTopics,
            mentorMessageCount + 1,
            false
          ),
        ]);
        setFlowState({
          mode: 'CAREER_MENTOR',
          step: 0,
          resumeData: {
            roadmap,
            structuredData,
            topicIndex,
            coveredTopics,
            mentorMessageCount: mentorMessageCount + 1,
            finaleShown,
          },
        });
        return;
      }

      if (isSummaryRequest(text)) {
        const recap = `So far, we have explored: ${coveredTopics.slice(0, 4).join(', ')}${
          coveredTopics.length > 4 ? ', and more' : ''
        }. We are building this roadmap step by step as a team.`;

        addBotMessages([
          buildMentorCareerMessage(
            recap,
            roadmap,
            structuredData,
            topicIndex,
            coveredTopics,
            mentorMessageCount + 1,
            false
          ),
        ]);
        setFlowState({
          mode: 'CAREER_MENTOR',
          step: 0,
          resumeData: {
            roadmap,
            structuredData,
            topicIndex,
            coveredTopics,
            mentorMessageCount: mentorMessageCount + 1,
            finaleShown,
          },
        });
        return;
      }

      if (isDoneRequest(text)) {
        const canFinalize = mentorMessageCount >= 10;
        if (canFinalize) {
          const finaleText =
            "Great! We've covered all the key aspects of this career. I've compiled everything we discussed into a beautiful Summary Roadmap for you below.";
          addBotMessages([
            buildMentorCareerMessage(
              finaleText,
              roadmap,
              structuredData,
              CAREER_TOPIC_SEQUENCE.length - 1,
              coveredTopics,
              mentorMessageCount + 1,
              true
            ),
            {
              type: 'career',
              careerData: roadmap,
            },
          ]);

          setFlowState({
            mode: 'CAREER_MENTOR',
            step: 0,
            resumeData: {
              roadmap,
              structuredData,
              topicIndex: CAREER_TOPIC_SEQUENCE.length - 1,
              coveredTopics,
              mentorMessageCount: mentorMessageCount + 1,
              finaleShown: true,
            },
          });
          return;
        }
      }

      if (isNextConfirmation(text) && topicIndex < CAREER_TOPIC_SEQUENCE.length - 1) {
        const nextIndex = topicIndex + 1;
        const nextCovered = coveredTopics.includes(CAREER_TOPIC_SEQUENCE[nextIndex].label)
          ? coveredTopics
          : [...coveredTopics, CAREER_TOPIC_SEQUENCE[nextIndex].label];
        const nextCount = mentorMessageCount + 1;
        const isFinal = nextIndex === CAREER_TOPIC_SEQUENCE.length - 1 && nextCount >= 10;

        addBotMessages([
          buildMentorCareerMessage(
            buildSequentialTopicMessage(roadmap, structuredData, nextIndex, true),
            roadmap,
            structuredData,
            nextIndex,
            nextCovered,
            nextCount,
            isFinal
          ),
        ]);

        if (isFinal) {
          setTimeout(() => {
            setMessages((current) => [
              ...current,
              {
                from: 'bot',
                type: 'career',
                time: now(),
                careerData: roadmap,
              },
            ]);
          }, 350);
        }

        setFlowState({
          mode: 'CAREER_MENTOR',
          step: 0,
          resumeData: {
            roadmap,
            structuredData,
            topicIndex: nextIndex,
            coveredTopics: nextCovered,
            mentorMessageCount: nextCount,
            finaleShown: isFinal,
          },
        });
        return;
      }

      if (!isNextConfirmation(text) && topicIndex < CAREER_TOPIC_SEQUENCE.length - 1) {
        const currentTopic = CAREER_TOPIC_SEQUENCE[topicIndex];
        const compactReply = `${buildTopicContent(
          currentTopic.key,
          roadmap,
          structuredData
        )} ${buildCuriosityGap(topicIndex)}`;

        addBotMessages([
          buildMentorCareerMessage(
            compactReply,
            roadmap,
            structuredData,
            topicIndex,
            coveredTopics,
            mentorMessageCount + 1,
            false
          ),
        ]);
        setFlowState({
          mode: 'CAREER_MENTOR',
          step: 0,
          resumeData: {
            roadmap,
            structuredData,
            topicIndex,
            coveredTopics,
            mentorMessageCount: mentorMessageCount + 1,
            finaleShown,
          },
        });
        return;
      }

      if (finaleShown) {
        addBotMessages([
          buildMentorCareerMessage(
            buildCareerFollowUpAnswer(text, structuredData),
            roadmap,
            structuredData,
            topicIndex,
            coveredTopics,
            mentorMessageCount + 1,
            true
          ),
        ]);
        setFlowState({
          mode: 'CAREER_MENTOR',
          step: 0,
          resumeData: {
            roadmap,
            structuredData,
            topicIndex,
            coveredTopics,
            mentorMessageCount: mentorMessageCount + 1,
            finaleShown,
          },
        });
      }
      return;

    }

    const intent = detectIntent(text);

    if (intent === 'CAREER') {
      const roadmap = getCareerRoadmapFromText(text);

      if (roadmap) {
        const structuredData = buildCareerStructuredData(roadmap);
        setFlowState({
          mode: 'CAREER_MENTOR',
          step: 0,
          resumeData: {
            roadmap,
            structuredData,
            topicIndex: 0,
            coveredTopics: [CAREER_TOPIC_SEQUENCE[0].label],
            mentorMessageCount: 1,
            finaleShown: false,
          },
        });
        addBotMessages(buildCareerAdviceMessages(roadmap));
        return;
      }

      const extractedRole = extractCareerTarget(text);
      if (isValidCareerTarget(extractedRole)) {
        const fallbackRoadmap = buildFallbackCareerRoadmap(extractedRole);
        const structuredData = buildCareerStructuredData(fallbackRoadmap);
        setFlowState({
          mode: 'CAREER_MENTOR',
          step: 0,
          resumeData: {
            roadmap: fallbackRoadmap,
            structuredData,
            topicIndex: 0,
            coveredTopics: [CAREER_TOPIC_SEQUENCE[0].label],
            mentorMessageCount: 1,
            finaleShown: false,
          },
        });
        addBotMessages(buildCareerAdviceMessages(fallbackRoadmap));
      } else {
        runIntent(intent);
      }
      return;
    }

    runIntent(intent);
  };

  const handleQuickAction = (action) => {
    const config = {
      resume: { label: 'Build my resume', intent: 'RESUME_BUILD' },
      career: { label: 'Give me career advice', intent: 'CAREER' },
    };

    const selectedAction = config[action];
    if (!selectedAction) return;

    addMessage({ from: 'user', type: 'text', content: selectedAction.label });
    runIntent(selectedAction.intent);
  };

  const handleReset = () => {
    setFlowState(INITIAL_FLOW_STATE);
    setMessages([
      {
        from: 'bot',
        type: 'text',
        time: now(),
        content:
          'Chat reset.\n\nAsk me to build a resume or give career advice.',
      },
    ]);
  };

  return (
    <div className="aca-page">
      <div className="aca-header">
        <div className="aca-header-left">
          <div className="aca-bot-icon">
            <Sparkles size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="aca-title">AI Career Assistant</h1>
            <p className="aca-subtitle">Resume and career support</p>
          </div>
        </div>
        <button className="aca-reset-btn" onClick={handleReset} title="Reset chat">
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="aca-quick-actions">
        <button className="qa-btn qa-blue" onClick={() => handleQuickAction('resume')}>
          <FileText size={15} /> Build Resume
        </button>
        <button className="qa-btn qa-green" onClick={() => handleQuickAction('career')}>
          <Briefcase size={15} /> Career Advice
        </button>
      </div>

      <div className="aca-chat-area">
        {messages.map((message, index) => (
          <Bubble
            key={index}
            msg={message}
            onDownloadResume={handleDownloadResume}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="aca-input-bar">
        <div className="aca-input-wrapper">
          <input
            className="aca-input"
            placeholder="Ask me to build a resume or get career advice..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && handleSend()}
          />
          <button className="aca-send-btn" onClick={handleSend} disabled={!input.trim()}>
            <Send size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICareerAssistant;
