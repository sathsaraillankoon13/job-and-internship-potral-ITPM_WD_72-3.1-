import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import EmployerShell from "../components/EmployerShell";
import { useEmployerJobs } from "../context/EmployerJobsContext";
import { createJob, fetchJob, updateJob } from "../api";
import { parseDateTimeValue, toDateTimeLocalValue } from "../utils/jobSchedule";
import styles from "../styles/post-job.module.css";

// Utility functions
const toTitleCase = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const capitalizeFirstCharOnly = (value) => {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const initialForm = {
  title: "",
  opportunityType: "Full-time",
  category: "IT",
  department: "Technology",
  workMode: "On-site",
  description: "",
  location: "",
  salaryStipend: "",
  skillInput: "",
  requiredSkills: [],
  experienceLevel: "Entry Level",
  minEducation: "Bachelor's Degree (Ongoing)",
  eligibleYear: "Any Year",
  minGPA: "",
  fieldOfStudy: "",
  eligibleCategories: ["Undergraduates", "Recent Graduates"],
  expiresAt: "",
  startAt: "",
};

const eligibleCategoryOptions = [
  "Undergraduates",
  "Recent Graduates",
  "Postgraduates",
  "International Students",
];

const DESCRIPTION_MAX_LENGTH = 1000;

export default function PostJobPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("editId") || "";
  const isEditMode = Boolean(editId);
  const { refreshData } = useEmployerJobs();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingJob, setLoadingJob] = useState(false);
  const [applicantCount, setApplicantCount] = useState(0);
  const [salaryEdited, setSalaryEdited] = useState(false);
  const [message, setMessage] = useState("");
  const hasApplicants = applicantCount > 0;
  const isLockedEdit = isEditMode && hasApplicants;

  useEffect(() => {
    if (!isEditMode) return;

    let active = true;
    const loadJob = async () => {
      setLoadingJob(true);
      setMessage("");

      try {
        const job = await fetchJob(editId);
        if (!active) return;

        const normalizedSkills = Array.isArray(job.requiredSkills)
          ? job.requiredSkills
          : Array.isArray(job.skills)
          ? job.skills
          : [];

        setApplicantCount(Number(job.applicants || 0));
        setForm((prev) => ({
          ...prev,
          title: job.title || "",
          opportunityType: job.opportunityType || prev.opportunityType,
          category: job.category || prev.category,
          department: job.department || prev.department,
          workMode: job.workMode || prev.workMode,
          description: job.description || "",
          location: job.location || "",
          salaryStipend: job.salaryStipend || "",
          skillInput: "",
          requiredSkills: normalizedSkills,
          experienceLevel: job.experienceLevel || prev.experienceLevel,
          minEducation: job.minEducation || prev.minEducation,
          eligibleYear: job.eligibleYear || prev.eligibleYear,
          minGPA: job.minGPA || "",
          fieldOfStudy: job.fieldOfStudy || "",
          eligibleCategories:
            Array.isArray(job.eligibleCategories) && job.eligibleCategories.length > 0
              ? job.eligibleCategories
              : prev.eligibleCategories,
          expiresAt: toDateTimeLocalValue(parseDateTimeValue(job.expiresAt || job.applicationDeadline) || ""),
          startAt: toDateTimeLocalValue(parseDateTimeValue(job.startAt || job.startDate) || ""),
        }));
        setSalaryEdited(false);
      } catch (error) {
        if (!active) return;
        setMessage(error?.response?.data?.message || error.message || "Failed to load job for editing");
      } finally {
        if (active) setLoadingJob(false);
      }
    };

    loadJob();
    return () => {
      active = false;
    };
  }, [editId, isEditMode]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear error on field change
    setErrors((prev) => ({ ...prev, [key]: "" }));
    setMessage("");
  };

  const addSkill = () => {
    const next = capitalizeFirstCharOnly(form.skillInput.trim());
    if (!next) {
      setErrors((prev) => ({ ...prev, skillInput: "Skill cannot be empty." }));
      return;
    }

    if (form.requiredSkills.includes(next)) {
      setErrors((prev) => ({ ...prev, skillInput: "Skill already added." }));
      updateField("skillInput", "");
      return;
    }

    updateField("requiredSkills", [...form.requiredSkills, next]);
    updateField("skillInput", "");
  };

  const removeSkill = (skill) => {
    updateField(
      "requiredSkills",
      form.requiredSkills.filter((item) => item !== skill)
    );
  };

  const toggleEligibleCategory = (categoryName) => {
    const exists = form.eligibleCategories.includes(categoryName);

    if (exists) {
      updateField(
        "eligibleCategories",
        form.eligibleCategories.filter((item) => item !== categoryName)
      );
      return;
    }

    updateField("eligibleCategories", [...form.eligibleCategories, categoryName]);
  };

  // Salary must be numeric, max 9 digits, and end with .00
  const salaryError = useMemo(() => {
    if (isLockedEdit) return "";
    if (isEditMode && !salaryEdited) return "";
    const value = form.salaryStipend.trim();
    if (!value) return "Salary is required.";
    if (!/^\d{1,8}\.00$/.test(value)) {
      return "Salary must be numbers only (max 8 digits) and end with .00 (example: 50000.00).";
    }
    return "";
  }, [form.salaryStipend, isLockedEdit, isEditMode, salaryEdited]);

  // Real-time validation for dates
  const dateError = useMemo(() => {
    if (!form.startAt || !form.expiresAt) return "";

    const now = new Date();
    const startAt = parseDateTimeValue(form.startAt);
    const expiresAt = parseDateTimeValue(form.expiresAt, { defaultToEndOfDay: true });

    if (!startAt || !expiresAt) {
      return "Please enter valid start and expiry times.";
    }

    if (expiresAt < now) {
      return "Expires At cannot be in the past.";
    }

    if (expiresAt < startAt) {
      return "Expires At must be on or after Start At.";
    }

    return "";
  }, [form.startAt, form.expiresAt]);

  // Real-time validation for description
  const descriptionError = useMemo(() => {
    const length = form.description.trim().length;
    if (length > DESCRIPTION_MAX_LENGTH) {
      return `Description must not exceed ${DESCRIPTION_MAX_LENGTH} characters (${length}/${DESCRIPTION_MAX_LENGTH}).`;
    }
    return "";
  }, [form.description]);

  const canSubmit = useMemo(() => {
    const titleValid = isLockedEdit ? true : /^[A-Z]/.test(form.title.trim());
    const locationValid = isLockedEdit ? true : /^[A-Z]/.test(form.location.trim());
    const fieldOfStudyValid = !form.fieldOfStudy.trim() || /^[A-Z]/.test(form.fieldOfStudy.trim());
    const gpaValid = !form.minGPA.trim() || (!Number.isNaN(Number(form.minGPA)) && Number(form.minGPA) >= 0 && Number(form.minGPA) <= 4);
    return Boolean(
      (isLockedEdit || form.title.trim()) &&
      titleValid &&
      (isLockedEdit || form.location.trim()) &&
      locationValid &&
      form.startAt &&
      form.expiresAt &&
      form.description.trim().length > 0 &&
      form.description.trim().length <= DESCRIPTION_MAX_LENGTH &&
      form.requiredSkills.length > 0 &&
      form.requiredSkills.every((skill) => /^[A-Z]/.test(skill.trim())) &&
      (isLockedEdit || form.salaryStipend.trim()) &&
      !salaryError &&
      !dateError &&
      fieldOfStudyValid &&
      gpaValid &&
      !form.fieldOfStudy.match(/[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]/)
    );
  }, [form, salaryError, dateError, isLockedEdit]);

  const validate = () => {
    const nextErrors = {};

    if (!isLockedEdit && !form.title.trim()) {
      nextErrors.title = "Job title is required.";
    } else if (!isLockedEdit && !/^[A-Z]/.test(form.title.trim())) {
      nextErrors.title = "Title must start with a capital letter.";
    }

    if (!isLockedEdit && !form.location.trim()) {
      nextErrors.location = "Location is required.";
    } else if (!isLockedEdit && !/^[A-Z]/.test(form.location.trim())) {
      nextErrors.location = "Location must start with a capital letter.";
    }

    if (!form.startAt) nextErrors.startAt = "Start at is required.";
    if (!form.expiresAt) nextErrors.expiresAt = "Expires at is required.";

    if (!form.description.trim()) {
      nextErrors.description = "Description is required.";
    } else if (form.description.trim().length > DESCRIPTION_MAX_LENGTH) {
      nextErrors.description = `Description must not exceed ${DESCRIPTION_MAX_LENGTH} characters.`;
    }

    if (form.requiredSkills.length === 0) nextErrors.requiredSkills = "Add at least one required skill.";
    if (form.requiredSkills.some((skill) => !/^[A-Z]/.test(skill.trim()))) {
      nextErrors.requiredSkills = "Each skill must start with a capital letter.";
    }

    if (!isLockedEdit && salaryError) nextErrors.salaryStipend = salaryError;
    if (dateError) nextErrors.dates = dateError;

    if (form.fieldOfStudy && /[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]/.test(form.fieldOfStudy)) {
      nextErrors.fieldOfStudy = "Field of Study must not contain special characters.";
    } else if (form.fieldOfStudy.trim() && !/^[A-Z]/.test(form.fieldOfStudy.trim())) {
      nextErrors.fieldOfStudy = "Field of Study must start with a capital letter.";
    }

    if (form.minGPA.trim()) {
      const gpa = Number(form.minGPA);
      if (Number.isNaN(gpa) || gpa < 0 || gpa > 4) {
        nextErrors.minGPA = "Minimum GPA must be between 0.00 and 4.00.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) {
      setMessage(isEditMode ? "Please fix the highlighted fields before updating." : "Please fix the highlighted fields before publishing.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const payload = {
        title: capitalizeFirstCharOnly(form.title.trim()),
        opportunityType: form.opportunityType,
        category: form.category,
        department: capitalizeFirst(form.department.trim()),
        workMode: form.workMode,
        description: form.description.trim(),
        location: capitalizeFirstCharOnly(form.location.trim()),
        salaryStipend: form.salaryStipend.trim(),
        requiredSkills: form.requiredSkills.map((skill) => capitalizeFirstCharOnly(skill.trim())),
        skills: form.requiredSkills.map((skill) => capitalizeFirstCharOnly(skill.trim())),
        experienceLevel: form.experienceLevel,
        minEducation: form.minEducation,
        eligibleYear: form.eligibleYear,
        minGPA: form.minGPA.trim(),
        fieldOfStudy: capitalizeFirstCharOnly(form.fieldOfStudy.trim()),
        eligibleCategories: form.eligibleCategories,
        expiresAt: parseDateTimeValue(form.expiresAt, { defaultToEndOfDay: true })?.toISOString() || form.expiresAt,
        startAt: parseDateTimeValue(form.startAt)?.toISOString() || form.startAt,
        applicationDeadline: parseDateTimeValue(form.expiresAt, { defaultToEndOfDay: true })?.toISOString() || form.expiresAt,
        startDate: parseDateTimeValue(form.startAt)?.toISOString() || form.startAt,
      };

      if (isEditMode) {
        await updateJob(editId, payload);
      } else {
        await createJob(payload);
      }

      setForm(initialForm);
      setErrors({});
      setApplicantCount(0);
      await refreshData();
      window.dispatchEvent(new Event("careerbridge:data-updated"));
      window.alert(isEditMode ? "Job updated successfully!" : "Job posted successfully! You will be redirected to your dashboard.");
      navigate("/employer/dashboard");
    } catch (error) {
      setMessage(error?.response?.data?.message || error.message || "Failed to create job");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <EmployerShell activeKey="post-job" title="Post Job and Internship" subtitle="Create and publish a new opportunity for students.">
        <section className="overflow-hidden rounded-2xl border border-blue-100 bg-sky-50 shadow-[0_8px_30px_rgba(37,99,235,0.1)]">
          <header className="flex items-center gap-3 border-b border-blue-100 bg-gradient-to-r from-blue-50/50 to-sky-50 px-5 py-4 lg:px-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">📝</div>
            <div>
              <h3 className="font-['Sora'] text-sm font-extrabold text-blue-900">{isEditMode ? "Edit Job Posting" : "Professional Job Form"}</h3>
              <p className="text-xs text-slate-500">{isEditMode ? "Update an existing opportunity with applicant-aware editing restrictions." : "Basic Info, Skills, Eligibility, and Timeline with strict validation and schema mapping."}</p>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6 p-5 lg:p-6">
            {loadingJob ? <p className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">Loading job details...</p> : null}
            {isEditMode && hasApplicants ? (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                This job already has applicants. You can only adjust the timeline.
              </p>
            ) : null}
            <section className="rounded-xl border border-blue-100 bg-white/70 p-4">
              <h4 className="font-bold text-blue-900">Basic Information</h4>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <label className="text-sm font-semibold text-slate-700">
                  Title <span className="text-red-500">*</span>
                  <input
                    value={form.title}
                    onChange={(event) => updateField("title", capitalizeFirstCharOnly(event.target.value))}
                    readOnly={hasApplicants}
                    className={`mt-2 w-full rounded-lg border ${errors.title ? "border-red-500 bg-red-50" : "border-blue-200"} ${hasApplicants ? "bg-gray-100 text-slate-500" : "bg-white"} px-3 py-2.5 text-sm outline-none focus:border-blue-500`}
                    placeholder="e.g., Frontend Developer"
                  />
                  {errors.title ? <span className="mt-1 block text-xs text-red-600">{errors.title}</span> : null}
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Opportunity Type
                  <select
                    value={form.opportunityType}
                    onChange={(event) => updateField("opportunityType", event.target.value)}
                    disabled={hasApplicants}
                    className={`mt-2 w-full rounded-lg border ${errors.opportunityType ? "border-red-500 bg-red-50" : "border-blue-200"} ${hasApplicants ? "bg-gray-100 text-slate-500" : "bg-white"} px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:cursor-not-allowed`}
                  >
                    <option>Full-time</option>
                    <option>Internship</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Freelance</option>
                  </select>
                  {errors.opportunityType ? <span className="mt-1 block text-xs text-red-600">{errors.opportunityType}</span> : null}
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Category <span className="text-red-500">*</span>
                  <select
                    value={form.category}
                    onChange={(event) => updateField("category", event.target.value)}
                    disabled={hasApplicants}
                    className={`mt-2 w-full rounded-lg border ${errors.category ? "border-red-500 bg-red-50" : "border-blue-200"} ${hasApplicants ? "bg-gray-100 text-slate-500" : "bg-white"} px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:cursor-not-allowed`}
                  >
                    <option>IT</option>
                    <option>Marketing</option>
                    <option>Finance</option>
                    <option>Design</option>
                    <option>Engineering</option>
                  </select>
                  {errors.category ? <span className="mt-1 block text-xs text-red-600">{errors.category}</span> : null}
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Department
                  <input
                    value={form.department}
                    onChange={(event) => updateField("department", event.target.value)}
                    readOnly={hasApplicants}
                    className={`mt-2 w-full rounded-lg border ${errors.department ? "border-red-500 bg-red-50" : "border-blue-200"} ${hasApplicants ? "bg-gray-100 text-slate-500" : "bg-white"} px-3 py-2.5 text-sm outline-none focus:border-blue-500`}
                    placeholder="e.g., Engineering"
                  />
                  {errors.department ? <span className="mt-1 block text-xs text-red-600">{errors.department}</span> : null}
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Location <span className="text-red-500">*</span>
                  <input
                    value={form.location}
                    onChange={(event) => updateField("location", capitalizeFirstCharOnly(event.target.value))}
                    readOnly={hasApplicants}
                    className={`mt-2 w-full rounded-lg border ${errors.location ? "border-red-500 bg-red-50" : "border-blue-200"} ${hasApplicants ? "bg-gray-100 text-slate-500" : "bg-white"} px-3 py-2.5 text-sm outline-none focus:border-blue-500`}
                    placeholder="e.g., Colombo, Sri Lanka"
                  />
                  {errors.location ? <span className="mt-1 block text-xs text-red-600">{errors.location}</span> : null}
                </label>
                <label className="text-sm font-semibold text-slate-700 md:col-span-2">
                  Description <span className="text-red-500">*</span>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Maximum 1000 characters</span>
                    <span className={`text-xs font-semibold ${form.description.trim().length <= DESCRIPTION_MAX_LENGTH ? "text-slate-500" : "text-red-600"}`}>
                      {form.description.trim().length}/{DESCRIPTION_MAX_LENGTH}
                    </span>
                  </div>
                  <textarea
                    value={form.description}
                    onChange={(event) => updateField("description", event.target.value)}
                    readOnly={hasApplicants}
                    maxLength={DESCRIPTION_MAX_LENGTH}
                    className={`mt-2 min-h-24 w-full rounded-lg border ${errors.description || descriptionError ? "border-red-500 bg-red-50" : "border-blue-200"} ${hasApplicants ? "bg-gray-100 text-slate-500" : "bg-white"} px-3 py-2.5 text-sm outline-none focus:border-blue-500`}
                    placeholder="Describe the job role, responsibilities, and expectations (max 1000 characters)..."
                  />
                  {descriptionError ? <span className="mt-1 block text-xs text-orange-600">{descriptionError}</span> : null}
                  {errors.description ? <span className="mt-1 block text-xs text-red-600">{errors.description}</span> : null}
                </label>
              </div>
            </section>

            <section className="rounded-xl border border-blue-100 bg-white/70 p-4">
              <h4 className="font-bold text-blue-900">Skills and Requirements</h4>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <label className="text-sm font-semibold text-slate-700 md:col-span-2">
                  Add Required Skill <span className="text-red-500">*</span>
                  <div className="mt-2 flex gap-2">
                    <input
                      value={form.skillInput}
                      onChange={(event) => updateField("skillInput", capitalizeFirstCharOnly(event.target.value))}
                      readOnly={hasApplicants}
                      className={`w-full rounded-lg border ${errors.skillInput ? "border-red-500 bg-red-50" : "border-blue-200"} ${hasApplicants ? "bg-gray-100 text-slate-500" : "bg-white"} px-3 py-2.5 text-sm outline-none focus:border-blue-500`}
                      placeholder="Type a skill (e.g., React, Python, Design) and click Add"
                    />
                    <button type="button" onClick={addSkill} disabled={hasApplicants} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">
                      Add
                    </button>
                  </div>
                  {errors.skillInput ? <span className="mt-1 block text-xs text-red-600">{errors.skillInput}</span> : null}
                </label>
                <div className="md:col-span-2 flex flex-wrap gap-2">
                  {form.requiredSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      disabled={hasApplicants}
                      onClick={() => removeSkill(skill)}
                      className="rounded-full border border-blue-300 bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 hover:bg-blue-200 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-500"
                    >
                      {skill} ×
                    </button>
                  ))}
                </div>
                {errors.requiredSkills ? <p className="md:col-span-2 text-xs text-red-600">{errors.requiredSkills}</p> : null}

                <div className="text-sm font-semibold text-slate-700 md:col-span-2">
                  Experience Level <span className="text-red-500">*</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["Entry Level", "Mid Level", "Senior Level", "No Experience"].map((level) => (
                      <button
                        key={level}
                        type="button"
                        disabled={hasApplicants}
                        onClick={() => updateField("experienceLevel", level)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-bold ${form.experienceLevel === level ? "border-blue-600 bg-blue-600 text-white" : "border-blue-200 bg-white text-slate-600 hover:border-blue-400"} ${hasApplicants ? "cursor-not-allowed border-slate-200 bg-gray-100 text-slate-500" : ""}`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-sm font-semibold text-slate-700 md:col-span-2">
                  Work Mode <span className="text-red-500">*</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["On-site", "Remote", "Hybrid"].map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        disabled={hasApplicants}
                        onClick={() => updateField("workMode", mode)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-bold ${form.workMode === mode ? "border-blue-600 bg-blue-600 text-white" : "border-blue-200 bg-white text-slate-600 hover:border-blue-400"} ${hasApplicants ? "cursor-not-allowed border-slate-200 bg-gray-100 text-slate-500" : ""}`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-blue-100 bg-white/70 p-4">
              <h4 className="font-bold text-blue-900">Eligibility Criteria</h4>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <label className="text-sm font-semibold text-slate-700">
                  Minimum Education
                  <input
                    value={form.minEducation}
                    onChange={(event) => updateField("minEducation", event.target.value)}
                    readOnly={hasApplicants}
                    className={`mt-2 w-full rounded-lg border ${errors.minEducation ? "border-red-500 bg-red-50" : "border-blue-200"} ${hasApplicants ? "bg-gray-100 text-slate-500" : "bg-white"} px-3 py-2.5 text-sm outline-none focus:border-blue-500`}
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Eligible Academic Year
                  <input
                    value={form.eligibleYear}
                    onChange={(event) => updateField("eligibleYear", event.target.value)}
                    readOnly={hasApplicants}
                    className={`mt-2 w-full rounded-lg border ${errors.eligibleYear ? "border-red-500 bg-red-50" : "border-blue-200"} ${hasApplicants ? "bg-gray-100 text-slate-500" : "bg-white"} px-3 py-2.5 text-sm outline-none focus:border-blue-500`}
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Minimum GPA
                  <input
                    type="number"
                    min="0"
                    max="4"
                    step="0.01"
                    value={form.minGPA}
                    onChange={(event) => updateField("minGPA", event.target.value)}
                    readOnly={hasApplicants}
                    className={`mt-2 w-full rounded-lg border ${errors.minGPA ? "border-red-500 bg-red-50" : "border-blue-200"} ${hasApplicants ? "bg-gray-100 text-slate-500" : "bg-white"} px-3 py-2.5 text-sm outline-none focus:border-blue-500`}
                    placeholder="Optional (0.00 to 4.00)"
                  />
                  {errors.minGPA ? <span className="mt-1 block text-xs text-red-600">{errors.minGPA}</span> : null}
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Field of Study
                  <input
                    value={form.fieldOfStudy}
                    onChange={(event) => updateField("fieldOfStudy", capitalizeFirstCharOnly(event.target.value))}
                    readOnly={hasApplicants}
                    className={`mt-2 w-full rounded-lg border ${errors.fieldOfStudy ? "border-red-500 bg-red-50" : "border-blue-200"} ${hasApplicants ? "bg-gray-100 text-slate-500" : "bg-white"} px-3 py-2.5 text-sm outline-none focus:border-blue-500`}
                    placeholder="Optional (no special characters)"
                  />
                  {errors.fieldOfStudy ? <span className="mt-1 block text-xs text-red-600">{errors.fieldOfStudy}</span> : null}
                </label>
                <div className="text-sm font-semibold text-slate-700 md:col-span-2">
                  Eligible Categories
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {eligibleCategoryOptions.map((item) => (
                      <label key={item} className={`flex items-center gap-2 rounded-lg border p-2 text-sm font-medium ${hasApplicants ? "border-slate-200 bg-gray-100 text-slate-500" : "border-blue-100 bg-white text-slate-700 hover:bg-blue-50"}`}>
                        <input disabled={hasApplicants} type="checkbox" checked={form.eligibleCategories.includes(item)} onChange={() => toggleEligibleCategory(item)} />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-blue-100 bg-white/70 p-4">
              <h4 className="font-bold text-blue-900">Timeline and Compensation</h4>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <label className="text-sm font-semibold text-slate-700">
                  Start At <span className="text-red-500">*</span>
                  <input
                    type="datetime-local"
                    value={form.startAt}
                    onChange={(event) => updateField("startAt", event.target.value)}
                    min={toDateTimeLocalValue(new Date())}
                    className={`mt-2 w-full rounded-lg border ${errors.startAt || dateError ? "border-red-500 bg-red-50" : "border-blue-200 bg-white"} px-3 py-2.5 text-sm outline-none focus:border-blue-500`}
                  />
                  {errors.startAt ? <span className="mt-1 block text-xs text-red-600">{errors.startAt}</span> : null}
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Expires At <span className="text-red-500">*</span>
                  <input
                    type="datetime-local"
                    value={form.expiresAt}
                    onChange={(event) => updateField("expiresAt", event.target.value)}
                    min={form.startAt || toDateTimeLocalValue(new Date())}
                    className={`mt-2 w-full rounded-lg border ${errors.expiresAt || dateError ? "border-red-500 bg-red-50" : "border-blue-200 bg-white"} px-3 py-2.5 text-sm outline-none focus:border-blue-500`}
                  />
                  {dateError ? <span className="mt-1 block text-xs text-orange-600">{dateError}</span> : null}
                  {errors.expiresAt ? <span className="mt-1 block text-xs text-red-600">{errors.expiresAt}</span> : null}
                </label>
                <label className="text-sm font-semibold text-slate-700 md:col-span-2">
                  Salary / Stipend <span className="text-red-500">*</span>
                  <input
                    value={form.salaryStipend}
                    onChange={(event) => {
                      setSalaryEdited(true);
                      const raw = event.target.value;
                      if (/^\d{0,8}(\.\d{0,2})?$/.test(raw)) {
                        updateField("salaryStipend", raw);
                      }
                    }}
                    readOnly={hasApplicants}
                    className={`mt-2 w-full rounded-lg border ${errors.salaryStipend || (!isLockedEdit && salaryError) ? "border-red-500 bg-red-50" : "border-blue-200"} ${hasApplicants ? "bg-gray-100 text-slate-500" : "bg-white"} px-3 py-2.5 text-sm outline-none focus:border-blue-500`}
                    placeholder="e.g., 50000.00"
                  />
                  {!isLockedEdit && salaryError ? <span className="mt-1 block text-xs text-red-600">{salaryError}</span> : null}
                  {!salaryError && errors.salaryStipend ? <span className="mt-1 block text-xs text-red-600">{errors.salaryStipend}</span> : null}
                </label>
              </div>
            </section>

            {message ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{message}</p> : null}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting || loadingJob}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
              >
                {submitting ? (isEditMode ? "Updating..." : "Publishing...") : isEditMode ? "Update Job" : "Publish Job"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/employer/dashboard")}
                className="rounded-lg border border-blue-200 bg-white px-5 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      </EmployerShell>
    </div>
  );
}
