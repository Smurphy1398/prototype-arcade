# Roadmap

Living, reprioritizable view of where Prototype Arcade is headed. This changes as reality changes —
it does **not** replace the stable intent in `README.md` or the structured history in `BACKLOG.md`, and it
does not erase completed work. Executable detail lives in `PHASE_LANES.md`; this file is the altitude view.
Last updated: **2026-07-13**.

## Current milestone
**A trustworthy, growing arcade.** Every published game has an evidence-backed canonical build, the strongest
local games are imported, and the homepage feels like a real arcade — resumable after any break.

## Completed phases
- [x] Orientation audit (read-only, accepted)
- [x] Foundation & workflow docs (`README`, `AGENTS`, `CLAUDE`, `docs/`) — committed `e9839cc`, pushed
- [x] Status/navigation skills (`/handoff`, `/roadmap`, `/phaselane`, `/whatsnext`), `ROADMAP.md`, `PHASE_LANES.md`,
  model/effort routing — all four tested and passing _(Lane 1B, accepted/committed, push pending)_

## Now
- [ ] **Published-build reconciliation** — resolve the Halo provenance/version conflict first; confirm Tower
  Defense & Bob Ross canonical _(Lane 2, opening as read-only reconciliation/planning)_

## Next
- [ ] **Chess canonicalization & import** — playtest v2.2 vs v2.3, add `games/chess/`
- [ ] **Nebula Rescue canonicalization & import** — v6.4 stability check, import
- [ ] **Pictionary canonicalization & import** — game file (not the gallery exports)

## Later
- [ ] **World History Atlas** — decision/import (bonus game; Leaflet CDN)
- [ ] **Arcade homepage visual direction** — with 🧠 Grok
- [ ] **Arcade homepage implementation** — then 🔍 Codex regression/path/responsive review
- [ ] **Shared navigation & responsive behavior** — common back/pause/home across games
- [ ] **Halo FPS stabilization** — 3D/controls/perf hardening
- [ ] **Future prototype expansion** — new games from `RAW_IDEA_INBOX.md`
- [ ] **Workflow promotion** — generic `/handoff` etc. to global / future VIBE CODE OS; adapt `/peer-review`

## Parked
- Shared game shell (revisit once ≥4 games imported)
- Multiplayer / AI-image / campaign-mode concepts (see `BACKLOG.md` preserved specs) — not now

## Definition of the next public-arcade milestone
The next shippable milestone = **all three published games Confirmed canonical + at least one new game (likely
Chess) live**, with existing public URLs intact and the homepage still loading cleanly.
