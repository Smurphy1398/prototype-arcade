# B8 — Nebula Rescue read-only diagnosis (slide/ramp)

**Date:** 2026-07-15. **Agent:** 🧭 Claude (Opus/High, inline, sole editor). **Outside agents:** none used.
**Mode:** read-only diagnosis only — no game/runtime source edits, no source-archive changes, no commit/push/deploy performed during the investigation itself.

## Assignment (exact, as given)
> Next is B8 — Nebula Rescue read-only diagnosis, using Opus/High. Reproduce the broken slide/ramp behavior
> in the current v6.4 game. Compare v6.3 against v6.4 around the lower playfield, slide, return rails,
> habitrail objects, collision geometry, and object visibility/removal. Trace the two missing `rail` and two
> missing `habitrail` references to the exact objects or code paths removed during cleanup. Determine whether
> the failure is geometry, collision, positioning, physics/velocity, layering/visibility, or a missing
> return-path object. Protect the confirmed spinner behavior exactly (v6.4 torque
> `Math.min(5.6, 1.45 + passSpeed*.38)`, clamp ±14). Make no source edits, commits, pushes, or deploys.
> Finish with a bounded root-cause hypothesis, likely files/functions to patch, the smallest safe patch
> scope, rollback point, and exact smoke test.

## Runtime / archive SHA confirmation
- Runtime `games/nebula-rescue-game.html` — SHA-256 `16acbbb8191b146067112d6e1d51dc6af0ba7b9a689a8801fddf50ef102c2f7e`.
- Archive `..\PROTOTYPE ARCADE\3d space pinball game\rescue nebula - v2\Nebula_Rescue_v6_4_Control_Clarity_Nebula_Art_Benchmark.html` — **identical SHA-256**.
- Confirmed byte-identical. The repo runtime *is* the archived v6.4 build, unmodified.

## Full v6.3 → v6.4 diff — conclusion
Generated a full unified diff between archive `Nebula Rescue v6.3 benchmark.html` (1625 lines) and the v6.4
runtime (1677 lines): **19 hunks, ~150 changed lines total.** Every hunk falls in: title/HUD copy, background
gradient/nebula art, ambient point-light intensities, flipper pivot/length/servo/strike tuning, sling
position/power, the spinner torque/clamp/damping/sound-gate change (the protected win), and one new function
`v64ControlClarityNebulaPass()` at end of file.

**Zero hunks touch:** the collision-rail builder (`addRail`, lines ~448–502), the visible ramp tube
(`rampCurve`, 582–584), the return curves (`returnCurves`/`moonHabitrail`, 586–598), the `habitrail` mesh
(595), `startReturnPath`/`normalizeReturnPath` (988–1001), the return-path animation consumer (1276–1288),
or the ramp shot trigger (1251).

**Conclusion: the slide/ramp mechanic is byte-identical between v6.3 and v6.4.** Whatever is wrong with it
was already wrong in v6.3 and survived the v6.4 cleanup untouched — it is not something v6.4 broke.

## The "two missing rail / two missing habitrail" references — traced and resolved
Raw term counts: `habitrail` 8→6, `rail` 81→78 across the full file (v6.3→v6.4).
- Grepped every `habitrail` occurrence in both files. The two removed instances are **prose only**:
  - Line 74 (controls hint): v6.3 "...slower visible **habitrail** returns" → rewritten for v6.4's
    control+clarity messaging, no longer mentions habitrail returns.
  - Line 116 (intro paragraph): v6.3 "...and slower visible **habitrail** returns with trail/audio." →
    rewritten to v6.4's "tightens the lower control zone, improves flipper trapping..." copy.
- All four **code** references to `habitrail` (`moonHabitrail:` curve definition, `const habitrail=` mesh,
  `scene.add(habitrail)`, and the `returnCurves.moonHabitrail` call inside the ramp trigger) are present,
  unchanged, and byte-identical in both files.
