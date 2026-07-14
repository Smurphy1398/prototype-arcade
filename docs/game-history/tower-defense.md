# Tower Defense — Game History

**Agents:** 🧭 Claude (Sonnet, Explore-agent-assisted read-only archive research) · outside agents (🧠 Grok/🔍 Codex) — not used, this is Claude reading the local archive per lane spec.
Source archive folder: `..\PROTOTYPE ARCADE\towerdefense\` (protected, read-only, not modified). This is
the **highest-confidence** game in this recovery pass — every version v2 through v6.1 has a populated,
well-organized `changelog.txt` written in a consistent "Added → Next" format that self-documents intent
and follow-through (each "Next" list is directly answered by the following version's "Added" list).

## Current provisional build
`v6.1 economy rebalance\tower-defense-v6.1.html` — 68,115 B, `<title>Tower Defense V6.1</title>`. Matches
the repo's published build (`games/tower-defense-game.html`, hash `948f2386`, 68,559 B — see
`GAME_CATALOG.md`; near-identical size, matching internal title, confirmed as the canonical build).

## Source archive locations
| Version | Path | Note |
|---|---|---|
| Baseline/v1 | `tower-defense.html`, `tower-defense.txt` (empty, 0 bytes), `v1\tower-defense.html` | top-level file byte-identical to `v1\tower-defense.html`, confirmed via diff — not a distinct release |
| v2 | `v2\changelog.txt`, `v2\tower-defense-v2.html` | |
| v3 | `v3\changelog.txt`, `v3\tower-defense-v3.html` | |
| v4 | `v4 balance content update\changelog.txt`, `...\tower-defense-v4.html` | |
| v5 | `v5 major gamechange overtime\changelog.txt`, `...\tower_defense-v5.html` | |
| v6 | `v6 beta balance economy pack2\changelog.txt`, `...\tower-defense-v6.html` | |
| v6.1 | `v6.1 economy rebalance\changelog.txt`, `...\tower-defense-v6.1.html` | **current provisional build** |

## Evidence confidence: **High**
Every version folder v2-v6.1 has a populated changelog in a consistent format; each "Next" list is
verifiably answered by the following version's "Added" list. File sizes (18.7KB → 68KB) and folder
ordering corroborate a linear, additive progression. The only gap (empty top-level `tower-defense.txt`)
was fully resolved by a byte-identical diff confirming the top-level HTML is simply the v1 baseline.

## Economy changes across versions
- **v1**: $125 start, 20 lives, kill reward `12 + floor(wave/2)`, wave-clear bonus `35 + wave*5`, uncapped waves.
- **v2**: Money Factory tower introduced — **immediately buggy**, paid out between rounds instead of only during active waves.
- **v3**: bug fixed — factory only generates during active waves.
- **v4**: explicit "tighter economy" pass; factory nerfed (2x2 footprint, slower/lower payout).
- **v5**: another explicit tightening pass — "tighter economy and higher special tower costs" — plus Pack-a-Punch introduced as a $5000 late-game money sink.
- **v6**: economy *loosened* — +$1/kill flat bonus, round reward = `$100 × wave number`; difficulty-scaled starting resources (harder maps get less money/lives); Tier 2 Pack Core added as a second $5000 sink at 1,000,000 score.
- **v6.1**: rebalances v6's loosening — replaced the flat `$100×wave` reward with a smoother curve (less early, more mid/late); Pack cost scaled down by wave milestone ($4500→$4000→$3500); large/hard maps got extra starting money/lives.

**Overall arc**: flat/simple (v1) → exploitable factory (v2) → fixed (v3) → tightened (v4) → tightened
again (v5) → loosened (v6) → retuned (v6.1) — an oscillating tune-tighten-loosen-retune cycle consistent
with iterative playtesting, not random drift.

## Wave balance changes
v1: uncapped escalating waves, no formal end. v4: formal **16-wave win condition** + endless overtime
(waves 17+), 5-second auto-wave timer, swarms/multiple bosses added to fix a reported "difficulty
plateau." v5: auto-wave timer changed to 12s with visible countdown; wave display format `x/16`/`17+` for
clarity. v6: increased boss frequency/variety in overtime specifically; **super enemies/bosses introduced
after wave 50** (half damage from normal towers, require pack-a-punch). v6.1: no new wave-count changes;
added 4x speed for faster testing; slightly reduced difficulty on large/hard maps only.

## Towers/upgrades changes
v1: 3 towers (Basic, Rapid, Cannon), minimal/no upgrade system. v2: added Sniper, Frost, Money Factory;
upgrades to level 4; sell-refund; range indicators. v3: build-menu icons; hover preview. v4: path traps
(Glue, Spikes, TNT) as a separate mechanic; cannon/TNT explosion animations. v5: added **Flamethrower**
and **Mortar** towers; added **Pack-a-Punch** (overtime-unlocked, $5000, final upgrade tier); quick-
upgrade-all buttons. v6: fixed quick-upgrade hitbox bug; enhanced pack-a-punch visuals; added **Tier 2
Pack Core** (double pack-a-punch, 1,000,000-score unlock); pack-a-punched Factory gets 1.5x income + "roof
sniper" bonus. v6.1: no new towers — only pack-cost/UI-compaction changes.

## Enemy progression changes
v1: single generic enemy scaling by formula only. v2: added Runner, Brute, Shield, Boss types. v4: swarms
+ multiple simultaneous bosses for late-game. v5: named bosses **Serpent Prime** (snake movement,
trap-resistant) and **Trojan Cargo** (splits into a swarm on death) added. v6: **Super Enemies/Super
Bosses after wave 50** — resist normal-tower damage, require pack-a-punch, explicitly framed as the
balancing answer to escalating late-game difficulty. v6.1: no new enemy types.

## Scaling/difficulty changes
Overtime (post-wave-16 endless mode) introduced v4; clearer wave-count UI added v5; overtime boss
density/variety increased and the super-enemy damage-resistance mechanic added at v6, tied directly to
Pack-a-Punch as the intended answer to escalating difficulty; v6.1 confines its scaling changes to (a)
economy curve, (b) pack-cost curve, (c) map-specific starting resources — core wave/enemy formulas
untouched per its own changelog.

## v6.1 canonical-build confirmation
**Confirmed.** The version tree is strictly linear and terminates at v6.1 (68,115 B — the largest file in
the tree). No v7 or later folder exists. v6.1's own changelog explicitly frames itself as a corrective
rebalance of v6's issues — the expected role of a final/current build. No branch, fork, or later
experimental folder supersedes it.

## Regressions/abandoned experiments
- v2→v3: Money Factory's between-round income was a genuine bug, introduced then fixed.
- v4→v5: cannon screen-shake was called out as excessive in v4's own "Next" list and deliberately removed
  in v5 (while life-loss/TNT shake was kept) — a walk-back of a v4 feature.
- v6→v6.1: the flat `$100×wave` round-reward formula overshot ("too much money") and was replaced wholesale
  with a curve in v6.1 — a soft correction, not a bug.
- v5/v6→v6.1: flat $5000 Pack-a-Punch cost needed a three-step markdown by v6.1, an implicit admission the
  flat late-game cost created "impossible pack pressure."
- No features were permanently abandoned/removed — traps, pack-a-punch, overtime, and all maps persist
  through v6.1; changes are tuning passes, not feature reversals (aside from the cannon-shake walk-back).

## Exact useful quotes (verbatim, cited)
> "bug: the money factory currently generates money between rounds, it should only be active during the rounds" — v2 changelog, "Next"

> "after playing the waves feel like they cap at a certain difficulty, I'm noticing the same patterns of enemies, with a single boss maybe every other wave, never seeing more than one, i feel like it should get increasingly more intense as the waves increase" — v3 changelog, "Next for v4"

> "the money factory may be a little too overpowered too, can you balance that too maybe more time between payout and slightly less, and can you make it take up 2x2 grid spaces instead of a single space" — v3 changelog, "Next for v4"

> "can you make the cannons not shake the screen, its fine when you lose a life or if tnt goes off, but the cannon shakes are a bit much." — v4 changelog, "Next v5"

> "can you make it so you earn an extra dollar per kill, and you should earn more money for completing a round, maybe ($100 x wavenumber) awarded each round" — v5 changelog, "for v6"

> "super enemies after wave 50 that resist normal tower damage" — v6 changelog

> "I'd treat this as the first 'real V6 beta' and test it from waves 1–20 first before worrying about wave 100+ balance." — v6 changelog, final line

> "Replaced the flat $100 × wave reward with a smoother curve: early waves give much less, midgame ramps steadily, late/overtime gives more support." / "Pack cost now scales down: $4500 early overtime, $4000 after wave 25, $3500 after wave 35." / "This should land closer to the middle ground: less mindless early money, but less impossible pack pressure later." — v6.1 changelog

## What still requires hands-on playtesting
Whether v6.1's economy curve and pack-cost markdown actually feel balanced across waves 1-50+ and into
overtime — the changelogs document *intent*, not measured playtest outcomes. No in-browser gameplay
verification exists in `GAME_CATALOG.md` for this game either.

## Recommended next hardening/rescue lane
Lower priority than Nebula Rescue and Halo FPS — this game's changelog trail is clean and its economy arc
looks converged (v6.1 is a corrective pass, not a fresh problem). A straightforward in-browser playtest
across early/mid/late/overtime waves would be sufficient to move this from Provisional to Confirmed.
