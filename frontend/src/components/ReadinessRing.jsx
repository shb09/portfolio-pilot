/** Compact cobalt readiness ring on a periwinkle track. Score from backend only. */
export default function ReadinessRing({ score, size = 132 }) {
  const r = 56;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, score));
  const off = c - (pct / 100) * c;
  return (
    <div className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }} role="img" aria-label={`Portfolio readiness ${score} percent`}>
      <svg width={size} height={size} viewBox="0 0 132 132" className="-rotate-90" aria-hidden="true">
        <circle cx="66" cy="66" r={r} fill="none" stroke="var(--ring-track)" strokeWidth="11" />
        <circle
          cx="66"
          cy="66"
          r={r}
          fill="none"
          stroke="var(--brand)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
        {/* 100% marker dot */}
        <circle cx="66" cy={66 - r} r="4" fill={pct >= 100 ? "var(--brand)" : "var(--ring-track)"} />
      </svg>
      <div className="absolute text-center">
        <div className="text-[1.65rem] font-extrabold tabular-nums tracking-tight" style={{ color: "var(--ink)" }}>{score}%</div>
        <div className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--muted)" }}>
          Ready
        </div>
      </div>
    </div>
  );
}
