const Job = require("../models/Job");
const crypto = require("crypto");
const JobView = require("../models/JobView");
const JobSubmission = require("../models/JobSubmission");
const { getJobScheduleStatus, getJobTimingLabel, parseDateTimeValue } = require("../utils/jobSchedule");

function normalizeArrayInput(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeApprovalStatus(rawValue, fallback = "Approved") {
  const allowed = new Set(["Pending", "Approved", "Rejected"]);
  const normalized = String(rawValue || "").trim().toLowerCase();
  const mapped = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
  }[normalized];

  if (mapped && allowed.has(mapped)) {
    return mapped;
  }

  return fallback;
}

function normalizeLifecycleStatus(rawStatus, startAt, expiresAt, fallbackJob = null) {
  const normalized = String(rawStatus || "").trim().toLowerCase();
  const mapped = {
    scheduled: "Scheduled",
    active: "Active",
    expired: "Expired",
    closed: "Closed",
    draft: "Draft",
  }[normalized];

  if (mapped) {
    return mapped;
  }

  if (fallbackJob) {
    return getJobScheduleStatus(fallbackJob);
  }

  return getJobScheduleStatus({ startAt, expiresAt });
}

function toJobCard(job) {
  const item = typeof job.toObject === "function" ? job.toObject() : job;
  const status = getJobScheduleStatus(item);

  return {
    ...item,
    skills: item.requiredSkills || item.skills || [],
    deadline: item.expiresAt || item.applicationDeadline,
    stipend: item.salaryStipend,
    deadlineTag: getJobTimingLabel(item),
    status,
    approvalStatus: normalizeApprovalStatus(item.approvalStatus),
    startAt: item.startAt || item.startDate,
    expiresAt: item.expiresAt || item.applicationDeadline,
  };
}

function buildJobPayload(body, existingJob = null) {
  const startAt =
    parseDateTimeValue(body.startAt || body.startDate) ||
    (existingJob ? parseDateTimeValue(existingJob.startAt || existingJob.startDate) : null);

  const expiresAt =
    parseDateTimeValue(body.expiresAt || body.applicationDeadline, { defaultToEndOfDay: true }) ||
    (existingJob
      ? parseDateTimeValue(existingJob.expiresAt || existingJob.applicationDeadline, {
          defaultToEndOfDay: true,
        })
      : null);

  return {
    title: body.title,
    opportunityType: body.opportunityType,
    category: body.category,
    department: body.department,
    location: body.location,
    description: body.description,
    requiredSkills: normalizeArrayInput(body.requiredSkills || body.skills),
    salaryStipend: body.salaryStipend,
    experienceLevel: body.experienceLevel,
    workMode: body.workMode,
    minEducation: body.minEducation,
    eligibleYear: body.eligibleYear,
    minGPA: body.minGPA || "",
    fieldOfStudy: body.fieldOfStudy || "",
    eligibleCategories: normalizeArrayInput(body.eligibleCategories),
    startAt,
    expiresAt,
    applicationDeadline: expiresAt ? expiresAt.toISOString() : body.applicationDeadline,
    startDate: startAt ? startAt.toISOString() : body.startDate,
    skills: normalizeArrayInput(body.requiredSkills || body.skills),
    salary: body.salaryStipend,
    applicants: Number(body.applicants || 0),
    status: normalizeLifecycleStatus(
      body.status,
      startAt,
      expiresAt,
      existingJob || { startAt, expiresAt }
    ),
    approvalStatus: normalizeApprovalStatus(
      body.approvalStatus,
      existingJob ? normalizeApprovalStatus(existingJob.approvalStatus) : "Approved"
    ),

  };
}

const restrictedApplicantEditFields = [
  "title",
  "category",
  "opportunityType",
  "department",
  "description",
  "requiredSkills",
  "skills",
  "salaryStipend",
  "salary",
];

async function createJob(req, res, next) {
  try {
    const payload = buildJobPayload(req.body);
    payload.approvalStatus = "Pending";

    const newJob = new Job(payload);
    const job = await newJob.save();
    res.status(201).json(toJobCard(job));
  } catch (error) {
    next(error);
  }
}

async function getAllJobs(req, res, next) {
  try {
    const { category, search, audience, approvalStatus, page, limit } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    if (approvalStatus) {
      filter.approvalStatus = {
        $regex: `^${String(approvalStatus).trim()}$`,
        $options: "i",
      };
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    let cards = jobs.map((job) => toJobCard(job));

    if (audience === "student") {
      cards = cards.filter(
        (item) => String(item.approvalStatus || "Approved").toLowerCase().trim() === "approved"
      );

      const parsedPage = Number(page);
      const parsedLimit = Number(limit);
      const shouldPaginate =
        Number.isInteger(parsedPage) &&
        parsedPage > 0 &&
        Number.isInteger(parsedLimit) &&
        parsedLimit > 0;

      if (shouldPaginate) {
        const start = (parsedPage - 1) * parsedLimit;
        const items = cards.slice(start, start + parsedLimit);

        return res.json({
          items,
          pagination: {
            total: cards.length,
            page: parsedPage,
            limit: parsedLimit,
            hasMore: start + items.length < cards.length,
          },
        });
      }
    }

    res.json(cards);
  } catch (error) {
    next(error);
  }
}

async function getJobById(req, res, next) {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(toJobCard(job));
  } catch (error) {
    next(error);
  }
}

