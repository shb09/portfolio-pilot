# Deployment Guide — Portfolio Pilot

## Architecture recap

```
Browser (React SPA)
  → Spring Boot API (JWT, :8080) → TiDB Cloud
```

## Required environment variables

### Backend

| Variable | Purpose | Example |
|---|---|---|
| `TIDB_URL` | JDBC URL (TLS on) | `jdbc:mysql://<host>:4000/portfolio_pilot?sslMode=VERIFY_IDENTITY&serverTimezone=UTC` |
| `TIDB_USER` / `TIDB_PASSWORD` | TiDB credentials | — |
| `JWT_SECRET` | HMAC key, **≥32 chars**, unique per env | `openssl rand -hex 48` |
| `APP_BASE_URL` | Public URL used in email links (**never localhost in prod**) | `https://app.example.com` |
| `SPRING_MAIL_HOST` / `SPRING_MAIL_PORT` | SMTP server | `smtp.gmail.com` / `587` |
| `SPRING_MAIL_USERNAME` / `SPRING_MAIL_PASSWORD` | SMTP credentials (app password, not login) | — |
| `SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH` | SMTP auth flag | `true` |
| `SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE` | STARTTLS flag | `true` |
| `APP_MAIL_FROM` | Sender shown to users | `Portfolio Pilot <no-reply@example.com>` |
| `APP_ADMIN_EMAIL` / `APP_ADMIN_USERNAME` / `APP_ADMIN_PASSWORD` | One-time admin bootstrap (blank password = skipped) | — |
| `APP_AUTH_DEV_MODE` | Local testing only (**must be `false`/unset in prod**) | `false` |

### Frontend (build-time)

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend origin, e.g. `https://api.example.com` |
| `VITE_PUBLIC_URL` | Prefix for `/portfolio/*` if served separately (usually same as above or empty with proxy) |

Backend CORS: set `app.cors.allowed-origins` (currently only in code default `http://localhost:5173`;
pass `--app.cors.allowed-origins=https://app.example.com` or env if wired) to the frontend origin.

## Deployment checklist

- [ ] TiDB database `portfolio_pilot` exists; app has least-privilege credentials.
- [ ] `JWT_SECRET` unique, ≥32 chars, stored in the platform secret manager.
- [ ] `APP_BASE_URL` is the real https origin (verification/reset links depend on it).
- [ ] SMTP configured + test registration delivers mail; `APP_AUTH_DEV_MODE` is **unset/false**.
- [ ] Admin bootstrapped via env, then **rotate the initial password** and unset `APP_ADMIN_PASSWORD`.
- [ ] Frontend built with `VITE_API_URL`; SPA fallback (rewrite → `/index.html`) configured on the host.
- [ ] CORS allowlist = frontend origin only (no `*` with credentials).
- [ ] No `.env` files, keystores, or passwords committed (`.gitignore` covers `.env`).
- [ ] Logs contain no passwords/tokens (verified: grep-clean).
- [ ] Health check: `GET /api/health` (add `/api/health/db` for DB-aware probes).
- [ ] `ddl-auto=update` is a learning-mode convenience; adopt `validate` + reviewed migrations for prod.

## Local development

```bash
# backend (:8080) — dev mode enables verification testing without SMTP
cd backend
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home  # Mockito needs JDK 21
APP_AUTH_DEV_MODE=true \
APP_ADMIN_EMAIL='shb64178@gmail.com' APP_ADMIN_USERNAME='admin' APP_ADMIN_PASSWORD='qwerty@123456' \
mvn spring-boot:run

# frontend (:5173, /api proxied to :8080)
cd frontend && npm install && npm run dev
```

Test accounts (local TiDB): `admin`/`qwerty@123456` (ADMIN, rotate before any public exposure),
`student@test.com`/`password123` (USER). Register → verify (dev token in response) → login.

## Known limitations

- No browser in this environment: pixel-level theme/layout checks need one real-browser pass.
- Expired-JWT rejection shares the tested tampered-token path (`JwtException` → 401); no dedicated
  expired-token live test was run (tokens live 24h).
- Rate limiter is in-memory (single instance); use a shared store when scaling horizontally.
- SMTP was unavailable here: verification/reset flows were tested end-to-end in dev mode
  (raw token in response); real delivery needs provider credentials per the table above.
