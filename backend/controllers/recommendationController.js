const UserResult = require('../models/UserResult');
const InterviewResult = require('../models/InterviewResults');
const Job = require('../models/Job');
const { generateSmartRecommendations } = require('../utils/gemini');

// Static Learning Resources Database
const LEARNING_RESOURCES = [
    { title: 'Mastering React Hooks', url: 'https://react.dev/reference/react', tags: ['React', 'Frontend'], type: 'Documentation' },
    { title: 'React Performance Optimization', url: 'https://web.dev/react/', tags: ['React', 'Web'], type: 'Article' },
    { title: 'Java Concurrency in Practice', url: 'https://docs.oracle.com/javase/tutorial/essential/concurrency/', tags: ['Java', 'Backend'], type: 'Course' },
    { title: 'Node.js Event Loop Deep Dive', url: 'https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/', tags: ['Node.js', 'Backend'], type: 'Article' },
    { title: 'Python for Data Science', url: 'https://realpython.com/learning-paths/python-data-science/', tags: ['Python', 'Data'], type: 'Learning Path' },
    { title: 'CSS Layout Masterclass', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', tags: ['CSS', 'Frontend'], type: 'Interactive' },
    { title: 'SQL Injection Prevention', url: 'https://owasp.org/www-community/attacks/SQL_Injection', tags: ['Security', 'SQL', 'Backend'], type: 'Security Guide' }
];

/**
 * @desc    Get AI-driven smart job recommendations or study path based on custom algorithm
 * @route   GET /api/recommendations/smart
 */
exports.getSmartRecommendations = async (req, res) => {
    try {
        const { skill, userId } = req.query;
        const mongoose = require('mongoose');


        // 1. Fetch latest assessment result
        const latestAssessment = await UserResult.findOne({ userId }).sort({ date: -1 });
        
        // 2. Fetch latest mock interview feedback
        const latestInterview = await InterviewResult.findOne({ userId }).sort({ date: -1 });

        // Check if history exists
        if (!latestAssessment && !latestInterview) {
            return res.status(200).json({ 
                success: true, 
                message: 'No performance history found. Please complete an assessment to unlock personalized guidance.',
                recommendedJobs: [],
                studyPath: [],
                hasHistory: false
            });
        }

        const userScore = latestAssessment ? latestAssessment.percentage : 0;
        let testTopic = latestAssessment 
            ? latestAssessment.quizTitle.replace(/ Assessment| Quiz| Test/gi, '').trim()
            : (latestInterview ? latestInterview.pathway : "General Career");

        // HEAL: Strip anything before a colon (e.g., "UI/UX Designer: Figma" -> "Figma")
        if (testTopic.includes(':')) {
            testTopic = testTopic.split(':').pop().trim();
        }

        // Calculate Ready-to-Hire Status
        // Formula: (Score * 0.8) + (Previous_Interview_Score * 0.2)
        const interviewScore = latestInterview ? (latestInterview.score || 70) : 70;
        const readinessScore = Math.round((userScore * 0.8) + (interviewScore * 0.2));

        // Define status level
        let readinessStatus = 'Developing';
        if (readinessScore >= 85) readinessStatus = 'Workplace Ready';
        else if (readinessScore >= 70) readinessStatus = 'Interview Ready';

        // 3. APPLY CUSTOM ALGORITHM
        // If userScore is 70 or above -> Jobs
        // If userScore is below 70 -> Study Path
        
        if (userScore >= 70) {
            // STRICT MATCHING ALGORITHM
            const now = new Date();
            const activeJobs = await Job.find({
                $and: [
                    {
                        $or: [
                            { title: new RegExp(testTopic, 'i') },
                            { requiredSkills: new RegExp(testTopic, 'i') },
                            { required_skills: new RegExp(testTopic, 'i') },
                            { skills: new RegExp(testTopic, 'i') }
                        ]
                    },
                    {
                        status: { $in: ['Active', 'active', '', null] }
                    }
                ]
            }).limit(50).lean();

            const recommendedJobs = activeJobs.map(j => ({
                id: j._id,
                jobTitle: j.title,
                company: j.department || 'CareerBridge Partner',
                compatibilityScore: Math.min(98, readinessScore + Math.floor(Math.random() * 5)),
                matchCategory: readinessScore >= 80 ? 'Expert Match' : 'Strong Match',
                location: j.location || 'Remote',
                type: j.opportunityType || 'Full-time',
                skills: j.requiredSkills || j.skills || [],
                whyMatched: `Your ${userScore}% score in ${testTopic} proves you have the core competencies required for this role.`
            }));

            return res.status(200).json({
                success: true,
                hasHistory: true,
                readinessScore,
                readinessStatus,
                recommendedJobs,
                studyPath: [],
                mode: 'JOBS',
                message: `Congratulations! Your score of ${userScore}% qualifies you for top-tier opportunities.`
            });

        } else {
            // Study Path Logic (Score < 70)
            const missedQuestionsTags = [];
            if (latestAssessment && latestAssessment.questions && latestAssessment.selectedAnswers) {
                latestAssessment.questions.forEach((q, idx) => {
                    const studentAnswer = latestAssessment.selectedAnswers[idx];
                    if (studentAnswer !== q.correctAnswer) {
                        if (q.skill) missedQuestionsTags.push(q.skill);
                        if (q.testDomain && !missedQuestionsTags.includes(q.testDomain)) missedQuestionsTags.push(q.testDomain);
                    }
                });
            }

            // Always add the testTopic itself if few tags found
            if (missedQuestionsTags.length < 2) missedQuestionsTags.push(testTopic);

            // Filter resources matching tags
            const studyPath = LEARNING_RESOURCES.filter(res => 
                res.tags.some(tag => missedQuestionsTags.some(mt => mt.toLowerCase().includes(tag.toLowerCase())))
            );

            // Fallback resources if none found
            if (studyPath.length === 0) {
                studyPath.push(...LEARNING_RESOURCES.slice(0, 3));
            }

            return res.status(200).json({
                success: true,
                hasHistory: true,
                readinessScore,
                readinessStatus,
                recommendedJobs: [],
                studyPath,
                mode: 'STUDY',
                missedTopics: [...new Set(missedQuestionsTags)],
                message: `You're on the right track! Focus on strengthening these areas to unlock job recommendations.`
            });
        }

    } catch (error) {
        console.error('Error in weighted recommendation algorithm:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error processing recommendations', 
            error: error.message 
        });
    }
};
