function parseDateTimeValue(dateValue, { defaultToEndOfDay = false } = {}) {
  if (dateValue === null || dateValue === undefined || dateValue === "") {
    return null;
  }

  const rawValue = String(dateValue).trim();
  if (!rawValue) {
    return null;
  }

  const date = new Date(rawValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
    if (defaultToEndOfDay) {
      date.setHours(23, 59, 59, 999);
    } else {
      date.setHours(0, 0, 0, 0);
    }
  }

  return date;
}

function getCurrentDateTime() {
  return new Date();
}

function formatClockLabel(dateValue) {
  const date = parseDateTimeValue(dateValue);

  if (!date) {
    return "";
  }

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getJobScheduleBounds(job) {
  const startAt = parseDateTimeValue(job.startAt || job.startDate);
  const expiresAt = parseDateTimeValue(job.expiresAt || job.applicationDeadline, { defaultToEndOfDay: true });

  return { startAt, expiresAt };
}

function getJobScheduleStatus(job, currentDateTime = getCurrentDateTime()) {
  const manualStatus = String(job.status || "").trim().toLowerCase();
  if (manualStatus === "closed") {
    return "Closed";
  }

  if (manualStatus === "draft") {
    return "Draft";
  }

  const { startAt, expiresAt } = getJobScheduleBounds(job);

  if (!startAt || !expiresAt) {
    return "Scheduled";
  }

  if (currentDateTime < startAt) {
    return "Scheduled";
  }

  if (currentDateTime > expiresAt) {
    return "Expired";
  }

  return "Active";
}

function getJobTimingLabel(job, currentDateTime = getCurrentDateTime()) {
  const status = getJobScheduleStatus(job, currentDateTime);
  const { startAt, expiresAt } = getJobScheduleBounds(job);

  if (status === "Closed") {
    return "Applications Closed";
  }

  if (status === "Draft") {
    return "Draft";
  }

  if (status === "Scheduled") {
    const openTime = formatClockLabel(startAt || job.startDate);
    return openTime ? `Coming Soon · Opens at ${openTime}` : "Coming Soon";
  }

  if (!expiresAt) {
    return "No deadline";
  }

  if (status === "Expired") {
    return "Expired";
  }

  const diffMs = expiresAt.getTime() - currentDateTime.getTime();
  if (diffMs <= 0) {
    return "Closing now";
  }

  const sameDay = expiresAt.toDateString() === currentDateTime.toDateString();
  if (sameDay) {
    const hours = Math.ceil(diffMs / 3600000);
    if (hours >= 1) {
      return `Closes in ${hours} hours`;
    }

    const minutes = Math.max(1, Math.ceil(diffMs / 60000));
    return `Closes in ${minutes} minutes`;
  }

  const days = Math.ceil(diffMs / 86400000);
  if (days === 1) return "1 day left";
  return `${days} days left`;
}

module.exports = {
  formatClockLabel,
  getCurrentDateTime,
  getJobScheduleBounds,
  getJobScheduleStatus,
  getJobTimingLabel,
  parseDateTimeValue,
};