import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

function emitJobsUpdated() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem("careerbridge-jobs-updated", String(Date.now()));
  window.dispatchEvent(new Event("careerbridge:data-updated"));
}

export async function fetchJobs(params = {}) {
  const response = await api.get("jobs", { params });
  return response.data;
}

export async function fetchJob(jobId) {
  const response = await api.get(`jobs/${jobId}`);
  return response.data;
}

function getViewerSessionId() {
  if (typeof window === "undefined") {
    return "server";
  }

  const key = "careerbridge-viewer-id";
  const existing = window.localStorage.getItem(key);
  if (existing) {
    return existing;
  }

  const next = `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
  window.localStorage.setItem(key, next);
  return next;
}

export async function incrementJobView(jobId) {
  const response = await api.put(
    `jobs/${jobId}/view`,
    {},
    {
      headers: {
        "x-session-id": getViewerSessionId(),
      },
    }
  );

  if (typeof window !== "undefined") {
    emitJobsUpdated();
  }

  return response.data;
}

export async function trackJobView(jobId) {
  return incrementJobView(jobId);
}

export async function fetchAnalytics() {
  const response = await api.get("analytics");
  return response.data;
}

export async function fetchPerformanceAnalytics() {
  const response = await api.get("analytics/performance");
  return response.data;
}

export async function fetchNotifications() {
  const response = await api.get("notifications");
  return response.data;
}

export async function markNotificationRead(notificationId) {
  const response = await api.patch(`notifications/${notificationId}/read`);
  return response.data;
}

export async function createJob(payload) {
  const response = await api.post("jobs", payload);
  emitJobsUpdated();
  return response.data;
}

export async function updateJob(jobId, payload) {
  const response = await api.put(`jobs/${jobId}`, payload);
  emitJobsUpdated();
  return response.data;
}

export async function updateJobApproval(jobId, approvalStatus) {
  const response = await api.patch(`jobs/${jobId}/approval`, { approvalStatus });
  emitJobsUpdated();
  return response.data;
}

export async function approveJob(jobId) {
  return updateJobApproval(jobId, "Approved");
}

export async function rejectJob(jobId) {
  return updateJobApproval(jobId, "Rejected");
}

export async function closeJob(jobId) {
  const response = await api.patch(`jobs/${jobId}/close`);
  emitJobsUpdated();
  return response.data;
}

export async function deleteJob(jobId) {
  const response = await api.delete(`jobs/${jobId}`);
  emitJobsUpdated();
  return response.data;
}

export async function fetchPendingJobs() {
  const response = await api.get("jobs/admin/pending");
  return response.data;
}

export async function createSubmission(payload) {
  const response = await api.post("submissions", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function sendAssistantMessage(payload) {
  const response = await api.post("assistant/message", payload);
  return response.data;
}

export async function updateUser(userId, payload) {
  const response = await api.put(`users/${userId}`, payload);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("careerbridge:data-updated"));
  }
  return response.data;
}

export async function updateUserStatus(userId, status) {
  const response = await api.patch(`users/${userId}/status`, { status });
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("careerbridge:data-updated"));
  }
  return response.data;
}

export default api;
