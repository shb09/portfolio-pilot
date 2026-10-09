import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, apiError } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import ReadinessRing from "../components/ReadinessRing";
import Stat from "../components/Stat";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/dashboard/summary")
      .then((res) => setData(res.data))
      .catch((err) => setError(apiError(err, "Could not load dashboard")));
  }, []);

  if (error) return <p style={{ color: "var(--danger)" }}>{error}</p>;
  if (!data) return <p style={{ color: "var(--muted)" }}>Charting your course…</p>;

  const { readiness, analytics } = data;

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">
        Hey {user?.name?.split(" ")[0]} — how ready is your <span className="grad-text">profile?</span>
      </h1>
      <p className="mt-1" style={{ color: "var(--muted)" }}>
        Your career snapshot, scored by the backend from your real data.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {/* Readiness hero */}
        <div className="glass card flex flex-col items-center p-6 lg:row-span-2">
          <ReadinessRing score={readiness.score} />
          <p className="mt-3 text-sm font-semibold">Portfolio Readiness</p>
          <div className="mt-4 w-full space-y-2">
            {readiness.breakdown.map((b) => (
              <div key={b.section}>
                <div className="flex justify-between text-xs font-semibold">
                  <span>
                    {b.done ? "✓ " : "○ "}{b.label}
                  </span>
                  <span style={{ color: "var(--muted)" }}>
                    {b.earned}/{b.weight}
                  </span>
                </div>
                <div className="bar-track mt-1 h-1.5">
                  <div className="bar-fill h-1.5" style={{ width: `${(b.earned / b.weight) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next best actions */}
        <div className="glass card p-6 lg:col-span-2">
          <h2 className="text-lg font-extrabold">➤ Your next best actions</h2>
          <ul className="mt-3 space-y-2">
            {readiness.recommendations.map((tip) => (
              <li key={tip} className="flex gap-2 rounded-xl p-2.5 text-sm" style={{ background: "var(--chip)" }}>
                <span style={{ color: "var(--brand)" }}>→</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Engagement */}
        <div className="glass card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold">📈 Portfolio performance</h2>
            <Link to="/analytics" className="text-sm font-semibold underline" style={{ color: "var(--brand)" }}>
              Full analytics
            </Link>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Mini label="Views" value={analytics.portfolioViews} />
            <Mini label="Project clicks" value={analytics.projectClicks} />
            <Mini label="GitHub clicks" value={analytics.githubClicks} />
            <Mini label="Resume clicks" value={analytics.resumeClicks} />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Readiness" value={`${readiness.score}%`} icon="◈" />
        <Stat label="Total events" value={analytics.totalEvents} icon="📈" />
        <Stat label="LinkedIn clicks" value={analytics.linkedinClicks} icon="💼" />
        <Stat label="Sections complete" value={`${readiness.breakdown.filter((b) => b.done).length}/8`} icon="✅" />
      </div>

      <div className="glass card mt-4 flex flex-wrap gap-2 p-4">
        <span className="w-full text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
          Continue building
        </span>
        {[
          ["Projects", "/projects"],
          ["Skills", "/skills"],
          ["Experience", "/experience"],
          ["Preview & Publish", "/preview"],
        ].map(([label, to]) => (
          <Link key={to} to={to} className="btn-ghost px-3 py-1.5 text-sm font-semibold">
            {label} →
          </Link>
        ))}
      </div>
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div className="rounded-xl border p-3 text-center" style={{ borderColor: "var(--line)", background: "var(--bg-soft)" }}>
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
        {label}
      </div>
    </div>
  );
}
