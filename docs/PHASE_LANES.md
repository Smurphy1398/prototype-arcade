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

## Lane 2 — Published Build Reconciliation  ·  Deferred (Next, not Now)
- **Goal:** resolve the Halo v1.7.6-vs-v1.7.5.2 provenance conflict; confirm Tower Defense & Bob Ross canonical; lock hashes in `GAME_CATALOG.md`.
- **Reprioritized 2026-07-14:** moved behind the Arcade Expansion & Homepage Refresh sprint (Lanes 2A–2D) per
  Simon's direction — the conflict does not block importing or launching other games, so it doesn't have to
  block them either. Still required work; not dropped.
- **Inputs:** live `games/*-game.html`, local candidates, `GAME_CATALOG.md`.
- **Allowed changes:** possibly `games/halo-fps*.html`, `GAME_CATALOG.md`. **Exclusions:** no new games, no homepage redesign.
- **🧠 Grok:** unnecessary. **🔍 Codex:** recommended (path/regression).
- **Validation:** playtest all 3 locally + on a preview.
- **Status:** Ready, sequenced after Lane 2D. **Commit/push/deploy:** commit appropriate after acceptance; push/deploy separate.
- **Next lane:** game-specific upgrades.

---

## Arcade Expansion & Homepage Refresh Sprint (current objective)

### Lane 2A — Arcade Content & Import Audit  ·  ✅ Accepted / committed
- **Goal:** read-only audit — reconfirm published games launch, reconfirm the strongest import candidate for
  each missing game, define the file/URL structure and card metadata schema for adding all four without
  breaking existing URLs, get one bounded 🧠 Grok homepage/product-direction review.
- **Why now:** ground Lane 2B/2C in real constraints before touching any files.
- **Inputs:** `docs/GAME_CATALOG.md`, live site, current `index.html`, source collection (read-only).
- **Allowed changes:** `docs/{ROADMAP,PHASE_LANES,PROJECT_STATE,BACKLOG,PROJECT_LOG}.md`, `docs/agent-runs/*`. **Exclusions:** no game/runtime files, no `index.html`, no `games/`.
- **🧠 Grok:** required — one bounded call, transcript preserved verbatim in `docs/agent-runs/2026-07-14-grok-homepage-direction.md`. Direction accepted (Claude-selected, Grok-informed), scoped down for Lane 2C's first pass.
- **🔍 Codex:** unnecessary (nothing to diff yet).
- **Validation:** `git status` shows docs-only diff; Grok transcript captured verbatim; live 3-game smoke re-confirmed.
- **Status:** ✅ Accepted / committed. **Commit/push/deploy:** committed; push separate/unapproved.
- **Next lane:** Lane 2B.

### Lane 2B — Import Missing Games  ·  🟡 Active
- **Goal:** add Chess, Nebula Rescue, Pictionary, World History Atlas using the strongest Provisional
  candidate each, honestly labeled prototype/playtest. No internal-version edits, no source-archive deletions.
- **Allowed changes:** new `games/<slug>.html` + `games/<slug>-game.html` per game, `docs/GAME_CATALOG.md`, `docs/PROJECT_STATE.md`, `docs/PHASE_LANES.md`, `docs/PROJECT_LOG.md`. **Exclusions:** no `index.html` changes, no deep game-logic rewrites, no existing-URL changes.
- **🧠 Grok:** unnecessary. **🔍 Codex:** required — one bounded read-only path/link/runtime review after imports; transcript in `docs/agent-runs/`.
- **Validation:** local HTTP server; every imported game's landing + game URL launches/renders/navigates correctly; existing 6 URLs reconfirmed unchanged.
- **Status:** 🟡 Active. **Commit/push/deploy:** stop before commit; push/deploy remain separate.
- **Next lane:** Lane 2C (on Simon's review of imports + Codex findings).

### Lane 2C — Homepage Arcade Refresh  ·  Proposed
- **Goal:** redesign the homepage as a cohesive arcade using the Claude-selected, Grok-informed direction —
  hero, featured row, responsive grid, CSS-placeholder cover treatments, status/genre/control badges,
  prototype labels, documented (unpopulated) future-media hook fields.
- **Allowed changes:** `index.html` (and shared CSS if extracted). **Exclusions:** no fake screenshots/reviews/player-counts/trailer controls, no React/Vite, existing URLs preserved.
- **🧠 Grok:** direction already captured in Lane 2A (evidence, not authority). **🔍 Codex:** required — links, responsive, accessibility basics, Pages compatibility, duplication, no accidental runtime changes.
- **Status:** Proposed. **Next lane:** Lane 2D.

### Lane 2D — Full Arcade Smoke  ·  Proposed
- **Goal:** verify homepage + all 7 game cards/launches across desktop/tablet-landscape/tablet-portrait/phone;
  confirm existing 3 URLs still valid; no missing assets/console-blocking errors; report limitations honestly.
- **Status:** Proposed. **Next lane:** Lane 2 (deferred reconciliation) resumes.