- The `rail` count delta (81→78, a 3-reference drop, not the "two" originally estimated) is accounted for by
  the same two prose-line rewrites (each contained one more "rail"-substring hit inside "habitrail") plus
  incidental prose phrasing — **no `rails[]` entry, `addRail()` call, or collision object was added, removed, or
  renamed.**

**This disproves the lane's working hypothesis** (inherited from `docs/game-history/nebula-rescue.md`'s "B8
diagnosis lead") that the v6.4 lower-playfield/sling cleanup inadvertently removed, hid, or altered a return
rail or related object near the slide. No such removal occurred. See "Reproduction limitation" below for why
this is a documentation-scope conclusion, not a full absolution of runtime behavior.

## Primary finding: decorative ramp, floor trigger, and scripted glide are geometrically decoupled
This is the most concrete, statically-provable explanation for "the slide doesn't work":
- The visible cyan "Space Station ramp" tube is `rampCurve` (line 582), a `THREE.CatmullRomCurve3` rendered
  as two nested `TubeGeometry` meshes rising from `y≈0.20` to `y≈0.94`. **`rampCurve` is never pushed into
  the `rails[]` collision array** — it is purely decorative. It has no collider.
- The ball is a 2D-on-a-plane puck: `ball={...,y:TABLE.ballR+.08}` (`y≈0.13`), never rising to meet the
  ramp's height. It physically passes *underneath* the glowing tube; nothing about the tube's shape affects
  ball motion.
- The actual "ramp shot" is a flat, invisible trigger box at line 1251:
  `if(ball.x>.08 && ball.x<1.45 && ball.z>-2.2 && ball.z<-.55 && ball.vz<-.5){ markShot('ramp',...); ...
  startReturnPath(returnCurves.moonHabitrail, .10, 1.75, 1.55, 'SPACE STATION HABITRAIL RETURN'); }`
- The ball carried by this trigger rides **`returnCurves.moonHabitrail`** (586) — a *separate* curve from the
  visible `rampCurve`, with different control points and a different visible tube (the `habitrail` mesh,
  595). The in-code comment at line 585 ("v5.0 shared rail/return curves: the visible tube and carried ball
  use the same path") is **not true for the ramp** — it is true for other shots, but the ramp trigger and the
  ramp's *visible* geometry are two unrelated objects that happen to sit near each other.
- **Failure category: geometry/collision decoupling + faked-mechanic design.** This is explicitly **not** a
  missing/removed return-path object — every object involved (`rampCurve`, `moonHabitrail`, `habitrail` mesh,
  the trigger, `startReturnPath`) is present and functional in isolation; they are simply not wired to each
  other the way the visible art implies.

## Secondary, unconfirmed failure modes (require hands-on playtest)
- **Over-eager trigger:** the trigger box has no minimum-speed skill gate beyond `vz<-.5` and no re-arm
  lockout, so a weak up-field drift through the right-center strip could fire the "ramp shot" without a real
  shot — a plausible source of the "glitchy" complaint. Not confirmed without play.
- **Return-to-drain (weakly supported, likely not the cause):** `moonHabitrail`'s exit state is
  `(vx=.10, vz=1.75)` — i.e., the ball exits gently at `x≈-1.18, z≈5.35`, which is a normal left-inlane feed
  position, not drain territory. This makes "the return dumps the ball into a drain" an unlikely explanation
  on current evidence.

## Reproduction limitation (explicit, per assignment's "reproduce" requirement)
Headless Chrome (30s virtual-time budget) was used to load-render the runtime file: the full 3D table,
backbox, spinner bars, and HUD render correctly behind the START overlay, Three.js/CDN resolves, and there is
**no persistent white screen** — the previously-flagged ~24s blank in an earlier screen recording is more
likely first-load/CDN latency than a rendering bug (consistent with Simon's own later observation of a ~5s
load in `PHASE_LANES.md` Lane 2C). However, **headless Chrome cannot click past the START overlay or drive
gameplay input**, so the actual in-play ramp-shot behavior (does it fire, does the glide look wrong, does it
feel broken) was **not reproduced**. The static code trace above is strong and internally consistent, but
Simon's hands-on smoke is required to confirm which of the primary/secondary failure modes he is actually
experiencing before any patch is written.

## Likely files/functions to patch (all in `games/nebula-rescue-game.html`, single file)
- **Ramp trigger** — line 1251 (add a speed/skill gate, a re-arm lockout, and/or narrow the trigger box to
  better match the visible ramp mouth).
- **Ramp/return curve coupling** — `rampCurve` (582), `returnCurves.moonHabitrail` (586), `habitrail` mesh
  (595): either make the scripted glide follow the visible ramp tube's path, or redesign the visible tube so
  its geometry reads honestly as the actual shot path.
- **`startReturnPath`** (993) — only if the entry snap/easing itself (not the curve mismatch) proves to be
  the visible glitch during playtest.
- **Mid-field colliders** near the ramp mouth — `addRail` calls at lines 473 / 481 / 482 — only if playtest
  shows the ball can't physically reach the trigger box at all (reachability, not the currently-diagnosed
  decoupling).

