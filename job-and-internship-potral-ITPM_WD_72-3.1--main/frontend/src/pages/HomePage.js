import { Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronRight, User } from "lucide-react";
import Footer from "../components/footer";
import Navbar from "../components/Navbar";
import { fetchJobs } from "../api";
import { getJobScheduleStatus, getJobTimingLabel } from "../utils/jobSchedule";
import styles from "../styles/HomePage.module.css";

const categoryRouteMap = {
  IT: "IT",
  Marketing: "Marketing",
  Finance: "Finance",
  Design: "Design",
  Engineering: "Engineering",
};

const categoryCards = [
  { label: "IT & Software", category: "IT", icon: "💻" },
  { label: "Marketing", category: "Marketing", icon: "📢" },
  { label: "Finance", category: "Finance", icon: "📊" },
  { label: "Design", category: "Design", icon: "🎨" },
  { label: "Engineering", category: "Engineering", icon: "🛠️" },
];

const howItWorks = [
  { step: "1", title: "Create Your Profile", description: "Add your skills and degree details in minutes." },
  { step: "2", title: "Discover & Filter", description: "Browse live opportunities by category and keyword." },
  { step: "3", title: "Apply & Track", description: "Apply instantly and keep everything in one place." },
];

function mapJobCard(job) {
  return {
    id: job._id,
    title: job.title,
    company: job.company || job.employerName || "CareerBridge",
    category: job.category,
    location: job.location,
    stipend: job.salaryStipend || job.stipend || "",
    skills: Array.isArray(job.skills) ? job.skills : [],
    deadline: job.expiresAt || job.applicationDeadline || job.deadline,
    deadlineTag: job.deadlineTag || getJobTimingLabel(job),
    description: job.description,
    experienceLevel: job.experienceLevel,
    applicationDeadline: job.expiresAt || job.applicationDeadline || job.deadline,
    startAt: job.startAt || job.startDate,
    expiresAt: job.expiresAt || job.applicationDeadline,
    status: job.status || "Scheduled",
    approvalStatus: job.approvalStatus || "Approved",
  };
}

