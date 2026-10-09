# Portfolio Pilot — Frontend

React 19 + Vite + Tailwind 4 + React Router + Axios.

## Themes

- 🌟 **Aura** (default light): aurora gradient blobs, glass cards, violet→fuchsia→amber brand.
- 🌙 **Dark**: deep-space indigo with neon glow. Toggle in navbar, persisted (`pp_theme`, `data-theme` attr).

## Flow

`/ → /login /register → /dashboard (readiness ring + tips + stats) → /profile /projects
/skills /education /experience /certifications /achievements (generic CrudPage) →
/preview (edit slug → preview → publish) → /portfolio/:username (public, fires analytics)
→ /analytics`

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
