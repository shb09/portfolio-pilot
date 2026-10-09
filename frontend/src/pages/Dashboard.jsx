import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, apiError } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import ReadinessRing from "../components/ReadinessRing";
import Stat from "../components/Stat";
import { Stagger, StaggerItem } from "../components/Reveal";

/** "What should I improve in my professional profile next?" */
function tipLink(tip) {
  const t = tip.toLowerCase();
  if (t.includes("publish") || t.includes("launch-ready") || t.includes("share")) return ["/preview", "Open publishing"];
  if (t.includes("project")) return ["/projects", "Go to projects"];
  if (t.includes("skill")) return ["/skills", "Go to skills"];
  if (t.includes("experience") || t.includes("internship")) return ["/experience", "Go to experience"];
  if (t.includes("education")) return ["/education", "Go to education"];
  if (t.includes("certification")) return ["/certifications", "Go to certifications"];
  if (t.includes("achievement") || t.includes("award")) return ["/achievements", "Go to achievements"];
  if (t.includes("github") || t.includes("resume") || t.includes("about")) return ["/profile", "Go to profile"];
  return ["/profile", "Review profile"];
}

function Skeleton() {
  return (
    <div className="space-y-3" aria-label="Loading dashboard">
      <div className="skeleton h-8 w-2/3" />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="skeleton h-64" />
        <div className="skeleton h-64 lg:col-span-2" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-24" />)}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [portfolio, setPortfolio] = useState(null); // null = not set up yet
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let live = true;
    Promise.all([
      api.get("/dashboard/summary"),
      api.get("/portfolio").catch(() => ({ data: null })),
      api.get("/projects").catch(() => ({ data: [] })),
    ])
      .then(([dash, pf, projs]) => {
        if (!live) return;
        setData(dash.data);
        setPortfolio(pf.data);
        setProjects((projs.data || []).slice(0, 3));
      })
      .catch((err) => live && setError(apiError(err, "Could not load dashboard")))
      .finally(() => {});
    return () => { live = false; };
  }, []);

  if (error) {
    return (
      <div className="solid card p-8 text-center">
        <p className="font-bold" style={{ color: "var(--danger)" }}>{error}</p>
        <button onClick={() => window.location.reload()} className="btn-brand mt-4 px-4 py-2 text-sm">Retry</button>
      </div>
    );
  }
  if (!data) return <Skeleton />;

  const { readiness, analytics } = data;
  const first = user?.name?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const done = readiness.breakdown.filter((b) => b.done).length;

  return (
    <div>
      {/* A. Welcome */}
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <h1 className="display text-3xl sm:text-4xl">{greeting}, {first}.</h1>
          <p className="mt-1" style={{ color: "var(--muted)" }}>
            What should you improve in your professional profile next?
          </p>
        </div>
        <Link to="/preview" className="btn-brand ml-auto px-4 py-2 text-sm">Preview & publish →</Link>
      </div>

      <Stagger className="mt-6 grid gap-4 lg:grid-cols-3" gap={0.08}>
        {/* B. Readiness */}
        <StaggerItem className="solid card flex flex-col items-center p-6">
          <ReadinessRing score={readiness.score} />
          <p className="mt-2 text-sm font-bold">Portfolio readiness</p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>{done} of 8 sections complete</p>
          <div className="mt-4 w-full space-y-2">
            {readiness.breakdown.map((b) => (
              <div key={b.section}>
                <div className="flex justify-between text-xs font-semibold">
                  <span>{b.done ? "✓ " : "○ "}{b.label}</span>
                  <span style={{ color: "var(--muted)" }}>{b.earned}/{b.weight}</span>
                </div>
                <div className="bar-track mt-1 h-1.5" role="progressbar" aria-valuenow={b.earned} aria-valuemin={0} aria-valuemax={b.weight} aria-label={b.label}>
                  <div className="bar-fill h-1.5" style={{ width: `${(b.earned / b.weight) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </StaggerItem>

        <div className="space-y-4 lg:col-span-2">
          {/* C. Publication status */}
          <StaggerItem className="solid card flex flex-wrap items-center gap-3 p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl text-lg" style={{ background: "var(--chip)" }} aria-hidden="true">🚀</span>
            <div className="min-w-0">
              <p className="font-bold">
                {portfolio?.published ? "Your portfolio is live" : portfolio ? "Draft saved — not published yet" : "Publishing not set up yet"}
              </p>
              <p className="truncate text-sm" style={{ color: "var(--muted)" }}>
                {portfolio?.username ? `/portfolio/${portfolio.username}` : "Claim a username to get your public link"}
              </p>
            </div>
            <Link to="/preview" className="btn-ghost ml-auto px-3 py-1.5 text-sm font-semibold">
              {portfolio?.published ? "Manage" : "Set up →"}
            </Link>
          </StaggerItem>

          {/* D. Next best action (top recommendation, linked) */}
          <StaggerItem className="solid card p-5" style={{ borderColor: "var(--brand)" }}>
            <p className="label" style={{ color: "var(--brand)" }}>Next best action</p>
            {readiness.recommendations.slice(0, 1).map((tip) => {
              const [to, label] = tipLink(tip);
              return (
                <div key={tip} className="mt-1 flex flex-wrap items-center gap-3">
                  <p className="text-lg font-bold">{tip}</p>
                  <Link to={to} className="btn-brand ml-auto px-4 py-2 text-sm">{label} →</Link>
                </div>
              );
            })}
            {readiness.recommendations.length > 1 && (
              <ul className="mt-3 space-y-1.5">
                {readiness.recommendations.slice(1, 4).map((tip) => {
                  const [to] = tipLink(tip);
                  return (
                    <li key={tip} className="text-sm">
                      <Link to={to} className="underline decoration-dotted" style={{ color: "var(--muted)" }}>{tip}</Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </StaggerItem>

          {/* E. Stats */}
          <StaggerItem className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat label="Readiness" value={`${readiness.score}%`} icon="◈" />
            <Stat label="Views" value={analytics.portfolioViews} icon="👁" />
            <Stat label="Total clicks" value={analytics.projectClicks + analytics.githubClicks + analytics.resumeClicks + analytics.linkedinClicks} icon="➤" />
            <Stat label="Sections done" value={`${done}/8`} icon="✓" />
          </StaggerItem>
        </div>
      </Stagger>

      {/* F. Recent projects */}
      <div className="solid card mt-4 p-5">
        <div className="flex items-center">
          <h2 className="text-lg font-extrabold">Recent projects</h2>
          <Link to="/projects" className="ml-auto text-sm font-semibold underline" style={{ color: "var(--brand)" }}>Manage all →</Link>
        </div>
        {projects.length === 0 ? (
          <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl p-4" style={{ background: "var(--chip)" }}>
            <p className="text-sm">No projects yet — your first one is the highest-leverage move.</p>
            <Link to="/projects" className="btn-brand ml-auto px-3 py-1.5 text-sm">+ Add project</Link>
          </div>
        ) : (
          <ul className="mt-3 divide-y" style={{ borderColor: "var(--line)" }}>
            {projects.map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-bold" style={{ background: "var(--chip)", color: "var(--brand)" }} aria-hidden="true">▣</span>
                <div className="min-w-0">
                  <p className="truncate font-bold">{p.title}</p>
                  <p className="truncate text-xs" style={{ color: "var(--muted)" }}>{p.techStack || "—"}</p>
                </div>
                <Link to="/projects" className="ml-auto shrink-0 text-xs font-semibold underline" style={{ color: "var(--brand)" }}>Edit</Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* G. Recent activity (real counts only) */}
      <div className="solid card mt-4 p-5">
        <div className="flex items-center">
          <h2 className="text-lg font-extrabold">Engagement snapshot</h2>
          <Link to="/analytics" className="ml-auto text-sm font-semibold underline" style={{ color: "var(--brand)" }}>Full analytics →</Link>
        </div>
        {analytics.totalEvents === 0 ? (
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            No visits yet. Publish your portfolio and share the link — every view lands here.
          </p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <span className="chip px-3 py-1">👁 {analytics.portfolioViews} views</span>
            <span className="chip px-3 py-1">▣ {analytics.projectClicks} project clicks</span>
            <span className="chip px-3 py-1">⬢ {analytics.githubClicks} GitHub</span>
            <span className="chip px-3 py-1">⬇ {analytics.resumeClicks} resume</span>
            <span className="chip px-3 py-1">💼 {analytics.linkedinClicks} LinkedIn</span>
          </div>
        )}
      </div>
    </div>
  );
}
