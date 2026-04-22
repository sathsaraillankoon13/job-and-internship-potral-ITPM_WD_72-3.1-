import EmployerShell from "../components/EmployerShell";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchJobs, fetchPerformanceAnalytics } from "../api";
import styles from "../styles/analytics.module.css";

const MOCK_PERFORMANCE_ANALYTICS = {
  summaryCards: [
    { key: "views", title: "Total Job Views", value: 3842, growthPercent: 18 },
    { key: "applications", title: "Total Applications", value: 247, growthPercent: 12 },
  ],
  weeklyTrend: [
    { day: "Mon", views: 120, applications: 8 },
    { day: "Tue", views: 132, applications: 10 },
    { day: "Wed", views: 118, applications: 6 },
    { day: "Thu", views: 164, applications: 12 },
    { day: "Fri", views: 154, applications: 11 },
    { day: "Sat", views: 182, applications: 14 },
    { day: "Sun", views: 140, applications: 9 },
  ],
  categoryBreakdown: [
    { category: "Engineering", percentage: 40, applications: 99 },
    { category: "Design", percentage: 22, applications: 54 },
    { category: "Data / Analytics", percentage: 18, applications: 44 },
    { category: "Operations", percentage: 20, applications: 50 },
  ],
  topPerformer: {
    title: "Frontend Developer",
    opportunityType: "Full-time",
    location: "Colombo",
    postedOn: "2026-03-18",
    metrics: {
      views: 120,
      applications: 45,
      conversionRate: 37,
      clickRate: 8.2,
    },
  },
  jobPerformance: [
    { title: "Frontend Developer", category: "Engineering", views: 120, applications: 45, conversionRate: 37 },
    { title: "Mobile App Intern", category: "Engineering", views: 95, applications: 32, conversionRate: 34 },
    { title: "UI/UX Design Intern", category: "Design", views: 78, applications: 19, conversionRate: 24 },
    { title: "Data Analyst", category: "Analytics", views: 64, applications: 28, conversionRate: 44 },
    { title: "DevOps Engineer", category: "Engineering", views: 112, applications: 61, conversionRate: 54 },
  ],
  updatedAt: null,
};

const summaryIcons = {
  views: "👁",
  applications: "📄",
};

const categoryColors = ["#2563eb", "#0ea5e9", "#60a5fa", "#93c5fd", "#1d4ed8"];

function formatCardValue(card) {
  if (card.suffix) {
    return `${card.value}${card.suffix}`;
  }

  return Number(card.value || 0).toLocaleString();
}

