import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "../theme/ThemeContext";
import Aurora from "../components/Aurora";
import { Reveal, Stagger, StaggerItem } from "../components/Reveal";

/* Clearly-labeled marketing preview: static demo numbers, never user data. */
function ProductPreview() {
  const reduce = useReducedMotion();
  const wrap = reduce ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.15 } };
  return (
    <motion.div
      {...wrap}
      className="solid card overflow-hidden"
      aria-label="Product preview (demo illustration)"
    >
      <div className="flex items-center gap-1.5 border-b px-4 py-2.5" style={{ borderColor: "var(--line)" }}>
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--brand)" }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--brand-2)" }} />
        <span className="ml-2 text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
          Dashboard · demo preview
        </span>
      </div>
      <div className="grid gap-4 p-5 sm:grid-cols-5">
        <div className="sm:col-span-2">
          <p className="label">Portfolio readiness</p>
          <p className="display grad-text mt-1 text-5xl">82%</p>
          <div className="bar-track mt-2 h-2">
            <div className="bar-fill h-2" style={{ width: "82%" }} />
          </div>
          <div className="mt-3 space-y-1 text-xs font-medium">
            {[["Profile", true], ["Skills", true], ["Projects", true], ["Experience", false]].map(([l, done]) => (
              <p key={l} style={{ color: done ? "var(--ink)" : "var(--muted)" }}>
                {done ? "✓" : "○"} {l}
              </p>
            ))}
          </div>
        </div>
        <div className="sm:col-span-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            {[["6", "Projects"], ["9", "Skills"], ["Live", "Published"]].map(([v, l]) => (
              <div key={l} className="rounded-lg border p-2.5" style={{ borderColor: "var(--line)", background: "var(--bg-soft)" }}>
                <p className="text-lg font-extrabold" style={{ color: "var(--brand)" }}>{v}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>{l}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg p-3 text-xs font-medium" style={{ background: "var(--chip)" }}>
            <span style={{ color: "var(--brand)" }}>→</span> Next best action: add your internship experience.
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const entrance = { initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.55 } };

