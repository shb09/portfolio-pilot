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
| 8 | React frontend | planned |
| 9 | Testing, docs, deployment, viva prep | planned |
