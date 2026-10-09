import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Moon, Sun } from "lucide-react";
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
      <div className="flex items-center gap-2 border-b px-4 py-2.5" style={{ borderColor: "var(--line)" }}>
        <span className="flex h-5 w-5 items-center justify-center rounded text-[11px] font-extrabold" style={{ background: "var(--brand)", color: "var(--brand-ink)" }} aria-hidden="true">P</span>
        <span className="text-xs font-extrabold tracking-tight">Portfolio Pilot</span>
        <span className="chip ml-auto px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>Demo preview</span>
      </div>
      <div className="grid gap-5 p-5 sm:grid-cols-5">
        <div className="sm:col-span-2">
          <p className="eyebrow">Readiness</p>
          <p className="display mt-0.5 text-5xl tabular-nums" style={{ color: "var(--brand-strong)" }}>82%</p>
          <div className="bar-track mt-2 h-2">
            <div className="bar-fill h-2" style={{ width: "82%" }} />
          </div>
          <div className="mt-3 space-y-1.5 text-xs font-semibold">
            {[["Profile", "15/15", true], ["Projects · 6", "20/20", true], ["Skills · 9", "11/15", true], ["Experience", "0/15", false]].map(([l, s, done]) => (
              <p key={l} className="flex items-center gap-2">
                <span className="flex h-4 w-4 items-center justify-center rounded-full"
                  style={{ background: done ? "var(--brand)" : "var(--ring-track)", color: done ? "var(--brand-ink)" : "var(--muted)" }}>
                  {done && <Check size={10} strokeWidth={3.5} />}
                </span>
                <span className="flex-1">{l}</span>
                <span className="tabular-nums" style={{ color: "var(--muted)" }}>{s}</span>
              </p>
            ))}
          </div>
        </div>
        <div className="sm:col-span-3">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Statistics</p>
            <span className="chip px-2 py-0.5 text-[10px] font-bold" style={{ color: "var(--ok)" }}>● Published</span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            {[["6", "Projects"], ["9", "Skills"], ["14", "Views"]].map(([v, l]) => (
              <div key={l} className="rounded-lg border p-2.5" style={{ borderColor: "var(--line)", background: "var(--bg)" }}>
                <p className="text-lg font-extrabold tabular-nums">{v}</p>
                <p className="eyebrow" style={{ fontSize: "0.6rem" }}>{l}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg border-l-[3px] p-2.5 text-xs font-semibold" style={{ background: "var(--surface-tint)", borderColor: "var(--line)", borderLeftColor: "var(--brand)" }}>
            Next: add your internship experience →
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
      {/* Compact top nav */}
      <header className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-4 sm:px-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-md text-sm font-extrabold" style={{ background: "var(--brand)", color: "var(--brand-ink)" }} aria-hidden="true">P</span>
        <span className="text-[15px] font-extrabold tracking-tight">Portfolio Pilot</span>
        <nav className="ml-6 hidden items-center gap-5 text-[13px] font-semibold md:flex" style={{ color: "var(--muted)" }} aria-label="Product">
          <a href="#how" className="hover:underline">How it works</a>
          <a href="#readiness" className="hover:underline">Readiness</a>
          <a href="#publish" className="hover:underline">Publishing</a>
        </nav>
        <div className="ml-auto flex gap-2">
          <button onClick={toggle} className="btn-ghost p-2" aria-label="Toggle theme">
            {theme === "porcelain" ? <Moon size={15} /> : <Sun size={15} />}
          </button>
          <Link to="/login" className="btn-ghost px-3.5 py-1.5 text-[13px] font-semibold">Login</Link>
          <Link to="/register" className="btn-brand px-3.5 py-1.5 text-[13px]">Get started</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Split hero */}
        <section className="grid items-center gap-10 py-10 lg:grid-cols-[1fr_1.05fr] lg:py-14">
          <div>
            <motion.p {...anim()} className="eyebrow" style={{ color: "var(--brand)" }}>
              Career-profile workspace · for students
            </motion.p>
            <motion.h1 {...anim(0.08)} className="display mt-3 text-4xl sm:text-[3.4rem]">
              Make your work impossible to overlook.
            </motion.h1>
            <motion.p {...anim(0.16)} className="mt-4 max-w-md text-[15px] leading-relaxed sm:text-base" style={{ color: "var(--muted)" }}>
              Bring your projects, skills, experience, and achievements together in one
              professional portfolio. See what is missing, improve your profile, and
              share your work with confidence.
            </motion.p>
            <motion.div {...anim(0.24)} className="mt-6 flex flex-wrap gap-2.5">
              <Link to="/register" className="btn-brand px-5 py-2.5 text-sm">Build your portfolio <ArrowRight size={15} /></Link>
              <a href="#how" className="btn-ghost px-5 py-2.5 text-sm font-semibold">Explore the product</a>
            </motion.div>
          </div>
          <ProductPreview />
        </section>

        {/* Narrative */}
        <Reveal className="grid gap-8 border-t py-12 lg:grid-cols-[1fr_1.4fr]" style={{ borderColor: "var(--line)" }}>
          <div>
            <p className="eyebrow" style={{ color: "var(--brand)" }}>The problem</p>
            <h2 className="display mt-2 text-2xl sm:text-[2rem]">Proof scattered across the internet never compounds.</h2>
          </div>
          <div className="grid gap-4 text-sm leading-relaxed sm:grid-cols-2" style={{ color: "var(--muted)" }}>
            <p>A repo nobody links. A certificate lost in an inbox. A resume three versions old.
              Recruiters decide in seconds — fragmented evidence loses.</p>
            <p className="font-semibold" style={{ color: "var(--ink)" }}>
              Portfolio Pilot is the single structured home for everything that proves you can
              do the job — with a score that tells you what to fix next.
            </p>
          </div>
        </Reveal>

        <section id="how" className="border-t py-12" style={{ borderColor: "var(--line)" }}>
          <Reveal>
            <p className="eyebrow" style={{ color: "var(--brand)" }}>How it works</p>
            <h2 className="display mt-2 text-2xl sm:text-[2rem]">Collect. Understand. Publish. Track.</h2>
          </Reveal>
          <Stagger className="mt-7 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01 · Collect", "Gather projects, skills, education, experience, certs, and wins in one calm workspace."],
              ["02 · Understand", "A backend engine scores eight sections 0–100 and names the exact gaps."],
              ["03 · Publish", "Preview the real page, claim your slug, share /portfolio/you."],
              ["04 · Track", "Views and clicks counted event by event — no vanity metrics."],
            ].map(([t, d]) => (
              <StaggerItem key={t}>
                <p className="text-[13px] font-extrabold" style={{ color: "var(--brand)" }}>{t}</p>
                <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{d}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        <section id="readiness" className="grid items-center gap-10 border-t py-12 lg:grid-cols-2" style={{ borderColor: "var(--line)" }}>
          <Reveal>
            <p className="eyebrow" style={{ color: "var(--brand)" }}>Readiness, quantified</p>
            <h2 className="display mt-2 text-2xl sm:text-[2rem]">Eight sections. One honest number.</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              Profile, about, skills, projects, education, experience, certifications, achievements —
              weighted and computed from your live data. Every tip links to the form that resolves it.
            </p>
            <Link to="/register" className="btn-brand mt-4 inline-flex px-4 py-2 text-[13px]">Get your score <ArrowRight size={14} /></Link>
          </Reveal>
          <Reveal className="tint rounded-xl p-6" delay={0.1}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {[["Profile", "15/15", 100], ["About", "10/10", 100], ["Skills", "11/15", 73], ["Projects", "20/20", 100], ["Education", "10/10", 100], ["Experience", "0/15", 0], ["Certs", "3/5", 60], ["Wins", "10/10", 100]].map(([l, s, w]) => (
                <div key={l}>
                  <div className="flex justify-between text-xs font-bold"><span>{l}</span><span className="tabular-nums" style={{ color: "var(--muted)" }}>{s}</span></div>
                  <div className="bar-track mt-1 h-1.5"><div className="bar-fill h-1.5" style={{ width: `${w}%` }} /></div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="publish" className="grid items-center gap-10 border-t py-12 lg:grid-cols-2" style={{ borderColor: "var(--line)" }}>
          <Reveal className="solid card order-2 p-6 lg:order-1">
            <p className="eyebrow">Publishing · Analytics</p>
            <p className="mt-2 font-mono text-sm font-bold" style={{ color: "var(--brand)" }}>/portfolio/you</p>
            <div className="mt-3 space-y-2.5">
              {[["Portfolio views", "w-4/5"], ["Project clicks", "w-1/2"], ["Resume clicks", "w-1/4"]].map(([l, w]) => (
                <div key={l}>
                  <div className="text-xs font-bold">{l}</div>
                  <div className="bar-track mt-1 h-1.5"><div className={`bar-fill h-1.5 ${w}`} /></div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal className="order-1 lg:order-2">
            <p className="eyebrow" style={{ color: "var(--brand)" }}>Share & measure</p>
            <h2 className="display mt-2 text-2xl sm:text-[2rem]">Draft in private. Ship in public.</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              Preview exactly what visitors see, publish when ready, then watch real engagement
              arrive — views, project opens, resume downloads. Unpublished work stays invisible.
            </p>
          </Reveal>
        </section>

        <Reveal className="my-6 flex flex-wrap items-center gap-4 rounded-xl px-6 py-8 sm:px-10" style={{ background: "var(--ink)" }}>
          <div>
            <h2 className="display text-2xl sm:text-[1.7rem]" style={{ color: "var(--bg)" }}>Your career story starts with one page.</h2>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>Free for students. Live in minutes.</p>
          </div>
          <Link to="/register" className="btn-brand ml-auto px-5 py-2.5 text-sm" style={{ background: "var(--brand)", color: "var(--brand-ink)" }}>
            Build your portfolio <ArrowRight size={15} />
          </Link>
        </Reveal>
      </main>

      <footer className="border-t py-5 text-center text-xs" style={{ borderColor: "var(--line)", color: "var(--muted)" }}>
        Portfolio Pilot — build your profile, track your progress, launch your career story.
      </footer>
    </div>
  );
}
