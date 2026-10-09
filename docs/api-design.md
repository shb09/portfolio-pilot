# API Design

Base: `/api` (dev proxied by Vite; prod via `VITE_API_URL`). Public portfolio + event ingest need no JWT.

## Auth

| Method & path | Auth | Success | Errors |
|---|---|---|---|
| POST `/api/auth/register` | no | 201 `{token, user}` | 409 taken, 400 validation |
| POST `/api/auth/login` | no | 200 `{token, user}` | 401 (same message for unknown email — no enumeration) |
| GET `/api/auth/me` | JWT | 200 user | 401 |

## Modules (profile, projects, skills, education, experience, certifications, achievements)

| Method & path | Success | Notes |
|---|---|---|
| GET `/api/{module}` | 200 list (mine, newest first) | scoped by JWT email |
| POST `/api/{module}` | 201 created | `@Valid`;PUT-semantics per module docs |
| GET `/api/{module}/{id}` | 200 | 404 covers missing + not-mine |
| PUT `/api/{module}/{id}` | 200 | full replace |
| DELETE `/api/{module}/{id}` | 204 | idempotent-ish: second delete → 404 |

Profile is special: `GET /api/profile` (404 until created) + `PUT /api/profile` (upsert).

## Dashboard

- GET `/api/dashboard/readiness` → `{score 0–100, breakdown[8 × {section,label,weight,earned,done}], recommendations[]}`
- GET `/api/dashboard/summary` → `{readiness, analytics}` (whole dashboard in one call)

## Portfolio & public

| Method & path | Auth | Notes |
|---|---|---|
| GET `/api/portfolio` | JWT | 404 until slug claimed |
| PUT `/api/portfolio` | JWT | `{username ^[a-z0-9-]{3,30}$, published, tagline}`; 409 slug taken |
| GET `/api/portfolio/preview` | JWT | my full assembly, published or not |
| GET `/portfolio/{username}` | no | 404 unless published; read-only assembly |

## Analytics

- POST `/api/analytics/event` (public) `{username, eventType, projectId?}` → 202; 404 unknown/unpublished slug; 400 project not on that portfolio
- GET `/api/analytics/summary` (JWT) → `{portfolioViews, projectClicks, githubClicks, resumeClicks, linkedinClicks, totalEvents}`

## Errors & codes

200 OK · 201 Created · 202 Accepted (event ingest) · 204 No Content (delete) ·
400 validation/malformed (incl. bad enum) · 401 JSON `{"error":"Unauthorized"}` ·
404 (missing, not-mine, unpublished) · 409 (email/slug taken) · 500 fallback.
