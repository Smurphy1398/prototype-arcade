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

### Lane 2B — Import Missing Games  ·  ✅ Complete, pending review (stop before commit)
- **Goal:** add Chess, Nebula Rescue, Pictionary, World History Atlas using the strongest Provisional
  candidate each, honestly labeled prototype/playtest. No internal-version edits, no source-archive deletions.
- **Allowed changes:** new `games/<slug>.html` + `games/<slug>-game.html` per game, `docs/GAME_CATALOG.md`, `docs/PROJECT_STATE.md`, `docs/PHASE_LANES.md`, `docs/PROJECT_LOG.md`. **Exclusions:** no `index.html` changes, no deep game-logic rewrites, no existing-URL changes.
- **🧠 Grok:** unnecessary. **🔍 Codex:** required — ran one bounded read-only path/link/runtime review;
  caught 2 real findings (Chess/Nebula Rescue falsely documented as offline-capable — both actually load
  Three.js from a CDN; World History's dependency list was incomplete) — both verified and fixed. Transcript:
  `docs/agent-runs/2026-07-14-codex-missing-games-import-review.md`.
- **Validation:** local HTTP server; all 8 new URLs return 200 with correct titles/non-truncated content; nav
  hrefs verified to resolve to real files; existing 6 URLs/files confirmed byte-unchanged. **No in-browser
  render/gameplay smoke performed** (explicitly named as a validation-depth limit, not claimed as done).
- **Status:** ✅ Complete, pending Simon's review. **Commit/push/deploy:** stop before commit; push/deploy remain separate.
- **Next lane:** Lane 2C (on Simon's approval of this lane).

### Lane 2C — Homepage Arcade Refresh  ·  ✅ Accepted / committed
- **Goal:** redesign the homepage as a cohesive arcade using the Claude-selected, Grok-informed direction —
  hero, featured row, responsive grid, CSS-placeholder cover treatments, status/genre/control badges,
  prototype labels, documented (unpopulated) future-media hook fields.
- **Allowed changes:** `index.html` only (kept single-file, matching the project's standalone-HTML ethos —
  no CSS extracted). **Exclusions:** no fake screenshots/reviews/player-counts/trailer controls, no
  React/Vite, existing URLs preserved.
- **🧠 Grok:** direction captured in Lane 2A (evidence, not authority) — implemented the "Prototype Cabinet
  Row" system: dark amber-accent stage, per-game accent colors + CSS-marquee cover placeholders, one
  featured slot (Halo, per Grok's "sticky default" rule since all 4 imports landed the same day), Floor
  grid (6 primary games) + dashed-border Bonus rail (World History Atlas), unified honest status vocabulary
  (Playable Prototype / Early Prototype / Experimental Build — per Simon's Lane 2B vocabulary, not Grok's
  "Rough"), sticky in-page nav, responsive 3/2/1 grid, `data-media="placeholder"` hooks for future real
  covers.
- **🔍 Codex (final release review, 2026-07-14):** bounded read-only pass over the actual diff — **no
  release blocker** found (links, HTML validity, responsive/a11y basics, fake-content, game-source changes,
  Pages compatibility all clean). Flagged 2 non-blocking issues: a `--game-accent` CSS scoping bug (per-game
  colors silently fall back to global amber — cosmetic, deferred to `BACKLOG.md` B10) and stale commit facts
  in `PROJECT_STATE.md` (fixed same pass). Transcript: `docs/agent-runs/2026-07-14-codex-homepage-refresh-review.md`.
- **Simon's acceptance (2026-07-14, real browser):** homepage "looks fine." Nebula Rescue loads in
  **~5 seconds with no white screen** (previously observed as ~24s blank in the original screen recording —
  materially improved, cause still not diagnosed). **This is acceptance of the homepage presentation and
  imported-game launch smoke — not of deep Nebula gameplay/physics/slide/ramp/balance**, which remains
  future rescue work gated behind Game History Recovery.
- **Validation:** local HTTP server + Codex's independent re-verification (200s, tag-balance, zero
  `games/` diff) + Simon's own real-browser check. **Full multi-viewport (desktop/tablet-landscape/
  tablet-portrait/phone) sweep across all 7 games was not exhaustively itemized** — Simon's homepage + Nebula
  check was accepted as sufficient for tonight's ship; a formal Lane 2D pass remains available if needed later.
- **Status:** ✅ Accepted / committed. **Commit/push/deploy:** committed this pass; push follows immediately.
- **Next lane:** **Game History Recovery** — tomorrow's first task, per Simon's explicit sequencing.

### Lane 2D — Full Arcade Smoke  ·  Parked (Simon's live acceptance covered tonight's ship; formal sweep optional later)

---

## Game History Recovery  ·  ✅ Complete, pending Simon's review (stop before commit)

**Completed 2026-07-14.** Read-only investigation of the protected source archive (`..\PROTOTYPE ARCADE\`)
for Nebula Rescue, Halo FPS, Pictionary, Tower Defense, and World History Atlas — recovering
version/checkpoint history before any hands-on Nebula Rescue or Halo FPS source repairs (hard prerequisite,
`docs/BACKLOG.md` B8).

- **Goal:** recover durable version/checkpoint history from the protected, read-only source archive
  (`..\PROTOTYPE ARCADE` — never edited, renamed, or reorganized) for **Nebula Rescue, Halo FPS, Pictionary,
  Tower Defense, World History Atlas**. Chess and Bob Ross may be added only if evidence is readily
  available — must not dilute the five required.
- **Evidence to inspect (read-only):** version folders, filenames + internal visible version labels, hashes,
  changelog/readme/passover/handoff/history files, prompt notes, benchmark/final/master labels, duplicate
  files, clarifying screenshots, meaningful content diffs between versions. **Never rank builds by filename,
  modification date, or highest version number alone.**
- **Durable outputs:** `docs/game-history/README.md` + one file per game — `nebula-rescue.md`,
  `halo-fps.md`, `pictionary.md`, `tower-defense.md`, `world-history-atlas.md`. Each must contain: current
  provisional build, source archive locations, evidence confidence, version/checkpoint timeline, major
  changes per meaningful checkpoint, known-good checkpoints, regressions/abandoned experiments,
  internal-label/filename conflicts, exact useful quotes from source notes, protected wins / do-not-regress
  behavior, known unresolved problems, historical design intent, what still requires hands-on playtesting,
  recommended next hardening/rescue lane, and source filename/hash references.
- **Per-game specific tracking (do not drop any of these):**
  - **Nebula Rescue:** spinner implementation and later fixes; slide/ramp/rail changes; plunger; flipper
    controls; camera modes; table geometry; collision/physics changes; ball saves/kickbacks; scoring
    economy; mission progression; visual-theme changes; performance/FPS changes; known glitch periods;
    current v6.4 lineage; **which changes must not be bundled together during rescue.**
  - **Halo FPS:** the published v1.7.5.2-vs-v1.7.6 conflict; movement; weapons; enemies/AI; pickups/
    loadouts; map/camera changes; HUD/minimap; performance; multiplayer/friend-playtest benchmarks.
  - **Pictionary:** party-flow changes; drawing tools; secret-word/reveal flow; team/scoring changes;
    gallery exports vs. game builds; multiplayer/AI-image ambitions vs. current local build.
  - **Tower Defense:** economy; wave balance; towers/upgrades; enemy progression; scaling/difficulty; v6.1
    economy-rebalance lineage.
  - **World History Atlas:** clean-rebuild lineage; map provider/CDNs; GeoJSON/data sources; timeline/
    navigation; region/era coverage; performance/load issues; historical-content architecture.
- **Raw-note preservation:** when small source `.txt` files hold unique historical context, preserve their
  exact content under `docs/game-history/raw/` (already seeded with `2026-07-14-video-review.md`). **Never**
  copy whole historical HTML builds into `docs/`.
- **Never fabricate missing history** — use `Unknown` + an explicit confidence label wherever evidence is incomplete.
- **Integration (when this lane actually runs):** link outputs from `docs/GAME_CATALOG.md`, `docs/BACKLOG.md`,
  `docs/ROADMAP.md`, `docs/PHASE_LANES.md`, `docs/PROJECT_STATE.md`, `docs/PROJECT_LOG.md`.
- **🧠 Grok / 🔍 Codex:** unnecessary — this is Claude reading the local archive directly.
- **Explicit exclusions:** no game source changes, no source-archive changes, no commit/push/deploy. Read-only
  investigation only — stop for Simon's review at the end.
- **Status:** ✅ Complete, pending Simon's review (stop before commit). All 5 durable output files +
  `README.md` written under `docs/game-history/`; 5 source `.txt` files preserved verbatim under
  `docs/game-history/raw/`. No game source, source-archive, or commit/push/deploy actions taken.
- **Next lane:** Nebula Rescue rescue/hardening (`BACKLOG.md` B8) — only after Simon reviews this lane's
  output.
