# Database Design (TiDB — the only database)

MySQL-compatible: `mysql-connector-j`, MySQL dialect, standard SQL + FK constraints.

## Tables

| Table | Why its own table | Relation |
|---|---|---|
| `users` | identity + auth (email unique, BCrypt hash) | parent of all |
| `profiles` | 1-to-1 bio (headline/about/links); keeps auth slim | 1–1 → users (unique user_id) |
| `projects` | N per user (title/desc/tech/links); feeds score + public page | N–1 → users |
| `skills` | N per user + level enum; countable for scoring | N–1 → users |
| `education` | repeatable degrees | N–1 → users |
| `experience` | repeatable roles | N–1 → users |
| `certifications` | repeatable credentials | N–1 → users |
| `achievements` | repeatable wins | N–1 → users |
| `portfolios` | publish state: unique slug + published flag + tagline | 1–1 → users |
| `analytics_events` | append-only log (owner, type, optional project_id, time) | N–1 → users |

## Constraints & viva answers

- **Why `user_id` FK?** Ownership + cascade scope: every query is `WHERE user_id = ?`.
- **Why Skill separated?** N skills per user; must be queryable/countable (readiness counts them).
- **Why `published` flag + unique username?** Draft vs live separation; slug is the public address.
- **Why AnalyticsEvent?** Engagement feedback loop; insert-only (never updated).
- **Why `project_id` has NO FK?** Events must survive project deletion (history > referential strictness).
- **User deleted?** `ON DELETE CASCADE` (Hibernate default via FK): profile, modules, portfolio,
  events go with the user. No orphans.
- **Indexes:** `(user_id)` on every child; `(username)` unique; `(owner_user_id, event_type, created_at)`
  for dashboard counts. Skill level stored as `STRING` (immune to enum reordering).

## Schema sync

Entities are the source of truth; Hibernate `update` creates/alters tables (see SQL with
`show-sql=true`). First boot created: users, profiles, projects, skills, education,
experience, certifications, achievements, portfolios, analytics_events.
