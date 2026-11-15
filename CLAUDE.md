# CLAUDE.md — Hilyoon (hilyoon.com)

Rules and process for anyone (human or AI) working on this repo. Current state and open
tasks live in [`STATUS.md`](STATUS.md); deployment details in [`DEPLOY.md`](DEPLOY.md).
Update `STATUS.md` at the end of every working session.

## 1. What this is

Hilyoon is an **AI engineering company** site: services, industries, projects (MedPredix),
blog, contact. Three languages: **en, ro, ar** (Arabic is right-to-left).

| Part | Tech | Path |
|---|---|---|
| Website | Next.js 15 (App Router), TypeScript, Tailwind 3 | `frontend/` |
| API + admin panel | PHP 8.2, PDO/MySQL, no framework | `backend/` |
| Database | MariaDB 11.4 (prod) / MySQL in XAMPP (local) | `backend/sql/hilyoon.sql` |
| Production | Docker Compose next to PackNAI on one VPS | `docker-compose.prod.yml`, `deploy/` |

Key files:
- All homepage/nav/footer copy: `frontend/src/content/home.ts`. Projects: `frontend/src/content/projects.ts`.
  Copy changes never touch components; every string exists in all 3 languages.
- API router: `backend/api/index.php`. Shared helpers (responses, CORS, validation, JWT,
  config, secrets): `backend/utils/auth.php`. Models: `backend/models/`.
- Brand: colors `ink` / `aqua` (actions) / `gold` (highlights) / `ember` (logo red: labels,
  borders, lines) in `frontend/tailwind.config.js`; shared styles in `frontend/src/app/globals.css`;
  logo `frontend/public/brand/hilyoon-mark.png` via `components/brand/Logo.tsx`.

## 2. Git workflow

- Repo: `https://github.com/aqeelit/hilyoon-dev`. Branches: **`dev`** (work) → **`main`**
  (stable) → **`pro`** (what runs in production). Always in that order; **never `dev` → `pro`
  directly** (it caused the "Title can't be blank" PR error once).
- Small commits with a clear subject (`feat:`, `fix:`, `docs:`, `security:` …). Commits made by
  Claude end with the `Co-Authored-By` line.
- Never commit secrets: `backend/config/env.php`, `.env`, `frontend/.env.local` are git-ignored.
  Check `git diff --cached --name-only` before committing.
- `.gitattributes` forces LF for files that run on Linux (`*.sh`, `*.php`, Dockerfiles, YAML,
  Caddy). Don't remove it — CRLF breaks shell scripts on the server.

## 3. Local development (Windows + XAMPP)

- **Backend runs from XAMPP's copy**, not from this repo: `C:\xampp\htdocs\hilyoon-backend`.
  After editing `backend/`, sync it: `cp -r backend/. /c/xampp/htdocs/hilyoon-backend/`
  (Git Bash), then verify with `diff -rq backend /c/xampp/htdocs/hilyoon-backend -x package-lock.json -x logs`.
- Backend config: `backend/config/env.php` (git-ignored, copy of `config/env.example.php`) with
  `APP_ENV=development`, `JWT_SECRET`, `CRON_SECRET` (64-hex each). Without valid secrets the API
  answers 500 "Server is not configured" — by design.
- Frontend: `cd frontend && npm run dev` → http://localhost:3000 (`frontend/.env.local` points
  the API to `http://localhost/hilyoon-backend/api`).
- Admin panel: http://localhost/hilyoon-backend/admin/ — users come from the database.
  Create/reset an admin: `HILYOON_ADMIN_PASSWORD='...' php backend/scripts/create-admin.php you@hilyoon.com "Name"`.

## 4. Before every commit (tests)

Frontend (from `frontend/`):
```bash
npx tsc --noEmit && npx next lint && npm run build
```
Backend (repo root): `for f in $(find backend -name '*.php'); do php -l "$f" >/dev/null || echo "FAIL $f"; done`

Then smoke-test what you touched against the running app (XAMPP + `npm run start` on the
build): API status/blog/auth/admin routes return the expected codes, pages render in all
3 languages, no browser console errors, no horizontal overflow at 360/390/768 px.
Report failures honestly; never mark something done that wasn't tested.

## 5. Security rules (do not regress)

- **No default credentials anywhere** (code, SQL seed, docs, pages). The schema creates no users;
  admins are created with `backend/scripts/create-admin.php` (CLI only).
- **No built-in secrets.** `requireSecret()` in `utils/auth.php` refuses missing, short (<32),
  or previously published values. `APP_ENV` defaults to `production`.
- Admin panel login: DB + bcrypt, admin role only, CSRF token, session regeneration, lockout
  after 5 failures. Keep it that way.
- Blog Markdown is rendered by `frontend/src/components/blog/markdown.ts`, which escapes all HTML
  first. Never inject API content with raw `dangerouslySetInnerHTML`.
- Blog automation (OpenAI, costs money) runs only from the CLI or with `CRON_SECRET`.
- `/api-test` and `test-admin.php` are development-only.
- Never print, log or paste secret values (server `.env`, tokens, passwords) in chat or commits.

