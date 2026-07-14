# Project State

_What is true right now._ Update this whenever the truth changes. Keep it short and current.
Last updated: **2026-07-13**.

## Current phase
**Arcade Expansion & Homepage Refresh sprint** (reprioritized 2026-07-14). Deep Halo/published-build
reconciliation is deferred behind this sprint, not dropped — see Known risks below.

## Current lane
**Lane 2C — Homepage Arcade Refresh.** Status: **🟡 Implemented, awaiting Simon's local visual review**.
🧭 Claude sole editor; implemented the Claude-selected, Grok-informed "Prototype Cabinet Row" direction from
Lane 2A. Lane 2B (4 game imports) is ✅ committed (`7d19000`). Lane 2A (`2bc6c03`) and Lane 1B (`7d4d512`)
are committed, not yet pushed.

## Exact next action
1. **Simon:** open `http://127.0.0.1:8791/index.html` on this machine (local server running) and visually
   review the new homepage — desktop, then resize for tablet/phone. This is the lane's explicit visual gate;
   Claude has not automated it (no headless-browser/screenshot tool available).
2. On acceptance: run the bounded 🔍 Codex review of the `index.html` diff (links, responsive, accessibility,
   Pages compatibility, no accidental runtime changes), then commit Lane 2C.
3. Then **Lane 2D — full arcade smoke** across desktop/tablet/phone, all 7 URLs, existing 3 unaffected.
4. Lanes 1B/2A/2B (`7d4d512`/`2bc6c03`/`7d19000`) still need a **separate push approval** — nothing pushed yet.

## Published state (live == repo)
- 🟢 Live & smoke-passed 2026-07-13 (after the docs-only push): https://smurphy1398.github.io/prototype-arcade/ —
  homepage loads; Halo FPS (card v1.7.6), Tower Defense (v6.1), Bob Ross (v0.1) present with Play links; no runtime change (expected).
- GitHub Pages serves `main` at repo root (inferred; no CNAME/.nojekyll/workflow). Pages build status not directly inspectable (no `gh`/API).

## Canonical games (all Provisional — see `GAME_CATALOG.md`; publishing Provisional is OK, mislabeling as Confirmed is not)
- Halo FPS — ⚠️ published file matches no local build and mislabels its own version (title v1.7.5.2 vs card v1.7.6). Deferred to the Lane 2 hardening pass — does not block this sprint since it doesn't block importing/launching other games.
- Tower Defense — published ≈ local v6.1 (High).
- Bob Ross — only meaningful build (High).
- Chess/Checkers, Nebula Rescue pinball, Pictionary, World History Atlas — **imported 2026-07-14** (Lane 2B), all Provisional/Playable-or-Experimental Prototype, none Confirmed. In-browser playtest still required for all four.

## Repo status (corrected 2026-07-14, per 🔍 Codex catching this had gone stale)
- Lane 1 foundation **committed** (`e9839cc`) and **pushed**; that commit is still `origin/main`'s tip.
- Lane 1B, Lane 2A, and Lane 2B (4 game imports) are all **committed locally**, local `HEAD` = `7d19000`,
  **not yet pushed** — local `main` is ahead of `origin/main` by 3 commits.
- Lane 2C (`index.html` refresh) is **implemented and visually accepted by Simon, not yet committed** —
  proceeding through the final release sequence now.
- History (newest first): `7d19000 feat: import chess, nebula rescue, pictionary, and world history atlas` →
  `2bc6c03 docs: prioritize arcade expansion and homepage refresh` →
  `7d4d512 docs: add prototype arcade status skills and roadmap` →
  `e9839cc docs: establish prototype arcade project foundation` (= current `origin/main`) →
  `0ea750e Add Tower Defense and Bob Ross builds`.

## Known risks / watch items
- ⚠️ Halo provenance conflict (above) — **deferred, not dropped**; must resolve before Halo can be called Confirmed.
- ⚠️ `gh` (GitHub CLI) not installed; `github` MCP returning HTTP 400 → GitHub automation unavailable.
- ⚠️ **5 of 7 games now require internet to fully function** (Halo/Babylon, Chess & Nebula Rescue/Three.js-CDN,
  World History/Leaflet+GeoJSON+Wikipedia) — fine on GitHub Pages, broken offline; each landing page says so honestly.
  (Chess/Nebula Rescue's CDN dependency was miscategorized as "inlined" in the original Lane 1 audit — corrected
  2026-07-14 after a Lane 2B 🔍 Codex review caught it; see `docs/agent-runs/2026-07-14-codex-missing-games-import-review.md`.)
- 🔴 **Nebula Rescue — top-priority rescue candidate** (Simon, 2026-07-14, verbatim in `RAW_IDEA_INBOX.md`):
  slide/ramp broken, general glitchiness, balance needs serious work. **🔒 Protected win: the spinners were
  just fixed — do not regress them.** See `docs/BACKLOG.md` B8. **Hard prerequisite: no Nebula source edits
  until the Game History Recovery lane completes** (`docs/PHASE_LANES.md`) — sequenced as the explicit next
  lane after Lane 2C.
- ⚠️ Local MLB clone lacks `roadmap`/`phaselane`/`whatsnext` skills (only `handoff` present); Arcade skills authored fresh from Simon's spec.
- 🔒 `..\PROTOTYPE ARCADE` source collection is a protected read-only archive; a separate-drive backup also exists.

## Visual-access capability (2026-07-14)
- **Claude:** confirmed Chrome + Edge exist locally; headless Chrome screenshot capture against the local
  server verified working (see `docs/PROJECT_LOG.md` for the exact result). No packages installed.
- **🧠 Grok (local CLI):** text-only — no `--image`/attach flag found in `grok --help`. Cannot see a
  screenshot or video frame through this integration.
- **🔍 Codex (local CLI):** supports `-i/--image <FILE>` — can genuinely review a screenshot once one exists.
- **`ffmpeg`:** not installed — no video-frame extraction available without a package install (flagged as a
  blocker, not installed silently).

## Agents this session
**Agents:** 🧭 Claude (Opus, sole editor) · 🧠 Grok (one bounded homepage/product-direction review, Lane 2A) ·
🔍 Codex (one bounded read-only import review, Lane 2B — 2 real findings, both fixed). No 🛠️ Fable runs.
This capture pass: 🧭 Claude only (capability probe + docs; no outside agents needed).
