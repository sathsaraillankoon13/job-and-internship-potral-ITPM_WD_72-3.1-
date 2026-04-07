const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["job_activated"],
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    isRead: { type: Boolean, default: false },
    sentAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

notificationSchema.index({ jobId: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("Notification", notificationSchema);