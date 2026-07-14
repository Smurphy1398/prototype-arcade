# Halo FPS Arena — Game History

**Agents:** 🧭 Claude (Sonnet, Explore-agent-assisted read-only archive research) · outside agents (🧠 Grok/🔍 Codex) — not used, this is Claude reading the local archive per lane spec.
Source archive folder: `..\PROTOTYPE ARCADE\3d halo fps arena\` (protected, read-only, not modified). This
is the deepest version tree in the archive: ~60 version files across V0.1 → v1.7.6, but only **5
`changes.txt` files exist** (V0.1.1, v0.2, v0.3, v0.4, v0.5) — v0.6 onward has no authored changelog, so
that history is reconstructed from in-file titles/HUD strings/comments, not authored notes.

## Current provisional build
`v1.7 — Loadout Combat Playtest\v1.7.6 — Friend Playtest Benchmark\arena-fps-v1-7-6.html` — imported into
the repo as `games/halo-fps-game.html` local candidate (hash `f7d1714e`, 230,660 B — see
`GAME_CATALOG.md`). The **published** `games/halo-fps-game.html` (hash `eb9e655c`, 233,469 B) matches no
local build by hash and remains an unresolved hand-edited derivative — this recovery pass did not close
that gap (out of scope; requires a byte diff against the actual published file, not just archive reading).

## ⚠️ The v1.7.5.2-vs-v1.7.6 published-label conflict — resolved (archive-side)
**Verdict: not two competing builds.** Inside `arena-fps-v1-7-6.html` itself:
- Browser tab `<title>` (line 6): "Low-Poly Arena FPS **v1.7.5.2** - Cover / Pickup / Sniper Hotfix" — **stale**, copy-pasted from an earlier save and never updated.
- Static `<p>` (line 114): also stale "v1.7.5.2..." text, never touched by runtime JS.
- Static default `topTip` div (line 153): stale "v1.7.5.3" — one version further along, still wrong.
- **Runtime JS (lines 2600-2805, executes on load)** overwrites the on-screen `topTip` banner and the
  `betaChecklist` HUD box to correctly read **"v1.7.6"**, and the bottom-right debug panel's status string
  begins `"v1.7.6 Friend Playtest Benchmark"`.

So: the browser tab and one static paragraph say "v1.7.5.2" (dead boilerplate); everything the player
actually sees on screen after load says "v1.7.6" correctly. Diffing confirms `arena-fps-v1-7-6.html` is a
near-superset of `v1.7.5.3` (only 205 changed lines, all additive — one new IIFE block) and is much
further removed from `v1.7.5.2` (420 diff lines) — i.e. its real lineage is v1.7.5 → .1 → .2 → **.3** →
v1.7.6, not a fork of .2. **This exact stale-title pattern recurs elsewhere in the tree** (v0.8.2–v0.9.1
all stuck saying "v0.8.1"; v1.4.6–v1.5.3 all stuck saying "v1.4.5") — strong corroborating evidence this
is a systemic copy-paste habit in the file's boilerplate header, not a meaningful fork. **High confidence.**

v1.7.6 functionally adds over v1.7.5.3: fullscreen/pointer-lock-exit reliability, in-pause-menu loadout
switching + respawn, stronger/more-opaque smoke grenades, a reworked flamethrower (burn-over-time damage
ticks on bots), pickup-spacing algorithm, and a recoil/crosshair "movement accuracy" pass.

## Version tree (chronological; folder → internal label, flagging every mismatch)
Full ~60-entry table with per-file title/HUD-string verification was produced during this research pass
and is available in the agent-run transcript (`docs/agent-runs/2026-07-14-claude-halo-fps-history.md` —
create if not already present). Summary of the notable clusters:

| Range | Folder names | Internal-label status |
|---|---|---|
| V0.1 – v0.5 | Movement/arena → Feel+Collision → Bot enemies/Training Facility → Menu/timer/Vertical Training Complex → "Two-player multiplayer test" (Echo Yard Bot Test) | ✅ all match; 5 have real `changes.txt` |
| v0.6 | "Better netcode, lobby, player colors, kill feed" (Two Story Test) | ✅ title matches folder, but **no networking code exists in the file at all** — see Multiplayer section |
| v0.7 – v0.8.1 | Movement & Collision Rebuild → Babylon Collision Test → Safe Babylon Collision Test | ✅ match |
| v0.8.2 – v0.9.1 | compatibility fix, JumpCrouchRadar Fix, WASD Movement Fix, Stair Step-Up Fix, Smooth Stair Ramp+Radar Fix, Stair Ramp Blocker Fix, Walk-On Ramp Fix, Stair Side/Back Blockers, First Usable Base, Radar Alignment+Map Detail Fix | ❌ all internally stuck reading "v0.8.1" — real fixes exist per folder name, title just never updated |
| v1.0 – v1.4.5 | Deathmatch Loop → Stability Patch → Echo Yard Map Pass → Clean Blockout → Architecture Cleanup (+Stair/Balcony+LOS Fix) → Spacing Cleanup (Flow Polish, Landing Alignment, Route Cleanup+Dev Cheats, Stair Final+Dev Cheats, Clean Side Stairs Final) | ✅ match through v1.4.5 |
| v1.4.6 – v1.5.3 | Stair Entry Door Fix, Final Stair Lip Polish, Final Stair Foot Fix, Combat Feel+Bot Stability, Combat Stability+Stair Smoothing, Stair Stability Patch, Stair Support Surface Fix | ❌ all stuck reading "v1.4.5" in the static title (HUD `topTip` correct from v1.5 on) |
| v1.6 – v1.7.5.3 | Playtest Milestone, Barrel+Pause Hotfix, Loadout Combat Playtest (.1 HUD polish, .2 Enemy Gunplay+Pickup Polish, .3 Critical Systems Stability Patch, .4 Systems Recovery+Bot Spread, .5 Bot Intelligence+Gunplay Stability, .5.1 Startup Crash Hotfix, .5.2 Cover/Pickup/Sniper Hotfix, .5.3 Spawn/Radar/Smoke/Bot Cleanup) | ✅ self-consistent |
| v1.7.6 | Friend Playtest Benchmark | ❌ stale title says v1.7.5.2 (see conflict section above) — runtime HUD correct |

Note: `v1.6.1 — Barrel + Pause Hotfix\low_poly_arena_fps_v_0_1 (30).html` is a **0-byte dead file** sitting
alongside the real build (`preview.html`) in the same folder — a discarded upload artifact, not a genuine
version.

## Evidence confidence
- Version-tree completeness / stale-title pattern: **High** (directly read every folder, grepped every
  title/HUD string; the pattern repeats independently across 3 separate version clusters).
- v1.7.5.2-vs-v1.7.6 resolution: **High** (line-level diff, byte counts, static-vs-runtime string tracing
  all converge).
- Early feature history (v0.1–v0.5): **High** (sourced from the 5 real changelog files, read in full).
- v0.6-onward feature history: **Medium** (reconstructed from folder names + in-code HUD strings, no
  authored changelog; some folder-name claims — multiplayer — are directly contradicted by code, flagged
  below).
- Performance and "friend playtest" quantitative results: **Low / no evidence found.**

## Movement changes
v0.1: WASD+look, floor clamp, forced camera-look. v0.2 (`changes.txt`): slower/custom mouse-look, less
"icy" movement, simple obstacle collision. v0.3: crouch, mouse relock after Esc. v0.4: climbable ramps,
crouch vents, height-aware collision. v0.5: fixed ramp direction, reduced platform-drop teleport bug.
**v0.8.x through v0.9.1 is the single longest sub-patch chain in the project** — a 9-patch stair/collision
grind (compatibility → jump/crouch/radar → WASD → stair step-up → smooth stair ramp+radar → stair ramp
blocker → walk-on ramp → stair side/back blockers) culminating in v0.9 "First Usable Base." **v1.4.1–v1.4.8
is a second long stair-polish tail** (Flow Polish → Landing Alignment → Route Cleanup → Stair Final →
Clean Side Stairs Final → Entry Door Fix → Final Lip Polish → Final Foot Fix). The project's own handoff
doc states: *"Stairs were buggy for many versions but v1.5.3+ finally fixed the main stair/landing/balcony
issue. Do not casually alter the stair/landing/support system unless absolutely necessary."* — stairs are
the single most persistent, hardest-fought bug across the whole project (v0.8.3 through v1.5.3).

## Weapons/reload/weapon feedback
v0.1: hitscan shooting at targets, tracer line only. v0.2: recoil/flash feedback, shorter tracer. v0.3:
reload timing (not instant), generated WebAudio SFX, visible weapon model, recoil animation, shield
recharge foundation. By v1.7: full roster — Rifle, SMG, LMG, pistol, hand cannon, shotgun, sniper, rocket
launcher, minigun, flamethrower, heavy sniper; number-key/mouse-wheel switching; ADS. **v1.7.2→v1.7.3
regression**: v1.7.3's own beta checklist literally reads *"✓ HUD/ammo restored"* — ammo/HUD broke in
v1.7.2 and had to be explicitly restored. v1.7.5.1 fixed a genuine **startup crash** (`wouldHitHorizontalBlocker()`
called before `camera` existed during map generation — code comment: *"this helper can be called during
map generation before camera exists. Use a safe body-height fallback when there is no camera yet."*).
v1.7.6: reworked flamethrower (burn-over-time bot damage ticks), recoil/crosshair "movement accuracy" pass.

## Enemies/AI/bots
v0.5 (`changes.txt`): *"Added simple enemy bots for deathmatch testing... Bots move, strafe, shoot, damage
shields, die, and respawn."* Named bots ("Violet," "Magenta," "Ghost") persist unchanged v1.5→v1.7.6.
v1.5–v1.5.3: bot-spawn safety fixes (ground-plane-only spawns to avoid stair/crate seams). v1.7.4/v1.7.5/
v1.7.5.3: repeated "bot spread/anti-clump/less-crowded roam goals" passes — clumping was a recurring,
never fully resolved complaint. The project handoff doc's own stated top priority as of v1.7.6: *"Better
bot intelligence, navigation, flanking, and less clumping/sticking on walls"* — i.e. bot AI is explicitly
flagged as still weak/unresolved at the current benchmark.

## Pickups/loadouts
Full loadout system (primary/secondary/heavy/grenade/equipment) introduced at v1.7, with 5 classes
(Assault, Scout, Heavy, Breacher, Marksman). Pickup placement was iterated on almost every v1.7.x
sub-patch (v1.7.2, v1.7.4 "safer pickup spawns", v1.7.5 "safer pickup/barrel spawns", v1.7.5.3
"level-aware pickup collection, balcony/catwalk spawns, barrels spread + shown on radar", v1.7.6
"pickup-spacing algorithm") — a clear, recurring pain point never fully solved before the benchmark.
v1.7.6 added in-pause-menu loadout switching + full respawn.

## Map/camera changes
v0.3 "Training Facility" (spawn bays, side rooms, catwalks). v0.4 "Vertical Training Complex" (multi-level
zones, sniper balcony, upper bridge, climbable ramps). v0.5 introduces the **"Echo Yard"** map lineage,
which persists and is iteratively cleaned through v1.1–v1.4 ("Echo Yard Map Pass" → "Clean Blockout" →
"Architecture Cleanup" → "Spacing Cleanup"). ADS/right-click aiming added by v1.7.

## HUD/minimap
Radar/minimap added v0.4; radar shows walls/dummies/bots by v0.5. **Radar alignment is a second recurring
bug area alongside stairs** — separately fixed at v0.8.3, v0.8.6, and v0.9.1. Kill feed/player colors
claimed at v0.6 (unverifiable — no changes.txt). v1.7.6 added HUD z-index fixes and a radar pickup legend.

## Performance
No performance/FPS-drop complaints found anywhere in the tree — only the always-present `engine.getFps()`
diagnostic readout, not evidence of a documented problem. **No evidence either way.**

## Multiplayer/netcode/lobby history — notable negative finding
**Despite two folder names explicitly claiming multiplayer work** — `V0.5 — Two-player multiplayer test
with host/join room` and `V0.6 — Better netcode, lobby, player colors, kill feed` — **grepping both files
for multiplayer/socket/peer/webrtc/host/join/lobby/network code returns zero hits.** The word "room" in
v0.5 only refers to map rooms (`leftRoomBack`, etc.), not network lobbies. This experiment was either
planned-but-never-coded, attempted-and-rolled-back before saving, or exists in a file not present in this
archive. The project's own handoff doc confirms multiplayer was never delivered and remains aspirational
as of v1.7.6: *"Multiplayer is a future goal, but not yet. The immediate focus is a strong local
bot-deathmatch playtest."* **No friend-playtest benchmark quantitative notes** (framerate, player counts,
session logs) exist anywhere — "Friend Playtest Benchmark" is a milestone *label*, not a record of an
actual completed session with recorded feedback.

## Known-good checkpoints vs. abandoned/regressed experiments
**Known-good milestones (explicitly named as such):** v0.9 "First Usable Base"; v1.5.3+ (stair/landing/
balcony finally fixed, per handoff doc); v1.6 "Playtest Milestone"; **v1.7.6 "Friend Playtest Benchmark"**
— explicitly the current source-of-truth per the handoff doc: *"Use the uploaded v1.7.6 file as the source
of truth. Do not rebuild from scratch unless absolutely necessary."*

**Abandoned/regressed:** multiplayer/netcode/lobby (never implemented, still aspirational); v1.7.2 HUD/ammo
regression (fixed in v1.7.3); the entire v0.8.x/v0.9.x and v1.4.6–v1.5.3 stuck-title chains are a
*documentation* regression only (real fixes happened, title just wasn't updated); the v1.6.1 0-byte dead
file is a discarded save artifact, not a real version.

## Exact useful quotes (verbatim, cited)
> "Removed the dark skybox / Disabled fog for now / Brightened the entire scene / Added a visible spawn pad / Forced the camera to look toward the arena center / Added a debug FPS/position readout / Added extra lighting / Added a safety floor clamp so you do not fall into the void"
— `V0.1 — Movement, arena, shooting targets/V0.1.1/changes.txt`

> "Added simple enemy bots for deathmatch testing / Bots move, strafe, shoot, damage shields, die, and respawn / Radar now shows walls, dummies, and bots"
— `V0.5 — Two-player multiplayer test with hostjoin room/v0.5 — Echo Yard Bot Test/changes.txt`

> "Stairs were buggy for many versions but v1.5.3+ finally fixed the main stair/landing/balcony issue. / Do not casually alter the stair/landing/support system unless absolutely necessary. / v1.7.6 feels good so far and should be treated as the current benchmark base."
— `docs/game-history/raw/halo-fps-continuation-prompt.txt` (top-level handoff doc)

> "Avoid breaking HUD/ammo systems again; previous versions broke ammo/HUD when adding features."
— same handoff doc

> `<div id="betaChecklist"><b>v1.7.3 beta checklist</b><br>✓ HUD/ammo restored<br>✓ Smoke grenade thrown with E<br>✓ G throws frag grenade<br>✓ Heavy blip no longer enemy color<br>• Next: bot classes + weapon drops</div>`
— `v1.7 — Loadout Combat Playtest/v1.7.3 — Critical Systems Stability Patch/arena-fps-v1-7-3.html:161`

> `<title>Low-Poly Arena FPS v1.7.5.2 - Cover / Pickup / Sniper Hotfix</title>` (the stale title)
— `.../v1.7.6 — Friend Playtest Benchmark/arena-fps-v1-7-6.html:6`

> `beta.innerHTML='<b>v1.7.6 benchmark</b><br>- fullscreen/menu reliability<br>- pause loadout switching<br>- thicker smoke visibility<br>- stronger flamethrower burn<br>- better pickup spacing<br>- recoil/crosshair pass';` (the correct, runtime-displayed label)
— `.../arena-fps-v1-7-6.html:2631`

Full handoff doc preserved verbatim at `docs/game-history/raw/halo-fps-continuation-prompt.txt`.

## What still requires hands-on playtesting
Whether the published `games/halo-fps-game.html` (hash `eb9e655c`) is a superset or divergent fork of
local v1.7.6 — this requires a direct byte/feature diff against the published file, which was out of
scope for this archive-only pass. Bot AI/clumping quality, current stair feel, and whether the flagged
card-vs-title provenance conflict is now resolved on the **published** page (not just explained
archive-side).

## Recommended next hardening/rescue lane
Diff the published `games/halo-fps-game.html` against local `arena-fps-v1-7-6.html` directly (Lane 2,
already scheduled/deferred per `PROJECT_STATE.md`) to decide which becomes canonical and fix the
published version's stale-title display so the card/label finally matches what's on screen.
