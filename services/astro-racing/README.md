# Astro Racing rc.1 room service

Status: prepared, not publicly deployed. No hosting account/service or endpoint is configured.
The Arcade's existing GitHub Pages service only serves the static game.

The static game is now live and publicly verified at
https://smurphy1398.github.io/prototype-arcade/games/astro-racing.html.
See `../../docs/releases/astro-racing-1.0.0-rc.1/HOSTING-DECISION.md` for current prices,
measured bandwidth, and the exact Render account connection needed to finish rooms.

This directory preserves the candidate's 109 source/configuration files byte for byte.
`RELEASE-MANIFEST.json` records source SHA-256
`836043b225acc2531bb2b9e1b26c3c56278021afcb37de4ad9fcc0d4f1282875`.
The live client is the matching prebuilt output in `../../games/astro-racing/`.
Do not change simulation source during deployment or enable server verification acceleration.

## Deploy on an existing Node or Docker host

Use Node 24+, one persistent process, and a TLS proxy supporting WebSocket upgrades.
From this directory, run `npm ci --include=dev`, `npm run build`, then `npm run server`.
The supplied Dockerfile is an alternative (`docker build -t astro-racing:1.0.0-rc.1 .`).

Set environment variables:

```text
ASTRO_HOST=0.0.0.0
ASTRO_PORT=8787
ASTRO_VERIFY=0
ASTRO_ORIGINS=https://smurphy1398.github.io
```

Use the host's assigned port instead of 8787 where required. Forward HTTPS `/health`
and WSS `/rooms` to this process. The origin is the exact browser origin; do not append
`/prototype-arcade/` or use a wildcard. Health must return `ok:true`,
`version:"1.0.0-rc.1"`, `protocol:2`, `verify:false`.

No database, account system, leaderboard, disk, or extra replica is needed.
Rooms are held in memory: a restart drops them. Reconnect has a 30-second window.
Two human seats race alongside ten bots; 16 rooms/64 sockets are code limits, not
measured hosting capacity. Use one instance until room routing is explicitly redesigned.

## Optional Render recipe, if no existing suitable host is available

`render.yaml` is a reviewed preparation option, not an active deployment. Connect this
GitHub repository in a Render account and choose Blueprint path
`services/astro-racing/render.yaml`, or create a Node Web Service with its exact settings.
The recipe explicitly selects Free and disables automatic redeploys. Confirm the provider
shows no new charges; ask Simon before selecting a paid plan, paid add-on, or paid overage.
No Render account creation or billing action has been performed.

Render's current [WebSocket documentation](https://render.com/docs/websocket) supports WSS
on web services. Its [free service limits](https://render.com/docs/free) include idle
spin-down after 15 minutes, cold starts, limited monthly instance hours, and limited compute.
Active inbound WebSocket messages keep a free service active. Its free CPU may be inadequate
for this 60 Hz simulation; public real-time testing is required before calling it playable.
Settings follow the [Blueprint reference](https://render.com/docs/blueprint-spec).

After deployment, record the actual HTTPS/WSS URL; never guess a service subdomain.
Verify TLS, health, allowed/rejected origins, two independent browser clients, a complete
race and rematch on normal server time. Then set the landing's default server parameter
using `scripts/configure-endpoint.py` and publish that small integration change.
Guest links include both the room code and server address.

The exact remaining access requirement is an authenticated account/project on a persistent
Node/WebSocket hosting service (or an existing server with deployment access and TLS).
GitHub repository access alone cannot create that runtime on GitHub Pages.

## Verification commands

`node --import tsx scripts/check-server.mts` starts and closes a local production-mode
server on port 8802, tests the origin restriction and disabled acceleration, and measures
one minute with two independent protocol clients. Its default output is `server-check.json`;
set `ASTRO_SERVER_REPORT` to another evidence path. This is not an internet test.

For the public browser test, make Playwright available to Node (or set
`ASTRO_PLAYWRIGHT_MODULE` to an existing module URL), set `ASTRO_PUBLIC_ROOM_URL` to the
actual WSS endpoint, then run `node scripts/check-public-rooms.mjs`. Default browser is
Edge; `ASTRO_BROWSER_CHANNEL` can select another installed Chromium channel. Save evidence
outside source with `ASTRO_ROOM_EVIDENCE`. The test requires `verify:false` on the server
and checks guest sharing, independent clients, twelve finishers, matching results and a
complete rematch. It uses diagnostic client access to supply ordinary input messages;
it never accelerates the server or changes authoritative physics.

`ASTRO_ALLOW_LOCAL=1`, an explicit localhost `ASTRO_PUBLIC_GAME_URL`, and a local
`ASTRO_PUBLIC_ROOM_URL` are only for verifying the harness before hosting is available.
The report labels that as local preparation and must never be presented as public proof.
