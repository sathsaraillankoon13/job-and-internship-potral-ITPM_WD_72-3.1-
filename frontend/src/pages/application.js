import Head from "next/head";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import { createSubmission, fetchJob, incrementJobView } from "../api";
import { getJobScheduleStatus, getJobTimingLabel } from "../utils/jobSchedule";
import styles from "../styles/application.module.css";

const VIEW_DEDUP_WINDOW_MS = 5 * 60 * 1000;

function safeText(value, fallback) {
  if (!value || Array.isArray(value)) return fallback;
  return String(value);
}

export default function ApplicationPage() {
  const router = useRouter();
  const { query } = router;
  const trackedViewRef = useRef(false);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    studentEmail: "",
    phone: "",
    university: "",
    year: "",
    coverLetter: "",
    resumeFile: null,
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const validateSingleField = (name, value, currentState) => {
    const data = currentState || formData;

    if (name === "firstName") {
      return value.trim() ? "" : "First name is required.";
    }

    if (name === "lastName") {
      return value.trim() ? "" : "Last name is required.";
    }

    if (name === "studentEmail") {
      if (!value.trim()) return "Email is required.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Invalid email.";
    }

    if (name === "phone") {
      if (!value.trim()) return "Phone number is required.";
      return /^\d{10}$/.test(value.trim()) ? "" : "Phone must be a 10-digit number.";
    }

    if (name === "university") {
      return value.trim() ? "" : "University is required.";
    }

    if (name === "year") {
      if (!String(value).trim()) return "Year is required.";
      const parsed = Number(value);
      return Number.isInteger(parsed) && parsed >= 1 && parsed <= 4 ? "" : "Year must be between 1 and 4.";
    }

    if (name === "coverLetter") {
      if (!value.trim()) return "Cover letter is required.";
      return value.trim().length >= 50 ? "" : "Cover letter must be at least 50 characters.";
    }

    if (name === "resumeFile") {
      const file = data.resumeFile;
      const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

      if (!file) return "Resume file is required.";
      if (!allowed.includes(file.type)) return "File type not supported.";
      if (file.size > 5 * 1024 * 1024) return "File too large. Max size is 5MB.";
      return "";
    }

    return "";
  };

  useEffect(() => {
    let active = true;

    async function loadJob() {
      setLoading(true);
      setError("");

      try {
        if (query.jobId) {
          const data = await fetchJob(query.jobId);
          if (!active) return;
          setJob(data);
        }
      } catch (err) {
        if (!active) return;
        setError(err?.response?.data?.message || err.message || "Failed to load job details");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadJob();

    return () => {
      active = false;
    };
  }, [query.jobId]);

  useEffect(() => {
    if (typeof window === "undefined" || !query.jobId || trackedViewRef.current) {
      return;
    }

    const storageKey = `careerbridge-job-view-${String(query.jobId)}`;
    const now = Date.now();

    try {
      const raw = window.sessionStorage.getItem(storageKey);
      const lastTrackedAt = raw ? Number(raw) : 0;

      if (Number.isFinite(lastTrackedAt) && now - lastTrackedAt < VIEW_DEDUP_WINDOW_MS) {
        trackedViewRef.current = true;
        return;
      }
    } catch {
      // Ignore storage read issues and still try to count the view.
    }

    trackedViewRef.current = true;

    incrementJobView(query.jobId)
      .then(() => {
        try {
          window.sessionStorage.setItem(storageKey, String(now));
        } catch {
          // Ignore storage write issues.
        }
      })
      .catch(() => {
        trackedViewRef.current = false;
      });
  }, [query.jobId]);

  useEffect(() => {
    const refreshAppliedState = () => {
      if (typeof window === "undefined") return;
      if (!query.jobId) {
        setAlreadyApplied(false);
        return;
      }

      try {
        const storedIds = JSON.parse(window.localStorage.getItem("careerbridge-applied-jobs") || "[]");
        const normalized = Array.isArray(storedIds) ? storedIds.map(String) : [];
        setAlreadyApplied(normalized.includes(String(query.jobId)));
      } catch {
        setAlreadyApplied(false);
      }
    };

    refreshAppliedState();
    window.addEventListener("careerbridge:data-updated", refreshAppliedState);
    window.addEventListener("storage", refreshAppliedState);

    return () => {
      window.removeEventListener("careerbridge:data-updated", refreshAppliedState);
      window.removeEventListener("storage", refreshAppliedState);
    };
  }, [query.jobId]);

  const jobView = useMemo(
    () => ({
      title: safeText(job?.title || query.title, "Frontend Developer Intern"),
      category: safeText(job?.category || query.category, "IT"),
      location: safeText(job?.location || query.location, "Remote"),
      stipend: safeText(job?.salaryStipend || query.salaryStipend, "LKR 35,000/mo"),
      deadline: safeText(job?.applicationDeadline || query.applicationDeadline, "Closes Apr 10, 2026"),
      description: safeText(job?.description || query.description, "This is a great opportunity to learn and grow."),
      skills: Array.isArray(job?.skills)
        ? job.skills
        : safeText(query.skills, "React, TypeScript, CSS").split(","),
      experienceLevel: safeText(job?.experienceLevel || query.experienceLevel, "Entry Level"),
    }),
    [job, query]
  );

  const jobStatus = useMemo(() => {
    if (!job) return "Scheduled";
    return getJobScheduleStatus(job);
  }, [job]);

  const scheduleHint = useMemo(() => {
    if (!job) return "";
    return getJobTimingLabel(job);
  }, [job]);

  const blockedByStatus = jobStatus === "Scheduled" || jobStatus === "Expired" || jobStatus === "Closed" || jobStatus === "Draft";
  const submitBlocked = blockedByStatus || alreadyApplied;

  const statusBadge = useMemo(() => {
    if (jobStatus === "Scheduled") {
      return { label: "Scheduled", className: "border-amber-300/70 bg-amber-100/15 text-amber-100" };
    }
    if (jobStatus === "Expired" || jobStatus === "Closed") {
      return { label: "Applications Closed", className: "border-red-300/70 bg-red-100/15 text-red-100" };
    }
    return { label: "Active", className: "border-emerald-300/70 bg-emerald-100/15 text-emerald-100" };
  }, [jobStatus]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      const errorText = validateSingleField(name, value, next);
      setFieldErrors((current) => ({ ...current, [name]: errorText }));
      return next;
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
    setFormData((prev) => {
      const next = { ...prev, resumeFile: file };
      const errorText = validateSingleField("resumeFile", "", next);
      setFieldErrors((current) => ({ ...current, resumeFile: errorText }));
      return next;
    });
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!formData.lastName.trim()) nextErrors.lastName = "Last name is required.";

    if (!formData.studentEmail.trim()) {
      nextErrors.studentEmail = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.studentEmail.trim())) {
      nextErrors.studentEmail = "Invalid email.";
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      nextErrors.phone = "Phone must be a 10-digit number.";
    }

    if (!formData.university.trim()) nextErrors.university = "University is required.";

    const year = Number(formData.year);
    if (!formData.year) {
      nextErrors.year = "Year is required.";
    } else if (!Number.isInteger(year) || year < 1 || year > 4) {
      nextErrors.year = "Year must be between 1 and 4.";
    }

    if (!formData.coverLetter.trim()) {
      nextErrors.coverLetter = "Cover letter is required.";
    } else if (formData.coverLetter.trim().length < 50) {
      nextErrors.coverLetter = "Cover letter must be at least 50 characters.";
    }

    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!formData.resumeFile) {
      nextErrors.resumeFile = "Resume file is required.";
    } else if (!allowed.includes(formData.resumeFile.type)) {
      nextErrors.resumeFile = "File type not supported.";
    } else if (formData.resumeFile.size > 5 * 1024 * 1024) {
      nextErrors.resumeFile = "File too large. Max size is 5MB.";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const isFormValid = useMemo(() => {
    const hasValues =
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.studentEmail.trim() &&
      formData.phone.trim() &&
      formData.university.trim() &&
      formData.year &&
      formData.coverLetter.trim() &&
      formData.resumeFile;

    const hasBlockingError = Object.values(fieldErrors).some((value) => Boolean(value));
    return Boolean(hasValues) && !hasBlockingError;
  }, [fieldErrors, formData]);

  const redirectToJobs = () => {
    router.push("/opportunities");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (alreadyApplied) {
      setError("");
      setSuccessMessage("");
      return;
    }

    if (blockedByStatus) {
      setError("");
      setSuccessMessage("");
      return;
    }

    if (!query.jobId) {
      setError("Missing job ID for application.");
      return;
    }

    if (!validate()) {
      setError("Please fix the highlighted fields before submitting.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const payload = new FormData();
      payload.append("jobId", query.jobId);
      payload.append("firstName", formData.firstName.trim());
      payload.append("lastName", formData.lastName.trim());
      payload.append("studentEmail", formData.studentEmail.trim());
      payload.append("phone", formData.phone.trim());
      payload.append("university", formData.university.trim());
      payload.append("year", String(formData.year).trim());
      payload.append("coverLetter", formData.coverLetter.trim());
      payload.append("resumeFile", formData.resumeFile);

      await createSubmission(payload);

      if (typeof window !== "undefined" && query.jobId) {
        const storedIds = JSON.parse(window.localStorage.getItem("careerbridge-applied-jobs") || "[]");
        const nextIds = Array.from(new Set([...storedIds, String(query.jobId)]));
        window.localStorage.setItem("careerbridge-applied-jobs", JSON.stringify(nextIds));
      }

      window.dispatchEvent(new Event("careerbridge:data-updated"));

      setSuccessMessage("Application submitted successfully.");
      window.alert("Success: Your application has been submitted.");
      redirectToJobs();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Application | CareerBridge</title>
        <meta name="description" content="Apply for selected opportunity on CareerBridge" />
      </Head>

      <div className={styles.page}>
        <div className="min-h-screen bg-skyBrand-50 text-slate-900">
          <Navbar variant="hero" />

          <main className="relative overflow-hidden px-4 pb-14 pt-8 lg:px-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_9%,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(14,165,233,0.11),transparent_32%)]" />

            <div className="relative mx-auto grid max-w-7xl gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
              <section className="space-y-4">
                <article className="overflow-hidden rounded-3xl border border-sky-200 bg-white shadow-card">
                  <div className="relative overflow-hidden bg-gradient-to-r from-[#2248bd] to-[#2e5be2] p-6 text-white">
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
                    <div className="absolute -right-2 bottom-[-48px] h-32 w-32 rounded-full bg-white/5" />

                    <div className="relative flex items-start justify-between gap-4">
                      <div>
                        <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">{jobView.title}</h1>
                        <p className="mt-1 text-sm text-cyan-100">{jobView.category} · {jobView.location}</p>
                      </div>

                      <span className={`rounded-full border px-4 py-2 text-sm font-bold ${statusBadge.className}`}>
                        {statusBadge.label}
                      </span>
                    </div>

                    <div className="relative mt-5 flex flex-wrap gap-2">
                      <span className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-100">{jobView.location}</span>
                      <span className="rounded-full border border-emerald-300/40 bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-100">{jobView.stipend}</span>
                      <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-bold text-slate-100">{jobView.experienceLevel}</span>
                      <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-bold text-slate-100">{jobView.deadline}</span>
                    </div>
                  </div>

                  <div className="space-y-8 p-6">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-sky-700">Job Description</h3>
                      <div className="mt-3 rounded-2xl border border-sky-100 bg-gradient-to-b from-sky-50/70 to-white p-5 shadow-sm">
                        <p className="border-l-4 border-sky-400 pl-4 text-base leading-8 text-slate-700">{jobView.description}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-sky-700">Required Skills</h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {jobView.skills.map((skill, idx) => (
                          <span key={`${skill}-${idx}`} className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-700">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>

                <article className="rounded-3xl border border-sky-200 bg-sky-50 p-5 shadow-card">
                  <div className="mb-4 flex items-center justify-between text-sm">
                    <p className="font-semibold text-slate-600">Application Progress</p>
                    <p className="font-bold text-slate-500">0%</p>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-2 w-0 rounded-full bg-skyBrand-500" />
                  </div>

                  {loading ? <p className="mt-4 text-sm text-slate-500">Loading job details...</p> : null}
                  {error ? <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

                  <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <h2 className="text-lg font-black text-slate-800">Professional Application Form</h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <input
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`h-11 w-full rounded-xl border ${fieldErrors.firstName ? "border-red-500" : "border-slate-200"} bg-slate-50 px-3 text-sm outline-none focus:border-skyBrand-400`}
                          placeholder="First name *"
                        />
                        {fieldErrors.firstName ? <p className="mt-1 text-xs text-red-600">{fieldErrors.firstName}</p> : null}
                      </div>
                      <div>
                        <input
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`h-11 w-full rounded-xl border ${fieldErrors.lastName ? "border-red-500" : "border-slate-200"} bg-slate-50 px-3 text-sm outline-none focus:border-skyBrand-400`}
                          placeholder="Last name *"
                        />
                        {fieldErrors.lastName ? <p className="mt-1 text-xs text-red-600">{fieldErrors.lastName}</p> : null}
                      </div>
                      <div>
                        <input
                          type="email"
                          name="studentEmail"
                          value={formData.studentEmail}
                          onChange={handleChange}
                          className={`h-11 w-full rounded-xl border ${fieldErrors.studentEmail ? "border-red-500" : "border-slate-200"} bg-slate-50 px-3 text-sm outline-none focus:border-skyBrand-400`}
                          placeholder="Student email *"
                        />
                        {fieldErrors.studentEmail ? <p className="mt-1 text-xs text-red-600">{fieldErrors.studentEmail}</p> : null}
                      </div>
                      <div>
                        <input
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`h-11 w-full rounded-xl border ${fieldErrors.phone ? "border-red-500" : "border-slate-200"} bg-slate-50 px-3 text-sm outline-none focus:border-skyBrand-400`}
                          placeholder="Phone (10 digits) *"
                        />
                        {fieldErrors.phone ? <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p> : null}
                      </div>
                      <div>
                        <input
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          className={`h-11 w-full rounded-xl border ${fieldErrors.year ? "border-red-500" : "border-slate-200"} bg-slate-50 px-3 text-sm outline-none focus:border-skyBrand-400`}
                          placeholder="Year (1-4) *"
                        />
                        {fieldErrors.year ? <p className="mt-1 text-xs text-red-600">{fieldErrors.year}</p> : null}
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          name="university"
                          value={formData.university}
                          onChange={handleChange}
                          className={`h-11 w-full rounded-xl border ${fieldErrors.university ? "border-red-500" : "border-slate-200"} bg-slate-50 px-3 text-sm outline-none focus:border-skyBrand-400`}
                          placeholder="University *"
                        />
                        {fieldErrors.university ? <p className="mt-1 text-xs text-red-600">{fieldErrors.university}</p> : null}
                      </div>
                      <div className="sm:col-span-2">
                        <textarea
                          name="coverLetter"
                          value={formData.coverLetter}
                          onChange={handleChange}
                          className={`min-h-32 w-full rounded-xl border ${fieldErrors.coverLetter ? "border-red-500" : "border-slate-200"} bg-slate-50 px-3 py-2 text-sm outline-none focus:border-skyBrand-400`}
                          placeholder="Cover letter (minimum 50 characters) *"
                        />
                        {fieldErrors.coverLetter ? <p className="mt-1 text-xs text-red-600">{fieldErrors.coverLetter}</p> : null}
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Resume File *</label>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className={`block w-full rounded-xl border ${fieldErrors.resumeFile ? "border-red-500" : "border-slate-200"} bg-white px-3 py-2 text-sm`}
                        />
                        {fieldErrors.resumeFile ? <p className="mt-1 text-xs text-red-600">{fieldErrors.resumeFile}</p> : null}
                      </div>
                    </div>

                    {successMessage ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{successMessage}</p> : null}

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={submitBlocked || submitting || loading}
                        className={`rounded-lg px-6 py-3 text-sm font-bold text-white shadow-lg ${submitBlocked ? "cursor-not-allowed bg-gray-400" : "bg-blue-600"}`}
                      >
                        {alreadyApplied
                          ? "Already Applied"
                          : jobStatus === "Scheduled"
                          ? "Not Yet Open"
                          : blockedByStatus
                          ? "Applications Closed"
                          : submitting
                          ? "Submitting..."
                          : "Submit Application"}
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push("/opportunities")}
                        className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg"
                      >
                        Back to Jobs
                      </button>
                    </div>
                    {alreadyApplied ? (
                      <p className="text-xs text-slate-600">
                        You have already submitted an application for this role. You can still view the details for your reference.
                      </p>
                    ) : null}
                    {!alreadyApplied && blockedByStatus ? (
                      <p className="text-xs text-slate-600">
                        {jobStatus === "Scheduled"
                          ? `This role is not yet open for applications. ${scheduleHint || "Please check again later."}`
                          : "Applications are closed for this role. You can still view the details for your reference."}
                      </p>
                    ) : null}
                  </form>
                </article>
              </section>

              <aside className="space-y-4">
                <div className="rounded-3xl border border-sky-200 bg-white p-5 shadow-card">
                  <p className="text-xs font-black uppercase tracking-widest text-sky-700">Quick Summary</p>
                  <div className="mt-3 space-y-3 text-sm text-slate-700">
                    <p><span className="font-bold">Category:</span> {jobView.category}</p>
                    <p><span className="font-bold">Location:</span> {jobView.location}</p>
                    <p><span className="font-bold">Deadline:</span> {jobView.deadline}</p>
                    <p><span className="font-bold">Stipend:</span> {jobView.stipend}</p>
                  </div>
                </div>
              </aside>
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}
