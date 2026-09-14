RC3 is live and publicly verified. Physical-phone verification remains an owner check.

## Agent Snapshot
Codex (inline), sole implementer in Simon's explicitly authorized mobile hotfix lane.

## Agent Contributions
- Codex inspected canonical source/live RC2, implemented the focused repair, extended the existing input harness, built and prepared RC3. Accepted implementation; public verification passed.
- Outside agents were not used because the request is tightly scoped and usage is limited. No verbatim agent output captured.

## Claude Synthesis
Claude did not run. Simon authorized Codex's edits, commits, pushes and existing Pages redeployment. No new service or package was installed.

## What Changed / Current State
RC3 makes Drive the large right thumb target and Drift the large left target (136-148px wide, 72-80px high); Item/Trick share the row above Drive, brake/reverse sits above Drift, and Recenter is at the top. Existing safe-area insets and compact HUD remain.

Auto-drive is off by default. The version-3 preference marker corrects RC2's automatic true value once, retaining steering, graphics, resolution, setup and tuning; a subsequent deliberate opt-in persists. RC2 did not distinguish a deliberate true from its automatic true, so all pre-marker true values are corrected once. Drive remains visible.

Each pointer owns only its action; secondary release/cancellation/lost capture cannot clear held Drive. Global blur, hidden page, pagehide and rotation clear controls. Brake overrides gas and releasing it restores a still-held Drive. Solo rotation/backgrounding pauses; resume never resurrects held touches.

Tilt uses screen-relative gravity derived from W3C device orientation, avoiding the previous raw Euler-angle sign/representation problem. Calibration requires at least five valid samples over 200ms within a two-degree band. Defaults remain sensitivity 1.4, dead zone 3 degrees and 140ms time-based smoothing. Returning inside the dead zone sets steering to zero immediately. Null/nonfinite/out-of-range data invalidate calibration; a feed older than 500ms contributes no steering and selects touch fallback. Recenter and rotation require fresh calibration. The original permission timeout is canceled after successful calibration, preventing it from interfering with later rotation. Denied, unavailable, missing and superseded permission paths use touch fallback.

Axis derivation reference: https://www.w3.org/TR/orientation-event/ (Z-X'-Y'' orientation and device frame). No compass heading is required.

## Work Completed / Evidence
- Six targeted Node input/mobile tests passed; normal TypeScript + Vite build passed. No full course audit or new testing framework.
- 22 existing-harness browser checks passed in Edge emulation: permission/calibration, actual simulation acceleration, native CDP four-finger holds/releases/cancel, synthetic per-pointer cancellation/lost capture, brake, both landscape directions, neutral/dead zone, recenter, invalid/stale sensors, touch fallback, migration/opt-in, background/resume and layout.
- Inspected rendered 844x340 tilt and 568x320 touch images. Bounds/overlap checks cover 844x390, 667x300, 568x320 and 390x760. Synthetic sensor events and touch emulation do not verify physical iOS/Android sensor sign/feel or thumb reach.
- The first multitouch test failure was a CDP fixture error (touchEnd names released contacts). A later rotation failure revealed a real leftover permission timeout; it was fixed and the checks rerun. Final evidence is mobile-checks.json; build-checks.json records commands/results.
- RC2 baseline main/Pages: 7b31d014ffda41c786987c7ecb53c22e71c04299; live RC2 bundle was index-DvS4bCKF.js. No partial hotfix existed in that clean checkout. The outer unborn/dirty project remains untouched except additive handoff/status documents.
- Source SHA-256: `f0f1f3d6178b56fdb310a1e2a5921462f95b19ad92d349125cabbfb3b744bffc`. Active dist SHA-256: `5517186eb5016553cc87a09946993aeb5fbd6ac73a5dbd7b63fdc5456218125a`. Bundle: `assets/index-C-Np7Fsz.js`.
- Source manifest comparison permits only nine files: mobile controller/math/CSS/hints/tests, package identity, build label, and README source-identity correction. Course/physics/bot/item/network/server/audio/preview files match RC2 byte for byte. All old hashed assets and checkpoints remain. Checkpoint 44 archive hash was rechecked. Existing rollback tag arcade-before-astro-mobile-rc2 remains unchanged; 7b31d01 also retains the complete RC2 release.

## Git / Commit / Push / Deploy State
Game commit `6ae654c0c96a1520fdb6c33e72c444e7d79bdb11` was committed, pushed and successfully built by GitHub Pages. Public HTTPS verification passed: all 25 active runtime hashes, Arcade card/landing/game navigation, keyboard driving, and actual phone UI setup/countdown stationary until held Drive accelerates (emulated sensor/touch). Zero browser page errors. `publication.json` records the receipt; the following documentation commit does not change game bytes. Existing main/root Pages only. No new charges. Public rooms remain unavailable; Render paused. P2P, leaderboard and course work excluded.

## TL;DR
RC3 implements the requested mobile controls hotfix. Targeted automated checks and the normal build pass. Public verification passed and is recorded in publication.json.

## Quick Smoke — Do This Now
- Open https://smurphy1398.github.io/prototype-arcade/games/astro-racing.html and check RC3.
- In landscape, Enable Tilt, grant permission and hold your comfortable grip still until Tilt ready.
- Hold Drive on the right, Drift on the left; release Item/Trick while keeping Drive held. Only releasing Drive should remove gas; brake overrides it.
- Tip each edge down, return to neutral, then Recenter. Rotate to the other landscape orientation, hold steady and resume.
- Switch apps and return; resume explicitly and re-hold Drive. Use Touch steering if motion is unavailable. Report phone/browser plus any wrong direction or stuck control.

## Exact Next Action
Simon performs the physical-phone smoke above on published RC3.
