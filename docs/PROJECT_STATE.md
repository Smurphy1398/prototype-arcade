# Project State

_What is true right now._ Update this whenever the truth changes. Keep it short and current.
Last updated: **2026-07-13**.

## Current phase
**Arcade Expansion & Homepage Refresh sprint** (reprioritized 2026-07-14). Deep Halo/published-build
reconciliation is deferred behind this sprint, not dropped — see Known risks below.

## Current lane
**Lane 2B — Import Missing Games** (Chess, Nebula Rescue, Pictionary, World History Atlas, one coherent lane).
Status: **Complete, pending Simon's review — stop before commit**. 🧭 Claude sole editor. 🔍 Codex ran one
bounded read-only import review (caught and Claude fixed 2 real dependency-documentation errors — see
`docs/agent-runs/2026-07-14-codex-missing-games-import-review.md`). Lane 2A (audit + 🧠 Grok homepage
direction) is ✅ Accepted / committed.

## Exact next action
1. Simon reviews the 4 imported games + Codex findings/fixes (this report).
2. On approval: commit Lane 2B (8 new `games/*.html` files + `docs/GAME_CATALOG.md` + this file + `PHASE_LANES.md` + `PROJECT_LOG.md` + the Codex agent-run record).
3. Then **Lane 2C — homepage refresh** (Claude-selected, Grok-informed "Prototype Cabinet Row" direction) — not started, awaits this review.
4. Lane 1B (`7d4d512`) and Lane 2A (`2bc6c03`) still need a **separate push approval** — not pushed yet.

## Published state (live == repo)
- 🟢 Live & smoke-passed 2026-07-13 (after the docs-only push): https://smurphy1398.github.io/prototype-arcade/ —
  homepage loads; Halo FPS (card v1.7.6), Tower Defense (v6.1), Bob Ross (v0.1) present with Play links; no runtime change (expected).
- GitHub Pages serves `main` at repo root (inferred; no CNAME/.nojekyll/workflow). Pages build status not directly inspectable (no `gh`/API).

## Canonical games (all Provisional — see `GAME_CATALOG.md`; publishing Provisional is OK, mislabeling as Confirmed is not)
- Halo FPS — ⚠️ published file matches no local build and mislabels its own version (title v1.7.5.2 vs card v1.7.6). Deferred to the Lane 2 hardening pass — does not block this sprint since it doesn't block importing/launching other games.
- Tower Defense — published ≈ local v6.1 (High).
- Bob Ross — only meaningful build (High).
- Chess/Checkers, Nebula Rescue pinball, Pictionary, World History Atlas — **imported 2026-07-14** (Lane 2B), all Provisional/Playable-or-Experimental Prototype, none Confirmed. In-browser playtest still required for all four.

## Repo status
- Lane 1 foundation **committed** (`e9839cc`) and **pushed**; local `main` == `origin/main` at that commit.
- Lane 1B (workflow docs + `.claude/skills/`) is **committed locally** (`7d4d512`), **not yet pushed**.
- Lane 2A (docs reprioritization + Grok record) **committed locally** (`2bc6c03`), **not yet pushed**.
- Lane 2B (4 game imports + catalog/docs updates) is **complete in the working tree, not yet committed** —
  awaiting Simon's review of this report.
- History: Lane 2A `2bc6c03` → Lane 1B `7d4d512` → Lane 1 `e9839cc docs: establish prototype arcade project foundation` → `0ea750e Add Tower Defense and Bob Ross builds`.

## Known risks / watch items
- ⚠️ Halo provenance conflict (above) — **deferred, not dropped**; must resolve before Halo can be called Confirmed.
- ⚠️ `gh` (GitHub CLI) not installed; `github` MCP returning HTTP 400 → GitHub automation unavailable.
- ⚠️ **5 of 7 games now require internet to fully function** (Halo/Babylon, Chess & Nebula Rescue/Three.js-CDN,
  World History/Leaflet+GeoJSON+Wikipedia) — fine on GitHub Pages, broken offline; each landing page says so honestly.
  (Chess/Nebula Rescue's CDN dependency was miscategorized as "inlined" in the original Lane 1 audit — corrected
  2026-07-14 after a Lane 2B 🔍 Codex review caught it; see `docs/agent-runs/2026-07-14-codex-missing-games-import-review.md`.)
- ⚠️ Local MLB clone lacks `roadmap`/`phaselane`/`whatsnext` skills (only `handoff` present); Arcade skills authored fresh from Simon's spec.
- 🔒 `..\PROTOTYPE ARCADE` source collection is a protected read-only archive; a separate-drive backup also exists.

## Agents this session
**Agents:** 🧭 Claude (Opus, sole editor) · 🧠 Grok (one bounded homepage/product-direction review, Lane 2A) ·
🔍 Codex (one bounded read-only import review, Lane 2B — 2 real findings, both fixed). No 🛠️ Fable runs.