export default function HomePage({ user }) {

  const navigate = useNavigate();
  useEffect(() => {
    document.title = "CareerBridge | Where Futures Begin";
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [now, setNow] = useState(() => new Date());

  const loadJobs = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
      setError("");
    }

    try {
      const data = await fetchJobs({ audience: "student" });
      const mappedJobs = Array.isArray(data) ? data.map(mapJobCard) : [];
      setJobs(mappedJobs.filter((job) => String(job.approvalStatus || "Approved").toLowerCase() === "approved"));
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
  }, [jobs.length]);

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

  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), 60000);

    return () => clearInterval(intervalId);
  }, []);

  const featuredJobs = useMemo(
    () =>
      jobs.slice(0, 4).map((job) => ({
        ...job,
        status: getJobScheduleStatus(job, now),
        deadlineTag: getJobTimingLabel(job, now),
      })),
    [jobs, now]
  );

  const categories = useMemo(
    () =>
      categoryCards.map((item) => ({
        ...item,
        count: jobs.filter((job) => job.category === item.category).length,
      })),
    [jobs]
  );

  const handleHeroSearch = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();

    if (!query) {
      navigate("/opportunities");
      return;
    }

    navigate(`/opportunities?${new URLSearchParams({ q: query }).toString()}`);
  };

  return (
    <>
      <div className={styles.page}>
        <div className="min-h-screen bg-skyBrand-50 text-slate-900">
          <Navbar variant="hero" user={user} />


          <main>
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 pb-14 pt-16 text-white lg:px-8 lg:pt-20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.22),transparent_45%),radial-gradient(circle_at_80%_50%,rgba(56,189,248,0.17),transparent_45%)]" />

              <div className="relative mx-auto max-w-6xl text-center">
                <span className="inline-flex items-center rounded-full border border-sky-300/40 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/90">
                  {loading ? "Loading live opportunities..." : `${jobs.length} live opportunities waiting for you`}
                </span>

                <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
                  Where students meet
                  <span className="block text-skyBrand-300">their future</span>
                </h1>

                <p className="mx-auto mt-5 max-w-2xl text-sm text-white/70 sm:text-base">
                  Discover internships, part-time roles, and full-time careers from top Sri Lankan companies.
                  Everything is curated, structured, and searchable in one place.
                </p>



                <form
                  onSubmit={handleHeroSearch}
                  className="mx-auto mt-8 flex w-full max-w-2xl flex-col gap-3 rounded-2xl border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur md:flex-row"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Job title, company, or keyword"
                    className="h-11 flex-1 rounded-xl border border-white/10 bg-white/10 px-4 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-sky-300"
                  />
                  <button
                    type="submit"
                    className="h-11 rounded-xl bg-gradient-to-r from-skyBrand-500 to-skyBrand-700 px-6 text-sm font-extrabold text-white transition hover:scale-[1.02]"
                  >
                    Search
                  </button>
                </form>

                {error ? <p className="mx-auto mt-4 max-w-2xl rounded-xl border border-red-300/40 bg-red-500/20 px-4 py-3 text-sm text-red-100">{error}</p> : null}

                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-center">
                  <div>
                    <p className="text-2xl font-black">{jobs.length || 0}+</p>
                    <p className="text-xs uppercase tracking-widest text-white/60">Active Jobs</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black">5</p>
                    <p className="text-xs uppercase tracking-widest text-white/60">Categories</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black">2.4k</p>
                    <p className="text-xs uppercase tracking-widest text-white/60">Students Placed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black">Free</p>
                    <p className="text-xs uppercase tracking-widest text-white/60">To Join</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mx-auto -mt-2 max-w-7xl px-4 pb-16 pt-10 lg:px-8">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-skyBrand-700">Live Opportunities</p>
                  <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                    Your next role is <span className="font-serif italic text-skyBrand-700">right here</span>
                  </h2>
                </div>
              </div>

              {loading ? (
                <div className="rounded-3xl border border-sky-200 bg-white p-8 text-center shadow-card">Loading featured jobs...</div>
              ) : null}

              <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)_260px]">
                <div className="space-y-5">
                  <div className="rounded-3xl bg-gradient-to-br from-skyBrand-700 to-skyBrand-900 p-6 text-white shadow-glow">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/70">Platform at a glance</p>
                    <div className="mt-5 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-3xl font-black">{jobs.length}</p>
                        <p className="text-xs text-white/70">Active Jobs</p>
                      </div>
                      <div>
                        <p className="text-3xl font-black">5</p>
                        <p className="text-xs text-white/70">Categories</p>
                      </div>
                      <div>
                        <p className="text-3xl font-black">2.4k</p>
                        <p className="text-xs text-white/70">Placed</p>
                      </div>
                      <div>
                        <p className="text-3xl font-black">96%</p>
                        <p className="text-xs text-white/70">Satisfied</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-skyBrand-500/40 bg-gradient-to-br from-slate-950 to-blue-950 p-6 text-white">
                    <p className="text-sm font-bold uppercase tracking-widest text-skyBrand-300">Smart Matching</p>
                    <h3 className="mt-3 text-xl font-black">Personalized for your degree</h3>
                    <p className="mt-3 text-sm text-white/70">
                      Build your profile once and get role recommendations based on skills, major, and goals.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate(user ? "/student/skill-selection" : "/student-register")}
                      className="mt-5 rounded-xl border border-skyBrand-300/60 bg-skyBrand-500/20 px-4 py-2 text-sm font-bold hover:bg-skyBrand-600"
                    >
                      {user ? "Take Skills Assessment" : "Create free profile"}
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl border border-sky-200 bg-white p-6 shadow-card">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <h3 className="text-lg font-black">Featured Opportunities</h3>
                    <Link to="/opportunities" className="text-sm font-bold text-skyBrand-700 hover:underline">
                      View all
                    </Link>
                  </div>

                  {error ? <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

                  <div className="space-y-3">
                    {featuredJobs.map((job) => (
                      <article
                        key={job.id}
                        className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-skyBrand-300 hover:bg-white hover:shadow-md"
                      >
                        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-sky-500 to-sky-300" />
                        <div className="ml-2 flex items-start justify-between gap-4">
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{job.title}</h4>
                            <p className="mt-1 text-xs text-slate-500">
                              {job.company} | {job.location} | {job.category}
                            </p>
                            <p className="mt-1 text-xs font-semibold text-skyBrand-700">{job.stipend}</p>
                          </div>
                          <div className="text-right">
                            <span className="inline-block rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-emerald-700">
                              {job.deadlineTag}
                            </span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="rounded-3xl border border-sky-200 bg-skyBrand-100 p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-skyBrand-700">Top Companies Hiring</p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {["Banking", "Startups", "Research", "Design", "Analytics", "FinTech"].map((item) => (
                        <div key={item} className="flex h-12 items-center justify-center rounded-xl border border-sky-200 bg-white text-xs font-bold text-slate-700">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-sky-200 bg-white p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-skyBrand-700">Top Categories</p>
                    <div className="mt-4 space-y-2">
                      {categories.map((item) => (
                        <Link
                          key={item.category}
                          to={`/opportunities?category=${categoryRouteMap[item.category]}`}
                          className="flex w-full items-center justify-between rounded-xl border border-sky-100 bg-skyBrand-50 px-3 py-2 text-left transition hover:bg-skyBrand-700 hover:text-white"
                        >
                          <span className="text-xs font-bold">
                            {item.icon} {item.label}
                          </span>
                          <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-bold">{item.count}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-6 lg:px-8">
              <div className="grid gap-5 lg:grid-cols-3">
                <article className="rounded-3xl border border-sky-200 bg-[#deebf8] p-6">
                  <h3 className="text-3xl font-black tracking-tight text-slate-900">How it works</h3>
                  <div className="mt-5 space-y-4">
                    {howItWorks.map((item) => (
                      <div key={item.step} className="flex gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white shadow-md shadow-blue-300/60">
                          {item.step}
                        </div>
                        <div>
                          <p className="text-xl font-bold tracking-tight text-slate-900">{item.title}</p>
                          <p className="mt-1 text-base text-slate-600">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="rounded-3xl border border-slate-200 bg-[#f4f4f4] p-6">
                  <h3 className="text-3xl font-black tracking-tight text-slate-900">Students love CareerBridge</h3>
                  <p className="mt-1 text-base text-slate-500">Live opportunities updated daily</p>
                  <div className="mt-5 rounded-2xl border border-slate-200 bg-[#e9eff7] p-4">
                    <p className="text-sm tracking-[0.25em] text-amber-400">★★★★★</p>
                    <p className="mt-3 font-serif text-xl italic leading-relaxed text-slate-700">
                      "The platform makes it easy to find internships and job posts without endless scrolling."
                    </p>
                  </div>
                </article>

                <article className="relative overflow-hidden rounded-3xl border border-sky-400/20 bg-gradient-to-br from-[#01132d] via-[#001635] to-[#021b44] p-6 text-white">
                  <p className="text-sm font-bold uppercase tracking-widest text-skyBrand-300">Need a faster start?</p>
                  <h3 className="mt-3 text-3xl font-black tracking-tight">Apply with one profile</h3>
                  <p className="mt-3 text-sm text-white/70">
                    Search, filter, and apply from the same place. Your next role is already on the board.
                  </p>
                  <Link to="/opportunities" className="mt-6 inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-sky-100">
                    Browse jobs
                  </Link>
                </article>
              </div>
            </section>
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}
