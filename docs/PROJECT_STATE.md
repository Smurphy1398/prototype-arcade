# Project State

Last updated: **2026-09-14**. Reflects live baseline **de81a363d9ab6c87b6950a4fe62e6b6da9d3fc75** plus the RC2 mobile/presentation changes in this commit. Public verification follows deployment.

## Current lane

**Astro Racing 1.0.0-rc.2 is locally verified and prepared for publication.** Simon authorized the targeted mobile controls, HUD, Sunspun promotional imagery, commits, pushes and Pages deployment. His actual phone screenshots informed the layout. Final approved course content, checkpoint 44 and the original prepared room server are retained. Online leaderboard work remains separate.

The canonical editable source is `services/astro-racing/`; active browser build is `games/astro-racing/`, linked from `games/astro-racing.html` and the Arcade cabinet. RC2 source SHA-256 `d1308316d9b61afec53705bb9e70f3c5f9225b459d51340fa3be35181a402c3d`; active dist SHA-256 `4e47a24ee30b43f4f3ea6a156cd56e8537d2b604421eb0f19dd720ddd46af50f`. Manifest and evidence: `releases/astro-racing-1.0.0-rc.2/`. Previous RC1 evidence remains historical.

## Verification and phone testing

Four Node tests, 24 mobile browser checks, the actual Arcade UI launch path, all 25 active runtime hashes and both promotional assets pass locally. Desktop/mobile crops and actual race rendering were inspected. Touch/sensor checks are **emulated**, not real-phone verification. Physical Safari permission, tilt feel/sign, thumb reach, frame rate and background return remain for Simon.

## Multiplayer

**Public rooms unavailable; Render connection request paused by Simon.** No new hosting charges. Existing Node/WebSocket code and deployment recipes remain intact. The bounded `P2P-ASSESSMENT.md` recommends retaining that option, reducing snapshot bandwidth first, and treating WebRTC host-player conversion as a separate lane with signaling/TURN and host-loss work. No public friend race/rematch success is claimed.

## Publication and rollback

Live landing: https://smurphy1398.github.io/prototype-arcade/games/astro-racing.html

Existing GitHub Pages: HTTPS enforced, legacy build, `main` branch/root. Explicit Pages build requests are used if pushes do not queue one. Rollback tag `arcade-before-astro-mobile-rc2` retains de81a36; the full Git archive also exists locally. Revert only the RC2 commit(s) and request another Pages build; never force-push or discard unrelated work. Pre-Astro rollback tag remains.

Checkpoint 44 remains SHA-256 `0c1a1fa259c64f457f968d03adb881af05dff98f552c092b1f0caf3f476604cd`. Checkpoint 45 adds the RC2 source and runnable build. All other games and historical builds are retained; this lane does not re-audit them. Earlier July state remains archived in `releases/astro-racing-1.0.0-rc.1/project-state-before.md`.

## Next action

Publish/verify RC2, then real-phone playtesting. Render login is paused. The P2P assessment is preparation, not a networking conversion or a new account-connection request.
