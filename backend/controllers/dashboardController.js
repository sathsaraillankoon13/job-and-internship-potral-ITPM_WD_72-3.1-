const JobSubmission = require("../models/JobSubmission");
const Job = require("../models/Job");
const { getJobScheduleStatus } = require("../utils/jobSchedule");

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getWeekWindow(date = new Date()) {
  const start = new Date(date);
  const day = start.getDay();
  const diffToMonday = (day + 6) % 7;
  start.setDate(start.getDate() - diffToMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return { start, end };
}

function buildWeeklyApplicationVolume(submissions) {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const counts = labels.map((label) => ({ label, value: 0 }));
  const { start, end } = getWeekWindow();

  submissions.forEach((submission) => {
    const appliedAt = new Date(submission.appliedDate || submission.createdAt);
    if (Number.isNaN(appliedAt.getTime()) || appliedAt < start || appliedAt >= end) {
      return;
    }

    const dayIndex = (appliedAt.getDay() + 6) % 7;
    counts[dayIndex].value += 1;
  });

  return counts;
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getJobViews(job) {
  return toNumber(job.views || job.viewCount || job.impressions || 0);
}

function roundTo(value, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function calcGrowth(current, previous) {
  if (!previous) {
    if (!current) return 0;
    return 100;
  }

  return roundTo(((current - previous) / previous) * 100, 1);
}

function getLastNMonths(n, now = new Date()) {
  const months = [];

  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: MONTH_LABELS[d.getMonth()],
      year: d.getFullYear(),
      month: d.getMonth(),
    });
  }

  return months;
}

