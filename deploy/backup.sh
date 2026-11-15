#!/bin/sh
# Daily logical backup of the Hilyoon database; keeps the newest 7 dumps.
# Restore: see DEPLOY.md ("Operations").
# Runs in the mariadb image (/bin/sh = dash, no pipefail), so the dump goes to a file first
# and only counts as a success if mariadb-dump exits 0 AND the dump contains tables.
set -u
while true; do
  stamp=$(date +%Y%m%d-%H%M)
  tmp="/backups/.hilyoon-$stamp.sql"
  # --skip-ssl: private Docker network; the server's auto-generated cert is self-signed
  if mariadb-dump -h db -uroot --skip-ssl --single-transaction --routines --databases hilyoon_saas > "$tmp" \
     && grep -q "CREATE TABLE" "$tmp"; then
    gzip -c "$tmp" > "/backups/hilyoon-$stamp.sql.gz" && rm -f "$tmp"
    date -u +%FT%TZ > /backups/last_success
    echo "backup ok: hilyoon-$stamp.sql.gz ($(wc -c < "/backups/hilyoon-$stamp.sql.gz") bytes)"
  else
    rm -f "$tmp"
    echo "backup FAILED at $stamp" >&2
  fi
  ls -1t /backups/hilyoon-*.sql.gz 2>/dev/null | tail -n +8 | xargs -r rm -f
  sleep 86400
done
