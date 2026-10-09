# Portfolio Pilot — Frontend

React 19 + Vite + Tailwind 4 + React Router + Axios + Framer Motion.

## Themes

- 🌙 **Midnight Emerald** (default): `#071410` foundation, `#67F5AD` emerald + `#63E6E2` cyan accents, selective glass.
- ☀ **Mist**: light companion in the same accent family. Toggle in sidebar/header, persisted (`pp_theme`, `data-theme` attr).

## Flow

`/ → /login /register → /dashboard (welcome, readiness, publish status, linked next action,
stats, recents) → /profile /projects /skills /education /experience /certifications
/achievements (searchable CrudPage) → /preview (floating glass controls → publish) →
/portfolio/:username (public editorial portfolio, fires analytics) → /analytics (charts)
→ /settings (account, theme, public link)`

## Dev

```bash
npm install
npm run dev     # :5173, /api + /portfolio proxied to localhost:8080
npm run build
```

## Prod

Set `VITE_API_URL` (backend origin) and `VITE_PUBLIC_URL` (prefix for `/portfolio/*`
if served separately); add the app origin to backend `app.cors.allowed-origins`.
Auth token + theme persist in `localStorage` (`pp_token`, `pp_user`, `pp_theme`).
