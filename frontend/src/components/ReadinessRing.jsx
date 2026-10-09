/** Readiness ring: SVG conic-style progress, brand gradient stroke. */
export default function ReadinessRing({ score, size = 168 }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const off = c - (Math.min(100, Math.max(0, score)) / 100) * c;
  const id = "ringgrad";
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 168 168" className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--brand)" />
            <stop offset="60%" stopColor="var(--brand-2)" />
            <stop offset="100%" stopColor="var(--brand-3)" />
          </linearGradient>
        </defs>
        <circle cx="84" cy="84" r={r} fill="none" stroke="var(--ring-track)" strokeWidth="14" />
        <circle
          cx="84"
          cy="84"
          r={r}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          style={{ transition: "stroke-dashoffset 0.8s ease", filter: "drop-shadow(0 0 8px var(--brand))" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="grad-text text-4xl font-extrabold">{score}%</div>
        <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
          Ready
        </div>
      </div>
    </div>
  );
}
