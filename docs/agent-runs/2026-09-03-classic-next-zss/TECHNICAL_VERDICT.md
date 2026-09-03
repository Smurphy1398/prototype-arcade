# TECHNICAL VERDICT — Classic / Next ZSS floor wiring

**Reviewer:** Grok technical pass (read-only). Not Codex. Not owner smoke.  
**Worktree:** `C:\Users\smurp\Documents\Projects\AI Projects 26\arcade-classic-next-2026-09-03`  
**Date:** 2026-09-03  
**Method:** static inspection of HTML/CSS/JSON + SHA-256 of named files. TCP `127.0.0.1:8766` was **down** (`TcpTestSucceeded=False`); no HTTP/serve, launch/render, or gameplay rung.

## Verdict: PASS

All **eight assigned checks** hold on disk. This is **not** HTTP-verified and **not** a playthrough. Adjacent Next-floor lobby defects are recorded as open risks and do **not** fail the ZSS Play wiring.

| # | Check | Result |
|---|---|---|
| 1 | Classic Floor ZSS card → `games/zombie-survivors-latest.html` | **PASS** |
| 2 | Next Floor Play → same landing, not `../../PROTOTYPE ARCADE` | **PASS** |
| 3 | Candidate `index.html` + `three.min.js` exist | **PASS** |
| 4 | Back-navigation Classic ← → Next | **PASS** (floor pages) |
| 5 | Style switcher does not delete Classic | **PASS** |
| 6 | v3.0 labeled CANDIDATE / NOT OWNER-ACCEPTED, never Stable | **PASS** |
| 7 | No v3.1.x Arcade artifact invented | **PASS** |
| 8 | Classic `@media`; Next `.floor` `auto-fill` | **PASS** |

---

## 1. Classic Floor ZSS card — PASS

Exact path: `index.html` (20,519 B, SHA-256 `f8d365d94848e2cb73ae59ee99064d9920dc751eaa9346328bf0632a596bfc7d`)

Floor cabinet (first card in `#floor .grid`):

```html
<a class="cabinet" href="games/zombie-survivors-latest.html">
```

Cover CSS: `.cover[data-game="zombie-survivors"]` uses `url("assets/covers/zombie-survivors.jpg")`.  
Cover file: `assets/covers/zombie-survivors.jpg` — 354,600 B, SHA-256 `96b0a0e0847dd5d813fb9ad856053bd2be8844172c8451bbd33a0c930a5b860d`.

Pre-existing Classic cabinets remain: featured Halo (`games/halo-fps.html`), Floor TD / Bob Ross / Rubik / Chess / Nebula / Pictionary, Bonus True History Atlas.

## 2. Next Floor Play — PASS (ZSS)

Exact path: `next/index.html` (9,464 B, SHA-256 `351fe114fe4bac19e2f7866cdb89471c195d3369d68ba349dc9e41e75f90f7dc`)

ZSS Play:

```html
<a class="btn" href="../games/zombie-survivors-latest.html">Play</a>
```

That is the same Arcade landing as Classic. It is **not** a `../../PROTOTYPE ARCADE` or `../../../PROTOTYPE%20ARCADE` URL.

Other Next **floor** Launch buttons also target Arcade landings (`../games/halo-fps.html`, `tower-defense.html`, `bob-ross.html`, `chess.html`, `rubiks-cube.html`, `world-history.html`, `pictionary.html`, `nebula-rescue.html`). Floor Play/Launch for ZSS is in-scope PASS.

**Out of this check, still broken:** Next **lobby** Launch buttons still point at the sibling archive. See Open risks.

## 3. Candidate files — PASS (static)

Directory: `games/zombie-survivors/candidates/v3.0-SLICE1-98e3422093d9/`

| File | Bytes | SHA-256 |
|---|---:|---|
| `index.html` | 6,137,414 | `98e3422093d9cbf5cace834c370b6dd940b38c0dfca832ce0a19f9285b1c86f2` |
| `three.min.js` | 603,451 | `7ae04663bb431808bc025280122162029ea3a354efc5fcca8bd8f95d1a1933e9` |
| `CANDIDATE.json` | 8,990 | `a509fbba89c790efb7f43f88fde94581a6822626b14f89ce424a2ba13985aea2` |

`index.html` line 7: `<script src="three.min.js"></script>` (document-relative; sibling file present).  
`CANDIDATE.json` `candidate_sha256` matches the `index.html` hash. `three.min.js` hash matches the 2026-09-02 incomplete-publish fix note inside `CANDIDATE.json`.  
`assets/` tree is present beside the artifact (sfx, skins, weapon-kit).

Landing pointer: `games/zombie-survivors-latest.html` → `./zombie-survivors/candidates/v3.0-SLICE1-98e3422093d9/index.html`.

HTTP of these URLs: **not proven** (port 8766 closed).

## 4. Back-navigation Classic ← → Next — PASS (floors)

| From | Control | Target |
|---|---|---|
| Classic nav | style-switch `Next` | `next/index.html` |
| Next topbar | `Classic` | `../index.html` |
| ZSS landing | `← Back to Classic Floor` | `../index.html` |
| ZSS landing | `Next preview` | `../next/index.html` |

Classic style-switch:

```html
<span class="style-switch" aria-label="Arcade style">
  <a class="is-on" href="index.html">Classic</a>
  <a href="next/index.html">Next</a>
</span>
```

Inner Next pages (`next/prize.html`, `next/settings.html`, `next/lobbies/*.html`) only return to Next floor, not Classic. One extra click via Next → Classic. Named as a risk, not a floor-nav fail.

## 5. Style switcher does not delete Classic — PASS

