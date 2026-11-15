# Deploying Hilyoon (next to PackNAI)

Hilyoon runs on the PackNAI VPS (`150.241.128.83`, Ubuntu 24.04, 2 vCPU, 3.8 GB RAM, no swap)
as its own Docker Compose project in `/opt/hilyoon`. PackNAI's Caddy keeps ports 80/443 and
serves both sites with automatic HTTPS.

```
                    ┌──────────────── PackNAI's Caddy (80/443) ────────────────┐
  packnai.com  ───► │ reverse_proxy web:8000              (packnai_default net) │
  hilyoon.com  ───► │ /api/*, /admin/*, /images/blog/*  → hilyoon-backend:80   │
                    │ everything else                   → hilyoon-frontend:3000│
                    └───────────────────────────── shared "web" network ───────┘
  hilyoon stack:  frontend (Next.js, 384 MB cap) · backend (PHP 8.2/Apache, 256 MB)
                  db (MariaDB 11.4, 512 MB, private network only) · backup (daily dump, keep 7)
```

Expected memory use of the Hilyoon stack is ~0.5–0.7 GB; PackNAI uses ~0.35 GB.

Only `/api`, `/admin` and `/images/blog` reach PHP. Config, SQL, scripts, logs and the
automation scripts are never exposed (Caddy routing + Apache deny rules).

## One-time setup

### 1. PackNAI repo change (lets its Caddy serve extra sites)

Make the three small edits in [`deploy/packnai/README.md`](deploy/packnai/README.md) **in the
PackNAI repository** and deploy PackNAI as usual. Before that deploy, on the server:

```bash
docker network create web
mkdir -p /opt/caddy-sites /opt/hilyoon
```

Recreating PackNAI's Caddy causes a few seconds of downtime for packnai.com; do it at a quiet time.

### 2. Server secrets (`/opt/hilyoon/.env`)

```bash
cd /opt/hilyoon
cat > .env <<EOF
DOMAIN=hilyoon.com
DB_PASSWORD=$(openssl rand -hex 24)
DB_ROOT_PASSWORD=$(openssl rand -hex 24)
JWT_SECRET=$(openssl rand -hex 32)
CRON_SECRET=$(openssl rand -hex 32)
OPENAI_API_KEY=
HILYOON_TAG=latest
EOF
chmod 600 .env
```

`.env` never leaves the server and is never committed. See `.env.prod.example`.

## Deploy (from your PC)

Requires Docker Desktop running and the SSH key at `~/.ssh/packnai_key`. In Git Bash, from
the repo root on a clean, committed working tree:

```bash
./deploy/ship.sh
```

It builds both images locally (the server has too little RAM to build Next.js), uploads them
over SSH, uploads the compose file, Caddy site and schema, starts the stack, installs
`/opt/caddy-sites/hilyoon.caddy`, validates the Caddy config and reloads Caddy without downtime.
Images are tagged with the git commit, so every release can be rolled back.

### First deploy only: create the admin

The database starts empty (no default users):

```bash
ssh -i ~/.ssh/packnai_key root@150.241.128.83
cd /opt/hilyoon
docker compose -f docker-compose.prod.yml exec backend php scripts/create-admin.php you@hilyoon.com "Your Name"
```

### Check it before switching DNS

HTTPS certificates can only be issued once DNS points at the server, so test from the server:

```bash
docker run --rm --network web curlimages/curl -s -o /dev/null -w "%{http_code}\n" http://hilyoon-frontend:3000/en
docker run --rm --network web curlimages/curl -s http://hilyoon-backend/api/status
```

## Switch DNS

At the DNS provider for hilyoon.com (a day before, lower the TTL to 300):

| Record | Change to |
|---|---|
| `hilyoon.com` A | `150.241.128.83` |
| `www.hilyoon.com` A | `150.241.128.83` |
| **`mail.hilyoon.com`, MX, SPF/DKIM/DMARC** | **leave unchanged**: email stays on the current server (`51.15.184.145`) |

Caddy obtains the hilyoon.com certificate automatically within a minute of DNS resolving.

## Operations

| Task | Command (in `/opt/hilyoon`) |
|---|---|
| Status | `docker compose -f docker-compose.prod.yml ps` |
| Logs | `docker compose -f docker-compose.prod.yml logs -f --tail=100 frontend backend` |
| Roll back | on your PC: `HILYOON_TAG=<old-commit> ./deploy/ship.sh --no-build` |
| Backups | `docker compose -f docker-compose.prod.yml exec backup ls -lh /backups` |
| Restore | `docker compose -f docker-compose.prod.yml exec -T backup sh -c 'gunzip -c /backups/<file>.sql.gz' \| docker compose -f docker-compose.prod.yml exec -T db sh -c 'mariadb -uroot -p"$MARIADB_ROOT_PASSWORD"'` |
| AI blog run | `docker compose -f docker-compose.prod.yml exec -T backend php automation/cron-scheduler.php` |

To run AI blog generation every 6 hours (only with `OPENAI_API_KEY` set), add to root's crontab:

```cron
0 */6 * * * cd /opt/hilyoon && docker compose -f docker-compose.prod.yml exec -T backend php automation/cron-scheduler.php >> /var/log/hilyoon-cron.log 2>&1
```

## Branches

`dev` → development · `main` → stable · `pro` → what runs in production. Deploy from `pro`.
