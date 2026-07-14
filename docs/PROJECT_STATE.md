# Project State

_What is true right now._ Update this whenever the truth changes. Keep it short and current.
Last updated: **2026-07-13**.

## Current phase
**Arcade Expansion & Homepage Refresh sprint** (reprioritized 2026-07-14). Deep Halo/published-build
reconciliation is deferred behind this sprint, not dropped — see Known risks below.

## Current lane
**Lane 2B — Import Missing Games** (Chess, Nebula Rescue, Pictionary, World History Atlas, one coherent lane).
Status: **🟡 Active**. 🧭 Claude sole editor. 🔍 Codex gives one bounded read-only import review after the
diff exists. Lane 2A (audit + 🧠 Grok homepage direction) is ✅ Accepted / committed.

## Exact next action
1. Import all four games (strongest evidence-backed candidate each), landing pages + game files, honest
   Provisional labeling — no `index.html` changes yet (that's Lane 2C).
2. Update `GAME_CATALOG.md` + this file + `PHASE_LANES.md` + `PROJECT_LOG.md` with source/target/hash/status per game.
3. Validate via local HTTP server (launch/render/navigation — not full gameplay) for all 8 new URLs + reconfirm the existing 6 unchanged.
4. Run one bounded 🔍 Codex read-only import review; record it in `docs/agent-runs/`.
5. Return the Lane 2B report and **stop before commit** — Lane 2C (homepage refresh) awaits Simon's review of the imports + Codex findings.
6. Lane 1B (`7d4d512`) and Lane 2A still need a **separate push approval** — not pushed yet.

## Published state (live == repo)
- 🟢 Live & smoke-passed 2026-07-13 (after the docs-only push): https://smurphy1398.github.io/prototype-arcade/ —
  homepage loads; Halo FPS (card v1.7.6), Tower Defense (v6.1), Bob Ross (v0.1) present with Play links; no runtime change (expected).
- GitHub Pages serves `main` at repo root (inferred; no CNAME/.nojekyll/workflow). Pages build status not directly inspectable (no `gh`/API).

## Canonical games (all Provisional — see `GAME_CATALOG.md`; publishing Provisional is OK, mislabeling as Confirmed is not)
- Halo FPS — ⚠️ published file matches no local build and mislabels its own version (title v1.7.5.2 vs card v1.7.6). Deferred to the Lane 2 hardening pass — does not block this sprint since it doesn't block importing/launching other games.
- Tower Defense — published ≈ local v6.1 (High).
- Bob Ross — only meaningful build (High).
- Chess/Checkers, Nebula Rescue pinball, Pictionary, World History Atlas — local only; **import targets for Lane 2B** (candidates reconfirmed in Lane 2A).

## Repo status
- Lane 1 foundation **committed** (`e9839cc`) and **pushed**; local `main` == `origin/main` at that commit.
- Lane 1B (workflow docs + `.claude/skills/`) is **committed locally** (`7d4d512`), **not yet pushed**.
- Lane 2A adds docs-only reprioritization + one `docs/agent-runs/` record. No game/runtime files touched.
- History: Lane 1B `7d4d512` → Lane 1 `e9839cc docs: establish prototype arcade project foundation` → `0ea750e Add Tower Defense and Bob Ross builds`.

## Known risks / watch items
- ⚠️ Halo provenance conflict (above) — **deferred, not dropped**; must resolve before Halo can be called Confirmed.
- ⚠️ `gh` (GitHub CLI) not installed; `github` MCP returning HTTP 400 → GitHub automation unavailable.
- ⚠️ Halo (Babylon) and World History (Leaflet) depend on CDNs — fine on Pages, broken offline.
- ⚠️ Local MLB clone lacks `roadmap`/`phaselane`/`whatsnext` skills (only `handoff` present); Arcade skills authored fresh from Simon's spec.
- 🔒 `..\PROTOTYPE ARCADE` source collection is a protected read-only archive; a separate-drive backup also exists.

## Agents this session
**Agents:** 🧭 Claude (Opus, sole editor) · 🧠 Grok (one bounded homepage/product-direction review, Lane 2A). No 🔍 Codex / 🛠️ Fable runs yet.
