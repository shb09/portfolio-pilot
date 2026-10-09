import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Eye, FolderKanban, MousePointerClick, Plus } from "lucide-react";
import { api, apiError } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import ReadinessRing from "../components/ReadinessRing";
import { Stagger, StaggerItem } from "../components/Reveal";

/** "What is the most valuable next step I can take?" */
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
      <div className="skeleton h-7 w-1/2" />
      <div className="grid gap-3 lg:grid-cols-3">
        <div className="skeleton h-52" />
        <div className="skeleton h-52 lg:col-span-2" />
      </div>
      <div className="skeleton h-28" />
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
        setProjects((projs.data || []).slice(0, 4));
      })
      .catch((err) => live && setError(apiError(err, "Could not load dashboard")));
    return () => { live = false; };
  }, []);

  if (error) {
    return (
      <div className="solid card p-8 text-center">
        <p className="text-sm font-bold" style={{ color: "var(--danger)" }}>{error}</p>
        <button onClick={() => window.location.reload()} className="btn-brand mt-4 px-4 py-2 text-[13px]">Retry</button>
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
  const clicks = analytics.projectClicks + analytics.githubClicks + analytics.resumeClicks + analytics.linkedinClicks;

  return (
    <div>
      {/* Compact welcome */}
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="display text-[1.45rem]">{greeting}, {first}.</h1>
          <p className="mt-0.5 text-[13px]" style={{ color: "var(--muted)" }}>
            Your most valuable next step is below.
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          <Link to="/projects" className="btn-ghost px-3 py-1.5 text-xs font-semibold"><Plus size={14} /> Project</Link>
          <Link to="/preview" className="btn-brand px-3 py-1.5 text-xs">Preview & publish <ArrowRight size={14} /></Link>
        </div>
      </div>

      {/* Primary area: readiness + publish */}
      <Stagger className="mt-4 grid gap-3 lg:grid-cols-5" gap={0.07}>
        <StaggerItem className="solid card p-5 lg:col-span-3">
          <div className="flex flex-wrap items-center gap-5">
            <ReadinessRing score={readiness.score} />
            <div className="min-w-48 flex-1">
              <p className="eyebrow">Portfolio readiness · live from backend</p>
              <div className="mt-2.5 grid grid-cols-1 gap-x-5 sm:grid-cols-2">
                {readiness.breakdown.map((b) => (
                  <div key={b.section} className="py-[3px]">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{b.done ? "✓ " : "○ "}{b.label}</span>
                      <span className="tabular-nums" style={{ color: "var(--muted)" }}>{b.earned}/{b.weight}</span>
                    </div>
                    <div className="bar-track mt-1 h-1" role="progressbar" aria-valuenow={b.earned} aria-valuemin={0} aria-valuemax={b.weight} aria-label={b.label}>
                      <div className="bar-fill h-1" style={{ width: `${(b.earned / b.weight) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem className="tint rounded-xl p-5 lg:col-span-2">
          <p className="eyebrow">Publication</p>
          <p className="mt-1.5 text-lg font-extrabold tracking-tight">
            {portfolio?.published ? "Live and shareable" : portfolio ? "Draft — not public yet" : "Not set up yet"}
          </p>
          <p className="mt-0.5 truncate font-mono text-xs" style={{ color: "var(--muted)" }}>
            {portfolio?.username ? `/portfolio/${portfolio.username}` : "claim a username to get your link"}
          </p>
          <div className="mt-3.5 flex gap-2">
            <Link to="/preview" className="btn-brand px-3.5 py-1.5 text-xs">
              {portfolio?.published ? "Manage page" : "Set up"}
            </Link>
            {portfolio?.published && (
              <a href={`/portfolio/${portfolio.username}`} target="_blank" rel="noreferrer" className="btn-ghost px-3.5 py-1.5 text-xs font-semibold">
                Open <ArrowUpRight size={13} />
              </a>
            )}
          </div>
        </StaggerItem>
      </Stagger>

      {/* Next: the single most valuable step */}
      {topTip && (
        <Link to={topTo} className="tint mt-3 flex items-center gap-3 rounded-xl border-l-[3px] px-4 py-3.5"
          style={{ borderLeftColor: "var(--brand)" }}>
          <span className="chip-accent px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest">Next step</span>
          <span className="text-sm font-bold">{topTip}</span>
          <span className="ml-auto flex shrink-0 items-center gap-1 text-xs font-bold" style={{ color: "var(--brand)" }}>
            {topLabel} <ArrowRight size={14} />
          </span>
        </Link>
      )}
      {readiness.recommendations.length > 1 && (
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {readiness.recommendations.slice(1, 3).map((tip) => {
            const [to] = tipLink(tip);
            return (
              <Link key={tip} to={to} className="text-xs font-medium underline decoration-dotted underline-offset-4" style={{ color: "var(--muted)" }}>
                Also: {tip}
              </Link>
            );
          })}
        </div>
      )}

      {/* Below: recents + compact stats */}
      <div className="mt-4 grid gap-3 lg:grid-cols-5">
        <div className="solid card lg:col-span-3">
          <div className="flex items-center px-4 pt-3.5">
            <h2 className="text-sm font-extrabold">Recent projects</h2>
            <Link to="/projects" className="ml-auto text-xs font-bold underline underline-offset-2" style={{ color: "var(--brand)" }}>Manage all</Link>
          </div>
          {projects.length === 0 ? (
            <div className="flex flex-wrap items-center gap-2.5 px-4 py-3.5">
              <p className="text-[13px]" style={{ color: "var(--muted)" }}>No projects yet — the highest-leverage first move.</p>
              <Link to="/projects" className="btn-brand ml-auto px-3 py-1.5 text-xs"><Plus size={13} /> Add project</Link>
            </div>
          ) : (
            <ul className="divide-y" style={{ borderColor: "var(--line)" }}>
              {projects.map((p) => (
                <li key={p.id} className="record-row flex items-center gap-2.5 px-4 py-2.5">
                  <FolderKanban size={15} style={{ color: "var(--brand)" }} className="shrink-0" aria-hidden="true" />
                  <p className="truncate text-[13px] font-bold">{p.title}</p>
                  {p.featured && <span className="chip-accent shrink-0 px-1.5 py-px text-[10px] font-bold">Featured</span>}
                  <span className="truncate text-xs" style={{ color: "var(--muted)" }}>{p.techStack || ""}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="tint rounded-xl p-4 lg:col-span-2">
          <h2 className="text-sm font-extrabold">Profile statistics</h2>
          <dl className="mt-2.5 grid grid-cols-3 gap-2 text-center">
            {[
              [`${readiness.score}%`, "Ready", null],
              [`${analytics.portfolioViews}`, "Views", Eye],
              [`${clicks}`, "Clicks", MousePointerClick],
            ].map(([v, l, Icon]) => (
              <div key={l} className="rounded-lg border px-2 py-2.5" style={{ borderColor: "var(--line)", background: "var(--surface-solid)" }}>
                <dt className="eyebrow flex items-center justify-center gap-1" style={{ fontSize: "0.6rem" }}>
                  {Icon && <Icon size={11} aria-hidden="true" />}{l}
                </dt>
                <dd className="mt-0.5 text-xl font-extrabold tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
          <Link to="/analytics" className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold underline underline-offset-2" style={{ color: "var(--brand)" }}>
            Full analytics <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
