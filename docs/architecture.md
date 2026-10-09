# Architecture

> Controller → Service → Repository → JPA/Hibernate → TiDB. React talks REST+JWT.

```
React (Vite + Tailwind + Router + Axios)
  │  REST JSON, Authorization: Bearer <jwt>   (dev: vite proxy, prod: VITE_API_URL)
  ▼
Spring Boot 3.2.5 (Java 21)
  ├─ controller/  HTTP only: routes, status codes, @Valid, DTOs, Authentication → email
  ├─ service/     Business logic: auth rules, ownership, readiness score,
  │               recommendations, publish rules, analytics (@Transactional writes)
  ├─ repository/  JpaRepository interfaces (Spring generates impl);
  │               derived queries like findByIdAndUserId enforce ownership in SQL
  ├─ entity/      @Entity = TiDB table; @ManyToOne user_id FK; @OneToOne unique user_id
  ├─ dto/         API contracts (records) + Bean Validation; entities never leak
  │               (password_hash never leaves the server)
  ├─ security/    JwtService (HMAC) + JwtAuthFilter (fills SecurityContext per request)
  ├─ config/      SecurityConfig (stateless, JSON 401, route rules), CorsConfig
  └─ exception/   GlobalExceptionHandler: 400 validation/malformed, 404/409/401 via
                  ResponseStatusException, 500 fallback
  ▼
TiDB Cloud (MySQL-compatible, mysql-connector-j, port 4000, TLS)
```

## Request walks (viva-ready)

**POST /api/projects + JWT:** DispatcherServlet → Security chain (CORS → JwtAuthFilter
validates token → entry point 401 if bad) → ProjectController (DTO, @Valid) →
ProjectService (resolve owner, apply, save) → ProjectRepository (Hibernate INSERT with
user_id) → 201 + ProjectDto.

**GET /portfolio/{u} (public):** no JWT → PublicPortfolioController → PortfolioService
(slug must exist AND published=true, else 404) → assemble profile+6 collections → JSON.
Frontend fires POST /api/analytics/event (fire-and-forget, 202).

**GET /api/dashboard/summary:** ReadinessService (8 COUNT queries + rules → 0–100) +
AnalyticsService (counts by type) → one JSON for the whole dashboard.

## Layer rules

- Controllers never contain scoring/ownership math; services never touch HTTP.
- Cross-user access returns **404** (not 403) — never leaks other users' IDs.
- Frontend never calculates the score; it renders what the backend returns.
- `ddl-auto=update` is the learning-mode schema sync; production path is `validate` + migrations.
