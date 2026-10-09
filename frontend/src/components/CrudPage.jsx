import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { api, apiError } from "../api/client";
import Toast from "./Toast";

/**
 * Generic owner-scoped CRUD page driven by a module config:
 * { endpoint, title, singular, icon, tagline, addLabel, empty,
 *   fields, filters?, titleOf, subOf, descOf, metaOf, tagsOf, linksOf }
 * Search spans title/subtitle/description/meta/tags. Filters are
 * exact-match selects declared in config (e.g. skill level).
 */
export default function CrudPage({ config }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({});
  const [editing, setEditing] = useState(null); // null | 'new' | item
  const [confirming, setConfirming] = useState(null);
  const [form, setForm] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const firstField = useRef(null);
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  };
  useEffect(() => () => clearTimeout(toastTimer.current), []);

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
    setQuery("");
    setActiveFilters({});
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.endpoint]);

  // Accessible modal: Esc closes, first field focused.
  useEffect(() => {
    if (!editing && !confirming) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setEditing(null);
        setConfirming(null);
      }
    };
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => firstField.current?.focus(), 60);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [editing, confirming]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      for (const f of config.filters || []) {
        const want = activeFilters[f.key];
        if (want && f.of(item) !== want) return false;
      }
      if (!q) return true;
      const hay = [
        config.titleOf(item), config.subOf(item), config.descOf(item), config.metaOf(item),
        ...(config.tagsOf?.(item) || []),
      ].filter(Boolean).join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [items, query, activeFilters, config]);

  const openNew = () => {
    const blank = {};
    config.fields.forEach((f) => (blank[f.name] = f.defaultValue ?? ""));
    setForm(blank);
    setFormError("");
    setEditing("new");
  };

  const openEdit = (item) => {
    const filled = {};
    config.fields.forEach((f) => (filled[f.name] = item[f.name] ?? ""));
    setForm(filled);
    setFormError("");
    setEditing(item);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    const payload = {};
    Object.entries(form).forEach(([k, v]) => {
      payload[k] = v === "" ? null : v;
    });
    try {
      if (editing === "new") {
        await api.post(config.endpoint, payload);
        showToast(`${config.singular[0].toUpperCase() + config.singular.slice(1)} added ✓`);
      } else {
        await api.put(`${config.endpoint}/${editing.id}`, payload);
        showToast("Changes saved ✓");
      }
      setEditing(null);
      await load();
    } catch (err) {
      setFormError(apiError(err, "Could not save — check the highlighted fields"));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirming) return;
    try {
      await api.delete(`${config.endpoint}/${confirming.id}`);
      setConfirming(null);
      showToast("Deleted");
      await load();
    } catch (err) {
      setError(apiError(err, "Could not delete"));
      setConfirming(null);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <h1 className="display text-3xl">{config.icon} {config.title}</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{config.tagline}</p>
        </div>
        <button onClick={openNew} className="btn-brand ml-auto px-4 py-2 text-sm">+ {config.addLabel}</button>
      </div>

      {/* Search + filters */}
      <div className="solid card mt-4 flex flex-wrap items-center gap-2 p-3">
        <label htmlFor="crud-search" className="sr-only">Search {config.title}</label>
        <input
          id="crud-search"
          className="input min-w-40 flex-1"
          placeholder={`Search ${config.title.toLowerCase()}…`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {(config.filters || []).map((f) => (
          <span key={f.key}>
            <label htmlFor={`filter-${f.key}`} className="sr-only">{f.label}</label>
            <select
              id={`filter-${f.key}`}
              className="input w-auto"
              value={activeFilters[f.key] || ""}
              onChange={(e) => setActiveFilters({ ...activeFilters, [f.key]: e.target.value || undefined })}
            >
              <option value="">All {f.label.toLowerCase()}s</option>
              {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </span>
        ))}
        <span className="ml-auto text-xs font-semibold" style={{ color: "var(--muted)" }} aria-live="polite">
          {loading ? "…" : `${visible.length} of ${items.length}`}
        </span>
      </div>

      {error && (
        <div className="solid card mt-4 flex items-center gap-3 p-4">
          <p className="text-sm font-semibold" style={{ color: "var(--danger)" }}>{error}</p>
          <button onClick={load} className="btn-ghost ml-auto px-3 py-1.5 text-xs font-semibold">Retry</button>
        </div>
      )}

      {loading ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2" aria-label="Loading">
          {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-36" />)}
        </div>
      ) : visible.length === 0 ? (
        <div className="solid card mt-4 p-10 text-center">
          <div className="text-4xl" aria-hidden="true">{config.icon}</div>
          <p className="mt-2 font-bold">{items.length === 0 ? "Nothing here yet" : "No matches"}</p>
          <p className="mx-auto mt-1 max-w-sm text-sm" style={{ color: "var(--muted)" }}>
            {items.length === 0 ? config.empty : "Try a different search or clear the filters."}
          </p>
          {items.length === 0 ? (
            <button onClick={openNew} className="btn-brand mt-4 px-4 py-2 text-sm">+ {config.addLabel}</button>
          ) : (
            <button onClick={() => { setQuery(""); setActiveFilters({}); }} className="btn-ghost mt-4 px-4 py-2 text-sm font-semibold">Clear search</button>
          )}
        </div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {visible.map((item) => (
            <article key={item.id} className="solid card p-5 transition-transform hover:-translate-y-0.5">
              <div className="flex items-start gap-2">
                <div className="min-w-0">
                  <h3 className="truncate font-bold">{config.titleOf(item)}</h3>
                  {config.subOf(item) && (
                    <p className="truncate text-sm" style={{ color: "var(--muted)" }}>{config.subOf(item)}</p>
                  )}
                </div>
                <div className="ml-auto flex shrink-0 gap-1.5">
                  <button onClick={() => openEdit(item)} className="btn-ghost px-2.5 py-1 text-xs font-semibold" aria-label={`Edit ${config.titleOf(item)}`}>Edit</button>
                  <button onClick={() => setConfirming(item)} className="btn-danger-ghost px-2.5 py-1 text-xs font-semibold" aria-label={`Delete ${config.titleOf(item)}`}>Delete</button>
                </div>
              </div>
              {config.descOf(item) && <p className="mt-2 line-clamp-3 text-sm leading-relaxed">{config.descOf(item)}</p>}
              {(config.tagsOf?.(item)?.length > 0 || config.metaOf?.(item) || config.linksOf?.(item)?.length > 0) && (
                <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                  {(config.tagsOf?.(item) || []).map((t) => (
                    <span key={t} className="chip px-2.5 py-0.5 font-medium">{t}</span>
                  ))}
                  {config.metaOf?.(item) && <span style={{ color: "var(--muted)" }}>{config.metaOf(item)}</span>}
                  {(config.linksOf?.(item) || []).map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="font-semibold underline" style={{ color: "var(--brand)" }}>{l.label}</a>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {/* Editor dialog */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-30 flex items-center justify-center bg-black/55 p-4"
            onClick={() => setEditing(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={editing === "new" ? config.addLabel : `Edit ${config.singular}`}
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="solid card max-h-[90vh] w-full max-w-lg overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-extrabold">{editing === "new" ? config.addLabel : `Edit ${config.singular}`}</h2>
              {formError && (
                <p role="alert" className="mt-2 rounded-lg p-2.5 text-sm font-medium" style={{ background: "var(--chip)", color: "var(--danger)" }}>
                  {formError}
                </p>
              )}
              <form onSubmit={save} noValidate={false}>
                <div className="mt-4 grid gap-3">
                  {config.fields.map((f, i) => (
                    <div key={f.name}>
                      <label className="label" htmlFor={`f-${f.name}`}>{f.label}{f.required && " *"}</label>
                      {f.type === "textarea" ? (
                        <textarea
                          id={`f-${f.name}`}
                          ref={i === 0 ? firstField : undefined}
                          className="input mt-1"
                          rows={3}
                          placeholder={f.placeholder}
                          value={form[f.name] ?? ""}
                          onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                          required={!!f.required}
                        />
                      ) : f.type === "select" ? (
                        <select
                          id={`f-${f.name}`}
                          ref={i === 0 ? firstField : undefined}
                          className="input mt-1"
                          value={form[f.name] ?? ""}
                          onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                          required={!!f.required}
                        >
                          <option value="">Select…</option>
                          {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input
                          id={`f-${f.name}`}
                          ref={i === 0 ? firstField : undefined}
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
                  <button type="button" onClick={() => setEditing(null)} className="btn-ghost px-4 py-2 text-sm font-semibold">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-brand px-4 py-2 text-sm">
                    {saving ? "Saving…" : "Save"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {confirming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-30 flex items-center justify-center bg-black/55 p-4"
            onClick={() => setConfirming(null)}
          >
            <motion.div
              role="alertdialog"
              aria-modal="true"
              aria-label="Confirm deletion"
              aria-describedby="delete-desc"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="solid card w-full max-w-sm p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-extrabold">Delete {config.singular}?</h2>
              <p id="delete-desc" className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                “{config.titleOf(confirming)}” will be permanently removed. This cannot be undone.
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button ref={firstField} onClick={() => setConfirming(null)} className="btn-ghost px-4 py-2 text-sm font-semibold">Cancel</button>
                <button onClick={remove} className="px-4 py-2 text-sm font-bold" style={{ background: "var(--danger)", color: "#04120c", borderRadius: "0.75rem" }}>Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toast message={toast} />
    </div>
  );
}
