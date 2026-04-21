const express = require("express");
const {
  closeJob,
  createJob,
  deleteJob,
  getAllJobs,
  getJobApplications,
  getJobById,
  incrementJobView,
  setJobApprovalStatus,
  trackJobView,
  updateJob,
  getPendingJobs,
  updateApprovalStatus,
} = require("../controllers/jobController");

const router = express.Router();
const recommendationController = require("../controllers/recommendationController");

router.route("/").get(getAllJobs).post(createJob);
router.get("/recommended", recommendationController.getSmartRecommendations);
router.route("/:id").get(getJobById).put(updateJob).delete(deleteJob);
router.patch("/:id/approval", setJobApprovalStatus);
router.post("/:id/view", trackJobView);
router.put("/:id/view", incrementJobView);
router.post("/:id/increment-view", trackJobView);
router.put("/:id/increment-view", incrementJobView);
router.route("/:id/close").patch(closeJob);
router.route("/:id/applications").get(getJobApplications);
router.get("/admin/pending", getPendingJobs);
router.patch("/:id/approval", updateApprovalStatus);

module.exports = router;