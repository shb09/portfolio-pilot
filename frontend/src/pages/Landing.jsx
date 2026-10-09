import { Link } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";
import Aurora from "../components/Aurora";

const FEATURES = [
  ["◈", "Readiness engine", "A backend-calculated 0–100 score across 8 career sections — never a guess, never frontend math."],
  ["➤", "Next best actions", "Rule-based recommendations tell you exactly what to add next. No black boxes, no fake AI."],
  ["🚀", "Publish & share", "One slug, one public link — a real developer portfolio, not an admin table."],
  ["📈", "Engagement analytics", "See who viewed your portfolio and what they clicked, event by event."],
];

export default function Landing() {
  const { theme, toggle } = useTheme();
  return (
    <div className="min-h-screen">
      <Aurora />
      <header className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-5">
        <span className="btn-brand flex h-9 w-9 items-center justify-center text-xl">◈</span>
        <span className="grad-text text-xl font-extrabold">Portfolio Pilot</span>
        <div className="ml-auto flex gap-2">
          <button onClick={toggle} className="btn-ghost px-3 py-1.5 text-sm">
            {theme === "aura" ? "🌙 Dark" : "✨ Aura"}
          </button>
          <Link to="/login" className="btn-ghost px-4 py-1.5 text-sm font-semibold">
            Login
          </Link>
          <Link to="/register" className="btn-brand px-4 py-1.5 text-sm">
            Get started
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16">
        <section className="py-14 text-center sm:py-20">
          <span className="chip px-4 py-1.5 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--brand)" }}>
            Career-profile OS for students
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
            Build your profile. <span className="grad-text">Launch your career story.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg" style={{ color: "var(--muted)" }}>
            Your projects, skills, certificates and wins — scattered everywhere. Portfolio Pilot
            brings them together, scores your readiness, and publishes you to the world.
          </p>
          <div className="mt-7 flex justify-center gap-3">
            <Link to="/register" className="btn-brand px-6 py-3">
              Start building — it's your story
            </Link>
            <a href="#how" className="btn-ghost px-6 py-3 font-semibold">
              How it works
            </a>
          </div>
        </section>

        <section id="how" className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map(([icon, title, body]) => (
            <div key={title} className="glass card p-6">
              <div className="text-3xl">{icon}</div>
              <h2 className="mt-2 text-lg font-extrabold">{title}</h2>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                {body}
              </p>
            </div>
          ))}
        </section>

        <section className="glass card mt-6 p-8 text-center">
          <p className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
            The journey
          </p>
          <p className="mt-2 text-sm font-medium leading-loose sm:text-base">
            Register → Profile → Skills → Projects → Education → Experience → Certifications →
            Achievements → <span className="grad-text font-extrabold">Readiness score</span> →
            Preview → Publish → Share → Analytics
          </p>
          <Link to="/register" className="btn-brand mt-5 inline-block px-6 py-3">
            Begin the journey
          </Link>
        </section>
      </main>
    </div>
  );
}
