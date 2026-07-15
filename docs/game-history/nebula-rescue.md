# Nebula Rescue — Game History

**Agents:** 🧭 Claude (Sonnet, Explore-agent-assisted read-only archive research) · outside agents (🧠 Grok/🔍 Codex) — not used, this is Claude reading the local archive per lane spec.
Source archive folder: `..\PROTOTYPE ARCADE\3d space pinball game\` (protected, read-only, not modified).

## Current provisional build
`rescue nebula - v2\Nebula_Rescue_v6_4_Control_Clarity_Nebula_Art_Benchmark.html` — internally titled
"Nebula Rescue v6.4 — Control + Clarity + Nebula Art Benchmark." This is the file imported into the repo
as `games/nebula-rescue-game.html` (source hash `a5693986`, byte-identical — see `GAME_CATALOG.md`).

## Source archive locations
| File | Role |
|---|---|
| `Nebula Rescue v6.3 benchmark.html` (top level) | v6.3 benchmark, duplicated 3x (see below) |
| `rescue nebula - v1\Nebula Rescue v6.3 benchmark.html` | byte-identical copy of the above |
| `rescue nebula - v1\nebula_rescue_v63_last_chance_clean_benchmark.html` | byte-identical copy of the above |
| `rescue nebula - v2\Nebula_Rescue_v6_4_Control_Clarity_Nebula_Art_Benchmark.html` | **current provisional build (v6.4)** |
| `v1\space_pinball_3_d_html.html` | earliest prototype ("Cosmic Pinball 3D") |
| `v2\space_pinball_3_d_html (1).html` | first Three.js rewrite ("Cosmic Pinball 3D - Rebuilt") |
| `v3\space_pinball_3_d_html (2).html` | mission/mode added ("Cosmic Pinball 3D Simulation" / "Cosmic Odyssey") |
| `passover.txt` | handoff brief that produced v6.4 — preserved verbatim at `docs/game-history/raw/nebula-rescue-passover.txt` |
| `Screenshot 2026-05-28 183207.png` | dev screenshot, not analyzed |

## Evidence confidence: **Medium-High**
High confidence on the v6.3→v6.4 code diff (directly observed). Medium confidence on the early
prototype chronology (v1→v3→"v6.3", large undocumented gap). Low confidence on whether v6.4 was ever
formally marked "accepted," and whether the ~29 FPS performance complaint was empirically resolved (no
telemetry survives).

## Version/checkpoint timeline
1. **v1 "Cosmic Pinball 3D"** — plain Canvas 2D with a faked 3D look; explicitly says it could be
   "expanded with real Three.js later."
2. **v2 "Cosmic Pinball 3D - Rebuilt"** — first true Three.js/WebGL rewrite.
3. **v3 "Cosmic Pinball 3D Simulation" / "Cosmic Odyssey"** — adds orbit lanes → saucer → "Rescue Mode" →
   Saturn Ramp jackpot mission structure; earliest evidence of the "Rescue" theme.
4. **Large undocumented gap** — by the next surviving file the game has been renamed "Nebula Rescue,"
   gained a full cabinet/backbox, HUD, audio, kickback/ball-save, spinners, slings, bumpers, mission
   core, and camera presets. In-code function names (`v46ArtifactCleanup`, `v53ClarityCleanup`,
   `v541SafeReadabilityCleanup`, `v542ControlZoneCleanup`, `v552KnownObjectFinish`,
   `v56DeviceClarityPass`) prove a long unlogged iteration history exists between v3 and this build.
5. **"v4.9"/"v6.3" benchmark** (title tag still says v4.9; in-code comments and runtime mission text say
   v6.3) — the file `passover.txt` calls the **"Last-Chance Clean Benchmark"** and designates as the base
   for further work.
6. **A rejected "v6.4 Red Spider Cleanup" build** — described only in `passover.txt`, not present as a
   file anywhere in the archive. Per the notes: *"v6.4 was a failed experiment that damaged the layout,
   lowered visual quality, made the board messier, and hurt playability."*
7. **`rescue nebula - v2` v6.4 "Control + Clarity + Nebula Art Benchmark"** — a different, successful
   v6.4 built directly on the v6.3 file (confirmed via diff: ~150 changed lines out of ~2,000+, a
   surgical pass, not a rewrite). **This is the current provisional build.**

## 🔒 Protected win: spinner implementation and later fixes — do not regress
Spinner mechanics (`spinners` array + `buildSpinnerDoor` + torque/damping loop) exist in both v6.3 and
v6.4:
- v6.3: torque `min(9.5, 3.8+passSpeed*.62)`, spin clamped ±22, damping `*=.955^(dt*60)`.
- v6.4: torque reduced to `min(5.6, 1.45+passSpeed*.38)`, spin clamped **±14**, damping tightened to
  `*=.918^(dt*60)` (decays faster), shot sound gated (`if(sp.cool<=.055)`) instead of unconditional.

This directly implements passover.txt's ask ("Cap max spinner angular velocity... Add damping... avoid
constant sound spam") and is a refinement, not a removal — **Simon has separately confirmed (2026-07-14,
`RAW_IDEA_INBOX.md`) the spinners were just brought to an acceptable state; this must not be regressed
during future rescue work.**

## Slide/ramp/rail changes
Habitrail/return-rail visuals and code are **byte-identical** between v6.3 and v6.4 — no dedicated
slide-mechanic or ramp/rail geometry *fix* was made, and (correction below) no rail/habitrail *object* was
removed either. The only intentional rail-adjacent change is sling repositioning (see below).

**⚠️ Correction (2026-07-15, B8 read-only diagnosis, `docs/agent-runs/2026-07-15-claude-nebula-b8-read-only-diagnosis.md`):**
this section originally flagged a small `rail`/`habitrail` reference-count drop (`rail` 52→50, `habitrail`
6→4) as a possible sign that v6.4's lower-playfield/sling cleanup had removed, hidden, or altered a return
rail or related object near the slide. A full line-by-line trace of every `rail`/`habitrail` occurrence in
both files found that **delta is prose-only** — the two dropped `habitrail` mentions are the title/controls
hint ("...slower visible habitrail returns") and the intro paragraph, both simply rewritten for v6.4's
control+clarity messaging. Every code reference (`moonHabitrail` curve, `habitrail` mesh, `scene.add`,
the ramp trigger's `returnCurves.moonHabitrail` call) is present and unchanged in both files. **No return
rail, habitrail object, or collision geometry was removed, hidden, or altered by the v6.4 cleanup.** The
original "concrete starting point for the reported slide break" framing is retracted — it is not.

**The accurate conclusion stands:** no dedicated slide-mechanic fix was added in v6.4, and the mechanic is
identical in both archived builds, so **the break predates or survived both v6.3 and v6.4** — it is not a
v6.4 regression.

**New diagnosis (statically confirmed by direct code trace, not archive inference):** the visible ramp is a
purely decorative floating tube (`rampCurve`, never added to the `rails[]` collision array) that the ball —
a flat puck at a fixed low height — physically passes under. The actual "ramp shot" is an unrelated flat
floor trigger box that, when hit, snaps the ball onto a *different* curve (`moonHabitrail`) for a scripted
glide. The visible ramp geometry and the real trigger/scripted-return path are **geometrically decoupled** —
they are separate objects that only appear connected in the art. This is a plausible root cause for "the
slide doesn't work," independent of any v6.3→v6.4 change.

**Simon has directly reported the slide/ramp does not work in play** (`RAW_IDEA_INBOX.md`, 2026-07-14). The
archive/diff evidence does not contradict this and now offers a concrete static explanation — but
**hands-on gameplay reproduction of the actual in-play failure mode is still required before any patch is
written**; the 2026-07-15 diagnosis pass could not click past the game's start screen in a headless
browser, so which exact failure mode Simon sees (never triggers / clips through / visibly-wrong glide /
dumps to drain) remains unconfirmed.

## Plunger and flipper control changes
- **Plunger**: no changes found between v6.3 and v6.4.
- **Flipper geometry**: pivots moved slightly, bat length increased (`1.08`→`1.18` left, `1.13`→`1.20`
  right), rest/active angles deepened — matches comment "v6.4: slightly longer/cleaner bats with a
  deeper held angle for better trap/cradle control."
- **Flipper motor tuning**: servo speed and max angular velocity both increased (faster response).
- **Held-flipper cradle behavior** (the core ask in passover.txt item 2): v6.4 tightens the held-bat
  catch physics substantially (`ball.vx*.72`→`.48`, new rule dampening near-flipper contact, clamp
  `-3.15`→`-1.72`) while simultaneously *increasing* power on fresh/rising strikes (`strikeScale` max
  `1.35`→`1.55`) — a materially softer "trap" feel on holds and a sharper feel on taps, exactly matching
  the dual goal in the handoff notes.

## Camera modes
Identical in v6.3 and v6.4 — 4 fixed presets (keys 1–4), free orbit (F), dev cam (N). No changes in this
pass.

## Table geometry changes
Only flipper and sling geometry changed (above/below). No changes to overall table bounds, cabinet,
playfield mesh, or bumper positions.

## Collision/physics changes
Flipper collision radius widened slightly to match longer bats; sling collider radius reduced and
repositioned; spinner torque/clamp/damping tightened (above). No changes to bumper or general
segment-collision code.

## Ball saves/kickbacks
Kickback lane, kickback lights, `state.kickback` counter, ball-save, and extra-ball-at-450,000 logic
unchanged between v6.3 and v6.4.

## Scoring economy
No scoring-value changes found (bumper +12000, spinner +4500, sling +1200, fuel target +9000, extra-ball
threshold 450000, ball-save award +2500 — identical in both files).

## Mission progression
Mission states (ATTRACT, LAUNCH BAY, BALL SAVE ACTIVE, meteor/blackhole/supernova shows, fuel-bank/
wormhole-scoop/rescue-mode flow) unchanged between v6.3 and v6.4.

## Visual-theme changes
v6.4 reworks background art per passover.txt item 5 ("Red Spider Nebula" art direction): gradient stops
shifted from blue/purple to a crimson/magenta palette, nebula wisp rendering expanded 16→24 ellipses with
new flowing bezier "wisp" strokes, board label recolored "NEBULA/RESCUE" (gold) → "RED CORE/RESCUE"
(coral/cyan).

## Performance/FPS changes
passover.txt explicitly states the pre-v6.4 game "often feels stuck around 29 FPS." v6.4's concrete
changes: pixel-ratio cap lowered `.84`→`.72`; dynamic point-light intensity/distance cuts sharpened
(`*=.50/.70`→`*=.32/.62`); several individual lights (play/mag/ball/spinner/bumper/mission-door/board-lamp)
further dimmed. **No FPS number is recorded in either file** — whether the 29 FPS target was actually hit
by v6.4 is **Unknown (Low confidence)**, since no benchmark/telemetry output survives.

## Known glitch periods
No `TODO`/`FIXME`/bug strings exist in either HTML file. The only documented failed build is the
unarchived "v6.4 Red Spider Cleanup" described in passover.txt (see timeline step 6) — its file does not
survive. passover.txt's "Current problems to fix" section documents the full pre-v6.4 known-issue list
(lower playfield clutter, weak flipper trap feel, spinner over-speed, unsourced lighting, board-art
misalignment, ~29 FPS), all addressed to varying degrees in the v6.4 diff.

## Current v6.4 lineage — recommended base
`rescue nebula - v2\Nebula_Rescue_v6_4_Control_Clarity_Nebula_Art_Benchmark.html` is the most refined
build in the archive and matches the file already chosen as the repo's provisional canonical build. It is
a small, surgical diff over v6.3 concentrated exactly where passover.txt asked (perf, slings, flippers,
spinner cap, art, lighting) — not a rewrite — and is clearly distinct from, and does not exhibit the
damage attributed to, the rejected "Red Spider Cleanup." **No formal acceptance record exists** for this
file (Medium-High confidence it's the intended successful v6.4, based on content match, not a sign-off).

## Which changes must not be bundled together
No file contains an explicit bundling-conflict warning. The closest guidance is passover.txt's rule #6:
*"Do not add a bunch of new devices before cleaning the existing layout."* — i.e., during any future
rescue pass, layout/collider cleanup should land before new feature/device additions, not alongside them.

## Regressions / abandoned experiments
- The "v6.4 Red Spider Cleanup" (rejected, not archived) — see timeline step 6.
- No other abandoned branches found; v1→v2→v3→v6.3→v6.4 is a single forward lineage.

## Exact useful quotes (verbatim, `passover.txt`)
> "Do NOT use v6.4 Red Spider Cleanup as the base. v6.4 was a failed experiment that damaged the layout, lowered visual quality, made the board messier, and hurt playability. Use the uploaded v6.3 file only."

> "Tap = sharp flick. Hold = control/trap. Release/re-hit = finesse shot. Fresh rising stroke = strong shot. Already-held flipper contact = soft control, not full cannon launch."

> "Cap max spinner angular velocity. Ball speed should determine spin torque. Slow ball = small flap/spin. Fast ball = fast spin. Add damping so it spins down naturally. Avoid constant sound spam."

> "Current game often feels stuck around 29 FPS and can feel laggy. Do not solve this by making the game ugly."

Full text preserved at `docs/game-history/raw/nebula-rescue-passover.txt`.

## What still requires hands-on playtesting
The slide/ramp break Simon reported directly — **now narrowed by static diagnosis to a specific candidate
mechanism (decorative ramp / floor trigger / scripted-glide decoupling, see above), but the actual in-play
failure mode is still unconfirmed** — plus overall balance/mission pacing, actual FPS achieved by v6.4, and
whether the held-flipper cradle tuning feels right in practice.

## Recommended next hardening/rescue lane
**B8 read-only diagnosis is complete** (2026-07-15,
`docs/agent-runs/2026-07-15-claude-nebula-b8-read-only-diagnosis.md`). Next: Simon's hands-on smoke of the
current v6.4 build, specifically to confirm which ramp failure mode he sees, before any patch is written —
per `docs/BACKLOG.md` B8 — while explicitly protecting the spinner tuning (torque
`Math.min(5.6,1.45+passSpeed*.38)`, clamp ±14) from regression.
