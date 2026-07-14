# Game Catalog

Canonical inventory of every recognizable game. **Confirmed** = evidence supports it as canonical.
**Provisional** = best current candidate, still needs a runtime playtest / diff before it's locked.
Source paths are relative to the protected import collection `..\PROTOTYPE ARCADE\` unless noted.
Never promote a candidate to Confirmed on filename or version number alone — see the conflicts below.

Seeded from the 2026-07-13 orientation audit (read-only). Hashes are MD5.

---

## Summary

| Game | Runtime | Published? | Canonical status | Confidence |
|---|---|---|---|---|
| Halo FPS Arena | Babylon.js (CDN) | ✅ live | ⚠️ Provisional — published file matches no local build | Medium |
| Tower Defense | Canvas 2D | ✅ live | Provisional (published ≈ local v6.1) | High |
| Bob Ross Painting Sim | Canvas 2D | ✅ live | Provisional (only meaningful build) | High |
| 3D Chess + Checkers | Three.js (inlined) | ✅ **imported 2026-07-14** (Lane 2B) | Provisional — v2.3 chosen over v2.2 (playtest still pending) | Medium |
| Pinball / Nebula Rescue | Three.js (inlined) | ✅ **imported 2026-07-14** (Lane 2B) | Provisional — v6.4 (playtest still pending) | Medium |
| Pictionary "Draw It!" | Canvas 2D | ✅ **imported 2026-07-14** (Lane 2B) | Provisional — game file (7), not the exports (playtest still pending) | Medium |
| World History / True History Atlas | Leaflet (CDN) | ✅ **imported 2026-07-14** (Lane 2B, bonus) | Provisional — v8 (playtest still pending) | Medium |

**Importing ≠ Confirmed.** All four newly imported games are honestly labeled Playable/Experimental
Prototype on their landing pages — none are claimed as final or canonical. Copies are byte-identical to
their source files (verified by hash below); nothing in game logic, internal version labels, or the source
archive was altered.

Published game-file hashes (live == repo, confirmed): `halo-fps-game.html eb9e655c` ·
`tower-defense-game.html 948f2386` · `bob-ross-game.html 282325ef`.
**All three differ by hash from every local build** — the published copies are lightly-edited
derivatives, so the repo and the source archive have diverged.

---

## Halo FPS Arena  ⚠️
- **Published:** `games/halo-fps-game.html` (repo) — hash `eb9e655c`, 233,469 B. Landing/homepage label **v1.7.6**.
- **⚠️ Version conflict:** the published game file's own `<title>` is **`Low-Poly Arena FPS v1.7.5.2`**, yet the
  wrapper pages advertise **v1.7.6**. The published file is **larger** than local v1.7.6 and matches **no** local
  build by hash → provenance uncertain (a hand-edited derivative).
- **Best local candidate (Provisional canonical):**
  `3d halo fps arena\v1.7 — Loadout Combat Playtest\v1.7.6 — Friend Playtest Benchmark\arena-fps-v1-7-6.html`
  — hash `f7d1714e`, 230,660 B (matches the advertised v1.7.6 label).
- **Alternatives:** local `v1.7.5.3` (`990f2936`), `v1.7.5.2` (`e8f0c22`).
- **Runtime:** Babylon.js via `cdn.babylonjs.com/babylon.js` (needs internet). **Controls:** WASD move, mouse-look
  (pointer-lock), click shoot, Esc pause. Desktop only; no touch/gamepad. ~60-version history in the source tree.
- **Must test before Confirmed:** diff/playtest the live file vs `arena-fps-v1-7-6.html`; decide which becomes canonical
  and make the advertised version honest.
- **Full version history:** `docs/game-history/halo-fps.md` (Game History Recovery lane, 2026-07-14) —
  resolves the v1.7.5.2-vs-v1.7.6 conflict as a stale-title bug, not a real fork.

## Tower Defense
- **Published:** `games/tower-defense-game.html` — hash `948f2386`, 68,559 B. Internal `<title>` `Tower Defense V6.1` (matches card).
- **Best local candidate (Provisional canonical):** `towerdefense\v6.1 economy rebalance\tower-defense-v6.1.html`
  — hash `e5fb2ac0`, 68,115 B, `<title> Tower Defense V6.1`.
- **Alternatives:** `v6` (`f3e3740d`). Full v1→v6.1 ladder in the tree.
- **Runtime:** Canvas 2D, self-contained. **Controls:** mouse. Desktop; likely mobile-tolerant.
- **Must test:** confirm published ≈ v6.1 by diff; quick playtest. Then Confirm.
- **Full version history:** `docs/game-history/tower-defense.md` (Game History Recovery lane, 2026-07-14) —
  highest-confidence report of the five; full authored changelog trail v2-v6.1.

## Bob Ross Painting Sim
- **Published:** `games/bob-ross-game.html` — hash `282325ef`, 18,161 B, `<title> Happy Accidents Painting Simulator`. Card label v0.1.
- **Best local candidate (Provisional canonical):** `bob ross sim\v1 prototype\bob_ross_painting_simulator_prototype.html`
  — hash `064298e0`, 17,537 B (only meaningful build). Sibling `saved art\happy-accident-masterpiece.png` is a user save, not an asset.
- **Runtime:** Canvas 2D, self-contained. **Controls:** mouse/touch paint. Desktop + maybe mobile.
- **Must test:** playtest save/export. Then Confirm.

## 3D Chess + Checkers  ✅ imported 2026-07-14
- **Repository path:** `games/chess.html` (landing) + `games/chess-game.html` (game).
- **Source path:** `3d chess\v2.3 - Master fast\Chess-Checkers-3D-v2-2-MASTER.html`
- **Source hash:** `73d677e7` (50,490 B) → **Imported hash:** `73d677e7` (byte-identical, verified).
- **Version evidence:** internal `<title>` says `Chess 3D + Checkers - v2.0 Premium WebGL`; folder says v2.3.
  Chosen over v2.2 (`61d008a3`, 49,790 B) as newest/largest/distinct — **not yet playtested head-to-head**.
- **⚠️ Internal-label conflict (preserved, not resolved):** v2.1, v2.2, and v2.3 **all** internally title
  themselves `v2.0 Premium WebGL`; the v2.3 file is even *named* `...v2-2-MASTER`. Folder/file labels cannot
  rank them — content differs by hash. Not rewritten to hide this.
- **Runtime:** Three.js loaded via ES module `import` from `cdn.jsdelivr.net/npm/three@0.160.0` —
  **requires internet**, not self-contained. (Corrected 2026-07-14: the earlier Lane 1 audit's "inlined,
  self-contained" call was wrong — the `<script src=...>` grep used in that audit missed ES-module
  `importmap`/`import` loading. Caught by the Lane 2B 🔍 Codex review; verified directly before fixing.)
- **Status:** Provisional — Playable Prototype label on landing page.
- **Controls:** mouse click/select. **Devices:** desktop + mobile-tolerant (touch works).
- **Validation performed:** HTTP 200 via local server; content byte-verified against source; nav links
  (`chess-game.html`, `../index.html`) verified to resolve to existing files. **No in-browser
  render/gameplay test performed this lane** (see Lane 2B report for validation-depth statement).
- **Future testing still required:** in-browser playtest; v2.2-vs-v2.3 head-to-head; then Confirm.

## Pinball / Nebula Rescue  ✅ imported 2026-07-14
- **Repository path:** `games/nebula-rescue.html` (landing) + `games/nebula-rescue-game.html` (game).
- **Source path:** `3d space pinball game\rescue nebula - v2\Nebula_Rescue_v6_4_Control_Clarity_Nebula_Art_Benchmark.html`
- **Source hash:** `a5693986` (129,433 B) → **Imported hash:** `a5693986` (byte-identical, verified).
- **Version evidence:** internal `<title>` self-consistently says `Nebula Rescue v6.4 — Control + Clarity +
  Nebula Art Benchmark`.
- **⚠️ Version-label conflict (preserved, not resolved):** the three "v6.3 benchmark" source files internally
  title themselves `Nebula Rescue Pinball v4.9`. Lineage: legacy Cosmic Pinball 3D (v1→v3) → Nebula Rescue
  (v4.9-labeled "v6.3" → this v6.4). Documented honestly on the landing page.
- **Runtime:** Three.js loaded via ES module `import` from `cdn.jsdelivr.net/npm/three@0.160.0` —
  **requires internet**, not self-contained (same correction as Chess, above — Codex-caught).
- **Status:** Provisional — Playable Prototype label on landing page.
- **Controls:** keyboard flippers; some touch present. **Devices:** desktop primary; mobile uncertain.
- **Validation performed:** HTTP 200; content byte-verified; nav links verified. **No in-browser
  render/gameplay test performed this lane.**
- **Future testing still required:** in-browser playtest for stability; confirm v6.4 truly supersedes v6.3; then Confirm.
- **Full version history:** `docs/game-history/nebula-rescue.md` (Game History Recovery lane, 2026-07-14) —
  confirms the protected spinner-tuning win; finds no archive evidence explaining the reported slide/ramp
  break.

## Pictionary "Draw It! Master Party Edition"  ✅ imported 2026-07-14
- **Repository path:** `games/pictionary.html` (landing) + `games/pictionary-game.html` (game).
- **Source path:** `pictionary\pictionary_party_game (7).html`
- **Source hash:** `d729e200` (61,168 B) → **Imported hash:** `d729e200` (byte-identical, verified).
- **Version evidence:** internal `<title>` says `Draw It! Master Party Edition`. Chosen over `(6).html`
  (`294e3ec0`, 58,245 B) as the newer of the two actual game builds.
- **Not imported (correctly excluded):** `2026-05-23-mixed.html` / `...dirty-that-was-pretty-good.html` —
  these are gallery **exports** (internal title `... Gallery`, embedded image data), not the game itself.
- **Runtime:** Canvas 2D, self-contained, no internet required.
- **Status:** Provisional — Playable Prototype label on landing page. Local/hotseat only.
- **Controls:** mouse/touch draw. **Devices:** desktop + mobile.
- **Vision gap (unchanged):** the idea list wants multiplayer + AI image-to-image generation; current build
  is local/hotseat only — noted honestly on the landing page as a future idea, not a promise.
- **Validation performed:** HTTP 200; content byte-verified; nav links verified. **No in-browser
  render/gameplay test performed this lane.**
- **Future testing still required:** in-browser playtest; (6) vs (7) comparison if desired; then Confirm.
- **Full version history:** `docs/game-history/pictionary.md` (Game History Recovery lane, 2026-07-14) —
  thinnest evidence of the five games researched (no changelogs, no code comments).

## World History Map / True History Atlas  ✅ imported 2026-07-14 (bonus)
- **Repository path:** `games/world-history.html` (landing) + `games/world-history-game.html` (game).
- **Source path:** `world history map\v8 - clean rebuild\true-atlas-v8.html`
- **Source hash:** `cb66b407` (68,531 B) → **Imported hash:** `cb66b407` (byte-identical, verified).
- **Version evidence:** internal `<title>` says `True History Atlas — Friend Test Benchmark`. Chosen over
  v7.3–v7.6 "…Final Benchmark" siblings as newest.
- **Runtime:** Leaflet 1.9.4 from `unpkg.com`, **plus** live runtime fetches of historical-boundary GeoJSON
  from `raw.githubusercontent.com` and event summaries/thumbnails from the Wikipedia REST API
  (`en.wikipedia.org/api/rest_v1/...`). **Requires internet** for all of the above; will not fully work
  offline. Documented explicitly and visibly on the landing page (corrected 2026-07-14 — the GeoJSON/Wikipedia
  fetches were missed in the original landing-page copy; Codex-caught in the Lane 2B review).
- **Status:** Provisional — labeled **Experimental Build (bonus prototype)**, described as an interactive
  experience rather than a traditional game, per its non-game nature.
- **Controls:** mouse/touch pan/zoom. **Devices:** desktop + mobile.
- **Validation performed:** HTTP 200 for the local file; CDN dependency **not** exercised in this lane's
  local-server validation (local server has no bearing on whether `unpkg.com` is reachable at runtime — that
  depends on the visitor's own internet access, same as the live Halo/Babylon.js dependency already published).
  Content byte-verified; nav links verified. **No in-browser render/gameplay test performed this lane.**
- **Future testing still required:** in-browser test with live internet access to confirm tiles load; then Confirm.
- **Full version history:** `docs/game-history/world-history-atlas.md` (Game History Recovery lane,
  2026-07-14) — traces the v1-v8 clean-rebuild lineage and the v7 UI regression fixed in v7.1.

---

## Byte-identical duplicates (collapse to one canonical, archive the rest — never silently delete)
- `towerdefense\tower-defense.html` **==** `towerdefense\v1\tower-defense.html`  (`6d5b8f5f`)
- `world history map\v1 - wireframe\true-atlas-v1.html` **==** `world_history_map_prototype.html`  (`471038b2`)
- `world history map\v8 - clean rebuild\true-atlas-v8.html` **==** `world_history_map_prototype (19).html`  (`cb66b407`)
- **Nebula Rescue v6.3 exists in triplicate** (`ac657a21`): `3d space pinball game\Nebula Rescue v6.3 benchmark.html`,
  `…\rescue nebula - v1\Nebula Rescue v6.3 benchmark.html`, `…\rescue nebula - v1\nebula_rescue_v63_last_chance_clean_benchmark.html`

## Notes
- No `.jsx` / `.js` / `.css` / `.json` / `.zip` / fonts / models / textures exist in the collection — everything is
  standalone HTML. Nothing warrants React/Vite. PNGs present are user-saves or dev screenshots, not runtime assets.
- Games reference no external *image/audio* files → no missing-asset risk in that sense. **External
  script/data dependencies (updated 2026-07-14, Codex-verified):** Halo → Babylon.js (`cdn.babylonjs.com`);
  Chess & Nebula Rescue → Three.js via ES module import (`cdn.jsdelivr.net`); World History → Leaflet
  (`unpkg.com`) + live GeoJSON (`raw.githubusercontent.com`) + Wikipedia REST API. Tower Defense, Bob Ross,
  and Pictionary remain fully self-contained. **5 of 7 games now require internet access to fully function**
  — this is fine on GitHub Pages (which is itself served over the internet) but each affected game's landing
  page says so honestly.
