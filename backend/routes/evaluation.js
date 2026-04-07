const express = require('express');
const router = express.Router();

const { evaluateAnswer } = require('../controllers/evaluationController');

const protect = require('../middleware/authMiddleware');

router.post('/evaluate', evaluateAnswer);

module.exports = router;