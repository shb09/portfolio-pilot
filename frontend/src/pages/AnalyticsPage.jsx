import { useEffect, useState } from "react";
import { api, apiError } from "../api/client";
import Stat from "../components/Stat";

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/analytics/summary")
      .then((res) => setData(res.data))
      .catch((err) => setError(apiError(err, "Could not load analytics")));
  }, []);

  if (error) return <p style={{ color: "var(--danger)" }}>{error}</p>;
  if (!data) return <p style={{ color: "var(--muted)" }}>Counting events…</p>;

  const rows = [
    ["👁", "Portfolio views", data.portfolioViews, "Someone opened your public link"],
    ["▣", "Project clicks", data.projectClicks, "Visitors opening your project links"],
    ["⬢", "GitHub clicks", data.githubClicks, "Visitors heading to your code"],
    ["⬇", "Resume clicks", data.resumeClicks, "Recruiters grabbing your resume"],
    ["💼", "LinkedIn clicks", data.linkedinClicks, "Visitors checking your LinkedIn"],
  ];

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">📈 Portfolio Performance</h1>
      <p className="mt-1" style={{ color: "var(--muted)" }}>
        Every view and click on your public portfolio, counted event by event. No sensitive data, ever.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Stat label="Total events" value={data.totalEvents} icon="📊" />
        {rows.slice(0, 2).map(([icon, label, value]) => (
          <Stat key={label} label={label} value={value} icon={icon} />
        ))}
      </div>
      <div className="glass card mt-4 divide-y" style={{ borderColor: "var(--line)" }}>
        {rows.map(([icon, label, value, hint]) => (
          <div key={label} className="flex items-center gap-3 p-4">
            <span className="text-2xl">{icon}</span>
            <div>
              <p className="font-bold">{label}</p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>{hint}</p>
            </div>
            <span className="grad-text ml-auto text-3xl font-extrabold">{value}</span>
          </div>
        ))}
      </div>
      {data.totalEvents === 0 && (
        <p className="glass card mt-4 p-4 text-sm" style={{ color: "var(--muted)" }}>
          No traffic yet — publish your portfolio and share the link to start collecting events.
        </p>
      )}
    </div>
  );
}
