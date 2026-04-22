import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import { fetchJobs } from "../api";
import { getJobScheduleStatus, getJobTimingLabel } from "../utils/jobSchedule";
import styles from "../styles/opportunities.module.css";

const categories = ["all", "IT", "Marketing", "Finance", "Design", "Engineering"];

function getAppliedJobIds() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem("careerbridge-applied-jobs");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function mapJob(job) {
  return {
    id: job._id,
    title: job.title,
    category: job.category,
    location: job.location,
    stipend: job.salaryStipend || job.stipend || "",
    skills: Array.isArray(job.skills) ? job.skills : [],
    description: job.description,
    experienceLevel: job.experienceLevel,
    startAt: job.startAt || job.startDate,
    expiresAt: job.expiresAt || job.applicationDeadline,
    applicationDeadline: job.expiresAt || job.applicationDeadline,
    deadlineTag: job.deadlineTag || getJobTimingLabel(job),
    company: job.company || "CareerBridge",
    status: job.status || getJobScheduleStatus(job),
    approvalStatus: job.approvalStatus || "Approved",
  };
}

export default function OpportunitiesPage({ user }) {

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = "Opportunities | CareerBridge";
  }, []);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [now, setNow] = useState(() => new Date());

  const loadJobs = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
      setError("");
    }

    try {
      const params = {};
      params.audience = "student";
      if (category !== "all") {
        params.category = category;
      }
      if (search.trim()) {
        params.search = search.trim();
      }

      const data = await fetchJobs(params);
      const mapped = Array.isArray(data) ? data.map(mapJob) : Array.isArray(data?.items) ? data.items.map(mapJob) : [];
      setJobs(mapped.filter((job) => String(job.approvalStatus || "Approved").toLowerCase() === "approved"));
      if (silent) {
        setError("");
      }
    } catch (err) {
      if (!silent || jobs.length === 0) {
        setError(err?.response?.data?.message || err.message || "Failed to load jobs");
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [category, jobs.length, search]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryQuery = searchParams.get("category");
    const qQuery = searchParams.get("q");

    if (categoryQuery) {
      setCategory(categoryQuery);
    }
    if (qQuery) {
      setSearch(qQuery);
    }
  }, [location.search]);

  useEffect(() => {
    const refreshAppliedJobs = () => setAppliedJobIds(getAppliedJobIds());

    refreshAppliedJobs();
    window.addEventListener("careerbridge:data-updated", refreshAppliedJobs);
    window.addEventListener("storage", refreshAppliedJobs);

    return () => {
      window.removeEventListener("careerbridge:data-updated", refreshAppliedJobs);
      window.removeEventListener("storage", refreshAppliedJobs);
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let active = true;

    const safeLoad = async (silent = false) => {
      if (!active) return;
      await loadJobs(silent);
    };

    safeLoad(false);

    const intervalId = setInterval(() => {
      safeLoad(true);
    }, 5000);

    const onDataUpdated = () => {
      safeLoad(true);
    };

    const onStorage = (event) => {
      if (!event.key || event.key === "careerbridge-jobs-updated") {
        safeLoad(true);
      }
    };

    const onFocus = () => {
      safeLoad(true);
    };

    window.addEventListener("careerbridge:data-updated", onDataUpdated);
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);

    return () => {
      active = false;
      clearInterval(intervalId);
      window.removeEventListener("careerbridge:data-updated", onDataUpdated);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, [loadJobs]);

  const list = useMemo(() => {
    const statusPriority = {
      Active: 0,
      Scheduled: 1,
      Expired: 2,
      Closed: 3,
      Draft: 4,
    };

    const compareByStatus = (a, b) => {
      const aRank = statusPriority[a.status] ?? 99;
      const bRank = statusPriority[b.status] ?? 99;
      return aRank - bRank;
    };

    const copy = jobs.map((job) => ({
      ...job,
      isApplied: appliedJobIds.includes(String(job.id)),
      status: job.status || getJobScheduleStatus(job, now),
      deadlineTag: getJobTimingLabel(job, now),
    }));

    if (sortBy === "deadline") {
      copy.sort((a, b) => compareByStatus(a, b) || new Date(a.applicationDeadline) - new Date(b.applicationDeadline));
    } else if (sortBy === "newest") {
      copy.sort((a, b) => compareByStatus(a, b) || new Date(b.applicationDeadline) - new Date(a.applicationDeadline));
    } else {
      copy.sort((a, b) => compareByStatus(a, b) || a.title.localeCompare(b.title));
    }

    return copy;
  }, [jobs, sortBy, appliedJobIds, now]);

  const getActionState = (job) => {
    if (job.status === "Closed") {
      return { label: "Applications Closed", disabled: true };
    }

    if (job.isApplied) {
      return { label: "View Details", disabled: false };
    }

    if (job.status === "Scheduled") {
      return { label: "Not Yet Open", disabled: true };
    }

    if (job.status === "Expired") {
      return { label: "View Details", disabled: false };
    }

    return { label: "Apply Now", disabled: false };
  };

  const openJobDetails = async (job) => {
    if (job.status === "Scheduled") {
      return;
    }

    const searchParams = new URLSearchParams({
      jobId: job.id,
      title: job.title,
      category: job.category,
      location: job.location,
      salaryStipend: String(job.stipend || ""),
      skills: job.skills.join(", "),
      experienceLevel: String(job.experienceLevel || ""),
      applicationDeadline: String(job.applicationDeadline || ""),
      description: String(job.description || ""),
    });
    navigate(`/application?${searchParams.toString()}`);
  };

  return (
    <>
      <div className={styles.page}>
        <div className="min-h-screen bg-skyBrand-50 text-slate-900">
          <Navbar variant="hero" user={user} />


          <main className="relative overflow-hidden px-4 pb-16 pt-10 lg:px-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(59,130,246,0.2),transparent_30%),radial-gradient(circle_at_90%_20%,rgba(14,165,233,0.15),transparent_28%)]" />

            <div className="relative mx-auto max-w-7xl">
              <section className="mb-6 rounded-3xl border border-sky-200 bg-white p-6 shadow-card">
                <p className="text-xs font-bold uppercase tracking-widest text-skyBrand-700">Curated Roles</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                  Find Your <span className="text-skyBrand-700">Opportunity</span>
                </h1>
                <p className="mt-2 text-sm text-slate-500">Search the live CareerBridge job board by category or keyword.</p>
              </section>

              <section className="mb-6 flex flex-wrap gap-3 rounded-2xl border border-sky-200 bg-white p-4 shadow-card">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title or company"
                  className="h-11 min-w-[240px] flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-skyBrand-500"
                />

                <div className="flex flex-wrap gap-2">
                  {categories.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCategory(item)}
                      className={`rounded-lg border px-4 py-2 text-xs font-semibold ${
                        category === item
                          ? "border-skyBrand-300 bg-skyBrand-100 text-skyBrand-700"
                          : "border-slate-200 bg-white text-slate-600"
                      }`}
                    >
                      {item === "all" ? "All Categories" : item}
                    </button>
                  ))}
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold"
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="deadline">Sort: Deadline</option>
                  <option value="az">Sort: A-Z</option>
                </select>
              </section>

              {loading ? <div className="mb-6 rounded-2xl border border-sky-200 bg-white p-4 shadow-card">Loading jobs...</div> : null}
              {error ? <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {list.map((job) => (
                  <article
                    key={job.id}
                    onClick={() => openJobDetails(job)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openJobDetails(job);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    title={job.status === "Scheduled" ? `This job will open on ${job.startAt ? new Date(job.startAt).toLocaleString() : "its start date"}` : "View details"}
                    className={`${job.status === "Scheduled" ? "cursor-not-allowed opacity-80" : "cursor-pointer"} rounded-2xl border border-sky-300/60 p-5 text-white shadow-card`}
                    style={{ background: "linear-gradient(145deg, #1d3f75, #1f4f93 55%, #2a5da8)" }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="truncate text-sm font-black text-white">{job.title}</h3>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${job.status === "Closed" ? "bg-red-300 text-red-950" : job.isApplied ? "bg-emerald-400 text-white" : job.status === "Active" ? "bg-emerald-300 text-emerald-950" : job.status === "Scheduled" ? "bg-amber-300 text-amber-950" : "bg-slate-300 text-slate-900"}`}>
                        {job.status === "Closed" ? "Closed" : job.isApplied ? "Applied" : job.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-sky-100">{job.company}</p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full border border-sky-200/70 bg-sky-100/20 px-2.5 py-1 text-[11px] font-semibold text-sky-50">{job.category}</span>
                      <span className="rounded-full border border-white/35 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/95">{job.location}</span>
                      <span className="rounded-full border border-white/35 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/95">{job.stipend}</span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {job.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/90">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-white/25 pt-3">
                      <p className="text-xs font-semibold text-sky-100">{job.deadlineTag}</p>
                      {(() => {
                        const actionState = getActionState(job);

                        return (
                          <button
                            type="button"
                            disabled={actionState.disabled}
                            onClick={(event) => {
                              event.stopPropagation();

                              if (!actionState.disabled) {
                                openJobDetails(job);
                              }
                            }}
                            onMouseDown={(event) => event.stopPropagation()}
                            onKeyDown={(event) => event.stopPropagation()}
                            className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                              actionState.disabled
                                ? "cursor-not-allowed bg-white/15 text-white/70"
                                : "bg-gradient-to-r from-skyBrand-500 to-skyBrand-700 text-white"
                            }`}
                          >
                            {actionState.label}
                          </button>
                        );
                      })()}
                    </div>
                  </article>
                ))}
              </section>

              {!loading && list.length === 0 ? <p className="mt-6 text-sm text-slate-500">No jobs found for this filter/search.</p> : null}
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}
