<div align="center">

# ◈ Portfolio Pilot

### Build your profile. Track your progress. Launch your career story.

_A career-profile operating system for students & early-career developers — not another CRUD demo._

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![TiDB](https://img.shields.io/badge/TiDB-Cloud-FF5A5A?style=for-the-badge&logo=mysql&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)

[Features](#-why-its-not-just-crud) · [Quickstart](#-quickstart) · [API](#-api-at-a-glance) · [Docs](./docs/PRD.md) · [Live flow](#-the-journey)

</div>

---

## 🎯 The problem

Projects on GitHub. Skills in your head. Certificates in email. Resume versions everywhere.
**Portfolio Pilot pulls it all into one structured profile** — then tells you what's missing,
scores how ready you look, and gives you a public link to prove it.

## ✨ Why it's not just CRUD

| | Generic student app | **Portfolio Pilot** |
|---|---|---|
| Score | static "80% complete" | **◈ Backend-calculated readiness engine** — 8 weighted sections from live data |
| Guidance | none | **➤ Rule-based next best actions** ("Add 2 more skills…") — transparent, no fake AI |
| Sharing | admin table | **🚀 Publish → `/portfolio/{you}`** — a real public developer portfolio |
| Feedback | none | **📈 Engagement analytics** — views, project/GitHub/resume/LinkedIn clicks |
| Security | none | **🔐 JWT + BCrypt + ownership-scoped queries** (cross-user access → 404) |

## 🛠 Stack

**Backend** — Java 21 · Spring Boot 3.2 · Spring Web / Data JPA / Security / Validation · Hibernate ·
JWT (JJWT) + BCrypt · Maven · **TiDB Cloud only** (MySQL-compatible)

**Frontend** — React 19 + Vite · Tailwind CSS 4 · React Router · Axios

**Design** — ☀ **Warm Ivory** light theme (ivory `#F8F9F5`, forest `#245C43` actions,
lime `#B8E986` highlights) + optional 🌙 Midnight Emerald dark mode, one-tap toggle,
persisted. Sidebar workspace, readiness ring, timelines, skill dots, featured projects,
editorial public portfolio, Framer Motion micro-interactions (reduced-motion aware).

## 🚀 Quickstart

### Backend

```bash
cd backend
# point at your TiDB Cloud cluster (or export TIDB_URL / TIDB_USER / TIDB_PASSWORD)
mvn spring-boot:run
curl http://localhost:8080/api/health   # {"status":"OK",...}
```

> First boot auto-creates all 10 tables (`users, profiles, projects, skills, education,
> experience, certifications, achievements, portfolios, analytics_events`).

### Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173 (API proxied to :8080)
```

Production: `VITE_API_URL=https://your-api` + `app.cors.allowed-origins=https://your-app`.

## 🧭 The journey

```
Register → Profile → Skills → Projects → Education → Experience
  → Certifications → Achievements → ◈ Readiness score → Preview
  → 🚀 Publish → Share /portfolio/{you} → 📈 Analytics
```

The **dashboard** answers one question: _"How ready is my professional profile?"_ —
readiness ring, per-section checklist, next best actions, engagement stats.

## 🔌 API at a glance

```
POST /api/auth/register · POST /api/auth/login · GET /api/auth/me
GET/POST /api/{profile,projects,skills,education,experience,certifications,achievements}[/{id}]
GET  /api/dashboard/readiness · GET /api/dashboard/summary
GET+PUT /api/portfolio · GET /api/portfolio/preview · GET /portfolio/{username}  (public)
POST /api/analytics/event (public, 202) · GET /api/analytics/summary
```

Full contract: [`docs/api-design.md`](./docs/api-design.md) · Architecture: [`docs/architecture.md`](./docs/architecture.md) ·
Database: [`docs/database-design.md`](./docs/database-design.md) · Security: [`docs/security.md`](./docs/security.md) ·
Flow: [`docs/application-flow.md`](./docs/application-flow.md) · Build log: [`docs/increments.md`](./docs/increments.md)

## 📁 Structure

```
backend/   Spring Boot API (controller → service → repository → TiDB)
frontend/  React SPA (aura + dark themes, dashboard → publish → public portfolio)
docs/      PRD, architecture, database, API, security, flow, build log
```

---

<div align="center">

**◈ Portfolio Pilot** — _your career story, scored, published, and tracked._

Built as a learning-first college project. Every layer explainable end-to-end.

</div>
