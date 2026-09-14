# Project State

_What is true right now._ Update this whenever the truth changes. Keep it short and current.
Last updated: **2026-07-15**. Reflects: pre-checkpoint state — local `HEAD 68cf795` · `origin/main 68cf795` ·
in sync (0 ahead/0 behind), tree clean. This B8-diagnosis docs checkpoint (`docs: record nebula B8
diagnosis`) becomes the new committed/pushed tip immediately after this edit lands.

## Current phase
**Arcade Expansion & Homepage Refresh sprint** (reprioritized 2026-07-14). Deep Halo/published-build
reconciliation is deferred behind this sprint, not dropped — see Known risks below.

## Current lane
**B8 — Nebula Rescue read-only diagnosis.** Status: **✅ Complete, docs-only checkpoint (this pass).**
Read-only diff/code trace of v6.3 vs. v6.4 completed 2026-07-15 (Opus/High). Disproved the inherited
"cleanup may have removed a return rail" lead (the `rail`/`habitrail` reference-count drop is prose-only;
all ramp/rail/return code is byte-identical between v6.3 and v6.4). New primary finding: the visible ramp
tube and the actual floor-trigger/scripted-glide path are **geometrically decoupled** objects — a plausible,
statically-confirmed root cause. **In-play gameplay reproduction of the exact failure mode is still not
done** — headless Chrome confirmed the game loads/renders cleanly (no real white-screen bug) but could not
click past the start screen to drive gameplay. Full record:
`docs/agent-runs/2026-07-15-claude-nebula-b8-read-only-diagnosis.md`. `docs/game-history/nebula-rescue.md`
corrected to match. No Nebula source (or any runnable source) edited; no archive file touched.

## Exact next action
**Simon runs the hands-on smoke test** in
`docs/agent-runs/2026-07-15-claude-nebula-b8-read-only-diagnosis.md` (shoot the ramp, report which of 4
failure modes he observes), which determines the actual B8 patch scope. **The B8 patch lane itself is not
started and stays blocked until that hands-on confirmation lands** — 🔒 the protected spinner tuning
(torque `Math.min(5.6,1.45+passSpeed*.38)`, clamp ±14) must not regress whenever that lane opens.

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

## Repo status (refreshed 2026-07-15 — verified against `git`; corrects stale 2026-07-14 claims below)
- Pre-checkpoint: `origin/main` tip = local `HEAD` = **`68cf795`** (`docs: clarify nebula slide history
  lead`) — **fully in sync, 0 ahead/0 behind, tree clean.** The Game History Recovery lane (previously shown
  as committed-but-unpushed at `f65aac3`) and the subsequent `9d2e5b6`/`68cf795` doc passes are **all
  committed and pushed** — `PROJECT_STATE.md` had not been refreshed to reflect this until now.
- This B8 diagnosis docs checkpoint (`docs: record nebula B8 diagnosis`) is the next commit after `68cf795`
  — see the top-of-file freshness line for its exact hash once pushed.
- Lane 2C (`index.html` refresh) is **committed (`af0bc0b`) and pushed** — accepted by Simon and live. Lane
  2D full-arcade smoke is **Parked**.
- Game History Recovery is **docs-only, committed and pushed** (superseding the earlier "awaiting Simon's
  review before push" note — it shipped as part of `f65aac3`→`68cf795`).
- History (newest first, pre-checkpoint): `68cf795 docs: clarify nebula slide history lead` →
  `9d2e5b6 docs: adopt v1.3 report rules and refresh canonical state` →
  `f65aac3 docs: recover game history and checkpoint context` →
  `c9e4c52 docs: record seven-game arcade homepage release` →
  `af0bc0b feat: refresh prototype arcade homepage` →
  `9f0c517 docs: checkpoint visual review and reporting workflow` →
  `7d19000 feat: import chess, nebula rescue, pictionary, and world history atlas` →
  `2bc6c03 docs: prioritize arcade expansion and homepage refresh` →
  `7d4d512 docs: add prototype arcade status skills and roadmap` →
  `e9839cc docs: establish prototype arcade project foundation` → `0ea750e Add Tower Defense and Bob Ross builds`.

## Known risks / watch items
- ⚠️ Halo provenance conflict (above) — **deferred, not dropped**; must resolve before Halo can be called Confirmed.
- ⚠️ `gh` (GitHub CLI) not installed; `github` MCP returning HTTP 400 → GitHub automation unavailable.
- ⚠️ **5 of 7 games now require internet to fully function** (Halo/Babylon, Chess & Nebula Rescue/Three.js-CDN,
  World History/Leaflet+GeoJSON+Wikipedia) — fine on GitHub Pages, broken offline; each landing page says so honestly.
  (Chess/Nebula Rescue's CDN dependency was miscategorized as "inlined" in the original Lane 1 audit — corrected
  2026-07-14 after a Lane 2B 🔍 Codex review caught it; see `docs/agent-runs/2026-07-14-codex-missing-games-import-review.md`.)
- 🔴 **Nebula Rescue — top-priority rescue candidate** (Simon, 2026-07-14, verbatim in `RAW_IDEA_INBOX.md`):
  slide/ramp broken, general glitchiness, balance needs serious work. **🔒 Protected win: the spinners were
  just fixed — do not regress them.** See `docs/BACKLOG.md` B8. Game History Recovery and the B8 **read-only
  diagnosis** are both complete (`docs/game-history/nebula-rescue.md`,
  `docs/agent-runs/2026-07-15-claude-nebula-b8-read-only-diagnosis.md`) — the diagnosis found the reported
  "removed return rail" lead to be false (prose-only reference-count drop) and instead identifies a
  statically-confirmed decorative-ramp/scripted-glide geometry decoupling as the likely cause. **The B8
  patch lane is not open** — it stays blocked on Simon's hands-on smoke to confirm the actual in-play
  failure mode before any source edit.
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
**Game History Recovery pass:** 🧭 Claude (Sonnet) only — used 5 parallel read-only `Explore` subagents
(no edit/write tools, cannot touch the source archive) to investigate each game's folder concurrently,
then personally synthesized and wrote all `docs/game-history/` output. No 🧠 Grok/🔍 Codex runs this pass
**B8 diagnosis pass (2026-07-15):** 🧭 Claude (Opus/High, inline) only — full v6.3↔v6.4 diff, code trace,
one headless-Chrome load-render check. No 🧠 Grok/🔍 Codex runs; this docs-only checkpoint persists that
diagnosis and repairs the stale repo-status claims above.
(lane spec judged them unnecessary for reading a local archive).
