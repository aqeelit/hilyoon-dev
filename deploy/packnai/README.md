# One-time change in the PackNAI repo

PackNAI's Caddy owns ports 80/443 on the server, so it also serves hilyoon.com.
These three small changes let it load extra sites from a folder and reach the Hilyoon
containers. Commit them in the **PackNAI repository** (not on the server directly), or
the next PackNAI deploy will overwrite them.

## 1. `deploy/Caddyfile` — add at the very end

```caddyfile
# Additional sites hosted on this server (e.g. hilyoon.com), one file per site
import /etc/caddy/sites/*.caddy
```

## 2. `docker-compose.prod.yml` — `caddy` service

```yaml
  caddy:
    # ...existing settings...
    volumes:
      - ./deploy/Caddyfile:/etc/caddy/Caddyfile:ro
      - /opt/caddy-sites:/etc/caddy/sites:ro      # added
      - caddy_data:/data
      - caddy_config:/config
    networks:                                      # added
      - default
      - web
```

## 3. `docker-compose.prod.yml` — top level

```yaml
networks:
  web:
    external: true
```

The `web` network must exist before PackNAI's Caddy starts:
`docker network create web` (once, see DEPLOY.md).
