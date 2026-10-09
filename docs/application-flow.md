# Application Flow

## The journey (and which API powers each step)

```
REGISTER (POST /api/auth/register → token in localStorage)
   ↓ CREATE PROFILE (PUT /api/profile — upsert)
   ↓ ADD SKILLS / PROJECTS / EDUCATION / EXPERIENCE / CERTIFICATIONS / ACHIEVEMENTS
   │    (POST /api/{module} → 201; generic CrudPage per module)
   ↓ PORTFOLIO READINESS (GET /api/dashboard/summary → ring + bars + tips)
   ↓ PREVIEW (GET /api/portfolio/preview — same assembly as public)
   ↓ PUBLISH (PUT /api/portfolio {username, published:true} → slug claimed)
   ↓ SHARE (/portfolio/{username} — public page, no login)
   ↓ ANALYTICS (visitor clicks → POST /api/analytics/event → owner sees /analytics)
```

## Page map (frontend routes)

`/ → landing · /login · /register · /dashboard · /profile · /projects · /skills ·
/education · /experience · /certifications · /achievements · /preview ·
/analytics · /portfolio/:username (public)`

## Event flow (click → dashboard number)

```
Visitor clicks GitHub on a public page
  → PublicView onEvent → POST /api/analytics/event {username, GITHUB_CLICK}
  → AnalyticsService resolves owner via published slug → INSERT analytics_events → 202
  → Owner opens /analytics → GET /api/analytics/summary → counts by type
```

## State ownership

- Server: users, content, score, publish state, events (TiDB).
- Browser: JWT + user chip (localStorage), theme choice (`aura`/`dark`).
  No business state in React — readiness, recommendations, assembly all come from APIs.
