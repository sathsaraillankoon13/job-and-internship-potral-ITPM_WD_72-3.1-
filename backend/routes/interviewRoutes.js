const express = require('express');
const router = express.Router();

const { 
  generateInterview, 
  getNextQuestion, 
  getEvaluation, 
  getHistory 
} = require('../controllers/interviewController');

const protect = require('../middleware/authMiddleware');

router.post('/generate', generateInterview);
router.post('/next', getNextQuestion);
router.get('/evaluate/:sessionId', getEvaluation);
router.get('/history/:userId', getHistory);

module.exports = router;