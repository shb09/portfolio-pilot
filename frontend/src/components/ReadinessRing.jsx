/** Readiness ring: forest progress stroke, lime milestone ticks, ink numerals. */
export default function ReadinessRing({ score, size = 168 }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, score));
  const off = c - (pct / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }} role="img" aria-label={`Portfolio readiness ${score} percent`}>
      <svg width={size} height={size} viewBox="0 0 168 168" className="-rotate-90" aria-hidden="true">
        <circle cx="84" cy="84" r={r} fill="none" stroke="var(--ring-track)" strokeWidth="14" />
        {/* milestone ticks at 25/50/75 */}
        {[25, 50, 75].map((m) => {
          const a = (m / 100) * 2 * Math.PI;
          const x1 = 84 + (r - 9) * Math.cos(a);
          const y1 = 84 + (r - 9) * Math.sin(a);
          const x2 = 84 + (r + 9) * Math.cos(a);
          const y2 = 84 + (r + 9) * Math.sin(a);
          return <line key={m} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--lime-deep)" strokeWidth="3" strokeLinecap="round" opacity="0.7" />;
        })}
        <circle
          cx="84"
          cy="84"
          r={r}
          fill="none"
          stroke="var(--brand)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-4xl font-extrabold tracking-tight" style={{ color: "var(--ink)" }}>{score}%</div>
        <div className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--muted)" }}>
          Ready
        </div>
      </div>
    </div>
  );
}
