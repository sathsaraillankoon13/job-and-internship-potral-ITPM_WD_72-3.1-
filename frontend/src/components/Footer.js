export default function Footer() {
  const links = {
    "For Students": ["Browse Jobs", "Internships", "Full-time Roles", "Saved Listings"],
    Company: ["About Us", "Contact"],
  };

  return (
    <footer className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-4 pb-8 pt-16 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-xl font-black tracking-tight">
              Career<span className="text-skyBrand-300">Bridge</span>
            </h3>
            <p className="mt-3 max-w-xs text-sm text-white/60">
              Connecting Sri Lankan students with top employers and making the path from campus to career simple.
            </p>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/50">{title}</h4>
              <div className="space-y-2">
                {items.map((item) => (
                  <button key={item} type="button" className="block text-sm text-white/70 transition hover:text-white">
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-white/50">
          <p>Copyright 2025 CareerBridge. All rights reserved.</p>
          <p>Built for students across Sri Lanka.</p>
        </div>
      </div>
    </footer>
  );
}
