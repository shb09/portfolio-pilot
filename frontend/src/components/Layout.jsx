import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award, BarChart3, Briefcase, FolderKanban, GraduationCap, Layers,
  LayoutDashboard, LogOut, Menu, Moon, Rocket, Settings as SettingsIcon,
  Sun, Trophy, UserRound, X,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { useTheme } from "../theme/ThemeContext";

const WORKSPACE = [
  ["Overview", "/dashboard", LayoutDashboard],
  ["My Profile", "/profile", UserRound],
  ["Projects", "/projects", FolderKanban],
  ["Skills", "/skills", Layers],
  ["Education", "/education", GraduationCap],
  ["Experience", "/experience", Briefcase],
  ["Certifications", "/certifications", Award],
  ["Achievements", "/achievements", Trophy],
];

const PUBLISH = [["Preview & Publish", "/preview", Rocket]];

const INSIGHTS = [
  ["Analytics", "/analytics", BarChart3],
  ["Settings", "/settings", SettingsIcon],
];

function BrandMark({ size = 30 }) {
  return (
    <span
      className="flex items-center justify-center rounded-md text-sm font-extrabold"
      style={{ width: size, height: size, background: "var(--brand)", color: "var(--brand-ink)" }}
      aria-hidden="true"
    >
      P
    </span>
  );
}

function NavGroup({ label, items, onGo }) {
  return (
    <div>
      <p className="nav-section px-2.5 pb-1 pt-3">{label}</p>
      <ul className="space-y-px">
        {items.map(([name, to, Icon]) => (
          <li key={to}>
            <NavLink
              to={to}
              onClick={onGo}
              className={({ isActive }) => `navlink flex items-center gap-2 px-2.5 py-1.5${isActive ? " active" : ""}`}
            >
              <Icon size={15} strokeWidth={2.1} aria-hidden="true" className="shrink-0" />
              {name}
            </NavLink>
          </li>
        ))}
      </ul>
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

  const all = [...WORKSPACE, ...PUBLISH, ...INSIGHTS];
  const crumb = all.find(([, to]) => to === location.pathname)?.[0] || "Workspace";

  return (
    <div className="min-h-screen lg:flex">
      {/* Desktop sidebar — 228px, compact rows */}
      <aside
        className="sticky top-0 hidden h-screen w-[228px] shrink-0 flex-col border-r px-3 py-4 lg:flex"
        style={{ background: "var(--sidebar)", borderColor: "var(--line)" }}
      >
        <Link to="/dashboard" className="flex items-center gap-2 px-1.5 py-1">
          <BrandMark />
          <span>
            <span className="block text-sm font-extrabold leading-tight tracking-tight">Portfolio Pilot</span>
            <span className="block text-[10.5px] font-medium" style={{ color: "var(--muted)" }}>career-profile OS</span>
          </span>
        </Link>
        <nav className="mt-2 flex-1 overflow-y-auto" aria-label="Primary">
          <NavGroup label="Workspace" items={WORKSPACE} />
          <NavGroup label="Publish" items={PUBLISH} />
          <NavGroup label="Insights" items={INSIGHTS} />
        </nav>
        <div className="tint rounded-lg px-2.5 py-2">
          <p className="truncate text-[13px] font-bold leading-tight">{user?.name}</p>
          <p className="truncate text-[11px]" style={{ color: "var(--muted)" }}>{user?.email}</p>
          <div className="mt-1.5 flex gap-1">
            <button onClick={toggle} className="btn-ghost flex-1 px-1.5 py-1 text-[11px] font-semibold" title="Toggle theme">
              {theme === "porcelain" ? <><Moon size={12} /> Dark</> : <><Sun size={12} /> Light</>}
            </button>
            <button onClick={quit} className="btn-ghost flex-1 px-1.5 py-1 text-[11px] font-semibold">
              <LogOut size={12} /> Out
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Mobile floating bar */}
        <header className="sticky top-0 z-20 lg:hidden" style={{ background: "var(--nav)", backdropFilter: "blur(14px)", borderBottom: "1px solid var(--line)" }}>
          <div className="flex items-center gap-2 px-3.5 py-2.5">
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="btn-ghost p-1.5"
              aria-expanded={mobileOpen}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
            <Link to="/dashboard" className="flex items-center gap-2 text-sm font-extrabold tracking-tight">
              <BrandMark size={24} />
              Portfolio Pilot
            </Link>
            <button onClick={toggle} className="btn-ghost ml-auto p-1.5" aria-label="Toggle theme">
              {theme === "porcelain" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
          </div>
          <AnimatePresence>
            {mobileOpen && (
              <motion.nav
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t px-3.5 pb-3.5"
                style={{ borderColor: "var(--line)" }}
                aria-label="Primary"
              >
                <NavGroup label="Workspace" items={WORKSPACE} onGo={() => setMobileOpen(false)} />
                <NavGroup label="Publish" items={PUBLISH} onGo={() => setMobileOpen(false)} />
                <NavGroup label="Insights" items={INSIGHTS} onGo={() => setMobileOpen(false)} />
                <button onClick={quit} className="btn-ghost mt-2.5 flex w-full items-center justify-center gap-1.5 px-3 py-2 text-[13px] font-semibold">
                  <LogOut size={14} /> Logout ({user?.email})
                </button>
              </motion.nav>
            )}
          </AnimatePresence>
        </header>

        {/* Desktop breadcrumb header */}
        <div className="mx-auto hidden max-w-5xl items-center gap-2 px-7 pt-5 lg:flex">
          <nav className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--muted)" }} aria-label="Breadcrumb">
            <span>Portfolio Pilot</span>
            <span aria-hidden="true">/</span>
            <span style={{ color: "var(--ink)" }}>{crumb}</span>
          </nav>
          <div className="ml-auto">
            <button onClick={toggle} className="btn-ghost flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold" title="Toggle theme">
              {theme === "porcelain" ? <><Moon size={12} /> Dark</> : <><Sun size={12} /> Light</>}
            </button>
          </div>
        </div>

        <main className="mx-auto max-w-5xl px-3.5 py-5 sm:px-7">{children}</main>
        <footer className="mx-auto max-w-5xl px-7 pb-8 text-[11px]" style={{ color: "var(--muted)" }}>
          Portfolio Pilot — build your profile, track your progress, launch your career story.
        </footer>
      </div>
    </div>
  );
}
