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
  const [portfolio, setPortfolio] = useState(null);
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
      .catch((err) => live && setError(apiError(err, "Could not load dashboard")));
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
  const [topTip] = readiness.recommendations;
  const [topTo, topLabel] = topTip ? tipLink(topTip) : ["/profile", "Review profile"];

  return (
    <div>
      {/* A. Welcome + quick actions */}
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <h1 className="display text-[1.7rem] sm:text-3xl">{greeting}, {first}.</h1>
          <p className="mt-0.5 text-sm" style={{ color: "var(--muted)" }}>
            What should you improve in your professional profile next?
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          <Link to="/projects" className="btn-ghost px-3.5 py-2 text-sm font-semibold">+ Project</Link>
          <Link to="/preview" className="btn-brand px-3.5 py-2 text-sm">Preview & publish →</Link>
        </div>
      </div>

      {/* B+C. Readiness + publication */}
      <Stagger className="mt-5 grid gap-4 lg:grid-cols-5" gap={0.08}>
        <StaggerItem className="solid card p-6 lg:col-span-3">
          <div className="flex flex-wrap items-center gap-5">
            <ReadinessRing score={readiness.score} size={150} />
            <div className="min-w-52 flex-1">
              <p className="label">Portfolio readiness</p>
              <p className="mt-1 text-sm font-semibold">{done} of 8 sections complete</p>
              <div className="mt-3 grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                {readiness.breakdown.map((b) => (
                  <div key={b.section} className="py-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{b.done ? "✓ " : "○ "}{b.label}</span>
                      <span style={{ color: "var(--muted)" }}>{b.earned}/{b.weight}</span>
                    </div>
                    <div className="bar-track mt-1 h-1.5" role="progressbar" aria-valuenow={b.earned} aria-valuemin={0} aria-valuemax={b.weight} aria-label={b.label}>
                      <div className={`bar-fill h-1.5${b.done ? " lime" : ""}`} style={{ width: `${(b.earned / b.weight) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem className="tint rounded-[0.9rem] p-6 lg:col-span-2">
          <p className="label">Publication status</p>
          <p className="mt-2 text-lg font-extrabold tracking-tight">
            {portfolio?.published ? "Live and shareable" : portfolio ? "Draft — not public yet" : "Not set up yet"}
          </p>
          <p className="mt-1 truncate text-sm font-medium" style={{ color: "var(--muted)" }}>
            {portfolio?.username ? `/portfolio/${portfolio.username}` : "Claim a username to get your link"}
          </p>
          <div className="mt-4 flex gap-2">
            <Link to="/preview" className="btn-brand px-4 py-2 text-sm">
              {portfolio?.published ? "Manage page" : "Set up →"}
            </Link>
            {portfolio?.published && (
              <a href={`/portfolio/${portfolio.username}`} target="_blank" rel="noreferrer" className="btn-ghost px-4 py-2 text-sm font-semibold">
                Open ↗
              </a>
            )}
          </div>
        </StaggerItem>
      </Stagger>

      {/* D. Next best action — lime-led panel */}
      {topTip && (
        <div className="tint mt-4 flex flex-wrap items-center gap-3 rounded-[0.9rem] border-l-4 p-5"
          style={{ borderLeftColor: "var(--lime-deep)" }}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-extrabold"
            style={{ background: "var(--lime)", color: "#1e3a24" }} aria-hidden="true">→</span>
          <div className="min-w-0">
            <p className="label" style={{ color: "var(--brand)" }}>Next best action</p>
            <p className="font-bold">{topTip}</p>
          </div>
          <Link to={topTo} className="btn-brand ml-auto shrink-0 px-4 py-2 text-sm">{topLabel} →</Link>
        </div>
      )}
      {readiness.recommendations.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
          {readiness.recommendations.slice(1, 4).map((tip) => {
            const [to] = tipLink(tip);
            return (
              <Link key={tip} to={to} className="text-[13px] font-medium underline decoration-dotted underline-offset-4" style={{ color: "var(--muted)" }}>
                {tip}
              </Link>
            );
          })}
        </div>
      )}

      {/* E. Statistics */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Readiness" value={`${readiness.score}%`} icon="◈" />
        <Stat label="Views" value={analytics.portfolioViews} icon="👁" />
        <Stat label="Total clicks" value={analytics.projectClicks + analytics.githubClicks + analytics.resumeClicks + analytics.linkedinClicks} icon="➤" />
        <Stat label="Sections done" value={`${done}/8`} icon="✓" />
      </div>

      {/* F+G. Recents + engagement in one divided panel */}
      <div className="solid card mt-4 divide-y" style={{ borderColor: "var(--line)" }}>
        <div className="flex items-center p-5 pb-3">
          <h2 className="font-extrabold">Recent projects</h2>
          <Link to="/projects" className="ml-auto text-[13px] font-bold underline" style={{ color: "var(--brand)" }}>Manage all →</Link>
        </div>
        {projects.length === 0 ? (
          <div className="flex flex-wrap items-center gap-3 p-5 pt-2">
            <p className="text-sm" style={{ color: "var(--muted)" }}>No projects yet — your first one is the highest-leverage move.</p>
            <Link to="/projects" className="btn-brand ml-auto px-3 py-1.5 text-[13px]">+ Add project</Link>
          </div>
        ) : (
          <ul>
            {projects.map((p) => (
              <li key={p.id} className="flex items-center gap-3 px-5 py-2.5">
                <span className="font-bold" style={{ color: "var(--lime-deep)" }} aria-hidden="true">▣</span>
                <p className="truncate text-sm font-bold">{p.title}</p>
                {p.featured && <span className="chip-lime shrink-0 px-2 py-px text-[10px] font-bold">★</span>}
                <span className="truncate text-xs" style={{ color: "var(--muted)" }}>{p.techStack || ""}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap items-center gap-2 p-5">
          <h2 className="font-extrabold">Engagement</h2>
          {analytics.totalEvents === 0 ? (
            <p className="text-[13px]" style={{ color: "var(--muted)" }}>No visits yet — publish and share to start counting.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
              <span className="chip px-2.5 py-1">👁 {analytics.portfolioViews}</span>
              <span className="chip px-2.5 py-1">▣ {analytics.projectClicks}</span>
              <span className="chip px-2.5 py-1">⬢ {analytics.githubClicks}</span>
              <span className="chip px-2.5 py-1">⬇ {analytics.resumeClicks}</span>
            </div>
          )}
          <Link to="/analytics" className="ml-auto text-[13px] font-bold underline" style={{ color: "var(--brand)" }}>Full analytics →</Link>
        </div>
      </div>
    </div>
  );
}
