const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    opportunityType: {
      type: String,
      required: true,
      enum: ["Full-time", "Internship", "Part-time", "Contract", "Freelance"],
    },
    category: {
      type: String,
      required: true,
      enum: ["IT", "Marketing", "Finance", "Design", "Engineering"],
    },
    department: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    requiredSkills: {
      type: [{ type: String, trim: true }],
      default: [],
      validate: [(value) => value.length > 0, "At least one required skill is required"],
    },
    salaryStipend: { type: String, required: true, trim: true },
    experienceLevel: { type: String, required: true, trim: true },
    workMode: {
      type: String,
      required: true,
      enum: ["On-site", "Remote", "Hybrid"],
    },
    minEducation: { type: String, required: true, trim: true },
    eligibleYear: { type: String, required: true, trim: true },
    minGPA: { type: String, default: "", trim: true },
    fieldOfStudy: { type: String, default: "", trim: true },
    eligibleCategories: {
      type: [{ type: String, trim: true }],
      default: [],
    },
    startAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Scheduled", "Active", "Expired", "Closed", "Draft"],
      default: "Scheduled",
      trim: true,
    },
    approvalStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Approved",
      trim: true,
    },
    approvalStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      trim: true,
    },
    applicationDeadline: { type: String, default: "", trim: true },
    startDate: { type: String, default: "", trim: true },
    notificationSentAt: { type: Date, default: null },
    skills: { type: [{ type: String, trim: true }], default: [] },
    salary: { type: String, default: "", trim: true },
    applicants: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", category: "text", department: "text", location: "text", description: "text", requiredSkills: "text" });

module.exports = mongoose.model("Job", jobSchema);