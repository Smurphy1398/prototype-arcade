# Phase Lanes

The executable layer beneath `ROADMAP.md`. Coherent sprint lanes, lightweight format (from `AGENTS.md`).
Expected to change often. Not every tiny patch is a lane. If this file and `PROJECT_STATE.md`/`ROADMAP.md`
disagree about the active lane, that disagreement should be surfaced, not silently resolved.
Last updated: **2026-07-13**.

---

## Lane 1 — Project Foundation & Canonical Game Catalog  ·  ✅ Accepted / shipped
- **Goal:** durable project memory + canonical catalog; encode agent-attribution system.
- **Allowed changes:** docs only. **Exclusions:** no game/runtime files.
- **🧠 Grok:** unnecessary. **🔍 Codex:** unnecessary.
- **Validation:** docs-only diff; verbatim raw ideas; conflicts preserved. ✅
- **Files:** `README.md`, `AGENTS.md`, `CLAUDE.md`, `docs/{GAME_CATALOG,PROJECT_STATE,BACKLOG,RAW_IDEA_INBOX,PROJECT_LOG}.md`, `docs/agent-runs/README.md`.
- **Commit/push/deploy:** committed `e9839cc`, pushed to `origin/main`. Public smoke passed.
- **Next lane:** Lane 1B.

## Lane 1B — Prototype Arcade Status Skills Port  ·  ✅ Accepted / committed
- **Goal:** port/adapt `/handoff`, `/roadmap`, `/phaselane`, `/whatsnext` as Arcade-native skills; add `ROADMAP.md` + `PHASE_LANES.md` + model/effort routing.
- **Why now:** give Simon the MLB-style navigation he liked, backed by the Arcade's real docs.
- **Inputs:** local MLB `handoff` skill (style reference only — 3 of 4 sources absent locally), Simon's detailed spec, existing `docs/`.
- **Allowed changes:** `.claude/skills/**`, `docs/ROADMAP.md`, `docs/PHASE_LANES.md`, `AGENTS.md` (routing), `CLAUDE.md` (startup order), `docs/PROJECT_STATE.md`, `docs/PROJECT_LOG.md`, `docs/BACKLOG.md`.
- **Exclusions:** no game/runtime files, no `index.html`/`games/`, no source-archive changes, no package/global-skill install, no VIBE CODE OS, no agent invocation, no `/peer-review` port.
- **🧠 Grok:** unnecessary. **🔍 Codex:** unnecessary (docs/workflow-only commit; no outside review required).
- **Validation:** frontmatter correct; no MLB-only terms; docs agree on active lane; all 4 skills reloaded and functionally tested (`/whatsnext` → `/phaselane` → `/roadmap` → `/handoff`, all passed).
- **Status:** ✅ Accepted / committed. **Commit/push/deploy:** committed; **push pending explicit approval**; deploy not applicable (docs-only).
- **Next lane:** Lane 2 (opens as a new **read-only reconciliation/planning** lane).

## Lane 2 — Published Build Reconciliation  ·  Ready (not started)
- **Goal:** resolve the Halo v1.7.6-vs-v1.7.5.2 provenance conflict; confirm Tower Defense & Bob Ross canonical; lock hashes in `GAME_CATALOG.md`.
- **Why now:** fix existing truth before adding new games; smallest-risk real change.
- **Inputs:** live `games/*-game.html`, local candidates, `GAME_CATALOG.md`.
- **Allowed changes:** possibly `games/halo-fps*.html`, `GAME_CATALOG.md`. **Exclusions:** no new games, no homepage redesign.
- **🧠 Grok:** unnecessary. **🔍 Codex:** recommended (path/regression).
- **Validation:** playtest all 3 locally + on a preview.
- **Status:** Ready. **Commit/push/deploy:** commit appropriate after acceptance; push/deploy separate.
- **Next lane:** Chess import.

## Later lanes (Proposed — derived from `ROADMAP.md`)
- **Chess canonicalization & import** — playtest v2.2 vs v2.3; add `games/chess/`. 🔍 Codex recommended.
- **Nebula Rescue import** — v6.4 stability; add `games/nebula-rescue/`.
- **Pictionary import** — game file only (ignore gallery exports).
- **World History Atlas** — decision/import (Leaflet CDN).
- **Arcade homepage: visual direction** — 🧠 Grok required.
- **Arcade homepage: implementation** — 🔍 Codex required.
- **Shared navigation & responsive behavior.**
- **Halo FPS stabilization.**
