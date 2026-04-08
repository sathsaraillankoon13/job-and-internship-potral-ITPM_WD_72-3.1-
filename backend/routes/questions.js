const express = require('express');
const router = express.Router();

const { evaluateAnswer } = require('../controllers/evaluationController');
const { getQuestions, submitResult, getUserResults } = require('../controllers/assessmentController');

const protect = require('../middleware/authMiddleware');

router.post('/evaluate', evaluateAnswer);
router.get('/', getQuestions);
router.post('/submit', submitResult);
router.get('/history/:userId', getUserResults);

module.exports = router;

