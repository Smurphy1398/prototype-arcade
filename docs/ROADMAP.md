# Roadmap

Living, reprioritizable view of where Prototype Arcade is headed. This changes as reality changes —
it does **not** replace the stable intent in `README.md` or the structured history in `BACKLOG.md`, and it
does not erase completed work. Executable detail lives in `PHASE_LANES.md`; this file is the altitude view.
Last updated: **2026-07-13**.

## Current milestone
**A presentable, growing arcade.** Simon reprioritized (2026-07-14): get every viable game onto the public
site and make the homepage feel like a real arcade *first*; deep canonical reconciliation (Halo's version
conflict, etc.) is real work that still has to happen, but it moves behind this sprint instead of blocking it.
Provisional builds may publish honestly labeled as prototype/playtest — never falsely as confirmed/final.

## Completed phases
- [x] Orientation audit (read-only, accepted)
- [x] Foundation & workflow docs (`README`, `AGENTS`, `CLAUDE`, `docs/`) — committed `e9839cc`, pushed
- [x] Status/navigation skills (`/handoff`, `/roadmap`, `/phaselane`, `/whatsnext`), `ROADMAP.md`, `PHASE_LANES.md`,
  model/effort routing — all four tested and passing (Lane 1B, committed `7d4d512`)

## Now
- [ ] **Arcade Expansion & Homepage Refresh** — add all viable missing games, refresh the homepage into a
  cohesive arcade, prepare card structure for future media _(Lane 2A active — audit + one bounded 🧠 Grok
  review; 2B import, 2C homepage, 2D smoke to follow on separate approval)_

## Next
- [ ] **Published-build reconciliation & stabilization** — resolve the ⚠️ Halo v1.7.6-vs-v1.7.5.2 provenance
  conflict; confirm Tower Defense & Bob Ross canonical; general game-stability hardening _(deferred hardening
  lane — not dropped, just sequenced behind the expansion sprint; only re-prioritized earlier if a conflict
  directly blocks importing or launching a game)_
- [ ] **Game-specific upgrades** — per-game polish once imported (e.g. Chess v2.2-vs-v2.3 resolution, Nebula
  Rescue stability, Pictionary vision-gap items from `BACKLOG.md`)

## Later
- [ ] **Media/cover/screenshot/trailer pipeline** — see "Arcade Media Library" spec in `BACKLOG.md`
- [ ] **Shared navigation & responsive behavior** — common back/pause/home across games
- [ ] **Halo FPS stabilization** — 3D/controls/perf hardening
- [ ] **Future prototype expansion** — new games from `RAW_IDEA_INBOX.md`
- [ ] **Workflow promotion** — generic `/handoff` etc. to global / future VIBE CODE OS; adapt `/peer-review`

## Parked
- Shared game shell (revisit once ≥4 games imported)
- Multiplayer / AI-image / campaign-mode concepts (see `BACKLOG.md` preserved specs) — not now

## Definition of this sprint's milestone
All seven games (3 published + Chess, Nebula Rescue, Pictionary, World History Atlas) live on the public
arcade with honest Provisional/prototype labeling, existing public URLs intact, and a cohesive homepage
(hero, responsive card grid, status/genre/control badges, CSS-placeholder cover treatments, documented
future-media hooks) — not waiting on custom art or full canonical reconciliation.
