import { useEffect, useState } from "react";
import { api, apiError } from "../api/client";
import PublicView from "../components/PublicView";

export default function Preview() {
  const [data, setData] = useState(null);
  const [meta, setMeta] = useState({ username: "", tagline: "", published: false });
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const [{ data: preview }, metaRes] = await Promise.all([
        api.get("/portfolio/preview"),
        api.get("/portfolio").catch(() => ({ data: null })),
      ]);
      setData(preview);
      if (metaRes.data) setMeta(metaRes.data);
      else if (preview.username) setMeta({ username: preview.username, tagline: preview.tagline || "", published: false });
    } catch (err) {
      setError(apiError(err, "Could not load preview"));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (publish) => {
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const { data } = await api.put("/portfolio", {
        username: meta.username.toLowerCase().trim(),
        tagline: meta.tagline || null,
        published: publish,
      });
      setMeta(data);
      setStatus(publish ? "🚀 Published! Your public link is live below." : "Saved as draft. Publish when ready.");
      await load();
    } catch (err) {
      setError(apiError(err, "Could not save portfolio settings"));
    } finally {
      setBusy(false);
    }
  };

  const publicUrl = meta.username ? `${window.location.origin}/portfolio/${meta.username}` : "";

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">🚀 Preview & Publish</h1>
      <p className="mt-1" style={{ color: "var(--muted)" }}>
        Edit → Preview → Publish. Only published portfolios are publicly visible.
      </p>

      <div className="glass card mt-6 p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="username">Public username (slug) *</label>
            <input id="username" className="input mt-1" value={meta.username || ""} onChange={(e) => setMeta({ ...meta, username: e.target.value })} placeholder="asha-sharma" />
          </div>
          <div>
            <label className="label" htmlFor="tagline">Tagline</label>
            <input id="tagline" className="input mt-1" value={meta.tagline || ""} onChange={(e) => setMeta({ ...meta, tagline: e.target.value })} placeholder="Aspiring Java developer" />
          </div>
        </div>
        {error && <p className="mt-3 text-sm" style={{ color: "var(--danger)" }}>{error}</p>}
        {status && <p className="mt-3 text-sm font-semibold" style={{ color: "var(--ok)" }}>{status}</p>}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button disabled={busy} onClick={() => save(false)} className="btn-ghost px-4 py-2 text-sm font-semibold">
            Save draft
          </button>
          <button disabled={busy} onClick={() => save(true)} className="btn-brand px-4 py-2 text-sm">
            {meta.published ? "Update public page" : "Publish 🚀"}
          </button>
          {meta.published && meta.username && (
            <>
              {meta.published && (
                <button
                  onClick={() => save(false)}
                  disabled={busy}
                  className="btn-ghost px-4 py-2 text-sm"
                  style={{ color: "var(--danger)" }}
                >
                  Unpublish
                </button>
              )}
              <a href={publicUrl} target="_blank" rel="noreferrer" className="ml-auto text-sm font-semibold underline" style={{ color: "var(--brand)" }}>
                {publicUrl} ↗
              </a>
            </>
          )}
        </div>
      </div>

      <div className="mt-6">
        <p className="label mb-2">Live preview — exactly what visitors see</p>
        {data ? <PublicView data={data} onEvent={null} /> : <p style={{ color: "var(--muted)" }}>Loading preview…</p>}
      </div>
    </div>
  );
}
