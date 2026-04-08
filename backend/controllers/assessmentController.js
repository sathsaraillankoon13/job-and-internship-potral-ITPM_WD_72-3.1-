const Question = require('../models/Question');
const UserResult = require('../models/UserResult');

// Get questions filtered by pathway, skill, and difficulty
exports.getQuestions = async (req, res) => {
    try {
        const { pathway, skill, difficulty, testDomain } = req.query;
        
        let query = {};
        if (pathway) query.pathway = pathway;
        if (skill) query.skill = skill;
        if (difficulty) query.difficulty = difficulty;
        if (testDomain) query.testDomain = testDomain;

        console.log('Querying questions with:', query);
        const questions = await Question.find(query).limit(20);
        
        if (!questions || questions.length === 0) {
            return res.status(200).json([]); // Return empty array if none found
        }

        res.status(200).json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Error fetching questions', error: error.message });
    }
};

// Submit assessment results
exports.submitResult = async (req, res) => {
    try {
        const { 
            userId, 
            quizTitle, 
            timeTaken, 
            score, 
            totalQuestions, 
            percentage, 
            difficulty, 
            status, 
            questions, 
            selectedAnswers 
        } = req.body;

        const newResult = new UserResult({
            userId,
            quizTitle,
            timeTaken,
            score,
            totalQuestions,
            percentage,
            difficulty,
            status,
            questions,
            selectedAnswers
        });

        const savedResult = await newResult.save();
        res.status(201).json(savedResult);
    } catch (error) {
        console.error('Error submitting result:', error);
        res.status(500).json({ message: 'Error submitting result', error: error.message });
    }
};

// Get assessment history for a specific user
exports.getUserResults = async (req, res) => {
    try {
        const { userId } = req.params;
        const results = await UserResult.find({ userId }).sort({ date: -1 });
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching user results:', error);
        res.status(500).json({ message: 'Error fetching user results', error: error.message });
    }
};
