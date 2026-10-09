# Security

## Passwords

- BCrypt (`BCryptPasswordEncoder`, random salt per password). DB holds `$2a$…` hashes, never plaintext.
- `password_hash` never serialized: responses use `UserDto(id, name, email)`.

## Tokens

- JWT on register/login (subject = email, HMAC-signed, 24h expiry via `app.jwt.expiration-ms`).
- Secret from `app.jwt.secret` (env `JWT_SECRET`); startup fails fast if < 32 chars.
- Per request, `JwtAuthFilter` validates `Authorization: Bearer …` and sets a `ROLE_USER`
  authentication; tampered/expired/unknown-user tokens → request stays anonymous → 401.

## Routes

- Stateless sessions, CSRF off (token API, no cookies), HTTP Basic + form login off.
- Public: `/api/health*`, `/api/auth/**` (except `/me`), `GET /portfolio/**`,
  `POST /api/analytics/event`. Everything else needs JWT; unauthenticated → JSON 401.
- Ownership: services resolve the owner from the JWT email and scope every query
  (`findByIdAndUserId`); cross-user access → 404, never 403-with-data.

## Input & transport

- Bean Validation on every write DTO (`@Email`, `@NotBlank`, `@Pattern` for slugs/periods);
  malformed JSON (e.g. bad enum) → 400, not 500.
- Login errors use one message for bad email and bad password (no user enumeration).
- TiDB over TLS (`sslMode=VERIFY_IDENTITY`); credentials via `TIDB_*` env vars, never committed
  (`.gitignore` covers `.env`; rotate the dev password that shipped in early scaffolds).
- CORS allowlist (`app.cors.allowed-origins`, default `http://localhost:5173`).
