const mongoose = require('mongoose');
require('dotenv').config();
const MockQuestion = require('./models/MockQuestion');

const questions = [
  // Software Developer - Technical
  {
    pathway: 'Software Developer',
    interviewType: 'Technical',
    questionText: 'Explain the difference between virtual DOM and real DOM in React.'
  },
  {
    pathway: 'Software Developer',
    interviewType: 'Technical',
    questionText: 'What are closures in JavaScript and how do they work?'
  },
  {
    pathway: 'Software Developer',
    interviewType: 'Technical',
    questionText: 'How does CSS box model work?'
  },
  {
    pathway: 'Software Developer',
    interviewType: 'Technical',
    questionText: 'What is the purpose of useEffect hook in React?'
  },
  {
    pathway: 'Software Developer',
    interviewType: 'Technical',
    questionText: 'Explain RESTful API principles.'
  },
  {
    pathway: 'Software Developer',
    interviewType: 'Technical',
    questionText: 'What is dependency injection and why is it useful?'
  },
  {
    pathway: 'Software Developer',
    interviewType: 'Technical',
    questionText: 'How do you optimize performance in a web application?'
  },
  
  // Software Developer - Behavioral
  {
    pathway: 'Software Developer',
    interviewType: 'Behavioral',
    questionText: 'Tell me about a time you had a conflict with a team member.'
  },
  {
    pathway: 'Software Developer',
    interviewType: 'Behavioral',
    questionText: 'Why do you want to work for our company?'
  },
  {
    pathway: 'Software Developer',
    interviewType: 'Behavioral',
    questionText: 'Describe a difficult technical challenge you faced.'
  }
];

const seedMockQuestions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careerbridge', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB for seeding Mock Interview questions...');

    // Clear existing questions for these categories to avoid duplicates during testing
    await MockQuestion.deleteMany({ pathway: 'Software Developer' });

    await MockQuestion.insertMany(questions);
    console.log('Successfully seeded Mock Interview questions!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding Mock Interview questions:', error);
    process.exit(1);
  }
};

seedMockQuestions();
