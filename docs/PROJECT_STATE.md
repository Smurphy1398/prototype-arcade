# Project State

Last updated: **2026-09-14**. Reflects verified pre-Astro live commit
**7ece6acc09d3e3ca3513116b5230732f4b2cc8f3** plus the Astro release integration in this commit.
Publication verification is recorded in `docs/releases/astro-racing-1.0.0-rc.1/` after deployment.

## Current lane

**Astro Racing 1.0.0-rc.1 publication.** Simon authorized Codex's targeted editing,
commits, pushes and deployment on 14 September. The finished candidate's game content is
preserved. Online leaderboard is a separate next task; physical phone/friend testing follows publication.

The Arcade card and landing link to `games/astro-racing/index.html`. All 25 runtime
files match the release manifest. The matching room server source and deployment recipes
are in `services/astro-racing/`. No new hosting charges have been incurred.

**Multiplayer blocked:** no authenticated Node/WebSocket host or public room service has
been identified. GitHub Pages cannot execute the room server. The landing discloses this.
Public room-link/race/rematch verification remains pending that access, despite prior local success.

## Published state and deployment

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

Complete public Pages verification, then connect a persistent Node/WebSocket host using
`services/astro-racing/README.md`. Configure the verified WSS endpoint on the landing and
run the two-client normal-time race/rematch check before announcing public friend races.
