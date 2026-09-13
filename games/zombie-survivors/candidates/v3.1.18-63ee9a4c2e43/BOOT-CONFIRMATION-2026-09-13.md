# v3.1.18 candidate — boot-confirmation evidence, 2026-09-13

Served this exact directory locally (`python -m http.server`, byte-identical copy of the
committed candidate files, `index.html` = 6345063 bytes matching the source build exactly) and
drove it via the existing CDP harness (`v2.0-ec/tools/cdp-drive.mjs`, headless Chrome, port 9333,
an already-running instance reused rather than launching a second Chrome per the serialization
rule). Host load checked immediately before: 3% CPU. This is an **AGENT-VERIFIED BOOT** rung, not
a Normal-Play Trace — real served file, real CDP-synthesized input, headless renderer.

## What was checked

- **Title bar:** `Zombie Survivors — ver. v3.1.18` — exact version match.
- **Boot log (in-page diagnostic):** `4. READY — v3.1.18 · GG_WN3 Recovery: Sawer Readability,
  Core-Bug Closeouts & Audio Diagnostics · 7f611193` — identity line matches `CANDIDATE.json`'s
  `identity_line` field exactly (version, wall name, and commit all agree).
  Shader warm-up completed (14 programs, 474ms), world build completed (colliders=4774, vehicles=12,
  P21 skins loaded 30/60 — the 30 failures are the known placeholder-skin gap, not new).
- **New Game -> Start:** both real UI clicks (by visible button text, not a harness shortcut)
  landed the client in a rendered playing state — screenshot `v318-boot-03-after-start-click.png`
  shows a real rendered street scene, player weapon viewmodel visible, F8 debug overlay confirming
  `XYZ 0.00/0.00/6.00` (real spawn position) and the same exact version/commit identity string.
- **Console errors:** exactly 1 — `NotAllowedError: A user gesture is required to request Pointer
  Lock.` This is the same known CDP-synthetic-click artifact already disclosed in the v3.1.17
  candidate's own smoke evidence (synthetic clicks are not treated as a real user gesture by the
  browser's Pointer Lock API) — not a new defect, not investigated further here.
- **FPS in this headless/swiftshader render path:** ~4fps / 250ms frame time — expected and not
  representative of real performance (software rendering under CDP headless, same caveat every
  prior CDP capture this recovery has disclosed).

## What this does NOT claim

- No sustained multi-minute play session (same CDP-driven-movement limitation as v3.1.17's own
  disclosure).
- No claim about the player-death hard-freeze or pause-menu-non-interactive defects — both remain
  open, untested this session, and are listed in `CANDIDATE.json`'s `known_residuals_disclosed`.
- No claim this constitutes owner acceptance. `owner_accepted: false`.

## Evidence files (this run, local — not yet committed as part of the served candidate directory)

Captured under the working session's scratch path, referenced here for provenance:
`v318-boot-01-title.png`, `v318-boot-02-after-newgame-click.png`,
`v318-boot-03-after-start-click.png`.
