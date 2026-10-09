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

/**
 * Public portfolio — editorial reading experience, deliberately unlike
 * the dashboard: eyebrow sections, strong type, generous whitespace.
 * onEvent wires visitor clicks to analytics; pass null to disable.
 */
export default function PublicView({ data, onEvent }) {
  if (!data) return null;
  const track = (type, projectId) => onEvent && data.username && onEvent(data.username, type, projectId);
  const initial = (data.displayName || "?").charAt(0).toUpperCase();

  return (
    <article>
      {/* Hero */}
      <header className="solid card overflow-hidden">
        <div className="h-1.5" style={{ background: "linear-gradient(90deg, var(--brand-deep), var(--brand), var(--brand-2))" }} aria-hidden="true" />
        <div className="p-7 sm:p-10">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-2xl text-4xl font-extrabold"
            style={{ background: "linear-gradient(140deg, var(--brand-deep), var(--brand))", color: "#04120c" }}
            aria-hidden="true"
          >
            {initial}
          </div>
          <h1 className="display mt-5 text-4xl sm:text-6xl">{data.displayName}</h1>
          {data.headline && <p className="mt-2 text-xl font-bold" style={{ color: "var(--brand)" }}>{data.headline}</p>}
          {data.tagline && <p className="mt-1 text-base" style={{ color: "var(--muted)" }}>{data.tagline}</p>}
          {data.location && <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>📍 {data.location}</p>}
          <div className="mt-5 flex flex-wrap gap-2.5 text-sm font-semibold">
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
                ⬇ Resume
              </a>
            )}
          </div>
        </div>
      </header>

      {data.about && (
        <section className="mt-12" aria-label="About">
          <Eyebrow>About</Eyebrow>
          <p className="mt-4 max-w-2xl whitespace-pre-wrap text-lg leading-relaxed">{data.about}</p>
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
                      style={{ background: i <= (LEVEL_DOTS[s.level] || 2) ? "var(--brand)" : "var(--ring-track)" }} />
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.projects?.length > 0 && (
        <section className="mt-12" aria-label="Projects">
          <Eyebrow>Selected work</Eyebrow>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {data.projects.map((p) => (
              <article key={p.id} className="solid card group p-6 transition-transform hover:-translate-y-1">
                <h3 className="text-xl font-extrabold tracking-tight">{p.title}</h3>
                {p.techStack && <p className="mt-1 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--brand)" }}>{p.techStack}</p>}
                {p.description && <p className="mt-2 line-clamp-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{p.description}</p>}
                <div className="mt-4 flex gap-3 text-sm font-bold">
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" onClick={() => track("PROJECT_CLICK", p.id)} style={{ color: "var(--brand)" }}>Live ↗</a>}
                  {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" onClick={() => track("PROJECT_CLICK", p.id)} style={{ color: "var(--brand)" }}>Code ↗</a>}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {data.experience?.length > 0 && (
        <section className="mt-12" aria-label="Experience">
          <Eyebrow>Experience</Eyebrow>
          <div className="mt-4 space-y-6">
            {data.experience.map((e) => (
              <div key={e.id} className="flex gap-4">
                <div className="timeline-dot mt-2 h-2.5 w-2.5 shrink-0 rounded-full" aria-hidden="true" />
                <div>
                  <p className="text-lg font-extrabold">{e.title}</p>
                  <p className="text-sm font-semibold" style={{ color: "var(--brand)" }}>
                    {e.company}{e.location ? ` · ${e.location}` : ""}
                  </p>
                  <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                    {[e.startPeriod, e.endPeriod || "Present"].filter(Boolean).join(" → ")}
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
              <div key={e.id}>
                <p className="text-lg font-extrabold">{e.degree}</p>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  {e.school}{e.fieldOfStudy ? ` · ${e.fieldOfStudy}` : ""}{e.startYear ? ` · ${e.startYear} → ${e.endYear || "Present"}` : ""}
                </p>
                {e.description && <p className="mt-1 max-w-2xl text-sm">{e.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.certifications?.length > 0 && (
        <section className="mt-12" aria-label="Certifications">
          <Eyebrow>Certifications</Eyebrow>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {data.certifications.map((c) => (
              <li key={c.id} className="solid card flex items-center gap-3 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-bold" style={{ background: "var(--chip)", color: "var(--brand)" }} aria-hidden="true">✓</span>
                <div className="min-w-0">
                  <p className="truncate font-bold">{c.name}</p>
                  <p className="truncate text-xs" style={{ color: "var(--muted)" }}>{c.issuer}{c.issueDate ? ` · ${c.issueDate}` : ""}</p>
                </div>
                {c.credentialUrl && <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="ml-auto shrink-0 text-xs font-bold underline" style={{ color: "var(--brand)" }}>Verify</a>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.achievements?.length > 0 && (
        <section className="mt-12" aria-label="Achievements">
          <Eyebrow>Recognition</Eyebrow>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {data.achievements.map((a) => (
              <article key={a.id} className="solid card p-5">
                <p className="font-extrabold">🏆 {a.title}</p>
                {a.description && <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{a.description}</p>}
                <p className="mt-1.5 text-xs font-medium" style={{ color: "var(--muted)" }}>
                  {a.date}
                  {a.link && <> · <a href={a.link} target="_blank" rel="noreferrer" className="font-bold underline" style={{ color: "var(--brand)" }}>View</a></>}
                </p>
              </article>
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