async function getDashboardSummary(req, res, next) {
  try {
    const jobs = await Job.find({}, { startAt: 1, expiresAt: 1, startDate: 1, applicationDeadline: 1, status: 1, _id: 1, views: 1, title: 1 });
    const [totalApplicants, submissions, recentSubmissions] = await Promise.all([
      JobSubmission.countDocuments(),
      JobSubmission.find({}, { appliedDate: 1, createdAt: 1 }),
      JobSubmission.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    const recentSubmissionsWithJob = await Promise.all(
      recentSubmissions.map(async (s) => {
        const job = await Job.findById(s.jobId, { title: 1 });
        return {
          type: "application",
          icon: "📄",
          name: `${s.firstName} ${s.lastName}`,
          action: `applied to ${job?.title || "a job"}`,
          time: s.appliedDate || s.createdAt,
        };
      })
    );


    let activeJobs = 0;
    let scheduledJobs = 0;
    let expiredJobs = 0;
    let closedJobs = 0;
    let draftJobs = 0;
    let totalViews = 0;

    jobs.forEach((job) => {
      totalViews += (job.views || 0);
      const status = getJobScheduleStatus(job);


      if (status === "Scheduled") {
        scheduledJobs += 1;
        return;
      }

      if (status === "Active") {
        activeJobs += 1;
        return;
      }

      if (status === "Closed") {
        closedJobs += 1;
        return;
      }

      if (status === "Draft") {
        draftJobs += 1;
        return;
      }

      expiredJobs += 1;
    });

    res.json({
      totalJobPostings: jobs.length,
      scheduledJobs,
      activeJobs,
      expiredJobs,
      closedJobs,
      draftJobs,
      totalApplicants,
      totalViews,
      weeklyApplicationVolume: buildWeeklyApplicationVolume(submissions),
      recentActivity: recentSubmissionsWithJob,
    });

  } catch (error) {
    next(error);
  }
}

async function getPerformanceAnalytics(req, res, next) {
  try {
    const [jobsRaw, submissionsRaw] = await Promise.all([
      Job.find({}, {
        _id: 1,
        title: 1,
        category: 1,
        location: 1,
        opportunityType: 1,
        applicants: 1,
        createdAt: 1,
        updatedAt: 1,
        views: 1,
        viewCount: 1,
        impressions: 1,
      }).lean(),
      JobSubmission.find({}, { jobId: 1, appliedDate: 1, createdAt: 1 }).lean(),
    ]);

    const jobs = Array.isArray(jobsRaw) ? jobsRaw : [];
    const submissions = Array.isArray(submissionsRaw) ? submissionsRaw : [];

    const applicationsByJob = new Map();
    submissions.forEach((submission) => {
      const jobId = String(submission.jobId || "");
      if (!jobId) return;
      applicationsByJob.set(jobId, (applicationsByJob.get(jobId) || 0) + 1);
    });

    const jobRows = jobs.map((job) => {
      const jobId = String(job._id);
      const applications = applicationsByJob.has(jobId)
        ? applicationsByJob.get(jobId)
        : toNumber(job.applicants || 0);
      const rawViews = getJobViews(job);
      const views = Math.max(rawViews, applications);
      const conversionRate = views > 0 ? roundTo((applications / views) * 100, 1) : 0;

      return {
        id: jobId,
        title: job.title || "Untitled Role",
        category: job.category || "Other",
        location: job.location || "-",
        opportunityType: job.opportunityType || "Job",
        views,
        applications,
        conversionRate,
        createdAt: job.createdAt,
      };
    });

    const totalViews = jobRows.reduce((sum, row) => sum + row.views, 0);
    const totalApplications = submissions.length > 0
      ? submissions.length
      : jobRows.reduce((sum, row) => sum + row.applications, 0);

    const avgClickRate = totalViews > 0 ? roundTo((totalApplications / totalViews) * 100, 1) : 0;
    const jobsWithViews = jobRows.filter((row) => row.views > 0);
    const avgConversionRate = jobsWithViews.length > 0
      ? roundTo(jobsWithViews.reduce((sum, row) => sum + row.conversionRate, 0) / jobsWithViews.length, 1)
      : 0;

    const lastMonths = getLastNMonths(6);
    const monthBuckets = new Map(lastMonths.map((m) => [m.key, { month: m.label, views: 0, applications: 0 }]));

    jobRows.forEach((row) => {
      const d = new Date(row.createdAt || Date.now());
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const bucket = monthBuckets.get(key);
      if (!bucket) return;
      bucket.views += row.views;
    });

    submissions.forEach((submission) => {
      const d = new Date(submission.appliedDate || submission.createdAt || Date.now());
      if (Number.isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const bucket = monthBuckets.get(key);
      if (!bucket) return;
      bucket.applications += 1;
    });

    const monthlyTrend = lastMonths.map((m) => monthBuckets.get(m.key));

    const currentMonth = monthlyTrend[monthlyTrend.length - 1] || { views: totalViews, applications: totalApplications };
    const previousMonth = monthlyTrend[monthlyTrend.length - 2] || { views: 0, applications: 0 };
    const currentCtr = currentMonth.views > 0 ? (currentMonth.applications / currentMonth.views) * 100 : 0;
    const previousCtr = previousMonth.views > 0 ? (previousMonth.applications / previousMonth.views) * 100 : 0;

    const categoryMap = new Map();
    jobRows.forEach((row) => {
      categoryMap.set(row.id, row.category);
    });

    const categoryApplications = new Map();
    submissions.forEach((submission) => {
      const category = categoryMap.get(String(submission.jobId)) || "Other";
      categoryApplications.set(category, (categoryApplications.get(category) || 0) + 1);
    });

    if (categoryApplications.size === 0) {
      jobRows.forEach((row) => {
        categoryApplications.set(row.category, (categoryApplications.get(row.category) || 0) + row.applications);
      });
    }

    const totalCategoryApplications = Array.from(categoryApplications.values()).reduce((sum, value) => sum + value, 0);
    const categoryBreakdown = Array.from(categoryApplications.entries())
      .map(([category, applications]) => ({
        category,
        applications,
        percentage: totalCategoryApplications > 0 ? roundTo((applications / totalCategoryApplications) * 100, 1) : 0,
      }))
      .sort((a, b) => b.applications - a.applications)
      .slice(0, 6);

    const topPerformerRow = [...jobRows].sort((a, b) => {
      if (b.applications !== a.applications) return b.applications - a.applications;
      return b.views - a.views;
    })[0];

    const topPerformer = topPerformerRow
      ? {
          title: topPerformerRow.title,
          opportunityType: jobs.find((job) => String(job._id) === topPerformerRow.id)?.opportunityType || "Job",
          location: topPerformerRow.location,
          postedOn: new Date(jobs.find((job) => String(job._id) === topPerformerRow.id)?.createdAt || Date.now())
            .toISOString()
            .slice(0, 10),
          metrics: {
            views: topPerformerRow.views,
            applications: topPerformerRow.applications,
            conversionRate: topPerformerRow.conversionRate,
            clickRate: topPerformerRow.views > 0 ? roundTo((topPerformerRow.applications / topPerformerRow.views) * 100, 1) : 0,
          },
        }
      : {
          title: "No job data yet",
          opportunityType: "-",
          location: "-",
          postedOn: new Date().toISOString().slice(0, 10),
          metrics: {
            views: 0,
            applications: 0,
            conversionRate: 0,
            clickRate: 0,
          },
        };

    const jobPerformance = [...jobRows]
      .sort((a, b) => {
        if (b.applications !== a.applications) return b.applications - a.applications;
        return b.views - a.views;
      })
      .slice(0, 12)
      .map((row) => ({
        title: row.title,
        category: row.category,
        views: row.views,
        applications: row.applications,
        conversionRate: row.conversionRate,
      }));

    const payload = {
      summaryCards: [
        { key: "views", title: "Total Job Views", value: totalViews, growthPercent: calcGrowth(currentMonth.views, previousMonth.views) },
        { key: "applications", title: "Total Applications", value: totalApplications, growthPercent: calcGrowth(currentMonth.applications, previousMonth.applications) },
        { key: "ctr", title: "Avg. Click Rate", value: avgClickRate, growthPercent: calcGrowth(currentCtr, previousCtr), suffix: "%" },
        { key: "conversion", title: "Avg. Conversion Rate", value: avgConversionRate, growthPercent: calcGrowth(avgConversionRate, previousCtr), suffix: "%" },
      ],
      monthlyTrend,
      categoryBreakdown,
      topPerformer,
      jobPerformance,
      updatedAt: new Date().toISOString(),
    };

    res.json(payload);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboardSummary,
  getPerformanceAnalytics,
};