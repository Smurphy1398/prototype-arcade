# Project State

Last updated: **2026-09-14**. Reflects publicly verified game commit
**54e20bf2f7c15956c2ede5c6abfe5296946222ab**, plus the evidence/documentation update in this commit.
The game assets remain byte-identical to rc.1. Publication evidence is in `docs/releases/astro-racing-1.0.0-rc.1/`.

## Current lane

**Astro Racing 1.0.0-rc.1 is published; room hosting awaits account connection.** Simon authorized Codex's targeted editing,
commits, pushes and deployment on 14 September. The finished candidate's game content is
preserved. Online leaderboard is a separate next task; physical phone/friend testing follows publication.

The Arcade card and landing link to `games/astro-racing/index.html`. All 25 runtime
files match the release manifest. The matching room server source and deployment recipes
are in `services/astro-racing/`. No new hosting charges have been incurred.

**Multiplayer blocked:** no authenticated Node/WebSocket host or public room service has
been identified. GitHub Pages cannot execute the room server. The landing discloses this.
Public room-link/race/rematch verification remains pending that access, despite prior local success.

## Published state and deployment

**Live game:** https://smurphy1398.github.io/prototype-arcade/games/astro-racing.html

Public browser checks passed for the actual Arcade card, launch, all 25 asset hashes,
all 16 previews, keyboard driving, Back navigation, and landscape touch rendering.
Pages run 34808002639 succeeded at game commit `54e20bf`. The push did not queue Pages
automatically; an explicit Pages build request completed successfully.

GitHub's Pages API verified HTTPS at https://smurphy1398.github.io/prototype-arcade/,
legacy build, `main` branch, repository root, HTTPS enforced. Before this release the last
successful Pages build was `7ece6acc09d3e3ca3513116b5230732f4b2cc8f3`.
The live homepage was byte-identical to that Git commit. This release adds one Astro card;
all prior cabinets, game builds and historical files are retained.

The July state document was stale relative to September's actual Next-floor homepage and
Zombie Survivors v3.1.19 snapshot. It is preserved verbatim in
`releases/astro-racing-1.0.0-rc.1/project-state-before.md`; its old auth/live/version claims
are historical evidence, not current status. Other games were not re-audited in this lane.

## Rollback

Tag `arcade-before-astro-1.0.0-rc.1` retains the pre-release live commit.
The Astro workspace also contains a complete Git archive ZIP of that commit.
Checkpoint 44 remains byte-identical, SHA-256
`0c1a1fa259c64f457f968d03adb881af05dff98f552c092b1f0caf3f476604cd`.
Revert the targeted Astro publication commit(s) with a new commit; do not reset/force-push
main or delete unrelated newer work. See the release report for exact commit IDs once published.

## Next action

Run `Connect-Astro-Racing-Multiplayer.cmd` in the Astro workspace, authorize Render CLI,
and select the workspace. The recommended limited first test uses Render Free with no new charges;
see `releases/astro-racing-1.0.0-rc.1/HOSTING-DECISION.md`. Configure the verified WSS endpoint on the landing and
run the two-client normal-time race/rematch check before announcing public friend races.
