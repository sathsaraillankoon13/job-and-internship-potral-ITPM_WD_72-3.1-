import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useEmployerJobs } from "../context/EmployerJobsContext";
import { fetchNotifications } from "../api";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "🏠", href: "/employer/dashboard" },
  { key: "post-job", label: "Post Job / Internship", icon: "➕", href: "/employer/post-job" },
  { key: "manage-jobs", label: "Manage Job Posts", icon: "📋", href: "/employer/manage-job-posts", badge: "6" },
  { key: "analytics", label: "Analytics", icon: "📊", href: "/employer/analytics" },
];

function SidebarLink({ item, activeKey }) {
  const active = activeKey === item.key;

  return (
    <Link
      to={item.href}
      className={`relative mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
        active
          ? "bg-white/20 text-white shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.2)]"
          : "text-white/70 hover:bg-white/10 hover:text-white"
      }`}
    >
      {active ? <span className="absolute left-0 top-1/4 h-1/2 w-1 rounded-r bg-sky-300" /> : null}
      <span className="w-5 text-center text-base">{item.icon}</span>
      <span>{item.label}</span>
      {item.badge ? (
        <span className="ml-auto rounded-full bg-sky-400 px-2 py-0.5 text-[10px] font-extrabold text-white">{item.badge}</span>
      ) : null}
    </Link>
  );
}

export default function EmployerShell({ activeKey, title, subtitle, children, countsOverride }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const { counts } = useEmployerJobs();
  const resolvedCounts = countsOverride || counts;

  useEffect(() => {
    let active = true;

    async function loadNotifications() {
      try {
        const data = await fetchNotifications();
        if (!active) return;

        setNotificationCount(Number(data?.unreadCount || 0));
      } catch (error) {
        if (!active) return;
        setNotificationCount(0);
      }
    }

    loadNotifications();

    const refresh = () => loadNotifications();
    window.addEventListener("careerbridge:data-updated", refresh);

    const intervalId = setInterval(loadNotifications, 60000);

    return () => {
      active = false;
      window.removeEventListener("careerbridge:data-updated", refresh);
      clearInterval(intervalId);
    };
  }, []);

  const hasNotifications = useMemo(() => notificationCount > 0, [notificationCount]);

  const resolvedNavItems = navItems.map((item) =>
    item.key === "manage-jobs" ? { ...item, badge: String(resolvedCounts.total) } : item
  );

  return (
    <div className="min-h-screen bg-sky-100 text-slate-900">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gradient-to-b from-blue-900 to-blue-700 shadow-2xl transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-white/15 px-6 py-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-skyBrand-500 to-skyBrand-900 text-base font-black text-white shadow-glow">
              CB
            </div>
            <div>
              <p className="font-['Sora'] text-lg font-extrabold text-white tracking-tight">
                Career<span className="text-sky-300">Bridge</span>
              </p>
              <p className="text-[11px] text-white/55">Employer Portal</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-5">
          <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Main</p>
          {resolvedNavItems.map((item) => (
            <SidebarLink key={item.key} item={item} activeKey={activeKey} />
          ))}
        </div>

        <div className="mt-auto border-t border-white/10 p-5">
          <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-500 font-['Sora'] font-extrabold text-white">
              C
            </div>
            <div>
              <p className="text-sm font-bold text-white">TechCorp Ltd.</p>
              <p className="text-[11px] text-white/55">Employer Account</p>
            </div>
          </div>
        </div>
      </aside>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/45 lg:hidden"
          aria-label="Close sidebar"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 flex min-h-[68px] items-center justify-between border-b border-blue-300/50 bg-gradient-to-r from-blue-800 via-blue-700 to-sky-600 px-4 shadow-[0_8px_22px_rgba(30,64,175,0.28)] backdrop-blur lg:px-8">
          <div>
            <h1 className="font-['Sora'] text-lg font-extrabold tracking-tight text-white lg:text-xl">{title}</h1>
            <p className="hidden text-xs text-blue-100/90 sm:block">{subtitle}</p>
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/35 bg-white/15 text-lg text-white lg:hidden"
              aria-label="Toggle menu"
            >
              ☰
            </button>
            <button
              type="button"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/35 bg-white/15 text-lg text-white"
            >
              🔔
              {hasNotifications ? (
                <span className="absolute right-1.5 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border border-white bg-red-500 px-1 text-[10px] font-bold text-white">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              ) : null}
            </button>
            <Link
              to="/employer/post-job"
              className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-blue-700 shadow-[0_8px_20px_rgba(15,23,42,0.2)] transition hover:bg-blue-50 sm:px-4 sm:text-sm"
            >
              + Post New Job
            </Link>
          </div>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
