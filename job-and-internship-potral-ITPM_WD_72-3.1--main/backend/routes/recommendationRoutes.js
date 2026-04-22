const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');

router.get('/smart', recommendationController.getSmartRecommendations);

module.exports = router;
