const express = require('express');
const router = express.Router();
const { getSystemAnalytics } = require('../controllers/analyticsController');

router.get('/system', getSystemAnalytics);

module.exports = router;
