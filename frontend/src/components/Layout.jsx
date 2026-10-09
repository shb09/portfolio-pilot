import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../auth/AuthContext";
import { useTheme } from "../theme/ThemeContext";

const WORKSPACE = [
  ["Overview", "/dashboard", "◈"],
  ["My Profile", "/profile", "✦"],
  ["Projects", "/projects", "▣"],
  ["Skills", "/skills", "⬢"],
  ["Education", "/education", "❖"],
  ["Experience", "/experience", "⬣"],
  ["Certifications", "/certifications", "⬔"],
  ["Achievements", "/achievements", "⬒"],
];

const GROWTH = [
  ["Preview & Publish", "/preview", "🚀"],
  ["Analytics", "/analytics", "📈"],
  ["Settings", "/settings", "⚙"],
];

function BrandMark({ size = "h-9 w-9 text-lg" }) {
  return (
    <span className={`flex ${size} items-center justify-center rounded-lg font-extrabold`}
      style={{ background: "var(--brand)", color: "var(--brand-ink)" }} aria-hidden="true">◈</span>
  );
}

function NavGroup({ label, items, onGo }) {
  return (
    <div>
      <p className="nav-section px-3 pb-1.5 pt-4">{label}</p>
      <div className="space-y-0.5">
        {items.map(([name, to, icon]) => (
          <NavLink
            key={to}
            to={to}
            onClick={onGo}
            className={({ isActive }) => `navlink flex items-center gap-2.5 px-3 py-2 text-sm${isActive ? " active" : ""}`}
          >
            <span aria-hidden="true" className="w-5 text-center">{icon}</span>
            {name}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const quit = () => {
    logout();
    navigate("/login");
  };

  const here = [...WORKSPACE, ...GROWTH].find(([, to]) => to === location.pathname)?.[0] || "Workspace";

  return (
    <div className="min-h-screen lg:flex">
      {/* Desktop sidebar */}
      <aside
        className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r px-3 py-4 lg:flex"
        style={{ background: "var(--sidebar)", borderColor: "var(--line)" }}
      >
        <Link to="/dashboard" className="flex items-center gap-2.5 px-2 py-1.5">
          <BrandMark />
          <span>
            <span className="block text-[15px] font-extrabold leading-tight tracking-tight">Portfolio Pilot</span>
            <span className="block text-[11px] font-medium" style={{ color: "var(--muted)" }}>career-profile OS</span>
          </span>
        </Link>
        <nav className="mt-3 flex-1 overflow-y-auto" aria-label="Workspace">
          <NavGroup label="Workspace" items={WORKSPACE} />
          <NavGroup label="Growth" items={GROWTH} />
        </nav>
        <div className="tint rounded-xl p-3">
          <p className="truncate text-sm font-bold">{user?.name}</p>
          <p className="truncate text-xs" style={{ color: "var(--muted)" }}>{user?.email}</p>
          <div className="mt-2 flex gap-1.5">
            <button onClick={toggle} className="btn-ghost flex-1 px-2 py-1.5 text-xs font-semibold" title="Toggle theme">
              {theme === "ivory" ? "🌙 Emerald" : "☀ Ivory"}
            </button>
            <button onClick={quit} className="btn-ghost flex-1 px-2 py-1.5 text-xs font-semibold">
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Mobile floating glass bar */}
        <header className="sticky top-0 z-20 lg:hidden" style={{ background: "var(--nav)", backdropFilter: "blur(14px)", borderBottom: "1px solid var(--line)" }}>
          <div className="flex items-center gap-2 px-4 py-3">
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="btn-ghost px-2.5 py-1.5 text-sm"
              aria-expanded={mobileOpen}
              aria-label="Toggle navigation"
            >
              ☰
            </button>
            <Link to="/dashboard" className="flex items-center gap-2 font-extrabold tracking-tight">
              <BrandMark size="h-7 w-7 text-sm" />
              Portfolio Pilot
            </Link>
            <button onClick={toggle} className="btn-ghost ml-auto px-2.5 py-1.5 text-xs" aria-label="Toggle theme">
              {theme === "ivory" ? "🌙" : "☀"}
            </button>
          </div>
          <AnimatePresence>
            {mobileOpen && (
              <motion.nav
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden border-t px-4 pb-4"
                style={{ borderColor: "var(--line)" }}
                aria-label="Workspace"
              >
                <NavGroup label="Workspace" items={WORKSPACE} onGo={() => setMobileOpen(false)} />
                <NavGroup label="Growth" items={GROWTH} onGo={() => setMobileOpen(false)} />
                <button onClick={quit} className="btn-ghost mt-3 w-full px-3 py-2 text-sm font-semibold">
                  Logout ({user?.email})
                </button>
              </motion.nav>
            )}
          </AnimatePresence>
        </header>

        {/* Desktop compact header */}
        <div className="mx-auto hidden max-w-5xl items-center gap-3 px-8 pt-6 lg:flex">
          <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: "var(--muted)" }}>
            {here}
          </p>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={toggle} className="btn-ghost px-3 py-1.5 text-xs font-semibold" title="Toggle theme">
              {theme === "ivory" ? "🌙 Emerald theme" : "☀ Ivory theme"}
            </button>
          </div>
        </div>

        <main className="mx-auto max-w-5xl px-4 py-6 sm:px-8">{children}</main>
        <footer className="mx-auto max-w-5xl px-8 pb-10 text-xs" style={{ color: "var(--muted)" }}>
          Portfolio Pilot — build your profile, track your progress, launch your career story.
        </footer>
      </div>
    </div>
  );
}
