# Project State

_What is true right now._ Update this whenever the truth changes. Keep it short and current.
Last updated: **2026-07-13**.

## Current phase
Foundation & workflow tooling. Orientation audit accepted; foundation shipped; building status/navigation skills.

## Current lane
**Lane 1B — Prototype Arcade Status Skills Port** (docs/workflow-only).
Status: **✅ Accepted / committed**. 🧭 Claude sole editor. No outside agents. Shipped `/handoff`, `/roadmap`, `/phaselane`, `/whatsnext`
(all four functionally tested and passing) + `ROADMAP.md` + `PHASE_LANES.md` + model/effort routing.

## Exact next action
1. **Push Lane 1B** to `origin/main` — separately, on explicit approval.
2. Then **open Lane 2 — reconcile the 3 published builds** as a new **read-only reconciliation/planning lane**
   (Halo provenance/version conflict first; confirm Tower Defense & Bob Ross). Not started.

## Published state (live == repo)
- 🟢 Live & smoke-passed 2026-07-13 (after the docs-only push): https://smurphy1398.github.io/prototype-arcade/ —
  homepage loads; Halo FPS (card v1.7.6), Tower Defense (v6.1), Bob Ross (v0.1) present with Play links; no runtime change (expected).
- GitHub Pages serves `main` at repo root (inferred; no CNAME/.nojekyll/workflow). Pages build status not directly inspectable (no `gh`/API).

## Canonical games (all Provisional — see `GAME_CATALOG.md`)
- Halo FPS — ⚠️ published file matches no local build and mislabels its own version (title v1.7.5.2 vs card v1.7.6).
- Tower Defense — published ≈ local v6.1 (High).
- Bob Ross — only meaningful build (High).
- Chess/Checkers, Nebula Rescue pinball, Pictionary, World History Atlas — local only, import candidates.

## Repo status
- Lane 1 foundation **committed** (`e9839cc`) and **pushed**; local `main` == `origin/main` at that commit.
- Lane 1B (workflow docs + `.claude/skills/` only, no game/runtime files) is **committed locally**, **not yet pushed**.
- History: Lane 1B commit → `e9839cc docs: establish prototype arcade project foundation` → `0ea750e Add Tower Defense and Bob Ross builds`.

## Known risks / watch items
- ⚠️ Halo provenance conflict (above) — resolve before adding new games.
- ⚠️ `gh` (GitHub CLI) not installed; `github` MCP returning HTTP 400 → GitHub automation unavailable.
- ⚠️ Halo (Babylon) and World History (Leaflet) depend on CDNs — fine on Pages, broken offline.
- ⚠️ Local MLB clone lacks `roadmap`/`phaselane`/`whatsnext` skills (only `handoff` present); Arcade skills authored fresh from Simon's spec.
- 🔒 `..\PROTOTYPE ARCADE` source collection is a protected read-only archive; a separate-drive backup also exists.

## Agents this session
**Agents:** 🧭 Claude (Opus, sole editor). No 🧠 Grok / 🔍 Codex / 🛠️ Fable runs.
