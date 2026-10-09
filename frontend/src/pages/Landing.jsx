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
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--lime-deep)" }} />
        <span className="ml-2 text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
          Portfolio Pilot · demo preview
        </span>
        <span className="chip-lime ml-auto px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">Live</span>
      </div>
      <div className="grid gap-5 p-5 sm:grid-cols-5">
        <div className="sm:col-span-2">
          <p className="label">Portfolio readiness</p>
          <p className="display mt-1 text-5xl" style={{ color: "var(--brand-strong)" }}>82%</p>
          <div className="bar-track mt-2 h-2">
            <div className="bar-fill lime h-2" style={{ width: "82%" }} />
          </div>
          <div className="mt-3 space-y-1.5 text-xs font-semibold">
            {[["Profile", true], ["Skills · 9", true], ["Projects · 6", true], ["Experience", false]].map(([l, done]) => (
              <p key={l} className="flex items-center gap-2" style={{ color: done ? "var(--ink)" : "var(--muted)" }}>
                <span className="flex h-4 w-4 items-center justify-center rounded-full text-[10px]"
                  style={{ background: done ? "var(--lime)" : "var(--ring-track)", color: done ? "#1e3a24" : "var(--muted)" }}>
                  {done ? "✓" : "○"}
                </span>
                {l}
              </p>
            ))}
          </div>
        </div>
        <div className="sm:col-span-3">
          <p className="label">Selected work</p>
          <div className="mt-2 space-y-2">
            {[
              ["Campus Navigator", "React · Node · MongoDB", true],
              ["Placement Predictor", "Python · scikit-learn", false],
            ].map(([t, tech, feat]) => (
              <div key={t} className="rounded-lg border p-3" style={{ borderColor: "var(--line)", background: "var(--bg)" }}>
                <p className="flex items-center gap-2 text-sm font-bold">
                  {t}
                  {feat && <span className="chip-lime px-1.5 py-px text-[10px] font-bold">★ Featured</span>}
                </p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>{tech}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg border-l-4 p-3 text-xs font-semibold" style={{ background: "var(--surface-tint)", borderColor: "var(--line)", borderLeftColor: "var(--lime-deep)" }}>
            Next best action: add your internship experience →
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
        <span className="flex h-9 w-9 items-center justify-center rounded-lg text-lg font-extrabold" style={{ background: "var(--brand)", color: "var(--brand-ink)" }} aria-hidden="true">◈</span>
        <span className="text-lg font-extrabold tracking-tight">Portfolio Pilot</span>
        <div className="ml-auto flex gap-2">
          <button onClick={toggle} className="btn-ghost px-3 py-1.5 text-sm" aria-label="Toggle theme">
            {theme === "ivory" ? "🌙 Emerald" : "☀ Ivory"}
          </button>
          <Link to="/login" className="btn-ghost px-4 py-1.5 text-sm font-semibold">Login</Link>
          <Link to="/register" className="btn-brand px-4 py-1.5 text-sm">Get started</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Asymmetric editorial hero */}
        <section className="grid items-center gap-10 py-10 lg:grid-cols-[1.05fr_1fr] lg:py-16">
          <div>
            <motion.p {...anim()} className="label" style={{ color: "var(--brand)" }}>
              The career-profile workspace for students
            </motion.p>
            <motion.h1 {...anim(0.08)} className="display mt-3 text-[2.6rem] leading-[1.06] sm:text-6xl">
              Your work deserves
              <br />
              a <span style={{ color: "var(--brand)" }}>better story.</span>
            </motion.h1>
            <motion.p {...anim(0.16)} className="mt-4 max-w-md text-base leading-relaxed sm:text-lg" style={{ color: "var(--muted)" }}>
              Bring your projects, skills, education, and achievements together in one
              professional portfolio. Understand what is missing, improve your profile,
              and publish your work with confidence.
            </motion.p>
            <motion.div {...anim(0.24)} className="mt-7 flex flex-wrap gap-3">
              <Link to="/register" className="btn-brand px-6 py-3 text-sm">Build your portfolio</Link>
              <a href="#how" className="btn-ghost px-6 py-3 text-sm font-semibold">Explore how it works</a>
            </motion.div>
            <motion.div {...anim(0.3)} className="mt-6 flex gap-5 text-xs font-semibold" style={{ color: "var(--muted)" }}>
              <span>✓ Readiness scoring</span>
              <span>✓ Public publishing</span>
              <span>✓ Engagement analytics</span>
            </motion.div>
          </div>
          <ProductPreview />
        </section>

        {/* 1. Problem — editorial split */}
        <Reveal className="grid gap-8 border-t py-14 lg:grid-cols-2" style={{ borderColor: "var(--line)" }}>
          <div>
            <p className="label" style={{ color: "var(--brand)" }}>01 · The problem</p>
            <h2 className="display mt-2 text-3xl sm:text-4xl">Great work, scattered everywhere, seen by no one.</h2>
          </div>
          <div className="space-y-3 text-[15px] leading-relaxed" style={{ color: "var(--muted)" }}>
            <p>Your best project lives in a repo nobody links. Your certificate hides in an inbox.
              Your resume is three versions old. Recruiters spend seconds on a profile — scattered proof works against you.</p>
            <p className="font-semibold" style={{ color: "var(--ink)" }}>
              Portfolio Pilot gathers projects, skills, education, experience, certifications, and
              achievements into one structured home — then tells you exactly what's missing.
            </p>
          </div>
        </Reveal>

        {/* 2. How it works — numbered rail */}
        <section id="how" className="border-t py-14" style={{ borderColor: "var(--line)", background: "var(--surface-tint)" }}>
          <div className="px-1">
            <Reveal>
              <p className="label" style={{ color: "var(--brand)" }}>02 · How it works</p>
              <h2 className="display mt-2 text-3xl sm:text-4xl">From scattered to signed, in five moves.</h2>
            </Reveal>
            <Stagger className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-5">
              {[
                ["01", "Gather", "Profile, skills, projects, education, experience, certs, wins — one calm workspace."],
                ["02", "Score", "A backend engine grades 8 sections 0–100. Rules, not vibes."],
                ["03", "Improve", "Next-best-action tips link straight to the form that fixes them."],
                ["04", "Publish", "Preview, claim your slug, go live at /portfolio/you."],
                ["05", "Measure", "Views and clicks counted event by event."],
              ].map(([n, t, d]) => (
                <StaggerItem key={n}>
                  <p className="display border-b-2 pb-2 text-3xl" style={{ color: "var(--brand)", borderColor: "var(--lime)" }}>{n}</p>
                  <p className="mt-2 font-bold">{t}</p>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{d}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* 3. Readiness — product panel + copy */}
        <Reveal className="grid items-center gap-10 border-t py-14 lg:grid-cols-2" style={{ borderColor: "var(--line)" }}>
          <div className="solid card p-7">
            <p className="label">03 · Portfolio readiness</p>
            <div className="mt-3 flex items-end gap-3">
              <p className="display text-6xl" style={{ color: "var(--brand-strong)" }}>82%</p>
              <p className="pb-2 text-sm font-semibold" style={{ color: "var(--muted)" }}>demo score</p>
            </div>
            <div className="bar-track mt-2 h-2.5"><div className="bar-fill lime h-2.5" style={{ width: "82%" }} /></div>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm font-medium">
              {[["Profile", 15, 15], ["About", 10, 10], ["Skills", 15, 11], ["Projects", 20, 20], ["Education", 10, 10], ["Experience", 15, 0], ["Certs", 5, 3], ["Wins", 10, 10]].map(([l, w, e]) => (
                <li key={l} className="flex justify-between border-b py-1" style={{ borderColor: "var(--line)" }}>
                  <span>{l}</span><span style={{ color: "var(--muted)" }}>{e}/{w}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="display text-2xl sm:text-3xl">Know exactly what to fix next.</h3>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed" style={{ color: "var(--muted)" }}>
              Your real score is computed from your data on every visit — profile, about, skills,
              projects, education, experience, certifications, achievements. Each tip names the
              precise gap and links to the form that closes it. Never a black box, never called AI.
            </p>
            <Link to="/register" className="btn-brand mt-4 inline-block px-5 py-2.5 text-sm">Get your score</Link>
          </div>
        </Reveal>

        {/* 4+5. Publishing + analytics — alternating splits */}
        <Reveal className="grid items-center gap-10 border-t py-14 lg:grid-cols-2" style={{ borderColor: "var(--line)" }}>
          <div className="order-2 lg:order-1">
            <p className="label" style={{ color: "var(--brand)" }}>04 · Publishing & sharing</p>
            <h3 className="display mt-2 text-2xl sm:text-3xl">One link. Your whole story.</h3>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed" style={{ color: "var(--muted)" }}>
              Draft in private, preview exactly what visitors see, then publish. Unpublished work
              stays invisible — the public route only serves what you ship. Feature your best
              projects so they lead the page.
            </p>
            <Link to="/register" className="btn-brand mt-4 inline-block px-5 py-2.5 text-sm">Claim your slug</Link>
          </div>
          <div className="solid card order-1 p-7 lg:order-2">
            <p className="label">05 · Portfolio analytics</p>
            <div className="mt-4 space-y-3">
              {[["Portfolio views", "w-4/5", true], ["Project clicks", "w-3/5", false], ["GitHub clicks", "w-2/5", false], ["Resume clicks", "w-1/3", false]].map(([l, w, lime]) => (
                <div key={l}>
                  <div className="flex justify-between text-xs font-bold"><span>{l}</span></div>
                  <div className="bar-track mt-1 h-2"><div className={`h-2 ${lime ? "bar-fill lime" : "bar-fill"} ${w}`} /></div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>Real persisted events. Zero fabricated numbers.</p>
          </div>
        </Reveal>

        {/* 6. Final CTA — forest band */}
        <Reveal className="my-4 rounded-2xl px-6 py-14 text-center" style={{ background: "var(--brand)" }}>
          <h2 className="display mx-auto max-w-2xl text-3xl sm:text-4xl" style={{ color: "#ffffff" }}>
            Stop scattering proof. Start piloting it.
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm" style={{ color: "var(--lime)" }}>
            Free for students. Your public portfolio is minutes away.
          </p>
          <Link to="/register" className="mt-6 inline-block rounded-lg px-8 py-3 text-sm font-bold"
            style={{ background: "var(--lime)", color: "#1e3a24" }}>
            Build your portfolio
          </Link>
        </Reveal>
      </main>

      <footer className="border-t py-6 text-center text-xs" style={{ borderColor: "var(--line)", color: "var(--muted)" }}>
        ◈ Portfolio Pilot — build your profile, track your progress, launch your career story.
      </footer>
    </div>
  );
}
