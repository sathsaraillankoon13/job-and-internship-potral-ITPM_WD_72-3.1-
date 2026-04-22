const mongoose = require('mongoose');
const Question = require('./models/Question');
require('dotenv').config();

const questions = [
    {
        questionText: "Which hook is used to handle side effects in a React functional component?",
        options: ["useState", "useEffect", "useContext", "useReducer"],
        correctAnswer: "B",
        pathway: "Software Developer",
        testDomain: "Technical Quiz",
        skill: "React",
        difficulty: "Beginner",
        explanation: "useEffect is the primary hook for side effects like API calls and DOM manipulation."
    },
    {
        questionText: "What is the purpose of 'key' prop in React lists?",
        options: ["To style elements", "To identify elements uniquely for reconciliation", "To store data", "To handle clicks"],
        correctAnswer: "B",
        pathway: "Software Developer",
        testDomain: "Technical Quiz",
        skill: "React",
        difficulty: "Intermediate",
        explanation: "Keys help React identify which items have changed, been added, or removed, optimizing performance."
    },
    {
        questionText: "Which of the following is true about Virtual DOM?",
        options: ["It is a direct copy of the real DOM", "It is slower than the real DOM", "It is an in-memory representation of the UI", "It updates the entire page on every change"],
        correctAnswer: "C",
        pathway: "Software Developer",
        testDomain: "Technical Quiz",
        skill: "React",
        difficulty: "Beginner",
        explanation: "The Virtual DOM is a lightweight copy of the real DOM used by React to compute minimal updates."
    },
    {
        questionText: "How do you pass a prop from parent to child component?",
        options: ["Using state", "By adding it as an attribute to the child component", "Using refs", "Using context API only"],
        correctAnswer: "B",
        pathway: "Software Developer",
        testDomain: "Technical Quiz",
        skill: "React",
        difficulty: "Beginner",
        explanation: "Props are passed to components via attributes in JSX."
    },
    {
        questionText: "What does JSX stand for?",
        options: ["JavaScript XML", "JavaScript Extension", "JSON XML", "Java Syntax Extension"],
        correctAnswer: "A",
        pathway: "Software Developer",
        testDomain: "Technical Quiz",
        skill: "React",
        difficulty: "Beginner",
        explanation: "JSX stands for JavaScript XML, a syntax extension for JavaScript used with React."
    }
];

const seedQuestions = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB for seeding questions...');

        // Clear existing questions for these specific parameters to avoid duplicates during testing
        await Question.deleteMany({ skill: 'React', pathway: 'Software Developer' });
        
        await Question.insertMany(questions);
        console.log('Successfully seeded 5 React questions!');
        
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    } catch (error) {
        console.error('Error seeding questions:', error);
        process.exit(1);
    }
};

seedQuestions();