## Smallest safe patch scope (recommended, not yet started)
Tighten the ramp trigger at line 1251 (minimum entry speed + short re-arm lockout + box aligned to the
visible ramp mouth) and make the carried glide visually follow the *visible* ramp tube rather than the
separate `moonHabitrail` curve. Single, self-contained region; no other systems touched.

## 🔒 Spinner protection — confirmed disjoint from candidate patch surface
Protected values, confirmed present and unchanged in the current runtime:
- Torque: `const torque=Math.min(5.6,1.45+passSpeed*.38);` — line 1218 (`sp.spin=Math.max(-14,Math.min(14,...))`).
- Damping: `sp.spin*=Math.pow(.918,dt*60); sp.spin=Math.max(-14,Math.min(14,sp.spin));` — line 1345.

The full candidate patch surface for the ramp fix (1251, 582–598, 993, and rails 473/481/482) **does not
overlap** lines 1218 or 1345. The spinner tuning is structurally outside the scope of any ramp/slide patch —
**explicitly excluded from this diagnosis and from any future B8 patch lane** unless Simon separately opens
that scope.

## Rollback / checkpoint
Investigation was fully read-only. Runtime file untouched throughout (confirmed SHA before and after:
`16acbbb8…`, unchanged). Repo `HEAD` at investigation start: `68cf795` (clean tree, in sync with
`origin/main`). No archive file in `..\PROTOTYPE ARCADE\` was opened for write access at any point. If a
future patch needs reverting, `git checkout games/nebula-rescue-game.html` restores this exact byte-identical
v6.4 baseline.

## No-source-edit status
**Confirmed: zero edits were made to `games/nebula-rescue-game.html` or any other runnable source file, and
no file inside the protected `..\PROTOTYPE ARCADE\` archive was modified.** This diagnosis pass touched only
scratchpad working copies (outside the repo) and, in this follow-up checkpoint, `docs/` files.

## Exact smoke test (for Simon, hands-on — still required before any patch)
1. Open `games/nebula-rescue-game.html` (or the live URL), click **START GAME**, launch a ball.
2. Attempt to shoot the glowing cyan **RAMP** (right-center table, "MOON RAMP" / "SPACE STATION RAMP" arrow
   inserts).
3. Report which of the following you observe: (a) nothing ever triggers; (b) the ball ignores/clips through
   the visible tube; (c) the ball snaps/teleports onto a return glide that looks visibly wrong or jarring;
   (d) the return dumps the ball somewhere that reads as a drain/loss.
4. Confirm spinner feel is unchanged (capped speed, natural spin-down, no sound spam) — this must not regress.
5. Note whether the first-load blank screen recurs, and roughly how long it lasts.

His answer to step 3 determines which of the primary/secondary hypotheses above is correct and therefore
which patch scope (above) is the right one to open next.
