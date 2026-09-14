# Project State

Last updated: **2026-09-14**. Reflects RC3 release preparation against `7b31d01`; publication pending.

## Current lane
Astro Racing **1.0.0-rc.3 - MOBILE CONTROLS HOTFIX** is built and passes targeted checks. Simon authorized implementation, commit, push and existing Pages redeployment. Canonical source: `services/astro-racing/`; active build: `games/astro-racing/`; landing: `games/astro-racing.html`.

Large right Drive/left Drift, independent multitouch, opt-in auto-drive, steady-grip tilt calibration, both landscape orientations, Recenter and touch fallback. Six Node tests, 22 emulated browser checks and normal build pass. Physical-phone verification remains outstanding. Release evidence: `releases/astro-racing-1.0.0-rc.3/`; report: `agent-runs/2026-09-14-codex-astro-mobile-rc3.md`.

Source SHA-256 `f0f1f3d6178b56fdb310a1e2a5921462f95b19ad92d349125cabbfb3b744bffc`; active dist SHA-256 `5517186eb5016553cc87a09946993aeb5fbd6ac73a5dbd7b63fdc5456218125a`. Earlier RC2 state is preserved in the RC3 evidence directory.

## Publication and rollback
https://smurphy1398.github.io/prototype-arcade/games/astro-racing.html

Existing HTTPS GitHub Pages main/root; request an explicit Pages build if needed. Preserve old hashed assets, checkpoints 44/45, and rollback tag `arcade-before-astro-mobile-rc2`. RC2 is recoverable at `7b31d01`. Revert only RC3 with a new commit to undo this hotfix; never reset or force-push. Checkpoint 44 SHA-256 remains `0c1a1fa259c64f457f968d03adb881af05dff98f552c092b1f0caf3f476604cd`.

## Multiplayer and scope
Public rooms unavailable; Render connection paused. No new charges. Prepared server, P2P, leaderboard, courses, physics, bots, items and audio are outside this hotfix and retained.

## Next action
Complete authorized publication and public checks, then physical-phone smoke in the RC3 report.
