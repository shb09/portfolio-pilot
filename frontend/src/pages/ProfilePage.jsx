import { useEffect, useState } from "react";
import { api, apiError } from "../api/client";

const FIELDS = [
  ["headline", "Headline", "Java Developer | CS Undergrad"],
  ["about", "About", "A few lines about who you are…"],
  ["location", "Location", "Chennai, India"],
  ["githubUrl", "GitHub URL", "https://github.com/you"],
  ["linkedinUrl", "LinkedIn URL", "https://linkedin.com/in/you"],
  ["resumeUrl", "Resume URL", "https://…/resume.pdf"],
];

export default function ProfilePage() {
  const [form, setForm] = useState({ headline: "", about: "", location: "", githubUrl: "", linkedinUrl: "", resumeUrl: "" });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .get("/profile")
      .then((res) => setForm({ headline: "", about: "", location: "", githubUrl: "", linkedinUrl: "", resumeUrl: "", ...res.data }))
      .catch((err) => {
        if (err?.response?.status !== 404) setError(apiError(err, "Could not load profile"));
      });
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setStatus("");
    const payload = {};
    Object.entries(form).forEach(([k, v]) => (payload[k] = v === "" ? null : v));
    try {
      await api.put("/profile", payload);
      setStatus("Profile saved ✓ — your readiness score just moved.");
    } catch (err) {
      setError(apiError(err, "Could not save profile"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-extrabold tracking-tight">✦ Career Snapshot</h1>
      <p className="mt-1" style={{ color: "var(--muted)" }}>
        This powers your hero section, About, and contact links everywhere.
      </p>
      <form onSubmit={save} className="solid card mt-6 space-y-3 p-6">
        {error && <p className="text-sm" style={{ color: "var(--danger)" }}>{error}</p>}
        {status && <p className="text-sm font-semibold" style={{ color: "var(--ok)" }}>{status}</p>}
        {FIELDS.map(([name, label, ph]) => (
          <div key={name}>
            <label className="label" htmlFor={name}>{label}</label>
            {name === "about" ? (
              <textarea id={name} rows={4} className="input mt-1" placeholder={ph} value={form[name] ?? ""} onChange={(e) => setForm({ ...form, [name]: e.target.value })} />
            ) : (
              <input id={name} className="input mt-1" placeholder={ph} value={form[name] ?? ""} onChange={(e) => setForm({ ...form, [name]: e.target.value })} />
            )}
          </div>
        ))}
        <button type="submit" disabled={busy} className="btn-brand w-full py-2.5">
          {busy ? "Saving…" : "Save profile"}
        </button>
      </form>
    </div>
  );
}