## 6. Content rules

- Don't invent business facts: client names, case-study numbers, certifications, prices,
  phone numbers, addresses. Illustrative figures must be labelled (e.g. "Example workflow").
- Don't copy other companies' text, logos or images (the design was inspired by markovate.com,
  copy is original).
- Medical claims (MedPredix) are "as reported" and keep the clinical-judgment disclaimer.
- New copy goes into `content/*.ts` in en, ro and ar; check Arabic RTL rendering.

## 7. Production

Server: `root@150.241.128.83` (Ubuntu 24.04, 2 vCPU, 3.8 GB RAM + 2 GB swap), SSH key
`~/.ssh/packnai_key`. **Shared with PackNAI** (`/opt/packnai`, repo `aqeelit/milmar-dev`).

- Hilyoon lives in `/opt/hilyoon` (compose project `hilyoon`; secrets in `/opt/hilyoon/.env`,
  mode 600, never leaves the server). Deployed commit is in `/opt/hilyoon/DEPLOYED_COMMIT`.
- **PackNAI's Caddy** owns 80/443 and serves hilyoon.com from `/opt/caddy-sites/hilyoon.caddy`
  over the external Docker network `web`.
- **Never touch PackNAI's containers, volumes, `.env` or repo checkout on the server.** Changes to
  PackNAI go through its own repo and rules (feature branch → `dev` → reviewed PR → `main` →
  automatic deploy; see its `CLAUDE.md`). Don't run `docker system prune` there.
- Memory caps (frontend 384M, backend 256M, db 512M, backup 128M) protect PackNAI. Keep them.
- Only `/api`, `/admin`, `/images/blog` reach PHP; Apache also denies config/sql/scripts/logs.

### Deploy procedure (what actually works today)

Docker Desktop on the dev PC is not usable, so images are **built on the server** (fine since
the 2 GB swap was added). `deploy/ship.sh` (build locally, ship images) exists but has not been
run end-to-end yet. From Git Bash, repo root, after `pro` is updated and pushed:

```bash
KEY=~/.ssh/packnai_key; SRV=root@150.241.128.83
git fetch -q origin && SHA=$(git rev-parse --short origin/pro)
# 1. upload exactly the pro commit (never the working tree)
git archive --format=tar origin/pro | gzip | ssh -i $KEY $SRV "cd /opt/hilyoon && gunzip | tar -xf - && echo $SHA > DEPLOYED_COMMIT"
# 2. build + start (≈2 min build; PackNAI keeps running)
ssh -i $KEY $SRV 'cd /opt/hilyoon && export HILYOON_TAG=$(cat DEPLOYED_COMMIT) \
  && sed -i "s/^HILYOON_TAG=.*/HILYOON_TAG=$HILYOON_TAG/" .env \
  && docker compose -f docker-compose.prod.yml up -d --build && docker compose -f docker-compose.prod.yml ps'
# 3. if deploy/caddy/hilyoon.caddy changed: install, validate, graceful reload
ssh -i $KEY $SRV 'cp /opt/hilyoon/deploy/caddy/hilyoon.caddy /opt/caddy-sites/ \
  && docker exec packnai-caddy-1 caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile \
  && docker exec packnai-caddy-1 caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile'
```
Then verify: all Hilyoon services healthy, PackNAI containers healthy, `https://hilyoon.com`
and `https://packnai.com/health` answer 200. Rollback: set `HILYOON_TAG` in `/opt/hilyoon/.env`
to the previous commit (old images stay on the server) and `docker compose ... up -d`.

Operations (logs, backups, restore, AI cron): see `DEPLOY.md` → Operations.

## 8. Gotchas learned the hard way

- **Git Bash** rewrites `branch:path` and `/paths` in arguments → prefix with `MSYS_NO_PATHCONV=1`.
- **Windows PowerShell 5.1** has no `&&`; run server commands as one quoted string through
  `ssh ... '<commands>'`, or inside an SSH session. Use `ssh -t -o ServerAliveInterval=20` for
  interactive commands (the connection drops otherwise).
- In `ssh ... 'bash -s' <<EOF` scripts, `docker compose exec` (even `-T`) **eats the rest of the
  script from stdin** → add `</dev/null` to every `exec`.
- PHP Docker images leave `$_ENV` empty → read settings with `getenv()` (already done in
  `dbSetting()` / `config()`).
- `mariadb-dump` 11.4 needs `--skip-ssl` inside Docker and reads `MYSQL_PWD` (not `MARIADB_PWD`);
  always verify a backup has `CREATE TABLE` in it — a pipe hides dump failures.
- Headless Chrome/Edge can't go narrower than ~500 px; test mobile with DevTools emulation
  (device metrics), not `--window-size`.
- PackNAI's Caddyfile is a single-file bind mount: edits to it only apply after the container is
  recreated (PackNAI's deploy script does this). Hilyoon's site file is in a mounted folder, so a
  `caddy reload` is enough.
- The `/opt/hilyoon` checkout has no `.git`; it's a `git archive` of `pro`. Don't edit files there
  except as an emergency hotfix, and then commit the same change to `dev` immediately.