Classic is still the root `index.html` gold-cabinet page (sticky nav, `#0a0a0c`, Tonight's Cabinet Halo, Floor + Bonus). Next lives in isolated `next/` and labels itself `NEXT PREVIEW · Classic remains default · not published`. Switching is two hrefs; no JS rewrite of Classic. `next/arcade.js` only handles reduce-motion + slideshows.

Rollback identity recorded in `docs/agent-runs/2026-09-03-classic-next-zss/CLASSIC_BASELINE.md`: `origin/main` @ `c9d865c3f17bebda4f69d3715353b3f496fa75c6`.

## 6. v3.0 labeling — PASS (never Stable)

| Surface | Label |
|---|---|
| Classic status | `CANDIDATE · NOT OWNER-ACCEPTED` |
| Classic chips | `Candidate` + `Owner-smoke required` |
| Next pills | `Candidate` + `Owner-smoke required` |
| Next copy | `v3.0-SLICE1 · SHA 98e34220… · NOT owner-accepted` |
| Landing banner | `CANDIDATE / OWNER SMOKE REQUIRED / NOT OWNER ACCEPTED` |
| `CANDIDATE.json` | `"status": "CANDIDATE / OWNER SMOKE REQUIRED / NOT OWNER ACCEPTED"`, `"owner_accepted": false` |
| `GRAPHIC_SOURCE.md` | **Stable: none** |

No ZSS surface uses the word Stable as a product status.

## 7. No v3.1.x artifact — PASS

Recursive directory/file search for `v3.1` under this worktree: **empty**.

Candidate dirs only:

- `games/zombie-survivors/candidates/v2.8-WN5-4bd6b94dfe72/` (prior, retained)
- `games/zombie-survivors/candidates/v3.0-SLICE1-98e3422093d9/` (current pointer)

v3.1.x is mentioned only as “not an Arcade artifact yet” (Classic pitch, Next copy, landing warn, `GRAPHIC_SOURCE.md`).

## 8. Responsive CSS — PASS

Classic `index.html` media queries:

- `@media (max-width: 1099px)` — featured stack to 1 column
- `@media (max-width: 720px)` — header type, nav gap, full-width play, stacked status-row

Classic `.grid` / `.bonus-grid` use `repeat(auto-fit, minmax(260px, 1fr))` (not `auto-fill`). The assigned check asked media queries on Classic; that holds.

Next `next/arcade.css` line 48:

```css
.floor { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 18px; }
```

Also `@media (max-width: 700px)` on `.prize` / `.hero`, and `prefers-reduced-motion`.

---

## Open risks (do not round these up to FAIL of the 8)

1. **No HTTP/serve evidence.** `http://127.0.0.1:8766/` refused. Rung = static. Click-through, cover paint, and `three.min.js` 200 are unproven in this pass.
2. **Next lobby Launch URLs still target the protected archive** (floor Launch was remapped; lobby Launch was not). Broken relative paths from `next/lobbies/`:
   - `cube-orbit.html` → `../../../PROTOTYPE%20ARCADE/rubiks%20cube/dist/rubiks-cube-game.html`
   - `true-atlas.html` → `../../../PROTOTYPE%20ARCADE/world%20history%20map/v8%20-%20clean%20rebuild/true-atlas-v8.html`
   - `happy-accidents.html` → `../../../PROTOTYPE%20ARCADE/bob%20ross%20sim/v1%20prototype/bob_ross_painting_simulator_prototype.html`
   - `party-sketch.html` → `../../../PROTOTYPE%20ARCADE/pictionary/pictionary_party_game%20(7).html`
   - `grid-siege.html` → `../../../PROTOTYPE%20ARCADE/towerdefense/v6.1%20economy%20rebalance/tower-defense-v6.1.html`
   - `echo-yard.html` → `../../../PROTOTYPE%20ARCADE/3d%20halo%20fps%20arena/.../arena-fps-v1-7-6.html`
   - `kingboard.html` → `../../../PROTOTYPE%20ARCADE/3d%20chess/v2.3%20-%20Master%20fast/Chess-Checkers-3D-v2-2-MASTER.html`  
   `GRAPHIC_SOURCE.md` claimed “Launch URLs remapped to `../games/*.html`”. That is true for `next/index.html` only.
3. **Missing Next lobby:** `next/index.html` links `lobbies/nebula-tilt.html`; that file **does not exist**. Floor Launch for Nebula (`../games/nebula-rescue.html`) is fine; Lobby 404s.
4. **Inner Next pages have no Classic link** (prize, settings, seven lobbies). Floor pair is wired.
5. **Candidate gameplay not inspected.** Historical 2026-09-02 incomplete publish (missing `three.min.js`) is recorded as fixed on disk; this pass did not boot New Game.
6. **Classic ZSS sits under the heading “Playable Cabinets”** while the card itself says CANDIDATE. Honest on the card; section title is slightly broader than the status.

## What this pass does not claim

- Not HTTP 200. Not launch/render. Not interaction. Not functional/gameplay. Not real-device.
- Not owner-accepted. `owner_accepted` remains `false`.
- Not a visual/tackiness critique (that is a product pass, not this technical check).
- Not a live-goal / ZSS-repo / nebula-branch review.

## Exact next action (for integrator, not this reviewer)

If a follow-up is authorized: (a) remap the seven lobby Launch hrefs to the same `../games/*.html` landings as the floor, (b) add or drop `lobbies/nebula-tilt.html`, (c) serve and capture HTTP 200 for Classic, Next, ZSS landing, candidate `index.html`, and `three.min.js`. Do not invent a v3.1.x Arcade snapshot. Do not relabel v3.0 Stable.
