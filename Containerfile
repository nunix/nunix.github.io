# =========================================================================
# nunix-blog (Docusaurus 3.9.2 + React 19) — multi-stage Containerfile
# Targets: dev (hot reload against bind-mounted source), build, prod (default)
# =========================================================================

# --- deps: bun install (repo has bun.lock, package-lock.json also present
# but bun install reads package.json directly regardless) -------------------
FROM docker.io/oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# --- DEV target: hot reload against bind-mounted source ---------------------
# Run with source bind-mounted at /app (do NOT bake source into image).
# Watches docs/, sidebars.ts, docusaurus.config.ts, src/data/, src/pages/ for changes
# and auto-restarts dev server on any modification. See dev-watch.sh for watcher logic.
# Example: podman run -v .:/app:Z -p 3000:3000 --target dev
FROM deps AS dev
RUN apt-get update && apt-get install -y inotify-tools && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY dev-watch.sh .
RUN chmod +x dev-watch.sh
EXPOSE 3000
CMD ["/bin/bash", "./dev-watch.sh"]

# --- BUILD stage -------------------------------------------------------------
FROM deps AS build
WORKDIR /app
COPY . .
RUN bun run build

# --- PROD runtime — nginx:alpine (tiny, universally known, zero config
# needed beyond static file serving + SPA-style fallback for Docusaurus
# client routing; chosen over Caddy since Docusaurus build output is plain
# static HTML/JS with no need for Caddy's auto-TLS/reverse-proxy features) --
FROM docker.io/library/nginx:alpine AS prod
COPY --from=build /app/build /usr/share/nginx/html
RUN sed -i 's/listen\s*80;/listen 3000;/' /etc/nginx/conf.d/default.conf \
 && sed -i 's/listen\s*\[::\]:80;/listen [::]:3000;/' /etc/nginx/conf.d/default.conf || true
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
