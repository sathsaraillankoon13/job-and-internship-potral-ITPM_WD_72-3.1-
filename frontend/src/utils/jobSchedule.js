export function parseDateTimeValue(dateValue, { defaultToEndOfDay = false } = {}) {
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

export function toDateTimeLocalValue(dateValue) {
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function formatClockLabel(dateValue) {
  const date = parseDateTimeValue(dateValue);

  if (!date) {
    return "";
  }

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getJobScheduleStatus(job, currentDateTime = new Date()) {
  const manualStatus = String(job.status || "").trim().toLowerCase();
  if (manualStatus === "closed") {
    return "Closed";
  }

  if (manualStatus === "draft") {
    return "Draft";
  }

  const startAt = parseDateTimeValue(job.startAt || job.startDate);
  const expiresAt = parseDateTimeValue(job.expiresAt || job.applicationDeadline, { defaultToEndOfDay: true });

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

export function getJobTimingLabel(job, currentDateTime = new Date()) {
  const status = getJobScheduleStatus(job, currentDateTime);
  const startAt = parseDateTimeValue(job.startAt || job.startDate);
  const expiresAt = parseDateTimeValue(job.expiresAt || job.applicationDeadline, { defaultToEndOfDay: true });

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
