# Roadmap

Living, reprioritizable view of where Prototype Arcade is headed. This changes as reality changes —
it does **not** replace the stable intent in `README.md` or the structured history in `BACKLOG.md`, and it
does not erase completed work. Executable detail lives in `PHASE_LANES.md`; this file is the altitude view.
Last updated: **2026-07-14**. Reflects: local `HEAD f65aac3` (origin/main `c9e4c52`, local ahead 1, unpushed).

## Current milestone
**A presentable, growing arcade.** Simon reprioritized (2026-07-14): get every viable game onto the public
site and make the homepage feel like a real arcade *first*; deep canonical reconciliation (Halo's version
conflict, etc.) is real work that still has to happen, but it moves behind this sprint instead of blocking it.
Provisional builds may publish honestly labeled as prototype/playtest — never falsely as confirmed/final.

**Sprint status (2026-07-14):** the 7-game homepage sprint **shipped and is live**, and Game History Recovery
is complete — focus now shifts to per-game hardening (Nebula Rescue first) and canonical reconciliation. See
the milestone definition at the bottom for the exact sprint goal that was met.

## Completed phases
- [x] Orientation audit (read-only, accepted)
- [x] Foundation & workflow docs (`README`, `AGENTS`, `CLAUDE`, `docs/`) — committed `e9839cc`, pushed
- [x] Status/navigation skills (`/handoff`, `/roadmap`, `/phaselane`, `/whatsnext`), `ROADMAP.md`, `PHASE_LANES.md`,
  model/effort routing — all four tested and passing (Lane 1B, committed `7d4d512`)

## Now
- [x] Lane 2A (audit + 🧠 Grok direction) — accepted/committed `2bc6c03`
- [x] Lane 2B (4 games imported + 🔍 Codex review + fixes) — committed `7d19000`
- [x] **Lane 2C — Homepage Arcade Refresh** — ✅ shipped: Simon accepted, committed `af0bc0b`, pushed, and
  **live** at https://smurphy1398.github.io/prototype-arcade/ (release checkpoint `c9e4c52`).
- [x] **Game History Recovery** (documentation/research only) — ✅ complete: recovered durable
  version/checkpoint history for Nebula Rescue, Halo FPS, Pictionary, Tower Defense, World History Atlas into
  `docs/game-history/`. Committed locally as **`f65aac3`** (docs-only), **not yet pushed**, pending Simon's
  review. Satisfied the hard prerequisite before any hands-on Nebula/Halo repairs.
- [ ] Lane 2D — full arcade smoke — **Parked** (Simon's live acceptance covered the ship; formal sweep optional later).

## Next  (explicit order — each step gates the next)
1. [ ] **Nebula Rescue rescue/hardening** — top-priority game fix (`BACKLOG.md` B8): slide/ramp broken,
   general glitchiness, balance work — **protected win: do not regress the recently-fixed spinners.**
   Prerequisite (Game History Recovery) is complete; now blocked only on Simon's review of the recovery
   output (`docs/game-history/nebula-rescue.md`). No Nebula source edits until then.
- [ ] **Published-build reconciliation & stabilization** — resolve the ⚠️ Halo v1.7.6-vs-v1.7.5.2 provenance
  conflict; confirm Tower Defense & Bob Ross canonical; general game-stability hardening _(deferred, not
  dropped — only re-prioritized earlier if a conflict directly blocks importing or launching a game)_
- [ ] **Other game-specific upgrades** — per-game polish (e.g. Chess v2.2-vs-v2.3 resolution, Pictionary
  vision-gap items from `BACKLOG.md`)
- [ ] **Landing-page cleanup** — light polish pass (`BACKLOG.md` B9), not yet scoped

## Later
- [ ] **Media/cover/screenshot/trailer pipeline** — see "Arcade Media Library" spec in `BACKLOG.md`
- [ ] **Shared navigation & responsive behavior** — common back/pause/home across games
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
