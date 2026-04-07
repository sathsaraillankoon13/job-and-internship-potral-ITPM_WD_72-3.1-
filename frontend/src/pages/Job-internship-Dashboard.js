import { Link } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import EmployerShell from "../components/EmployerShell";
import { fetchAnalytics, fetchJobs } from "../api";
import { getJobScheduleStatus, getJobTimingLabel } from "../utils/jobSchedule";
import styles from "../styles/Job-internship-Dashboard.module.css";

function StatCard({ item }) {
  const trendClass = {
    up: "bg-emerald-100 text-emerald-700",
    down: "bg-red-100 text-red-600",
    neutral: "bg-[#0262BA]/15 text-[#0262BA]",
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#0262BA]/25 bg-gradient-to-br from-sky-50 to-[#0262BA]/[0.04] p-5 shadow-[0_10px_30px_rgba(2,98,186,0.18)] transition hover:-translate-y-1">
      <div className="absolute inset-x-0 top-0 h-1 bg-[#0262BA]" />
      <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#0262BA]/15 text-xl text-[#0262BA]">{item.icon}</div>
      <p className="font-['Sora'] text-3xl font-extrabold leading-none tracking-tight">{item.value}</p>
      <p className="mt-1 text-sm text-slate-500">{item.label}</p>
      <span className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${trendClass[item.tone]}`}>{item.trend}</span>
    </div>
  );
}

function getDeadlineTag(dateValue) {
  const deadline = new Date(dateValue);
  if (Number.isNaN(deadline.getTime())) return "No deadline";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);
  const days = Math.ceil((deadline.getTime() - today.getTime()) / 86400000);
  if (days < 0) return "Expired";
  if (days === 0) return "Closes today";
  if (days === 1) return "1 day left";
  return `${days} days left`;
}

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function JobInternshipDashboardPage() {
  const [analytics, setAnalytics] = useState({ totalJobPostings: 0, activeJobs: 0, expiredJobs: 0, totalApplicants: 0 });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [now, setNow] = useState(() => new Date());

  const loadDashboard = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }
    setError("");

    try {
      const [analyticsData, jobsData] = await Promise.all([fetchAnalytics(), fetchJobs()]);
      setAnalytics(analyticsData);
      setJobs(Array.isArray(jobsData) ? jobsData : []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to load dashboard data");
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;

    const safeLoad = async (silent = false) => {
      if (!active) return;
      await loadDashboard(silent);
    };

    safeLoad(false);

    const intervalId = setInterval(() => {
      safeLoad(true);
    }, 5000);

    const onDataUpdated = () => {
      safeLoad(true);
    };

    const onWindowFocus = () => {
      safeLoad(true);
    };

    window.addEventListener("careerbridge:data-updated", onDataUpdated);
    window.addEventListener("focus", onWindowFocus);

    return () => {
      active = false;
      clearInterval(intervalId);
      window.removeEventListener("careerbridge:data-updated", onDataUpdated);
      window.removeEventListener("focus", onWindowFocus);
    };
  }, [loadDashboard]);

  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(intervalId);
  }, []);

  const getJobStatusKey = (job) => {
    const manualStatus = String(job.status || "").toLowerCase();
    if (manualStatus === "closed" || manualStatus === "draft") {
      return manualStatus;
    }

    return getJobScheduleStatus(job, now).toLowerCase();
  };

  const liveCounts = useMemo(() => {
    return jobs.reduce(
      (acc, job) => {
        const status = getJobStatusKey(job);
        acc.total += 1;
        acc.applicants += Number(job.applicants || 0);

        if (status === "scheduled") acc.scheduled += 1;
        else if (status === "active") acc.active += 1;
        else if (status === "expired") acc.expired += 1;
        else if (status === "closed") acc.closed += 1;
        else if (status === "draft") acc.draft += 1;

        return acc;
      },
      { total: 0, scheduled: 0, active: 0, expired: 0, closed: 0, draft: 0, applicants: 0 }
    );
  }, [jobs, now]);

  const countsOverride = {
    total: liveCounts.total,
    scheduled: liveCounts.scheduled,
    active: liveCounts.active,
    expired: liveCounts.expired,
    closed: liveCounts.closed,
    draft: liveCounts.draft,
    applicants: liveCounts.applicants,
  };

  const stats = [
    { icon: "📋", value: liveCounts.total, label: "Total Job Postings", trend: "Live updates", tone: "up" },
    { icon: "✅", value: liveCounts.active, label: "Active Jobs", trend: "Currently live", tone: "neutral" },
    { icon: "⏰", value: liveCounts.expired, label: "Expired Jobs", trend: "Auto synced", tone: "down" },
    { icon: "👥", value: liveCounts.applicants, label: "Total Applicants", trend: "Across all jobs", tone: "up" },
  ];

  const weeklyApplicationVolume = useMemo(() => {
    if (Array.isArray(analytics.weeklyApplicationVolume) && analytics.weeklyApplicationVolume.length === 7) {
      return analytics.weeklyApplicationVolume.map((item, index) => ({
        label: item?.label || WEEKDAY_LABELS[index],
        value: Number(item?.value || 0),
      }));
    }

    return WEEKDAY_LABELS.map((label) => ({ label, value: 0 }));
  }, [analytics]);

  const maxWeeklyApplications = Math.max(...weeklyApplicationVolume.map((item) => Number(item.value || 0)), 1);

  const recentJobs = jobs.slice(0, 4).map((job) => ({
    id: job._id,
    title: job.title,
    location: job.location,
    stipend: job.salaryStipend,
    applicants: job.applicants || 0,
    status: getJobScheduleStatus(job, now),
    deadlineTag: job.deadlineTag || getJobTimingLabel(job, now),
  }));

  const formatStatus = (status) => status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <div className={styles.page}>
      <EmployerShell activeKey="dashboard" title="Job and Internship Dashboard" subtitle="Welcome back! Here's your overview for today." countsOverride={countsOverride}>
        {loading ? <div className="mb-5 rounded-2xl border border-sky-200 bg-white p-4 shadow-card">Loading dashboard data...</div> : null}
        {error ? <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

        <section className="relative mb-7 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 to-sky-500 p-7 text-white shadow-[0_14px_34px_rgba(37,99,235,0.28)] lg:p-9">
          <div className="pointer-events-none absolute -right-14 -top-14 h-56 w-56 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute bottom-[-70px] right-16 h-44 w-44 rounded-full bg-white/10" />
          <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-['Sora'] text-2xl font-extrabold tracking-tight lg:text-3xl">CareerBridge employer dashboard</h2>
              <p className="mt-1 text-sm text-white/80">The latest jobs and applicants are synced from the backend.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link to="/employer/post-job" className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-blue-700">
                  + Post New Job
                </Link>
                <Link to="/employer/manage-job-posts" className="rounded-lg border border-white/40 bg-white/15 px-4 py-2 text-sm font-bold text-white">
                  View Listings
                </Link>
              </div>
            </div>
            <div className="text-6xl drop-shadow">💼</div>
          </div>
        </section>

        <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <StatCard key={item.label} item={item} />
          ))}
        </section>

        <section className="mb-6 grid gap-5 xl:grid-cols-[1.4fr,1fr]">
          <article className="rounded-2xl border border-[#0262BA]/25 bg-gradient-to-br from-sky-50 to-[#0262BA]/[0.03] shadow-[0_10px_30px_rgba(2,98,186,0.14)]">
            <div className="flex items-center justify-between border-b border-[#0262BA]/20 px-5 py-4 lg:px-6">
              <div>
                <h3 className="font-['Sora'] text-[15px] font-extrabold">Recent Job Postings</h3>
                <p className="text-xs text-slate-500">Your most recently published opportunities</p>
              </div>
              <Link to="/employer/manage-job-posts" className="rounded-lg bg-[#0262BA]/12 px-3 py-1.5 text-xs font-bold text-[#0262BA]">
                View All
              </Link>
            </div>

            <div className="px-5 py-3 lg:px-6">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center gap-3 border-b border-[#0262BA]/10 py-3 last:border-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0262BA]/12 text-lg">💼</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">{job.title}</p>
                    <p className="text-xs text-slate-500">
                      {job.location} | {job.stipend} | {job.deadlineTag}
                    </p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${job.status === "Active" ? "bg-emerald-100 text-emerald-700" : job.status === "Scheduled" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}`}>
                    {formatStatus(job.status)}
                  </span>
                  <div className="text-right">
                    <p className="font-['Sora'] text-lg font-extrabold text-[#0262BA]">{job.applicants}</p>
                    <p className="text-[10px] text-slate-400">applicants</p>
                  </div>
                </div>
              ))}
              {!loading && recentJobs.length === 0 ? <p className="py-4 text-sm text-slate-500">No job postings yet. Create your first one.</p> : null}
            </div>
          </article>

          <div className="flex flex-col gap-5">
            <article className="rounded-2xl border border-[#0262BA]/25 bg-gradient-to-br from-sky-50 to-[#0262BA]/[0.03] shadow-[0_10px_30px_rgba(2,98,186,0.14)]">
              <div className="border-b border-[#0262BA]/20 px-5 py-4 lg:px-6">
                <h3 className="font-['Sora'] text-[15px] font-extrabold">Applications This Week</h3>
                <p className="text-xs text-slate-500">Daily application volume</p>
              </div>
              <div className="px-5 py-5 lg:px-6">
                <div className="rounded-xl bg-gradient-to-b from-[#0262BA]/10 to-sky-50 p-4">
                  <div className="flex h-36 items-end gap-2">
                    {weeklyApplicationVolume.map((item) => {
                      const value = Number(item.value || 0);
                      const barHeight = value > 0
                        ? Math.max(12, Math.round((value / maxWeeklyApplications) * 96))
                        : 0;

                      return (
                        <div key={item.label} className="flex flex-1 flex-col items-center gap-1.5">
                          <div className="w-full rounded-t-md bg-gradient-to-b from-[#1a7cd8] to-[#0262BA]" style={{ height: `${barHeight}px` }} />
                          <span className="text-[10px] font-semibold text-slate-400">{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-[#0262BA]/25 bg-gradient-to-br from-sky-50 to-[#0262BA]/[0.03] shadow-[0_10px_30px_rgba(2,98,186,0.14)]">
              <div className="border-b border-[#0262BA]/20 px-5 py-4 lg:px-6">
                <h3 className="font-['Sora'] text-[15px] font-extrabold">Quick Actions</h3>
              </div>
              <div className="grid grid-cols-3 gap-3 p-4">
                <Link to="/employer/post-job" className="rounded-xl border border-[#0262BA]/25 bg-[#0262BA]/10 p-3 text-center hover:bg-[#0262BA]/20">
                  <p className="text-2xl">➕</p>
                  <p className="text-xs font-bold text-slate-700">Post Job</p>
                </Link>
                <Link to="/employer/manage-job-posts" className="rounded-xl border border-[#0262BA]/25 bg-[#0262BA]/10 p-3 text-center hover:bg-[#0262BA]/20">
                  <p className="text-2xl">📋</p>
                  <p className="text-xs font-bold text-slate-700">Manage</p>
                </Link>
                <Link to="/employer/analytics" className="rounded-xl border border-[#0262BA]/25 bg-[#0262BA]/10 p-3 text-center hover:bg-[#0262BA]/20">
                  <p className="text-2xl">📊</p>
                  <p className="text-xs font-bold text-slate-700">Analytics</p>
                </Link>
              </div>
            </article>
          </div>
        </section>

        <section className="rounded-2xl border border-[#0262BA]/25 bg-gradient-to-br from-sky-50 to-[#0262BA]/[0.03] shadow-[0_10px_30px_rgba(2,98,186,0.14)]">
          <div className="border-b border-[#0262BA]/20 px-5 py-4 lg:px-6">
            <h3 className="font-['Sora'] text-[15px] font-extrabold">Recent Activity</h3>
            <p className="text-xs text-slate-500">Latest events on your portal</p>
          </div>
          <div className="grid gap-x-6 px-5 py-3 sm:grid-cols-2 lg:px-6">
            {[
              ["📄", "Kavindu Perera", "applied to Frontend Developer", "10 minutes ago"],
              ["👁️", "Mobile App Intern", "received 12 new views", "1 hour ago"],
              ["✅", "Data Analyst", "post was approved and published", "3 hours ago"],
              ["⏰", "DevOps Engineer", "listing has expired", "Yesterday"],
            ].map((item) => (
              <div key={item[1]} className="flex gap-3 border-b border-[#0262BA]/10 py-3 last:border-0">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#0262BA]/12">{item[0]}</div>
                <div>
                  <p className="text-sm text-slate-700">
                    <span className="font-bold text-slate-900">{item[1]}</span> {item[2]}
                  </p>
                  <p className="text-xs text-slate-400">{item[3]}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </EmployerShell>
    </div>
  );
}
