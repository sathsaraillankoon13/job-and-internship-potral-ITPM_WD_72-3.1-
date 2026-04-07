const JobSubmission = require("../models/JobSubmission");
const Job = require("../models/Job");
const { getJobScheduleStatus } = require("../utils/jobSchedule");

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validateSubmissionInput(body, file) {
  const errors = [];
  const email = normalizeText(body.studentEmail).toLowerCase();
  const phone = normalizeText(body.phone);
  const coverLetter = normalizeText(body.coverLetter);
  const year = Number(body.year);

  if (!normalizeText(body.firstName)) errors.push("First name is required");
  if (!normalizeText(body.lastName)) errors.push("Last name is required");
  if (!normalizeText(body.university)) errors.push("University is required");

  if (!email) {
    errors.push("Student email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Invalid email");
  }

  if (!phone) {
    errors.push("Phone is required");
  } else if (!/^\d{10}$/.test(phone)) {
    errors.push("Phone must be a 10-digit number");
  }

  if (!body.year) {
    errors.push("Year is required");
  } else if (!Number.isInteger(year) || year < 1 || year > 4) {
    errors.push("Year must be between 1 and 4");
  }

  if (!coverLetter) {
    errors.push("Cover letter is required");
  } else if (coverLetter.length < 50) {
    errors.push("Cover letter must be at least 50 characters");
  }

  if (!file) {
    errors.push("Resume file is required");
  }

  return { errors, email, phone, year, coverLetter };
}

async function createSubmission(req, res, next) {
  try {
    if (req.fileValidationError) {
      return res.status(400).json({ message: req.fileValidationError });
    }

    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: "jobId is required" });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const scheduleStatus = getJobScheduleStatus(job);
    if (scheduleStatus !== "Active") {
      const message =
        scheduleStatus === "Scheduled"
          ? "This job is not yet open for applications."
          : "Applications are closed for this job.";
      return res.status(400).json({ message });
    }

    const { errors, email, phone, year, coverLetter } = validateSubmissionInput(req.body, req.file);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0], errors });
    }

    const resumeFile = `/uploads/${req.file.filename}`;

    const payload = {
      jobId: job._id,
      firstName: normalizeText(req.body.firstName),
      lastName: normalizeText(req.body.lastName),
      university: normalizeText(req.body.university),
      coverLetter,
      studentEmail: email,
      phone,
      year,
      resumeFile,
      appliedDate: req.body.appliedDate || new Date().toISOString(),
    };

    const newSubmission = new JobSubmission(payload);
    const submission = await newSubmission.save();

    const updatedJob = await Job.findByIdAndUpdate(
      job._id,
      {
        $inc: { applicants: 1 },
      },
      { new: true, projection: { _id: 1, applicants: 1, views: 1 } }
    );

    const applicationsCount = Number(updatedJob?.applicants || 0);
    const viewsCount = Number(updatedJob?.views || 0);

    if (viewsCount <= applicationsCount) {
      await Job.findByIdAndUpdate(job._id, { $set: { views: applicationsCount } });
    }

    res.status(201).json(submission);
  } catch (error) {
    next(error);
  }
}

async function getSubmissionsByJob(req, res, next) {
  try {
    const jobId = req.params.jobId || req.query.jobId;

    if (!jobId) {
      return res.status(400).json({ message: "jobId is required" });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const submissions = await JobSubmission.find({ jobId }).sort({ appliedDate: -1, createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createSubmission,
  getSubmissionsByJob,
};