function formatUpdatedAt(value) {
  if (!value) {
    return "--";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return date.toLocaleString();
}

function toLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(MOCK_PERFORMANCE_ANALYTICS);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exportingPdf, setExportingPdf] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async (silent = false) => {
      if (!silent) {
        setLoading(true);
      }

      try {
        const [data, jobsData] = await Promise.all([fetchPerformanceAnalytics(), fetchJobs()]);
        if (!active) return;
        setAnalytics(data || MOCK_PERFORMANCE_ANALYTICS);
        setJobs(Array.isArray(jobsData) ? jobsData : []);
        setError("");
      } catch (err) {
        if (!active) return;
        setAnalytics(MOCK_PERFORMANCE_ANALYTICS);
        setJobs([]);
        if (!silent) {
          setError(err?.response?.data?.message || err.message || "Failed to load performance analytics.");
        }
      } finally {
        if (active && !silent) {
          setLoading(false);
        }
      }
    };

    load(false);
    const intervalId = setInterval(() => {
      load(true);
    }, 10000);

    const onDataUpdated = () => {
      load(true);
    };

    const onStorage = (event) => {
      if (!event.key || event.key === "careerbridge-jobs-updated") {
        load(true);
      }
    };

    const onFocus = () => {
      load(true);
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
  }, []);

  const topPerformerMetrics = useMemo(() => {
    return [
      [String(analytics?.topPerformer?.metrics?.views ?? 0), "Views"],
      [String(analytics?.topPerformer?.metrics?.applications ?? 0), "Applications"],
    ];
  }, [analytics]);

  const normalizedJobPerformance = useMemo(() => {
    return Array.isArray(jobs)
      ? jobs.map((row) => {
          const applications = Number(row.applicants || row.applications || 0);
          const views = Math.max(Number(row.views || 0), applications);
          const conversionRate = views > 0 ? Math.min((applications / views) * 100, 100) : 0;
        const status = String(row.status || "Scheduled");

          return {
            title: row.title,
            category: row.category || "Other",
            status,
            views,
            applications,
            conversionRate,
          };
        })
      : [];
  }, [jobs]);

  const tableRows = useMemo(() => {
    const statusPriority = {
      Active: 0,
      Scheduled: 1,
      Expired: 2,
      Closed: 3,
      Draft: 4,
    };

    return [...normalizedJobPerformance]
      .sort((a, b) => {
        const statusDiff = (statusPriority[a.status] ?? 99) - (statusPriority[b.status] ?? 99);
        if (statusDiff !== 0) return statusDiff;
        if (b.applications !== a.applications) return b.applications - a.applications;
        return b.views - a.views;
      });
  }, [normalizedJobPerformance]);

  const getStatusBadgeClass = (status) => {
    if (status === "Active") {
      return "bg-emerald-100 text-emerald-800";
    }
    if (status === "Expired") {
      return "bg-slate-200 text-slate-700";
    }
    if (status === "Closed") {
      return "bg-red-100 text-red-700";
    }
    if (status === "Scheduled") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-slate-100 text-slate-700";
  };

  const visibleSummaryCards = useMemo(() => {
    const totalViews = normalizedJobPerformance.reduce((sum, job) => sum + Number(job.views || 0), 0);
    const totalApplications = normalizedJobPerformance.reduce((sum, job) => sum + Number(job.applications || 0), 0);

    return [
      { key: "views", title: "Total Job Views", value: totalViews, growthPercent: 0 },
      { key: "applications", title: "Total Applications", value: totalApplications, growthPercent: 0 },
    ];
  }, [normalizedJobPerformance]);

  const weeklyTrendData = useMemo(() => {
    const incomingWeekly = Array.isArray(analytics?.weeklyTrend)
      ? analytics.weeklyTrend
      : Array.isArray(analytics?.dailyTrend)
      ? analytics.dailyTrend
      : null;

    if (incomingWeekly && incomingWeekly.length > 0) {
      return incomingWeekly.map((item) => ({
        day: String(item.day || item.label || "").slice(0, 3) || "--",
        views: Number(item.views || 0),
        applications: Number(item.applications || 0),
      }));
    }

    const today = new Date();
    const start = new Date(today);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - 6);

    const buckets = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);

      return {
        key: toLocalDateKey(date),
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        views: 0,
        applications: 0,
      };
    });

    const bucketMap = new Map(buckets.map((bucket) => [bucket.key, bucket]));

    (Array.isArray(jobs) ? jobs : []).forEach((job) => {
      const sourceDate = new Date(job.updatedAt || job.createdAt || job.startAt || job.expiresAt || "");
      if (Number.isNaN(sourceDate.getTime())) {
        return;
      }

      const key = toLocalDateKey(sourceDate);
      const bucket = bucketMap.get(key);
      if (!bucket) {
        return;
      }

      const applications = Number(job.applicants || job.applications || 0);
      const views = Math.max(Number(job.views || 0), applications);

      bucket.views += views;
      bucket.applications += applications;
    });

    return buckets.map(({ day, views, applications }) => ({ day, views, applications }));
  }, [analytics, jobs]);

  const handleExportPdf = async () => {
    setExportingPdf(true);

    try {
      const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
      ]);

      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const generatedAt = new Date().toLocaleString();

      doc.setFontSize(16);
      doc.text("Performance and Engagement Analytics", 40, 40);
      doc.setFontSize(10);
      doc.setTextColor(90, 90, 90);
      doc.text(`Generated at: ${generatedAt}`, 40, 58);

      let y = 84;
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text("Summary", 40, y);
      y += 10;

      const summaryRows = visibleSummaryCards.map((card) => [
        card.title,
        formatCardValue(card),
        `${Number(card.growthPercent || 0) >= 0 ? "↑" : "↓"} ${Math.abs(Number(card.growthPercent || 0))}%`,
      ]);

      autoTable(doc, {
        startY: y,
        head: [["Metric", "Value", "Growth"]],
        body: summaryRows,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [37, 99, 235] },
      });

      const afterSummaryY = doc.lastAutoTable.finalY + 18;
      doc.setFontSize(12);
      doc.text("Top Performer", 40, afterSummaryY);
      doc.setFontSize(10);
      doc.text(
        `${analytics.topPerformer.title} | ${analytics.topPerformer.opportunityType} | ${analytics.topPerformer.location}`,
        40,
        afterSummaryY + 14
      );
      doc.text(
        `Views: ${analytics.topPerformer.metrics.views} | Applications: ${analytics.topPerformer.metrics.applications} | Conversion: ${analytics.topPerformer.metrics.conversionRate}%`,
        40,
        afterSummaryY + 28
      );

      autoTable(doc, {
        startY: afterSummaryY + 46,
        head: [["Job Title", "Category", "Status", "Views", "Applications", "Conversion Rate"]],
        body: tableRows.map((row) => [
          row.title,
          row.category,
          row.status,
          Number(row.views || 0).toLocaleString(),
          Number(row.applications || 0).toLocaleString(),
          `${Number(row.conversionRate || 0).toFixed(1)}%`,
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [14, 165, 233] },
      });

      const fileName = `analytics-report-${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(fileName);
    } finally {
      setExportingPdf(false);
    }
  };

  return (
    <div className={styles.page}>
      <EmployerShell
        activeKey="analytics"
        title="Performance and Engagement Analytics"
        subtitle="Understand how your listings are performing."
      >
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={handleExportPdf}
          disabled={exportingPdf}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {exportingPdf ? "Exporting PDF..." : "Export as PDF"}
        </button>
      </div>

      {loading ? <div className="mb-5 rounded-2xl border border-sky-200 bg-white p-4 shadow-card">Loading analytics...</div> : null}
      {error ? <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">{error}</div> : null}

      <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {visibleSummaryCards.map((card) => {
          const isUp = Number(card.growthPercent || 0) >= 0;
          const growthLabel = `${isUp ? "↑" : "↓"} ${Math.abs(Number(card.growthPercent || 0))}%`;

          return (
            <article key={card.key} className="relative overflow-hidden rounded-2xl border border-blue-100 bg-sky-50 p-5 shadow-[0_8px_30px_rgba(37,99,235,0.1)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-sky-400" />
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-xl">{summaryIcons[card.key] || "📊"}</div>
              <span className={`rounded-full px-2 py-1 text-xs font-bold ${isUp ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>{growthLabel}</span>
            </div>
            <p className="mt-4 font-['Sora'] text-3xl font-extrabold leading-none">{formatCardValue(card)}</p>
            <p className="mt-1 text-sm text-slate-500">{card.title}</p>
          </article>
          );
        })}
      </section>

      <section className="mb-5 grid gap-5 xl:grid-cols-[1.4fr,1fr]">
        <article className="rounded-2xl border border-blue-100 bg-sky-50 shadow-[0_8px_30px_rgba(37,99,235,0.1)]">
          <div className="border-b border-blue-100 px-5 py-4 lg:px-6">
            <h3 className="font-['Sora'] text-[15px] font-extrabold">Views vs Applications</h3>
            <p className="text-xs text-slate-500">Weekly comparison · Last 7 days</p>
          </div>

          <div className="p-5 lg:p-6">
            <div className="h-72 rounded-xl bg-gradient-to-b from-sky-100 to-sky-50 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrendData} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
                  <XAxis dataKey="day" tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, borderColor: "#bfdbfe" }}
                    labelStyle={{ color: "#0f172a", fontWeight: 700 }}
                  />
                  <Bar dataKey="views" name="Views" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="applications" name="Applications" fill="#0ea5e9" radius={[6, 6, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-blue-100 bg-sky-50 shadow-[0_8px_30px_rgba(37,99,235,0.1)]">
          <div className="border-b border-blue-100 px-5 py-4 lg:px-6">
            <h3 className="font-['Sora'] text-[15px] font-extrabold">Popular Categories</h3>
            <p className="text-xs text-slate-500">By application count</p>
          </div>

          <div className="space-y-3 p-5 lg:p-6">
            {analytics.categoryBreakdown.map((item, index) => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: categoryColors[index % categoryColors.length] }} />
                  <span className="flex-1 text-sm text-slate-700">{item.category}</span>
                  <span className="text-sm font-extrabold text-slate-900">{item.percentage}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-blue-100">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${item.percentage}%`, backgroundColor: categoryColors[index % categoryColors.length] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mb-5 rounded-2xl border border-blue-100 bg-sky-50 shadow-[0_8px_30px_rgba(37,99,235,0.1)]">
        <div className="border-b border-blue-100 px-5 py-4 lg:px-6">
          <h3 className="font-['Sora'] text-[15px] font-extrabold">Top Performer</h3>
          <p className="text-xs text-slate-500">Best performing job post this month</p>
        </div>

        <div className="p-5 lg:p-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 p-5 text-white">
            <span className="absolute right-4 top-2 text-4xl opacity-30">🏆</span>
            <span className="inline-block rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider">Top Post</span>
            <h4 className="mt-3 font-['Sora'] text-xl font-extrabold">{analytics.topPerformer.title}</h4>
            <p className="text-xs text-white/75">{analytics.topPerformer.opportunityType} · {analytics.topPerformer.location} · Posted {analytics.topPerformer.postedOn}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {topPerformerMetrics.map((item) => (
                <div key={item[1]}>
                  <p className="font-['Sora'] text-2xl font-extrabold leading-none">{item[0]}</p>
                  <p className="text-[10px] text-white/75">{item[1]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-sky-50 shadow-[0_8px_30px_rgba(37,99,235,0.1)]">
        <div className="border-b border-blue-100 px-5 py-4 lg:px-6">
          <h3 className="font-['Sora'] text-[15px] font-extrabold">Job Performance Table</h3>
          <p className="text-xs text-slate-500">Views, applications and conversion per listing</p>
        </div>

        <div className="space-y-3 p-5 lg:p-6">
          <div className="hidden grid-cols-[2fr,1fr,1fr,1fr,1.2fr,1fr] border-b border-blue-100 pb-2 text-[11px] font-extrabold uppercase tracking-wide text-blue-700 lg:grid">
            <p>Job Title</p>
            <p>Status</p>
            <p>Views</p>
            <p>Applications</p>
            <p>Conversion Rate</p>
            <p>Category</p>
          </div>

          {tableRows.map((row) => (
            <div key={`${row.title}-${row.category}-${row.status}`} className="grid gap-2 border-b border-blue-50 pb-3 text-sm last:border-0 lg:grid-cols-[2fr,1fr,1fr,1fr,1.2fr,1fr] lg:items-center">
              <p className="font-bold text-slate-900">{row.title}</p>
              <p>
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${getStatusBadgeClass(row.status)}`}>
                  {row.status}
                </span>
              </p>
              <p className="inline-flex items-center gap-1">👁 {Number(row.views || 0).toLocaleString()}</p>
              <p className="font-bold text-blue-700">{Number(row.applications || 0).toLocaleString()}</p>
              <div>
                <p className="text-xs font-bold text-emerald-700">{Number(row.conversionRate || 0).toFixed(1)}%</p>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-blue-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-sky-400 transition-all duration-700 ease-out"
                    style={{ width: `${Math.max(0, Math.min(Number(row.conversionRate || 0), 100))}%` }}
                  />
                </div>
              </div>
              <p><span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700">{row.category}</span></p>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-4 text-right text-xs text-slate-500">Last updated: {formatUpdatedAt(analytics.updatedAt)}</p>
      </EmployerShell>
    </div>
  );
}
