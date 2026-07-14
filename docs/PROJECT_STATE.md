# Project State

_What is true right now._ Update this whenever the truth changes. Keep it short and current.
Last updated: **2026-07-13**.

## Current phase
**Arcade Expansion & Homepage Refresh sprint** (reprioritized 2026-07-14). Deep Halo/published-build
reconciliation is deferred behind this sprint, not dropped — see Known risks below.

## Current lane
**Lane 2C — Homepage Arcade Refresh.** Status: **✅ Shipped.** Committed (`af0bc0b`), pushed, and live —
verified by real rendered visual inspection plus HTTP checks on the public URL. Simon accepted the homepage
in his own browser; Nebula Rescue now loads in ~5s with no white screen (down from ~24s). 🔍 Codex's final
release review found no blockers.

## Exact next action
**Tomorrow's first task: Game History Recovery** (read-only investigation, `docs/PHASE_LANES.md`) — recover
durable version/checkpoint history for Nebula Rescue, Halo FPS, Pictionary, Tower Defense, and World History
Atlas from the protected source archive, **before any hands-on Nebula Rescue or Halo FPS source changes.**
This is a hard prerequisite, not a suggestion (see `docs/BACKLOG.md` B8). Not started tonight.

## Published state (live == repo)
- 🟢🚀 **Live 2026-07-14, source `af0bc0b`:** https://smurphy1398.github.io/prototype-arcade/ — the new
  7-game "Prototype Cabinet Row" homepage is live (featured Halo, Floor grid of 6, Bonus/Side Room Atlas).
  **Verified by actual rendered visual inspection** (headless Chrome screenshots, viewed directly — not HTTP
  alone) plus HTTP 200 on the homepage and all 7 game URLs. GitHub Pages took ~30–60s after push to
  redeploy (first check still showed the old 3-card page; second check, after a short wait, showed the new
  homepage).
- All 3 pre-existing public game URLs (`games/{halo-fps,tower-defense,bob-ross}.html`) confirmed still valid.
- GitHub Pages serves `main` at repo root (inferred; no CNAME/.nojekyll/workflow). Pages build status not
  directly inspectable via API (no `gh`), but deployment is now confirmed by direct visual + HTTP evidence.
- **Not verified tonight:** in-browser gameplay/interaction for any of the 4 newly imported games on the
  live production URL — only Simon's local-server check (homepage + Nebula) and this session's local/prod
  visual + HTTP checks. Deep Nebula Rescue gameplay/physics/balance remains explicitly open.

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
