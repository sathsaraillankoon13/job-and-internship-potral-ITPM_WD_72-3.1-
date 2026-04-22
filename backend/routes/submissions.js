const express = require("express");
const multer = require("multer");
const { createSubmission, getSubmissionsByJob } = require("../controllers/submissionsController");
const { uploadResume } = require("../middleware/upload");

const router = express.Router();

function handleResumeUpload(req, res, next) {
	const uploader = uploadResume.single("resumeFile");

	uploader(req, res, (error) => {
		if (!error) {
			return next();
		}

		if (error instanceof multer.MulterError) {
			if (error.code === "LIMIT_FILE_SIZE") {
				return res.status(400).json({ message: "File too large. Maximum size is 5MB." });
			}
			return res.status(400).json({ message: error.message });
		}

		if (error.code === "INVALID_FILE_TYPE") {
			return res.status(400).json({ message: "File type not supported. Only .pdf, .doc, .docx are allowed." });
		}

		return next(error);
	});
}

router.route("/").get(getSubmissionsByJob).post(handleResumeUpload, createSubmission);
router.get("/job/:jobId", getSubmissionsByJob);

module.exports = router;