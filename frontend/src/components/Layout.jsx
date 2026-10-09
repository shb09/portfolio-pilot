import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useTheme } from "../theme/ThemeContext";

const NAV = [
  ["Dashboard", "/dashboard", "◈"],
  ["Profile", "/profile", "✦"],
  ["Projects", "/projects", "▣"],
  ["Skills", "/skills", "⬢"],
  ["Education", "/education", "🎓"],
  ["Experience", "/experience", "💼"],
  ["Certifications", "/certifications", "🏅"],
  ["Achievements", "/achievements", "🏆"],
  ["Preview & Publish", "/preview", "🚀"],
  ["Analytics", "/analytics", "📈"],
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const quit = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen">
      <header
        className="sticky top-0 z-20 border-b"
        style={{ background: "var(--nav)", borderColor: "var(--line)", backdropFilter: "blur(14px)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 font-extrabold tracking-tight">
            <span className="btn-brand flex h-8 w-8 items-center justify-center text-lg">◈</span>
            <span className="grad-text text-lg">Portfolio Pilot</span>
          </button>
          <div className="ml-auto flex items-center gap-2">
            <span className="chip hidden px-3 py-1 text-xs sm:inline" style={{ color: "var(--muted)" }}>
              {user?.email}
            </span>
            <button onClick={toggle} className="btn-ghost px-3 py-1.5 text-sm" title="Toggle aura / dark theme">
              {theme === "aura" ? "🌙 Dark" : "✨ Aura"}
            </button>
            <button onClick={quit} className="btn-ghost px-3 py-1.5 text-sm">
              Logout
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3">
          {NAV.map(([label, to, icon]) => (
            <NavLink key={to} to={to} className="navlink whitespace-nowrap px-3 py-1.5 text-sm">
              <span className="mr-1">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <footer className="mx-auto max-w-6xl px-4 pb-10 text-center text-xs" style={{ color: "var(--muted)" }}>
        Portfolio Pilot — build your profile, track your progress, launch your career story.
      </footer>
    </div>
  );
}
