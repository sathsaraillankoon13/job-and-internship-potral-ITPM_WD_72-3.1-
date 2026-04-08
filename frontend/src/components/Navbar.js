import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { User } from "lucide-react";


const studentLinks = ["Home", "Jobs", "Skills", "Categories", "About Us", "Contact Us"];

const employerLinks = ["Post a Job", "My Listings", "Applications", "Pricing", "Resources"];

const studentRouteMap = {
  Home: "/",
  Jobs: "/opportunities",
  Skills: "/student/assessment",
  Categories: "/categories",
  "About Us": "/about",
  "Contact Us": "/contact",

};

const employerRouteMap = {
  "Post a Job": "/employer/post-job",
  "My Listings": "/employer/manage-job-posts",
  Applications: "/employer/dashboard",
};

export default function Navbar({ variant = "default", user: userProp = null }) {
  const [localUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const user = userProp || localUser;

  const audience = "student";
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHeroVariant = variant === "hero";
  const { pathname } = useLocation();

  const navLinks = useMemo(
    () => (audience === "student" ? studentLinks : employerLinks),
    [audience]
  );

  const headerClasses = isHeroVariant
    ? "sticky top-0 z-50 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 shadow-lg shadow-slate-950/30"
    : "sticky top-0 z-50 border-b border-sky-200/60 bg-white/95 backdrop-blur";

  const getNavItemClasses = (isActive) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition ${
      isHeroVariant
        ? isActive
          ? "bg-skyBrand-500/25 text-white hover:bg-skyBrand-500/35"
          : "text-white/85 hover:bg-white/10 hover:text-white"
        : isActive
          ? "bg-skyBrand-100 text-skyBrand-700"
          : "text-slate-700 hover:bg-skyBrand-50 hover:text-slate-900"
    }`;

  const getMobileNavItemClasses = (isActive) =>
    `block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
      isHeroVariant
        ? isActive
          ? "bg-white/10 text-white"
          : "text-white/90 hover:bg-white/10 hover:text-white"
        : isActive
          ? "bg-skyBrand-100 text-skyBrand-700"
          : "text-slate-700 hover:bg-skyBrand-50"
    }`;

  return (
    <header className={headerClasses}>
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-skyBrand-500 to-skyBrand-900 text-sm font-black text-white shadow-glow">
            CB
          </div>
          <div className={`text-xl font-black tracking-tight ${isHeroVariant ? "text-white" : "text-slate-900"}`}>
            Career<span className={isHeroVariant ? "text-skyBrand-300" : "text-skyBrand-700"}>Bridge</span>
          </div>
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link, index) => {
            const mappedHref =
              audience === "student" ? studentRouteMap[link] : employerRouteMap[link];
            const isActive = mappedHref ? pathname === mappedHref : false;

            return mappedHref ? (
              <Link
                key={link}
                to={mappedHref}
                className={getNavItemClasses(isActive)}
              >
                {link}
              </Link>
            ) : (
              <button
                key={link}
                type="button"
                className={getNavItemClasses(false)}
              >
                {link}
              </button>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <Link
              to="/student/dashboard"
              className={`flex items-center gap-2 rounded-full border p-1 transition ${
                isHeroVariant
                  ? "border-white/35 text-white hover:bg-white/10"
                  : "border-skyBrand-200 text-skyBrand-700 hover:bg-skyBrand-50 shadow-sm"
              }`}
              title="Go to Dashboard"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-skyBrand-500 to-skyBrand-700 shadow-inner">
                <User size={16} strokeWidth={3} className="text-white" />
              </div>
            </Link>
          ) : (
            <Link
              to="/login"
              className={`rounded-lg border px-4 py-2 text-sm font-bold transition ${
                isHeroVariant
                  ? "border-white/35 text-white hover:bg-white/10"
                  : "border-skyBrand-200 text-skyBrand-700 hover:bg-skyBrand-50"
              }`}
            >
              Login
            </Link>
          )}

          {audience === "student" ? (
            <button
              type="button"
              className="rounded-lg bg-skyBrand-500 px-4 py-2 text-sm font-extrabold text-white shadow-glow transition hover:bg-skyBrand-700"
            >
              Get Started
            </button>
          ) : (
            <Link
              to="/employer/post-job"
              className="rounded-lg bg-skyBrand-500 px-4 py-2 text-sm font-extrabold text-white shadow-glow transition hover:bg-skyBrand-700"
            >
              Post a Job
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className={`rounded-lg border p-2 transition lg:hidden ${
            isHeroVariant ? "border-white/35 text-white" : "border-sky-200 text-slate-700"
          }`}
          aria-label="Toggle navigation"
        >
          <span className="block h-0.5 w-5 bg-current" />
          <span className="mt-1 block h-0.5 w-5 bg-current" />
          <span className="mt-1 block h-0.5 w-5 bg-current" />
        </button>
      </div>

      {mobileOpen && (
        <div
          className={`space-y-2 border-t px-4 py-4 lg:hidden ${
            isHeroVariant
              ? "border-white/15 bg-slate-950/95 backdrop-blur-md"
              : "border-sky-100 bg-white"
          }`}
        >
          {navLinks.map((link) => {
            const mappedHref =
              audience === "student" ? studentRouteMap[link] : employerRouteMap[link];
            const isActive = mappedHref ? pathname === mappedHref : false;

            if (mappedHref) {
              return (
                <Link
                  key={link}
                  to={mappedHref}
                  className={getMobileNavItemClasses(isActive)}
                >
                  {link}
                </Link>
              );
            }

            return (
              <button
                key={link}
                type="button"
                className={getMobileNavItemClasses(false)}
              >
                {link}
              </button>
            );
          })}
          <div className="mt-2 flex gap-2">
            {user ? (
              <Link
                to="/student/dashboard"
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold ${
                  isHeroVariant
                    ? "border-white/35 text-white bg-white/10"
                    : "border-skyBrand-200 text-skyBrand-700 bg-skyBrand-50"
                }`}
              >
                <User size={18} />
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className={`flex-1 text-center rounded-lg border px-3 py-2 text-sm font-bold ${
                  isHeroVariant
                    ? "border-white/35 text-white"
                    : "border-skyBrand-200 text-skyBrand-700"
                }`}
              >
                Login
              </Link>
            )}

            {audience === "student" ? (
              <button type="button" className="flex-1 rounded-lg bg-skyBrand-500 px-3 py-2 text-sm font-bold text-white">
                Get Started
              </button>
            ) : (
              <Link to="/employer/post-job" className="flex-1 rounded-lg bg-skyBrand-500 px-3 py-2 text-center text-sm font-bold text-white">
                Post a Job
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
