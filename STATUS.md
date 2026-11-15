# STATUS — Hilyoon

Last updated: **2026-11-15**. Update this file at the end of every working session
(what changed, what's deployed, what's pending). Rules and process: [`CLAUDE.md`](CLAUDE.md).

Legend: `[x]` done **and tested** · `[~]` in progress · `[ ]` to do · `[!]` blocked / needs a decision

## Where things stand

| Item | State |
|---|---|
| **hilyoon.com** | **LIVE since 2026-11-15 ~20:05** over HTTPS (Let's Encrypt, auto-renewed by Caddy; current cert valid to 2027-02-13) |
| Branches | `dev` e01e739 · `main` a75a446 · `pro` 45db63f — identical files |
| Production (`/opt/hilyoon` on 150.241.128.83) | images from pro d2c9579 + backup fix (same files as pro 45db63f apart from docs); 4 services healthy, ~150 MB RAM |
| PackNAI | release 411c0eb (shared Caddy: `import /etc/caddy/sites/*.caddy`, `web` network) deployed by its CI; packnai.com unaffected |
| DNS | `hilyoon.com` + `www` → 150.241.128.83; `mail.hilyoon.com` + MX unchanged → 51.15.184.145 |
| Admin user in production | `aqeel@hilyoon.com` (id 1, admin, active) created 2026-11-15 |

## Go-live checklist

- [x] Server prep: Docker network `web`, `/opt/hilyoon`, `/opt/caddy-sites`, 2 GB swap (persistent, swappiness 10)
- [x] Hilyoon stack built on the server and started; secrets generated in `/opt/hilyoon/.env` (mode 600)
- [x] Internal tests over the `web` network: 27/27
- [x] Daily backup produces real dumps (5.8 KB, 11 tables + 3 procedures); fix merged to `pro` (45db63f)
- [x] PackNAI change merged (PR #64 → `dev`, PR #65 → `main` 411c0eb), CI passed, auto-deployed; Caddy recreated with the sites mount + `web` network
- [x] DNS switched (email records untouched)
- [x] `/opt/caddy-sites/hilyoon.caddy` installed (validated against PackNAI's new Caddyfile first); certificates for hilyoon.com + www obtained automatically
- [x] **Live tests on https://hilyoon.com: 39/40 + browser 11/11** — certificate, http→https, www→apex, 3 languages, MedPredix, blog, sitemap, API + MariaDB, admin login (CSRF, no credentials), all private paths 404, `/api-test` 404, HSTS, no Server header; browser uses same-origin `/api`, no console errors; packnai.com healthy
- [x] PackNAI worktree removed (`feat/caddy-extra-sites` merged and deleted locally)
- [x] Production admin `aqeel@hilyoon.com` created (bcrypt hash stored). **Change its password after the first login**: the initial one was shared in a chat. Reset = same command, same email:
  `ssh -t -o ServerAliveInterval=20 -i "$env:USERPROFILE\.ssh\packnai_key" root@150.241.128.83 'read -rsp Password: HILYOON_ADMIN_PASSWORD; echo; export HILYOON_ADMIN_PASSWORD; cd /opt/hilyoon; docker compose -f docker-compose.prod.yml exec -e HILYOON_ADMIN_PASSWORD backend php scripts/create-admin.php aqeel@hilyoon.com Aqeel'`
- [ ] Minor: `/` redirects twice (`/` → `/en/` → `/en`); make the middleware redirect straight to `/en` (`frontend/src/middleware.ts`)
- [ ] Optional: AI blog cron (only with `OPENAI_API_KEY` set) — DEPLOY.md → Operations
- [ ] Optional: old server 51.15.184.145 still hosts the old site and **the email** — don't shut it down without moving mail first

## Done (all tested)

- [x] Backend API rebuilt: router `api/index.php`; `utils/auth.php` + models recreated to match the real DB schema; JSON responses + CORS (single header) — API suite 35/35
- [x] Frontend ↔ backend: blog, categories, search, post pages, sitemap all from the API; browser integration 15/15
- [x] Next.js 15 fixes: async `params`, single root `<html>`, lint/type clean, production build passes
- [x] Redesign (Markovate-inspired layout, original copy): AI engineering services; reviews and team sections removed
- [x] Dark brand theme: ink / aqua / gold + logo red (`ember`) labels and borders; official logo, favicon and Apple icon; Space Grotesk + IBM Plex Sans Arabic
- [x] Mobile: no horizontal overflow at 360 / 390 / 768 px (EN/AR, home/blog/post/projects)
- [x] Projects section + MedPredix page (en/ro/ar) from the Arabic product document
- [x] Safe Markdown renderer for blog posts (HTML escaped; `<script>` verified harmless)
- [x] Security: DB-backed admin login (CSRF, lockout, session regeneration), no seeded users, no built-in secrets (fail closed), cron needs `CRON_SECRET`, `/api-test` dev-only — security suite 21/21
- [x] Docker production setup + PackNAI-shared Caddy design; Caddy configs validated against PackNAI's real Caddyfile

## Decisions needed / open questions

- [!] **MedPredix prices**: page shows **$150 / $450** (Arabic doc, 2025-09-29); the older English doc says $99 / $299. Confirm which is current.
- [!] MedPredix desktop platforms: page says Windows + macOS (Arabic doc); English doc also lists Linux.
- [ ] Real MedPredix screenshots would replace the illustrative workspace mock.
- [ ] Hero demo figures (−65%, 70%, 98%) are labelled "Example workflow"; replace with real case-study numbers when available.
- [ ] Contact form opens the visitor's email app (no backend endpoint); a PHP endpoint that stores/emails inquiries would be better.
- [ ] Privacy policy / terms pages don't exist (links were removed rather than pointing nowhere).

## Known issues / local environment

- Docker Desktop on the dev PC hangs (engine doesn't respond; PC low on free RAM) → images are built on the server; `deploy/ship.sh` untested end-to-end.
- Local XAMPP DB still has the old seeded users (`admin@`, `editor@`, `viewer@hilyoon.com`) with the weak password `password`, and a test blog post "How RAG Grounds LLM Answers in Your Data" (`slug test-rag-post`). Local only; reset/delete when convenient.
- `frontend/src/components/blog/BlogPage.tsx`: one lint warning (missing `useEffect` deps); search fetches on every keystroke (add a debounce).
- `frontend/src/lib/blog/data.ts` still holds unused mock posts (only its types are used).
- The very first commit on `main`/`pro` history contains the old `admin123` / published keys; harmless now (the code rejects those exact values).

## Session log

| Date | What happened |
|---|---|
| 2026-11-15 | Ran the project locally; rebuilt the PHP API (missing `utils/` and `models/`); fixed truncated admin dashboard; connected the blog to the API; Next.js 15 fixes |
| 2026-11-15 | Markovate-inspired redesign for AI engineering; dark theme; official logo; MedPredix project page; logo-red accents |
| 2026-11-15 | Full test pass (76 checks) → pushed to GitHub with `main` / `pro` / `dev`; security fixes on `dev` |
| 2026-11-15 | Docker setup; server inspection; server prep + Hilyoon stack deployed (not public yet); backup bug found and fixed; PackNAI change pushed and merged into PackNAI `dev` |
| 2026-11-15 | PackNAI release 411c0eb deployed by its CI; DNS switched; **hilyoon.com live** with HTTPS; live tests 39/40 + browser 11/11; `main` → `pro` merged (45db63f) |
