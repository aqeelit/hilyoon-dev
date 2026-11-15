#!/usr/bin/env bash
# Build Hilyoon images locally, copy them to the server, and (re)start the stack.
# The 4 GB server has no swap, so images are never built there.
#
#   ./deploy/ship.sh            # deploy current commit
#   HILYOON_TAG=abc1234 ./deploy/ship.sh --no-build   # roll back to an already-shipped tag
set -euo pipefail

SERVER="${SERVER:-root@150.241.128.83}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/packnai_key}"
REMOTE_DIR="${REMOTE_DIR:-/opt/hilyoon}"
TAG="${HILYOON_TAG:-$(git rev-parse --short HEAD)}"
SSH=(ssh -i "$SSH_KEY" -o BatchMode=yes "$SERVER")

cd "$(git rev-parse --show-toplevel)"

if [[ "${1:-}" != "--no-build" ]]; then
  if [[ -n "$(git status --porcelain)" ]]; then
    echo "Working tree has uncommitted changes; commit first so the tag matches the code." >&2
    exit 1
  fi
  echo "==> Building images (tag $TAG)"
  HILYOON_TAG="$TAG" docker compose -f docker-compose.prod.yml build frontend backend

  echo "==> Uploading images to $SERVER"
  docker save "hilyoon/frontend:$TAG" "hilyoon/backend:$TAG" | gzip | "${SSH[@]}" 'gunzip | docker load'
fi

echo "==> Uploading compose file, Caddy site and schema"
tar -czf - docker-compose.prod.yml deploy/backup.sh deploy/caddy/hilyoon.caddy backend/sql/hilyoon.sql \
  | "${SSH[@]}" "mkdir -p '$REMOTE_DIR' && tar -xzf - -C '$REMOTE_DIR'"

echo "==> Starting stack"
"${SSH[@]}" bash -s -- "$REMOTE_DIR" "$TAG" <<'REMOTE'
set -euo pipefail
cd "$1"
[ -f .env ] || { echo "Missing $1/.env (copy .env.prod.example and fill it in)" >&2; exit 1; }
sed -i "s/^HILYOON_TAG=.*/HILYOON_TAG=$2/" .env
docker compose -f docker-compose.prod.yml up -d --remove-orphans
docker compose -f docker-compose.prod.yml ps

# Install/refresh the Caddy site, validate, then reload without downtime
mkdir -p /opt/caddy-sites
cp deploy/caddy/hilyoon.caddy /opt/caddy-sites/hilyoon.caddy
CADDY=$(docker ps --filter "name=packnai-caddy" --format '{{.Names}}' | head -1)
docker exec "$CADDY" caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
docker exec "$CADDY" caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
echo "Deployed hilyoon tag $2"
REMOTE
