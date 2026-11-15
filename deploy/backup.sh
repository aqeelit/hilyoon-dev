#!/bin/sh
# Daily logical backup of the Hilyoon database; keeps the newest 7 dumps.
# Restore: gunzip -c /backups/hilyoon-YYYYmmdd-HHMM.sql.gz | docker compose -f docker-compose.prod.yml exec -T db mariadb -uroot -p"$DB_ROOT_PASSWORD" hilyoon_saas
set -eu
while true; do
  stamp=$(date +%Y%m%d-%H%M)
  if mariadb-dump -h db -uroot --single-transaction --routines --databases hilyoon_saas | gzip > "/backups/hilyoon-$stamp.sql.gz.tmp"; then
    mv "/backups/hilyoon-$stamp.sql.gz.tmp" "/backups/hilyoon-$stamp.sql.gz"
    date -u +%FT%TZ > /backups/last_success
    echo "backup ok: hilyoon-$stamp.sql.gz"
  else
    rm -f "/backups/hilyoon-$stamp.sql.gz.tmp"
    echo "backup FAILED" >&2
  fi
  ls -1t /backups/hilyoon-*.sql.gz 2>/dev/null | tail -n +8 | xargs -r rm -f
  sleep 86400
done
