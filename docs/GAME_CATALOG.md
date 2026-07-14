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
| 3D Chess + Checkers | Three.js (inlined) | ❌ local only | Provisional — v2.3 vs v2.2 unresolved | Medium |
| Pinball / Nebula Rescue | Three.js (inlined) | ❌ local only | Provisional — v6.4 | Medium |
| Pictionary "Draw It!" | Canvas 2D | ❌ local only | Provisional — game vs export files | Medium |
| World History / True History Atlas | Leaflet (CDN) | ❌ local only (bonus) | Provisional — v8 | Medium |

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

## Tower Defense
- **Published:** `games/tower-defense-game.html` — hash `948f2386`, 68,559 B. Internal `<title>` `Tower Defense V6.1` (matches card).
- **Best local candidate (Provisional canonical):** `towerdefense\v6.1 economy rebalance\tower-defense-v6.1.html`
  — hash `e5fb2ac0`, 68,115 B, `<title> Tower Defense V6.1`.
- **Alternatives:** `v6` (`f3e3740d`). Full v1→v6.1 ladder in the tree.
- **Runtime:** Canvas 2D, self-contained. **Controls:** mouse. Desktop; likely mobile-tolerant.
- **Must test:** confirm published ≈ v6.1 by diff; quick playtest. Then Confirm.

## Bob Ross Painting Sim
- **Published:** `games/bob-ross-game.html` — hash `282325ef`, 18,161 B, `<title> Happy Accidents Painting Simulator`. Card label v0.1.
- **Best local candidate (Provisional canonical):** `bob ross sim\v1 prototype\bob_ross_painting_simulator_prototype.html`
  — hash `064298e0`, 17,537 B (only meaningful build). Sibling `saved art\happy-accident-masterpiece.png` is a user save, not an asset.
- **Runtime:** Canvas 2D, self-contained. **Controls:** mouse/touch paint. Desktop + maybe mobile.
- **Must test:** playtest save/export. Then Confirm.

## 3D Chess + Checkers  (not published)
- **Provisional canonical:** `3d chess\v2.3 - Master fast\Chess-Checkers-3D-v2-2-MASTER.html` — hash `73d677e7`, 50,490 B (newest folder, largest, distinct hash).
- **Alternative:** `3d chess\v2.2 - Master\Chess-Checkers-3D-v2-2-Master.html` — hash `61d008a3`, 49,790 B.
- **⚠️ Internal-label conflict:** v2.1, v2.2, and v2.3 **all** internally title themselves `Chess 3D + Checkers - v2.0 Premium WebGL`,
  and the v2.3 folder's file is *named* `...v2-2-MASTER`. Folder/file labels cannot rank them — content differs (distinct hashes).
- **Runtime:** Three.js **inlined**, self-contained (no external src). **Controls:** mouse click. Desktop + mobile-tolerant.
- **Must test:** playtest v2.2 vs v2.3 head-to-head, pick the winner. Then Confirm.

## Pinball / Nebula Rescue  (not published)
- **Provisional canonical:** `3d space pinball game\rescue nebula - v2\Nebula_Rescue_v6_4_Control_Clarity_Nebula_Art_Benchmark.html`
  — hash `a5693986`, 129,433 B, `<title> Nebula Rescue v6.4 — Control + Clarity + Nebula Art Benchmark` (internal label self-consistent).
- **⚠️ Version-label conflict:** the three "v6.3 benchmark" files internally title themselves **`Nebula Rescue Pinball v4.9`**.
  Lineage: legacy **Cosmic Pinball 3D** (`space_pinball` v1→v3) was redesigned into **Nebula Rescue** (v4.9-labeled "v6.3" → v6.4).
- **Runtime:** Three.js **inlined**, self-contained. **Controls:** keyboard flippers + touch patterns present. Desktop; mobile uncertain.
- **Must test:** playtest v6.4 for stability ("benchmark" build); confirm it supersedes v6.3. Then Confirm.

## Pictionary "Draw It! Master Party Edition"  (not published)
- **Provisional canonical:** `pictionary\pictionary_party_game (7).html` — hash `d729e200`, 61,168 B, `<title> Draw It! Master Party Edition`.
- **Alternative:** `pictionary\pictionary_party_game (6).html` — hash `294e3ec0`, 58,245 B.
- **⚠️ Not builds:** `pictionary\2026-05-23-mixed.html` (473 KB) and `2026-05-23-dirty-that-was-pretty-good.html` (965 KB)
  are **gallery exports** (internal title `... Gallery`, embedded image data) — output artifacts/evidence, **not** the game.
- **Runtime:** Canvas 2D, self-contained. **Controls:** mouse/touch draw. Local/hotseat party edition.
- **Vision gap:** the idea list wants **multiplayer + AI image-to-image generation**; the current build is a local party edition.
- **Must test:** playtest (6) vs (7); pick game file, ignore exports. Then Confirm.

## World History Map / True History Atlas  (bonus — not in the original 3, not published)
- **Provisional canonical:** `world history map\v8 - clean rebuild\true-atlas-v8.html` — hash `cb66b407`, 68,531 B, `<title> True History Atlas — Friend Test Benchmark`.
- **Alternatives:** v7.3–v7.6 "…Final Benchmark" siblings.
- **Runtime:** Leaflet 1.9.4 via `unpkg.com` (needs internet + map tiles). **Controls:** mouse/touch map pan/zoom. Desktop + mobile.
- **Must test:** playtest map + tile loading online. Then Confirm.

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
- Games reference no external image/audio files → **no missing-asset risk**; the only external deps are the Babylon and Leaflet CDNs.
