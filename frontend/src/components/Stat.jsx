export default function Stat({ label, value, icon }) {
  return (
    <div className="glass card p-4">
      <div className="text-2xl">{icon}</div>
      <div className="mt-1 text-3xl font-extrabold">{value}</div>
      <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
        {label}
      </div>
    </div>
  );
}
