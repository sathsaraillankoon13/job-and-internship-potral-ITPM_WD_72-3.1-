const express = require("express");
const { getDashboardSummary, getPerformanceAnalytics } = require("../controllers/dashboardController");

const router = express.Router();

router.get("/", getDashboardSummary);
router.get("/performance", getPerformanceAnalytics);

module.exports = router;