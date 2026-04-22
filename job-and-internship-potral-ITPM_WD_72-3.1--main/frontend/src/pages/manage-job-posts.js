import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EmployerShell from "../components/EmployerShell";
import { useEmployerJobs } from "../context/EmployerJobsContext";
import { getJobScheduleStatus } from "../utils/jobSchedule";
import styles from "../styles/manage-job-posts.module.css";

const statusClass = {
  scheduled: "bg-amber-100 text-amber-700",
  active: "bg-emerald-100 text-emerald-700",
  expired: "bg-red-100 text-red-600",
  closed: "bg-slate-100 text-slate-600",
  draft: "bg-amber-100 text-amber-700",
};

const approvalClass = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-600",
};

const displayStatus = (status) => status.charAt(0).toUpperCase() + status.slice(1);

export default function ManageJobPostsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [now, setNow] = useState(() => new Date());
  const { jobs, closeJob, deleteJob, loading, error } = useEmployerJobs();

  const getJobStatusKey = (job) => {
    const manualStatus = String(job.status || "").toLowerCase();
    if (manualStatus === "closed" || manualStatus === "draft") {
      return manualStatus;
    }

    return getJobScheduleStatus(job, now).toLowerCase();
  };

  const dynamicCounts = useMemo(() => {
    return jobs.reduce(
      (acc, job) => {
        const status = getJobStatusKey(job);
        acc.total += 1;

        if (status === "scheduled") acc.scheduled += 1;
        else if (status === "active") acc.active += 1;
        else if (status === "expired") acc.expired += 1;
        else if (status === "closed") acc.closed += 1;
        else if (status === "draft") acc.draft += 1;

        return acc;
      },
      { total: 0, scheduled: 0, active: 0, expired: 0, closed: 0, draft: 0 }
    );
  }, [jobs, now]);

  const filters = [
    ["all", `All (${dynamicCounts.total})`],
    ["scheduled", `Scheduled (${dynamicCounts.scheduled})`],
    ["active", `Active (${dynamicCounts.active})`],
    ["expired", `Expired (${dynamicCounts.expired})`],
    ["closed", `Closed (${dynamicCounts.closed})`],
    ["draft", `Drafts (${dynamicCounts.draft})`],
  ];

  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(intervalId);
  }, []);

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return jobs.filter((job) => {
      const jobStatus = getJobStatusKey(job);
      const matchesFilter = activeFilter === "all" || jobStatus === activeFilter;
      const matchesQuery =
        !query ||
        job.title.toLowerCase().includes(query) ||
        job.category.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        (Array.isArray(job.skills) && job.skills.join(", ").toLowerCase().includes(query));
      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, jobs, now, search]);

  const getApprovalStatusKey = (job) => String(job.approvalStatus || "Approved").toLowerCase();

  const formatApprovalStatus = (status) => status.charAt(0).toUpperCase() + status.slice(1);

  const handleManualClose = async (jobId) => {
    try {
      await closeJob(jobId);
      window.dispatchEvent(new Event("careerbridge:data-updated"));
      if (typeof window !== "undefined") {
        window.localStorage.setItem("careerbridge-jobs-updated", String(Date.now()));
      }
    } catch {
      // The page-level error banner from context will display API failures.
    }
  };

  return (
    <div className={styles.page}>
      <EmployerShell
        activeKey="manage-jobs"
        title="Manage Job Posts"
        subtitle="View, edit, and control all your job listings."
      >
      {loading ? <div className="mb-5 rounded-2xl border border-sky-200 bg-white p-4 shadow-card">Loading jobs...</div> : null}
      {error ? <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["📋", dynamicCounts.total, "Total Posts"],
          ["🟢", dynamicCounts.active, "Active"],
          ["⏰", dynamicCounts.expired, "Expired"],
          ["🔒", dynamicCounts.closed, "Closed"],
        ].map((item) => (
          <div key={item[2]} className="rounded-2xl border border-[#0262BA]/25 bg-gradient-to-br from-sky-50 to-[#0262BA]/[0.03] p-4 shadow-[0_10px_30px_rgba(2,98,186,0.14)]">
            <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#0262BA]/12 text-lg">{item[0]}</div>
            <p className="font-['Sora'] text-2xl font-extrabold leading-none">{item[1]}</p>
            <p className="mt-1 text-xs text-slate-500">{item[2]}</p>
          </div>
        ))}
      </section>

      <section className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-[#0262BA]/25 bg-gradient-to-br from-sky-50 to-[#0262BA]/[0.03] p-4 shadow-[0_10px_30px_rgba(2,98,186,0.14)]">
        <div className="flex min-w-[230px] flex-1 items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2">
          <span>🔍</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full bg-transparent text-sm outline-none"
            placeholder="Search job title, type..."
          />
        </div>

        {filters.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveFilter(key)}
            className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${
              activeFilter === key ? "border-blue-600 bg-blue-600 text-white" : "border-blue-200 bg-blue-100 text-blue-700"
            }`}
          >
            {label}
          </button>
        ))}

        <Link to="/employer/post-job" className="ml-auto rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-bold text-white">
          + Post New Job
        </Link>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#0262BA]/25 bg-gradient-to-br from-sky-50 to-[#0262BA]/[0.03] shadow-[0_10px_30px_rgba(2,98,186,0.14)]">
        <div className="hidden grid-cols-[2fr,1fr,1fr,1fr,1fr,1.2fr] bg-gradient-to-r from-[#0262BA]/10 to-sky-50 px-5 py-3 text-[11px] font-extrabold uppercase tracking-wide text-[#0262BA] lg:grid">
          <p>Job Title</p>
          <p>Category</p>
          <p>Applicants</p>
          <p>Status</p>
          <p>Approval</p>
          <p>Actions</p>
        </div>

        {rows.map((job) => (
          <div key={job._id || job.id} className="grid gap-3 border-b border-[#0262BA]/10 px-5 py-3 last:border-0 lg:grid-cols-[2fr,1fr,1fr,1fr,1fr,1.2fr] lg:items-center">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">{job.icon}</span>
              <div>
                <p className="text-sm font-bold text-slate-900">{job.title}</p>
                <p className="text-xs text-slate-500">{job.location} · {job.salaryStipend}</p>
              </div>
            </div>

            <div>
              <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-700">
                {job.category}
              </span>
            </div>

            <p className="font-bold text-[#0262BA]">{job.applicants || 0}</p>
            <div>
              {(() => {
                const status = getJobStatusKey(job);

                return (
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusClass[status] || statusClass.expired}`}>
                    {displayStatus(status)}
                  </span>
                );
              })()}
            </div>

            <div>
              {(() => {
                const approval = getApprovalStatusKey(job);

                return (
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${approvalClass[approval] || approvalClass.pending}`}>
                    {formatApprovalStatus(approval)}
                  </span>
                );
              })()}
            </div>

            <div className="flex gap-2">
              {getJobStatusKey(job) === "expired" ? (
                <>
                  <button type="button" className="rounded-lg bg-emerald-100 px-2 py-1">♻️</button>
                  <button type="button" onClick={() => deleteJob(job._id || job.id)} className="rounded-lg bg-red-100 px-2 py-1">🗑️</button>
                </>
              ) : (
                <>
                  <Link to={`/employer/post-job?editId=${job._id || job.id}`} className="rounded-lg bg-blue-100 px-2 py-1">✏️</Link>
                  <button
                    type="button"
                    onClick={() => handleManualClose(job._id || job.id)}
                    disabled={getJobStatusKey(job) === "closed"}
                    className="rounded-lg bg-amber-100 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-60"
                    title={getJobStatusKey(job) === "closed" ? "Already closed" : "Close applications"}
                  >
                    🔒
                  </button>
                  <button type="button" onClick={() => deleteJob(job._id || job.id)} className="rounded-lg bg-red-100 px-2 py-1">🗑️</button>
                </>
              )}
            </div>
          </div>
        ))}
        {!loading && rows.length === 0 ? <p className="px-5 py-5 text-sm text-slate-500">No jobs found for this filter/search.</p> : null}
      </section>
      </EmployerShell>
    </div>
  );
}