export default function Landing() {
  const { theme, toggle } = useTheme();
  const reduce = useReducedMotion();
  const anim = (delay = 0) => (reduce ? {} : { ...entrance, transition: { ...entrance.transition, delay } });

  return (
    <div className="min-h-screen">
      <Aurora />
      <header className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-5 sm:px-6">
        <span className="btn-brand flex h-9 w-9 items-center justify-center text-xl" aria-hidden="true">◈</span>
        <span className="text-lg font-extrabold tracking-tight">Portfolio Pilot</span>
        <div className="ml-auto flex gap-2">
          <button onClick={toggle} className="btn-ghost px-3 py-1.5 text-sm" aria-label="Toggle theme">
            {theme === "emerald" ? "☀ Mist" : "🌙 Emerald"}
          </button>
          <Link to="/login" className="btn-ghost px-4 py-1.5 text-sm font-semibold">Login</Link>
          <Link to="/register" className="btn-brand px-4 py-1.5 text-sm">Get started</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Editorial asymmetric hero */}
        <section className="grid items-center gap-10 py-10 lg:grid-cols-2 lg:py-16">
          <div>
            <motion.p {...anim()} className="label" style={{ color: "var(--brand)" }}>
              Career-profile OS · for students & early careers
            </motion.p>
            <motion.h1 {...anim(0.08)} className="display mt-3 text-4xl sm:text-6xl">
              Your career,
              <br />
              <span className="grad-text">ready to launch.</span>
            </motion.h1>
            <motion.p {...anim(0.16)} className="mt-4 max-w-md text-base leading-relaxed sm:text-lg" style={{ color: "var(--muted)" }}>
              Projects on GitHub, skills in your head, certificates in email.
              Portfolio Pilot gathers it all, scores how ready you look,
              and publishes you to the world.
            </motion.p>
            <motion.div {...anim(0.24)} className="mt-7 flex flex-wrap gap-3">
              <Link to="/register" className="btn-brand px-6 py-3 text-sm">Build your portfolio</Link>
              <a href="#how" className="btn-ghost px-6 py-3 text-sm font-semibold">Explore how it works</a>
            </motion.div>
            <motion.p {...anim(0.3)} className="mt-4 text-xs" style={{ color: "var(--muted)" }}>
              Register → build → score → publish → get seen. Free for students.
            </motion.p>
          </div>
          <ProductPreview />
        </section>

        {/* Problem — split editorial row */}
        <Reveal className="grid gap-8 border-t py-14 lg:grid-cols-2" style={{ borderColor: "var(--line)" }}>
          <div>
            <p className="label" style={{ color: "var(--brand)" }}>The problem</p>
            <h2 className="display mt-2 text-3xl sm:text-4xl">Scattered proof of work gets overlooked.</h2>
          </div>
          <div className="space-y-3 text-[15px] leading-relaxed" style={{ color: "var(--muted)" }}>
            <p>Recruiters spend seconds on a profile. When your best project lives in a repo nobody links,
              your certificate hides in an inbox, and your resume is three versions old — those seconds work against you.</p>
            <p style={{ color: "var(--ink)" }} className="font-semibold">Portfolio Pilot is the single structured home for
              everything that proves you can do the job.</p>
          </div>
        </Reveal>

        {/* Workflow — numbered rail, not cards */}
        <section id="how" className="border-t py-14" style={{ borderColor: "var(--line)" }}>
          <Reveal>
            <p className="label" style={{ color: "var(--brand)" }}>The workflow</p>
            <h2 className="display mt-2 text-3xl sm:text-4xl">From scattered to signed, in five moves.</h2>
          </Reveal>
          <Stagger className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["01", "Gather", "Profile, skills, projects, education, experience, certs, wins — one workspace."],
              ["02", "Score", "A backend engine grades 8 sections 0–100. No vibes, just rules."],
              ["03", "Improve", "Next-best-action tips point at exactly what to add."],
              ["04", "Publish", "Preview, claim your slug, go live at /portfolio/you."],
              ["05", "Measure", "Views and clicks counted event by event."],
            ].map(([n, t, d]) => (
              <StaggerItem key={n}>
                <p className="display text-4xl" style={{ color: "var(--brand)" }}>{n}</p>
                <p className="mt-1 font-bold">{t}</p>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{d}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* Readiness + publishing — alternating splits */}
        <Reveal className="grid items-center gap-8 border-t py-14 lg:grid-cols-2" style={{ borderColor: "var(--line)" }}>
          <div className="solid card p-6">
            <p className="label">Readiness, visualized</p>
            <p className="display mt-1 text-5xl">0–100</p>
            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
              Profile 15 · About 10 · Skills 15 · Projects 20 · Education 10 ·
              Experience 15 · Certs 5 · Wins 10. Computed from your real data, every visit.
            </p>
          </div>
          <div>
            <h3 className="display text-2xl sm:text-3xl">Know exactly what to fix next.</h3>
            <p className="mt-2 text-[15px] leading-relaxed" style={{ color: "var(--muted)" }}>
              “Add your first project.” “Connect GitHub.” “Link your resume.”
              Each tip links straight to the form that resolves it.
            </p>
          </div>
        </Reveal>

        <Reveal className="grid items-center gap-8 border-t py-14 lg:grid-cols-2" style={{ borderColor: "var(--line)" }}>
          <div className="order-2 lg:order-1">
            <h3 className="display text-2xl sm:text-3xl">One link. Your whole story.</h3>
            <p className="mt-2 text-[15px] leading-relaxed" style={{ color: "var(--muted)" }}>
              Draft in private, preview exactly what visitors see, then publish.
              Unpublished work stays invisible — the public route only serves what you ship.
            </p>
            <Link to="/register" className="btn-brand mt-4 inline-block px-5 py-2.5 text-sm">Claim your slug</Link>
          </div>
          <div className="solid card order-1 p-6 lg:order-2">
            <p className="label">Analytics, honestly</p>
            <div className="mt-3 space-y-2.5">
              {[["Portfolio views", "w-4/5"], ["Project clicks", "w-3/5"], ["GitHub clicks", "w-2/5"], ["Resume clicks", "w-1/3"]].map(([l, w]) => (
                <div key={l}>
                  <div className="flex justify-between text-xs font-semibold"><span>{l}</span></div>
                  <div className="bar-track mt-1 h-2"><div className={`bar-fill h-2 ${w}`} /></div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>Real persisted events. Zero fabricated numbers.</p>
          </div>
        </Reveal>

        {/* Final CTA */}
        <Reveal className="border-t py-16 text-center" style={{ borderColor: "var(--line)" }}>
          <h2 className="display mx-auto max-w-2xl text-3xl sm:text-5xl">
            Stop scattering proof. <span className="grad-text">Start piloting it.</span>
          </h2>
          <Link to="/register" className="btn-brand mt-6 inline-block px-8 py-3.5">Build your portfolio</Link>
        </Reveal>
      </main>

      <footer className="border-t py-6 text-center text-xs" style={{ borderColor: "var(--line)", color: "var(--muted)" }}>
        ◈ Portfolio Pilot — build your profile, track your progress, launch your career story.
      </footer>
    </div>
  );
}
