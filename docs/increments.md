# Build Log

| Increment | Delivered | Verified |
|---|---|---|
| 1 | Backend scaffold: Java 21, Boot 3.2.5, layered packages, TiDB connection, `GET /api/health` + `/api/health/db`, stateless security, global error handler. Removed old scaffolds (`Backend/`, `backend_Portfolio/`, `Forntend/`, `learning/`). Created `portfolio_pilot` DB on TiDB Cloud (was missing → fixed). | verified 2026-10-05: compile OK, /health OK, /health/db OK |
| 2 | Auth: User entity (`users`, unique email, BCrypt hash), repository, DTOs + @Valid, JwtService (HS512), JwtAuthFilter, AuthService, AuthController (register 201 / login / me), JSON 401 entry point, ResponseStatusException handler. Caught + fixed: `/me` was under public `/api/auth/**` → rule ordering + null guard. | verified 2026-10-09: register 201, duplicate 409, validation 400, login 200, wrong-pw 401, unknown-email 401 (no enumeration), me 200/401/401 |
| 3 | Profile (1-to-1, GET + PUT upsert) + Projects + Skills CRUD with ownership template (`findByIdAndUserId` → 404 covers not-found + not-yours), SkillLevel enum (STRING), 400 handler for malformed JSON/enum. | verified 2026-10-09: profile 404→upsert 200, project CRUD 201/200/204/404, skill 201, bad enum 400, cross-user read/delete 404, unauth 401 |
| 4 | Education + Experience + Certifications + Achievements CRUD (same ownership template; YYYY-MM period validation). | verified 2026-10-09: 4×201, bad period 400 |
| 5 | Readiness engine: weighted 0-100 score + 8-section breakdown + rule-based recommendations; `GET /api/dashboard/readiness` + `/summary`. | verified: score 70 + 4 contextual tips on seeded data |
| 6 | Portfolio publish: slug claim (pattern + 409 on taken), publish flag, preview assembly, public `GET /portfolio/{username}` (404 unless published). | verified: 404→publish→200 full assembly |
| 7 | Analytics: insert-only events (5 types, plain projectId so history survives deletes), public 202 ingest, private summary. | verified: 202s counted in summary |
| 8 | React frontend (Vite, Tailwind, Router, Axios): landing → auth → dashboard → 7 CRUD sections → preview/publish → public portfolio → analytics → settings. | verified: build OK, routes + APIs tested live |
| 9 | Readiness unit tests (`ReadinessServiceTest`, mocked repos). | verified: 3/3 pass |
| 10 | Redesign 1: Midnight Emerald dark theme, editorial landing, sidebar shell, charts, motion. | verified: build + lint clean, APIs live |
| 11 | Redesign 2 (light): Warm Ivory `#F8F9F5` + Forest `#245C43` + Lime `#B8E986` system (emerald kept as optional dark); new landing headline + demo preview; recomposed dashboard (tint bands, lime-led action); grouped profile form; tech filter + featured flag on projects (backend: `featured` column, DTOs, service); editorial public portfolio (featured-first); forest/sage/lime analytics; Hikari hardening for TiDB idle timeouts. | verified 2026-10-09: build OK, lint 0 errors, mvn test 3/3, featured CRUD + public assembly live, readiness 85/70 recompute |
