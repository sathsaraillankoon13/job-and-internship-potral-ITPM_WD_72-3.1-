const mongoose = require("mongoose");

const jobViewSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    viewerKey: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    viewedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

jobViewSchema.index({ jobId: 1, viewerKey: 1, viewedAt: -1 });
jobViewSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("JobView", jobViewSchema);
