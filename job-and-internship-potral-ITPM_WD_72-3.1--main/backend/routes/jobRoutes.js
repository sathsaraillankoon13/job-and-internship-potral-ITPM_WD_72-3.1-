const express = require('express');
const router = express.Router();
const {
  getAllJobs,
  getJobsByCategory,
  searchJobs,
  getRecommendedJobs
} = require('../controllers/jobController');

// GET all jobs with optional filters
router.get('/all', getAllJobs);

// GET jobs filtered by category
router.get('/category/:category', getJobsByCategory);

// GET recommended jobs based on user profile
router.get('/recommended', getRecommendedJobs);

// GET search jobs by title or company
router.get('/search', searchJobs);

module.exports = router;
