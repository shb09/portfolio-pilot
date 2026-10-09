import { useEffect, useState } from "react";
import { api, apiError } from "../api/client";

/**
 * Generic owner-scoped CRUD page driven by a module config:
 * { endpoint, title, tagline, addLabel, fields, titleOf, subOf,
 *   descOf, metaOf, tagsOf, linksOf }
 */
export default function CrudPage({ config }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null); // null | 'new' | item
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(config.endpoint);
      setItems(data);
    } catch (err) {
      setError(apiError(err, `Could not load ${config.title.toLowerCase()}`));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.endpoint]);

  const openNew = () => {
    const blank = {};
    config.fields.forEach((f) => (blank[f.name] = f.defaultValue ?? ""));
    setForm(blank);
    setEditing("new");
    setError("");
  };

  const openEdit = (item) => {
    const filled = {};
    config.fields.forEach((f) => (filled[f.name] = item[f.name] ?? ""));
    setForm(filled);
    setEditing(item);
    setError("");
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    // Drop empty optional strings so the backend stores nulls, not "".
    const payload = {};
    Object.entries(form).forEach(([k, v]) => {
      payload[k] = v === "" ? null : v;
    });
    try {
      if (editing === "new") await api.post(config.endpoint, payload);
      else await api.put(`${config.endpoint}/${editing.id}`, payload);
      setEditing(null);
      await load();
    } catch (err) {
      setError(apiError(err, "Could not save"));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete "${config.titleOf(item)}"?`)) return;
    try {
      await api.delete(`${config.endpoint}/${item.id}`);
      await load();
    } catch (err) {
      setError(apiError(err, "Could not delete"));
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {config.icon} {config.title}
          </h1>
          <p className="mt-1" style={{ color: "var(--muted)" }}>
            {config.tagline}
          </p>
        </div>
        <button onClick={openNew} className="btn-brand ml-auto px-4 py-2 text-sm">
          + {config.addLabel}
        </button>
      </div>

      {error && (
        <div className="glass card mb-4 p-3 text-sm" style={{ color: "var(--danger)" }}>
          {error}
        </div>
      )}

      {loading ? (
        <p style={{ color: "var(--muted)" }}>Loading…</p>
      ) : items.length === 0 ? (
        <div className="glass card p-10 text-center">
          <div className="text-4xl">{config.icon}</div>
          <p className="mt-2 font-semibold">Nothing here yet</p>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            {config.empty}
          </p>
          <button onClick={openNew} className="btn-brand mt-4 px-4 py-2 text-sm">
            + {config.addLabel}
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <div key={item.id} className="glass card p-5">
              <div className="flex items-start gap-2">
                <div className="min-w-0">
                  <h3 className="truncate font-bold">{config.titleOf(item)}</h3>
                  {config.subOf(item) && (
                    <p className="truncate text-sm" style={{ color: "var(--muted)" }}>
                      {config.subOf(item)}
                    </p>
                  )}
                </div>
                <div className="ml-auto flex shrink-0 gap-1">
                  <button onClick={() => openEdit(item)} className="btn-ghost px-2.5 py-1 text-xs">
                    Edit
                  </button>
                  <button onClick={() => remove(item)} className="btn-ghost px-2.5 py-1 text-xs" style={{ color: "var(--danger)" }}>
                    Delete
                  </button>
                </div>
              </div>
              {config.descOf(item) && <p className="mt-2 line-clamp-3 text-sm">{config.descOf(item)}</p>}
              {(config.tagsOf?.(item)?.length > 0 || config.metaOf?.(item) || config.linksOf?.(item)?.length > 0) && (
                <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                  {(config.tagsOf?.(item) || []).map((t) => (
                    <span key={t} className="chip px-2.5 py-0.5">
                      {t}
                    </span>
                  ))}
                  {config.metaOf?.(item) && (
                    <span style={{ color: "var(--muted)" }}>{config.metaOf(item)}</span>
                  )}
                  {(config.linksOf?.(item) || []).map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="underline" style={{ color: "var(--brand)" }}>
                      {l.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4" onClick={() => setEditing(null)}>
          <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="glass card max-h-[90vh] w-full max-w-lg overflow-y-auto p-6">
            <h2 className="text-lg font-bold">
              {editing === "new" ? config.addLabel : `Edit ${config.singular}`}
            </h2>
            <div className="mt-4 grid gap-3">
              {config.fields.map((f) => (
                <div key={f.name} className={f.half ? "" : "col-span-full"}>
                  <label className="label" htmlFor={f.name}>
                    {f.label}
                    {f.required && " *"}
                  </label>
                  {f.type === "textarea" ? (
                    <textarea
                      id={f.name}
                      className="input mt-1"
                      rows={3}
                      placeholder={f.placeholder}
                      value={form[f.name] ?? ""}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      required={!!f.required}
                    />
                  ) : f.type === "select" ? (
                    <select
                      id={f.name}
                      className="input mt-1"
                      value={form[f.name] ?? ""}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      required={!!f.required}
                    >
                      <option value="">Select…</option>
                      {f.options.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={f.name}
                      type={f.type || "text"}
                      className="input mt-1"
                      placeholder={f.placeholder}
                      value={form[f.name] ?? ""}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      required={!!f.required}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="btn-ghost px-4 py-2 text-sm">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-brand px-4 py-2 text-sm">
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
