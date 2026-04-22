const mongoose = require("mongoose");

const jobSubmissionSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    university: { type: String, required: true, trim: true },
    coverLetter: { type: String, required: true, trim: true, minlength: 50 },
    studentEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{10}$/, "Phone must be a 10-digit number"],
    },
    year: { type: Number, required: true, min: 1, max: 4 },
    resumeFile: { type: String, required: true, trim: true },
    appliedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobSubmission", jobSubmissionSchema, "JobSubmissions");