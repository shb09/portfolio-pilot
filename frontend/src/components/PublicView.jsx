import { pub } from "../api/client";

function fire(username, eventType, projectId) {
  if (!username) return;
  pub
    .post("/api/analytics/event", { username, eventType, projectId: projectId ?? null })
    .catch(() => {});
}

function Section({ title, icon, children }) {
  if (!children) return null;
  return (
    <section className="glass card mt-6 p-6">
      <h2 className="text-xl font-extrabold">
        {icon} {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

const LEVEL_DOTS = { BEGINNER: 1, INTERMEDIATE: 2, ADVANCED: 3, EXPERT: 4 };

/**
 * Renders an assembled portfolio (preview + public share the shape).
 * onEvent wires visitor clicks to analytics; pass null to disable.
 */
export default function PublicView({ data, onEvent }) {
  if (!data) return null;
  const track = (type, projectId) => onEvent && data.username && onEvent(data.username, type, projectId);
  const initial = (data.displayName || "?").charAt(0).toUpperCase();

  return (
    <div>
      {/* Hero */}
      <section className="glass card overflow-hidden">
        <div className="h-2" style={{ background: "linear-gradient(90deg, var(--brand), var(--brand-2), var(--brand-3))" }} />
        <div className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl text-4xl font-extrabold"
            style={{ background: "linear-gradient(140deg, var(--brand), var(--brand-2))", color: "var(--brand-ink)", boxShadow: "var(--glow)" }}
          >
            {initial}
          </div>
          <div className="min-w-0">
            <h1 className="text-3xl font-extrabold tracking-tight">{data.displayName}</h1>
            {data.headline && <p className="grad-text text-lg font-bold">{data.headline}</p>}
            {data.tagline && <p className="mt-1" style={{ color: "var(--muted)" }}>{data.tagline}</p>}
            {data.location && <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>📍 {data.location}</p>}
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              {data.githubUrl && (
                <a href={data.githubUrl} target="_blank" rel="noreferrer" onClick={() => track("GITHUB_CLICK")} className="chip px-3 py-1 font-semibold" style={{ color: "var(--brand)" }}>
                  GitHub ↗
                </a>
              )}
              {data.linkedinUrl && (
                <a href={data.linkedinUrl} target="_blank" rel="noreferrer" onClick={() => track("LINKEDIN_CLICK")} className="chip px-3 py-1 font-semibold" style={{ color: "var(--brand)" }}>
                  LinkedIn ↗
                </a>
              )}
              {data.resumeUrl && (
                <a href={data.resumeUrl} target="_blank" rel="noreferrer" onClick={() => track("RESUME_CLICK")} className="btn-brand px-3 py-1">
                  ⬇ Resume
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {data.about && (
        <Section title="About" icon="✦">
          <p className="whitespace-pre-wrap leading-relaxed">{data.about}</p>
        </Section>
      )}

      {data.skills?.length > 0 && (
        <Section title="Professional Skills" icon="⬢">
          <div className="flex flex-wrap gap-2">
            {data.skills.map((s) => (
              <span key={s.id} className="chip flex items-center gap-2 px-3 py-1.5 text-sm font-medium">
                {s.name}
                <span className="flex gap-0.5" title={s.level}>
                  {[1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ background: i <= (LEVEL_DOTS[s.level] || 2) ? "var(--brand)" : "var(--ring-track)" }}
                    />
                  ))}
                </span>
              </span>
            ))}
          </div>
        </Section>
      )}

      {data.projects?.length > 0 && (
        <Section title="Your Projects" icon="▣">
          <div className="grid gap-4 md:grid-cols-2">
            {data.projects.map((p) => (
              <div key={p.id} className="rounded-xl border p-4" style={{ borderColor: "var(--line)", background: "var(--bg-soft)" }}>
                <h3 className="font-bold">{p.title}</h3>
                {p.description && <p className="mt-1 line-clamp-3 text-sm">{p.description}</p>}
                <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
                  {p.liveUrl && (
                    <a href={p.liveUrl} target="_blank" rel="noreferrer" onClick={() => track("PROJECT_CLICK", p.id)} style={{ color: "var(--brand)" }}>
                      Live ↗
                    </a>
                  )}
                  {p.githubUrl && (
                    <a href={p.githubUrl} target="_blank" rel="noreferrer" onClick={() => track("PROJECT_CLICK", p.id)} style={{ color: "var(--brand)" }}>
                      Code ↗
                    </a>
                  )}
                  {p.techStack && <span style={{ color: "var(--muted)" }}>{p.techStack}</span>}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.experience?.length > 0 && (
        <Section title="Experience" icon="💼">
          <div className="grid gap-3">
            {data.experience.map((e) => (
              <div key={e.id} className="flex gap-3">
                <div className="timeline-dot mt-1.5 h-3 w-3 shrink-0 rounded-full" />
                <div>
                  <p className="font-bold">{e.title} · <span style={{ color: "var(--brand)" }}>{e.company}</span></p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    {[e.startPeriod, e.endPeriod || "Present"].filter(Boolean).join(" → ")}{e.location ? ` · ${e.location}` : ""}
                  </p>
                  {e.description && <p className="mt-1 text-sm">{e.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.education?.length > 0 && (
        <Section title="Education" icon="🎓">
          <div className="grid gap-3">
            {data.education.map((e) => (
              <div key={e.id} className="flex gap-3">
                <div className="timeline-dot mt-1.5 h-3 w-3 shrink-0 rounded-full" />
                <div>
                  <p className="font-bold">{e.degree}</p>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    {e.school}{e.fieldOfStudy ? ` · ${e.fieldOfStudy}` : ""}{e.startYear ? ` · ${e.startYear} → ${e.endYear || "Present"}` : ""}
                  </p>
                  {e.description && <p className="mt-1 text-sm">{e.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.certifications?.length > 0 && (
        <Section title="Certifications" icon="🏅">
          <div className="grid gap-2">
            {data.certifications.map((c) => (
              <div key={c.id} className="flex items-center gap-2 text-sm">
                <span>🏅</span>
                <span className="font-semibold">{c.name}</span>
                <span style={{ color: "var(--muted)" }}>— {c.issuer}{c.issueDate ? ` · ${c.issueDate}` : ""}</span>
                {c.credentialUrl && (
                  <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="underline" style={{ color: "var(--brand)" }}>
                    Verify
                  </a>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.achievements?.length > 0 && (
        <Section title="Achievements" icon="🏆">
          <div className="grid gap-3 md:grid-cols-2">
            {data.achievements.map((a) => (
              <div key={a.id} className="rounded-xl border p-4" style={{ borderColor: "var(--line)", background: "var(--bg-soft)" }}>
                <p className="font-bold">🏆 {a.title}</p>
                {a.description && <p className="mt-1 text-sm">{a.description}</p>}
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                  {a.date}
                  {a.link && (
                    <> · <a href={a.link} target="_blank" rel="noreferrer" className="underline" style={{ color: "var(--brand)" }}>View</a></>
                  )}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      <p className="mt-8 text-center text-xs" style={{ color: "var(--muted)" }}>
        Crafted with ◈ Portfolio Pilot
      </p>
    </div>
  );
}

export { fire };
