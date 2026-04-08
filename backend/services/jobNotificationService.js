const mongoose = require("mongoose");
const Job = require("../models/Job");
const Notification = require("../models/Notification");
const { getJobScheduleStatus } = require("../utils/jobSchedule");

async function syncScheduledJobNotifications() {
  const jobs = await Job.find({}, { title: 1, startAt: 1, expiresAt: 1, startDate: 1, applicationDeadline: 1, notificationSentAt: 1 });
  const notifications = [];

  for (const job of jobs) {
    // Safety check for job ID to prevent CastErrors
    if (!job || !job._id || !mongoose.Types.ObjectId.isValid(job._id)) {
      console.warn(`Skipping job notification sync for invalid job ID: ${job ? job._id : 'null'}`);
      continue;
    }

    const status = getJobScheduleStatus(job);

    if (status !== "Active" || job.notificationSentAt) {
      continue;
    }

    try {
      const existing = await Notification.findOne({ jobId: job._id, type: "job_activated" });
      if (existing) {
        await Job.updateOne({ _id: job._id }, { $set: { notificationSentAt: existing.sentAt || new Date() } });
        continue;
      }

      notifications.push({
        jobId: job._id,
        type: "job_activated",
        title: "Job is now active",
        message: `${job.title} is now open for applications.`,
        sentAt: new Date(),
      });

      await Job.updateOne({ _id: job._id }, { $set: { notificationSentAt: new Date() } });
    } catch (error) {
      console.error(`Failed to process notification for job ${job._id}:`, error.message);
      // Don't crash the whole sync if one job fails
    }
  }

  if (notifications.length > 0) {
    await Notification.insertMany(notifications, { ordered: false });
  }

  return notifications.length;
}

module.exports = {
  syncScheduledJobNotifications,
};