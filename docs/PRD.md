# Portfolio Pilot — Product Requirements Document (PRD)

> **Tagline:** Build your profile. Track your progress. Launch your career story.
> **Type:** College TT project (faculty-evaluated, viva + demo)
> **Stack (locked):** Java 21 · Spring Boot · Spring Data JPA/Hibernate · Spring Security + JWT + BCrypt · Maven · **TiDB ONLY** (MySQL-compatible) · React + Vite + Tailwind + Router + Axios

## 1. Problem & Users

**Users:** college students, fresh graduates, early-career developers.
**Problem:** career data (projects, skills, certificates, achievements, education, internships, GitHub, resume) is scattered. No single structured profile, no sense of "how ready am I?", no shareable professional link, no feedback loop.

## 2. Product Vision

**Portfolio Pilot is a career-profile operating system.** It consolidates scattered data, scores profile readiness with backend rules, recommends next actions, publishes a public portfolio, and tracks engagement. It is NOT a generic CRUD app.

**Differentiators (must demo):**
1. **Readiness Engine** — backend-calculated score (never in React).
2. **Actionable recommendations** — rule-based `if` logic, explicitly NOT AI/LLM.
3. **Publish + public portfolio + analytics** — `/portfolio/{username}` + event tracking.

## 3. Core User Journey (happy path)

```
REGISTER → CREATE PROFILE → ADD SKILLS → ADD PROJECTS → ADD EDUCATION →
ADD EXPERIENCE → ADD CERTIFICATIONS → ADD ACHIEVEMENTS →
READINESS SCORE → PREVIEW → PUBLISH → SHARE PUBLIC LINK → VIEW ANALYTICS
```

Dashboard answers: **"How ready is my professional profile?"** — readiness %, per-section checklist (✓/⚠), next-best-actions from real rules.

## 4. Functional Requirements

| ID | Feature | Key rules |
|---|---|---|
| F1 | Registration / Login (JWT) | email unique, BCrypt hash, JWT on login, protected APIs |
| F2 | Profile | 1-to-1 with user: headline, about, github, linkedin, resume_url, location |
| F3–F8 | Skills, Projects, Education, Experience, Certifications, Achievements | CRUD, each row owned by one user (`user_id` FK), users see only their own |
| F9 | Readiness score | Weighted: Profile 15, About 10, Skills 15, Projects 20, Education 10, Experience 15, Certs 5, Achievements 10. Backend computes from real counts |
| F10 | Recommendations | Rules e.g. `projects==0 → "Add your first project"`, `skills<5 → "Add more skills"`, `github missing → "Connect GitHub"` |
| F11 | Portfolio publish | 1 row/user: unique username slug, `published` flag. Flow Edit → Preview → Publish. Public page: hero, about, skills, projects, experience, education, certs, achievements, contact |
| F12 | Public portfolio | `GET /portfolio/{username}` — only if published, read-only |
| F13 | Analytics | Events: PORTFOLIO_VIEW, PROJECT_CLICK, GITHUB_CLICK, RESUME_CLICK, LINKEDIN_CLICK. Insert-only, no sensitive data. Dashboard shows counts |
| F14 | Dashboard | readiness + breakdown + recommendations + analytics summary |
| F15 | Frontend pages | /login /register /dashboard /profile /projects /skills /education /experience /certifications /achievements /portfolio/preview /analytics /portfolio/{username} |

**Explicit non-goals:** no AI/LLM, no notifications/likes, no second database, no score calculation in React.

## 5. Non-Functional Requirements

- Layered backend: Controller → Service → Repository → JPA → TiDB. Business logic in services, DTOs + `@Valid` on APIs, global exception handler with proper status codes (200/201/400/401/403/404).
- Validation + error handling on every write API.
- Public routes fast + read-only; private routes JWT-protected.
- Explainability: every table, FK, annotation, endpoint defensible in viva.

## 6. Data Design (summary; full ER in docs/database-design.md)

Tables: `users, profiles, projects, skills, education, experience, certifications, achievements, portfolios, analytics_events`.
- Every child: `user_id BIGINT NOT NULL, FK → users(id) ON DELETE CASCADE` + index.
- `users.email` unique; `portfolios.username` unique; `portfolios.published` boolean.
- `analytics_events`: append-only (owner_user_id, event_type, project_id nullable, created_at indexed).

## 7. API Summary (full contract in docs/api-design.md)

```
POST /api/auth/register · POST /api/auth/login · GET /api/auth/me
CRUD: /api/profile /api/projects /api/skills /api/education /api/experience /api/certifications /api/achievements
GET  /api/dashboard/readiness   → { score, breakdown, recommendations }
GET  /api/dashboard/summary     → readiness + analytics counts
GET  /api/portfolio/preview     (auth, my data assembled)
POST /api/portfolio/publish     (auth, sets published=true)
GET  /portfolio/{username}      (public, 404 if unpublished)
POST /api/analytics/event       (public, minimal body)
GET  /api/analytics/summary     (auth, my counts)
GET  /api/health                (public, uptime probe)
```

## 8. Security

BCrypt password hashing · JWT (Authorization: Bearer) via security filter · protected endpoints · ownership checks (403 if not yours) · validation · no password/entity leakage (DTOs) · public endpoints limited to published data + event ingest.

## 9. Build Plan (increments — we build in this order, each verified before next)

1. ✅ **Inc 1 (this step):** backend scaffold — Java 21, Maven, TiDB connection, layered packages, `GET /api/health`, security permits health. Compiles + runs.
2. **Inc 2:** Auth — User entity, repo, DTOs, JWT service/filter, register/login/me, BCrypt, ownership-ready security.
3. **Inc 3:** Profile + Projects + Skills CRUD (the template all modules copy).
4. **Inc 4:** Education + Experience + Certifications + Achievements CRUD.
5. **Inc 5:** Readiness engine + recommendations (service, tested).
6. **Inc 6:** Portfolio publish + public page API.
7. **Inc 7:** Analytics ingest + summary.
8. **Inc 8:** React frontend (auth, dashboard, CRUD pages, preview, public, analytics).
9. **Inc 9:** Testing, docs (architecture/database/api/security), deployment notes, viva prep.

## 10. Definition of Done

Backend + frontend + TiDB persistence work; auth/authz enforced; validation + error handling; publishing + readiness + recommendations + analytics live; key flows tested; docs match implementation; student can explain what → why → how for every feature end-to-end (React → Controller → Service → JPA → TiDB, security, business rules).

## 11. Risks / Decisions log

- Old scaffolds removed (mixed `Backend/`, `backend_Portfolio/`, typo `Forntend/`, Boot 4.x/Java 17, malformed JDBC URL, empty JWT secret). Clean `backend/` + `frontend/` recreated — Boot 3.2.x + Java 21.
- `ddl-auto=update` for learning increments; document `validate`/migrations as production path.
- TiDB credentials via env vars (`TIDB_*`), never hardcode real secrets in git.