async function updateJob(req, res, next) {
  try {
    const existingJob = await Job.findById(req.params.id);

    if (!existingJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    const update = buildJobPayload(req.body, existingJob);

    if (typeof req.body.status !== "string") {
      update.status = normalizeLifecycleStatus(
        existingJob.status,
        update.startAt,
        update.expiresAt,
        existingJob
      );
    }

    if (typeof req.body.approvalStatus !== "string") {
      update.approvalStatus = normalizeApprovalStatus(existingJob.approvalStatus);
    }

    if ((existingJob.applicants || 0) > 0) {
      restrictedApplicantEditFields.forEach((field) => {
        update[field] = existingJob[field];
      });
    }

    if (!String(update.department || "").trim()) {
      update.department = String(existingJob.department || "Technology").trim() || "Technology";
    }

    update.applicants = existingJob.applicants || 0;

    const job = await Job.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    res.json(toJobCard(job));
  } catch (error) {
    next(error);
  }
}

async function setJobApprovalStatus(req, res, next) {
  try {
    const approvalStatus = normalizeApprovalStatus(req.body?.approvalStatus || req.body?.status, "");
    if (!["Pending", "Approved", "Rejected"].includes(approvalStatus)) {
      return res.status(400).json({ message: "Invalid approval status" });
    }

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { approvalStatus },
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(toJobCard(job));
  } catch (error) {
    next(error);
  }
}

async function closeJob(req, res, next) {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status: "Closed" },
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(toJobCard(job));
  } catch (error) {
    next(error);
  }
}

async function deleteJob(req, res, next) {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await JobSubmission.deleteMany({ jobId: req.params.id });

    res.json({ message: "Job deleted" });
  } catch (error) {
    next(error);
  }
}

async function getJobApplications(req, res, next) {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const submissions = await JobSubmission.find({ jobId: req.params.id }).sort({
      appliedDate: -1,
      createdAt: -1,
    });
    res.json(submissions);
  } catch (error) {
    next(error);
  }
}

function buildViewerKey(req) {
  const sessionId = req.headers["x-session-id"] || req.headers["x-viewer-id"];
  if (sessionId) {
    return `sid:${String(sessionId).trim()}`;
  }

  const ipRaw = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || req.ip || "unknown-ip";
  const ip = String(Array.isArray(ipRaw) ? ipRaw[0] : ipRaw)
    .split(",")[0]
    .trim();
  const userAgent = String(req.headers["user-agent"] || "unknown-agent");
  const hash = crypto.createHash("sha256").update(`${ip}|${userAgent}`).digest("hex");
  return `ip:${hash}`;
}

async function trackJobView(req, res, next) {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId, { _id: 1, views: 1 });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const now = new Date();
    const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const viewerKey = buildViewerKey(req);

    const writeResult = await JobView.updateOne(
      { jobId, viewerKey, viewedAt: { $gte: cutoff } },
      {
        $setOnInsert: {
          jobId,
          viewerKey,
          viewedAt: now,
          expiresAt,
        },
      },
      { upsert: true }
    );

    const isNewView = Boolean(writeResult?.upsertedCount);
    if (isNewView) {
      const currentViews = Number(job.views || 0);
      await Job.updateOne({ _id: jobId }, { $set: { views: currentViews + 1 } });
    }

    const updatedJob = await Job.findById(jobId, { views: 1 });

    res.json({
      jobId,
      totalViews: Number(updatedJob?.views || 0),
      counted: isNewView,
    });
  } catch (error) {
    next(error);
  }
}

async function incrementJobView(req, res, next) {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId, { _id: 1, views: 1 });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const nextViews = Number(job.views || 0) + 1;
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $set: { views: nextViews } },
      { new: true, runValidators: true, projection: { _id: 1, views: 1 } }
    );

    res.json({
      jobId,
      totalViews: Number(updatedJob.views || 0),
      counted: true,
    });
  } catch (error) {
    next(error);
  }
}

async function getPendingJobs(req, res, next) {
  try {
    const jobs = await Job.find({ approvalStatus: "Pending" }).sort({ createdAt: -1 });
    res.json(jobs.map(toJobCard));
  } catch (error) {
    next(error);
  }
}

async function updateApprovalStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { approvalStatus } = req.body;

    if (!["Approved", "Rejected", "Pending"].includes(approvalStatus)) {
      return res.status(400).json({ message: "Invalid approval status" });
    }

    const job = await Job.findByIdAndUpdate(
      id,
      { approvalStatus },
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(toJobCard(job));
  } catch (error) {
    next(error);
  }
}

module.exports = {
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
};