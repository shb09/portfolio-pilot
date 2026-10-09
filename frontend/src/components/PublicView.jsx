import { pub } from "../api/client";

function fire(username, eventType, projectId) {
  if (!username) return;
  pub
    .post("/api/analytics/event", { username, eventType, projectId: projectId ?? null })
    .catch(() => {});
}

function Eyebrow({ children }) {
  return (
    <p className="label flex items-center gap-3" style={{ color: "var(--brand)" }}>
      {children}
      <span className="h-px flex-1" style={{ background: "var(--line)" }} aria-hidden="true" />
    </p>
  );
}

const LEVEL_DOTS = { BEGINNER: 1, INTERMEDIATE: 2, ADVANCED: 3, EXPERT: 4 };

function orderedProjects(projects) {
  return [...(projects || [])].sort((a, b) => Number(b.featured || false) - Number(a.featured || false));
}

/**
 * Public portfolio — a personal site, not a dashboard: typography and
 * whitespace carry the design; bordered cards are the exception.
 * onEvent wires visitor clicks to analytics; pass null to disable.
 */
export default function PublicView({ data, onEvent }) {
  if (!data) return null;
  const track = (type, projectId) => onEvent && data.username && onEvent(data.username, type, projectId);
  const initial = (data.displayName || "?").charAt(0).toUpperCase();
  const projects = orderedProjects(data.projects);

  return (
    <article>
      {/* Hero — tinted band, no card chrome */}
      <header className="tint rounded-2xl px-7 py-10 sm:px-12 sm:py-14">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-xl text-3xl font-extrabold"
          style={{ background: "var(--brand)", color: "var(--brand-ink)" }}
          aria-hidden="true"
        >
          {initial}
        </div>
        <h1 className="display mt-5 text-4xl sm:text-6xl">{data.displayName}</h1>
        {data.headline && <p className="mt-2 text-xl font-bold" style={{ color: "var(--brand-strong)" }}>{data.headline}</p>}
        {data.tagline && <p className="mt-1" style={{ color: "var(--muted)" }}>{data.tagline}</p>}
        {data.location && <p className="mt-2 text-sm font-medium" style={{ color: "var(--muted)" }}>{data.location}</p>}
        <div className="mt-6 flex flex-wrap gap-2.5 text-sm font-semibold">
          {data.githubUrl && (
            <a href={data.githubUrl} target="_blank" rel="noreferrer" onClick={() => track("GITHUB_CLICK")} className="btn-ghost px-4 py-2">
              GitHub ↗
            </a>
          )}
          {data.linkedinUrl && (
            <a href={data.linkedinUrl} target="_blank" rel="noreferrer" onClick={() => track("LINKEDIN_CLICK")} className="btn-ghost px-4 py-2">
              LinkedIn ↗
            </a>
          )}
          {data.resumeUrl && (
            <a href={data.resumeUrl} target="_blank" rel="noreferrer" onClick={() => track("RESUME_CLICK")} className="btn-brand px-4 py-2">
              Download resume
            </a>
          )}
        </div>
      </header>

      {data.about && (
        <section className="mt-12" aria-label="About">
          <Eyebrow>About</Eyebrow>
          <p className="mt-4 max-w-2xl whitespace-pre-wrap text-[1.05rem] leading-relaxed">{data.about}</p>
        </section>
      )}

      {data.skills?.length > 0 && (
        <section className="mt-12" aria-label="Skills">
          <Eyebrow>Expertise</Eyebrow>
          <ul className="mt-4 flex flex-wrap gap-2">
            {data.skills.map((s) => (
              <li key={s.id} className="chip flex items-center gap-2 px-3.5 py-1.5 text-sm font-semibold">
                {s.name}
                <span className="flex gap-1" title={s.level} aria-label={`Level ${s.level}`}>
                  {[1, 2, 3, 4].map((i) => (
                    <span key={i} className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ background: i <= (LEVEL_DOTS[s.level] || 2) ? "var(--lime-deep)" : "var(--ring-track)" }} />
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {projects.length > 0 && (
        <section className="mt-12" aria-label="Projects">
          <Eyebrow>Selected work</Eyebrow>
          <div className="mt-2 divide-y" style={{ borderColor: "var(--line)" }}>
            {projects.map((p) => (
              <article key={p.id} className="group py-6">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <h3 className="text-2xl font-extrabold tracking-tight">{p.title}</h3>
                  {p.featured && <span className="chip-lime px-2 py-0.5 text-[11px] font-bold">★ Featured</span>}
                </div>
                {p.techStack && <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em]" style={{ color: "var(--lime-deep)" }}>{p.techStack}</p>}
                {p.description && <p className="mt-2 max-w-2xl text-[15px] leading-relaxed" style={{ color: "var(--muted)" }}>{p.description}</p>}
                <div className="mt-3 flex gap-4 text-sm font-bold">
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" onClick={() => track("PROJECT_CLICK", p.id)} style={{ color: "var(--brand)" }} className="underline decoration-2 underline-offset-4">Live demo ↗</a>}
                  {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" onClick={() => track("PROJECT_CLICK", p.id)} style={{ color: "var(--brand)" }} className="underline decoration-2 underline-offset-4">Source ↗</a>}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {data.experience?.length > 0 && (
        <section className="mt-12" aria-label="Experience">
          <Eyebrow>Experience</Eyebrow>
          <div className="mt-4 space-y-7">
            {data.experience.map((e) => (
              <div key={e.id} className="grid gap-1 sm:grid-cols-[180px_1fr]">
                <p className="text-[13px] font-bold uppercase tracking-wide" style={{ color: "var(--muted)" }}>
                  {[e.startPeriod, e.endPeriod || "Present"].filter(Boolean).join(" → ")}
                </p>
                <div>
                  <p className="text-lg font-extrabold">{e.title}</p>
                  <p className="text-sm font-bold" style={{ color: "var(--brand)" }}>
                    {e.company}{e.location ? ` · ${e.location}` : ""}
                  </p>
                  {e.description && <p className="mt-1.5 max-w-2xl text-sm leading-relaxed">{e.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education?.length > 0 && (
        <section className="mt-12" aria-label="Education">
          <Eyebrow>Education</Eyebrow>
          <div className="mt-4 space-y-5">
            {data.education.map((e) => (
              <div key={e.id} className="grid gap-1 sm:grid-cols-[180px_1fr]">
                <p className="text-[13px] font-bold uppercase tracking-wide" style={{ color: "var(--muted)" }}>
                  {e.startYear ? `${e.startYear} → ${e.endYear || "Present"}` : ""}
                </p>
                <div>
                  <p className="text-lg font-extrabold">{e.degree}</p>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    {e.school}{e.fieldOfStudy ? ` · ${e.fieldOfStudy}` : ""}
                  </p>
                  {e.description && <p className="mt-1 max-w-2xl text-sm">{e.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.certifications?.length > 0 && (
        <section className="mt-12" aria-label="Certifications">
          <Eyebrow>Certifications</Eyebrow>
          <ul className="mt-4 divide-y" style={{ borderColor: "var(--line)" }}>
            {data.certifications.map((c) => (
              <li key={c.id} className="flex items-baseline gap-3 py-3">
                <span className="font-bold" style={{ color: "var(--lime-deep)" }} aria-hidden="true">✓</span>
                <p className="font-bold">{c.name}</p>
                <p className="text-sm" style={{ color: "var(--muted)" }}>— {c.issuer}{c.issueDate ? ` · ${c.issueDate}` : ""}</p>
                {c.credentialUrl && <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="ml-auto shrink-0 text-xs font-bold underline" style={{ color: "var(--brand)" }}>Verify</a>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.achievements?.length > 0 && (
        <section className="mt-12" aria-label="Achievements">
          <Eyebrow>Recognition</Eyebrow>
          <div className="mt-4 grid gap-x-8 gap-y-5 md:grid-cols-2">
            {data.achievements.map((a) => (
              <div key={a.id} className="border-l-2 pl-4" style={{ borderColor: "var(--lime)" }}>
                <p className="font-extrabold">{a.title}</p>
                {a.description && <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{a.description}</p>}
                <p className="mt-1 text-xs font-semibold" style={{ color: "var(--muted)" }}>
                  {a.date}
                  {a.link && <> · <a href={a.link} target="_blank" rel="noreferrer" className="font-bold underline" style={{ color: "var(--brand)" }}>View</a></>}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="mt-14 border-t pt-5 text-center text-xs" style={{ borderColor: "var(--line)", color: "var(--muted)" }}>
        ◈ Crafted with Portfolio Pilot
      </footer>
    </article>
  );
}

export { fire };
