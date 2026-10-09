import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { api, apiError } from "../api/client";
import Stat from "../components/Stat";

/** Hand-rolled SVG bars — no chart dependency needed for 5 numbers. */
function Bars({ rows }) {
  const reduce = useReducedMotion();
  const max = Math.max(1, ...rows.map(([, v]) => v));
  return (
    <div className="space-y-3" role="img" aria-label="Engagement bar chart">
      {rows.map(([label, value], i) => (
        <div key={label}>
          <div className="flex justify-between text-sm font-semibold">
            <span>{label}</span>
            <span className="grad-text font-extrabold">{value}</span>
          </div>
          <div className="bar-track mt-1 h-2.5">
            <motion.div
              className="bar-fill h-2.5"
              initial={reduce ? false : { width: 0 }}
              whileInView={{ width: `${(value / max) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function Donut({ total, views }) {
  const pct = total === 0 ? 0 : Math.round((views / total) * 100);
  const r = 54;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-4">
      <svg width="130" height="130" viewBox="0 0 130 130" className="-rotate-90" role="img" aria-label={`${pct}% of events are portfolio views`}>
        <circle cx="65" cy="65" r={r} fill="none" stroke="var(--ring-track)" strokeWidth="14" />
        <motion.circle
          cx="65" cy="65" r={r} fill="none"
          stroke="var(--brand)" strokeWidth="14" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c - (pct / 100) * c }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div>
        <p className="display text-4xl">{pct}%</p>
        <p className="text-sm" style={{ color: "var(--muted)" }}>of engagement is<br />portfolio views</p>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/analytics/summary")
      .then((res) => setData(res.data))
      .catch((err) => setError(apiError(err, "Could not load analytics")));
  }, []);

  if (error) {
    return (
      <div className="solid card p-8 text-center">
        <p className="font-bold" style={{ color: "var(--danger)" }}>{error}</p>
        <button onClick={() => window.location.reload()} className="btn-brand mt-4 px-4 py-2 text-sm">Retry</button>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="space-y-3" aria-label="Loading analytics">
        <div className="skeleton h-8 w-1/2" />
        <div className="skeleton h-56" />
      </div>
    );
  }

  const rows = [
    ["👁 Portfolio views", data.portfolioViews, "Someone opened your public link"],
    ["▣ Project clicks", data.projectClicks, "Visitors opening project links"],
    ["⬢ GitHub clicks", data.githubClicks, "Visitors heading to your code"],
    ["⬇ Resume clicks", data.resumeClicks, "Recruiters grabbing your resume"],
    ["💼 LinkedIn clicks", data.linkedinClicks, "Visitors checking your LinkedIn"],
  ];

  return (
    <div>
      <h1 className="display text-3xl">Engagement</h1>
      <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
        Every view and click on your public portfolio, persisted event by event. Nothing fabricated.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Total events" value={data.totalEvents} icon="📊" />
        <Stat label="Views" value={data.portfolioViews} icon="👁" />
        <Stat label="Project clicks" value={data.projectClicks} icon="▣" />
        <Stat label="Profile clicks" value={data.githubClicks + data.linkedinClicks + data.resumeClicks} icon="➤" />
      </div>

      {data.totalEvents === 0 ? (
        <div className="solid card mt-4 p-10 text-center">
          <p className="text-4xl" aria-hidden="true">🛰</p>
          <p className="mt-2 font-extrabold">No traffic yet</p>
          <p className="mx-auto mt-1 max-w-sm text-sm" style={{ color: "var(--muted)" }}>
            Publish your portfolio and share the link — the first visit lands here automatically.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 lg:grid-cols-5">
          <div className="solid card p-6 lg:col-span-3">
            <h2 className="font-extrabold">Events by type</h2>
            <div className="mt-4"><Bars rows={rows.map(([l, v]) => [l, v])} /></div>
          </div>
          <div className="solid card p-6 lg:col-span-2">
            <h2 className="font-extrabold">View share</h2>
            <div className="mt-4"><Donut total={data.totalEvents} views={data.portfolioViews} /></div>
            <ul className="mt-4 space-y-1.5 text-sm" style={{ color: "var(--muted)" }}>
              {rows.map(([l, v, hint]) => (
                <li key={l} className="flex justify-between gap-2">
                  <span>{l} <span className="opacity-70">· {hint}</span></span>
                  <strong style={{ color: "var(--ink)" }}>{v}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
