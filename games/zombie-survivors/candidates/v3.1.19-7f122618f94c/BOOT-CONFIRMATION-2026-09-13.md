# v3.1.19 candidate — boot-confirmation evidence, 2026-09-13

Served this exact directory locally, drove it via the existing CDP harness
(`v2.0-ec/tools/cdp-drive.mjs`, headless Chrome, reused existing instance). AGENT-VERIFIED BOOT
rung, not a Normal-Play Trace.

- **Title bar:** `Zombie Survivors — ver. v3.1.19` — exact match.
- **New Game -> Start:** real UI clicks reached a rendered playing state; F8 debug overlay
  confirms `v3.1.19 · GG_WN3 Recovery: Death-Freeze Retest & Pause-Escape Diagnostics · b70e17a3`
  — matches `CANDIDATE.json`'s `identity_line` exactly.
- **Player state:** `hp:100, state:"playing"`.
- **Console errors:** exactly 1, the same known CDP-synthetic-click Pointer-Lock artifact
  disclosed in every prior candidate — not new.

Does not claim ZSS-BUG-033 or ZSS-BUG-034 are fixed. Does not claim owner acceptance
(`owner_accepted: false`).
