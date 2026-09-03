# Selected newest graphic source

**Chosen set:** `PA-GEN2.1-20260819-R2.2/preview/` (mtime 2026-08-19 15:03)

Why this is the newest applicable set:

| Folder | When | Notes |
|---|---|---|
| PA-GEN2-20260819-0559 | 2026-08-19 06:09 | First GEN2 |
| PA-GEN2.1-20260819-R2 | 2026-08-19 07:03 | R2 |
| PA-GEN2.1-20260819-R2.1 | 2026-08-19 13:17 | R2.1 |
| **PA-GEN2.1-20260819-R2.2** | **2026-08-19 15:03** | **Newest; HOLD preview; R1/R2/R2.1 frozen** |

Copied into this worktree as isolated `next/` (css, js, assets, lobbies, prize, settings). Launch URLs remapped to `../games/*.html` so they hit Arcade landings, not the sibling `PROTOTYPE ARCADE` archive.

R2.2 already reserved an empty **District Zero** cabinet (“empty until it has its own art”). That slot is now Zombie Survivors.

# ZSS cover

- Original (wrong title BOOMSTICK '88, kept as provenance): `docs/agent-runs/2026-09-03-classic-next-zss/assets/zss-cover-original.jpg`
- Titled web still: `docs/agent-runs/2026-09-03-classic-next-zss/assets/zss-cover-titled-zombie-survivors.jpg`
- Web: `assets/covers/zombie-survivors.jpg` and `next/assets/covers/zombie-survivors.jpg`
- SHA-256 (titled): `08B8A19453C0B9DE3EC3E7E7F42ADB0713010440D93EA9391F4664B4A140BB0B`
- Title lettering verified: **ZOMBIE SURVIVORS**. Boomstick remains the unlabeled shotgun in-hands.
- Generator: xAI Imagine `image_gen`, 2026-09-03, 3:4
- Prompt (verbatim): cinematic first-person survival-shooter arcade cabinet poster, original design, no logos, no franchise marks, no celebrity likeness. Foggy American small-town street at night after a disaster: wet asphalt, a boarded diner window, sodium-orange street lamps drowning in thick ground fog, distant silhouettes of slow walking figures barely readable through the haze. First-person view of weathered gloved hands holding a distinct short double-barrel shotgun (boomstick), not a generic assault rifle. Muted olive, rust, bone, and wet concrete palette. Theatrical fog, low visibility, grounded and grim rather than neon or comic-book. Photoreal cinematic poster quality, slightly grainy film still, not pixel art, not cartoon, not over-saturated zombie-horde cliché.

Tackiness note (author, not a critic): R2.2 floor is still magenta/cyan neon. Hero glow was reduced (`text-shadow` 24px → 10px). Classic gold row is the recoverable default. Cover is fog/diner/boomstick, not generic green-horde poster art.

# ZSS Arcade identity (do not invent v3.1.x)

- **Stable:** none. `owner_accepted` is false.
- **Candidate on Arcade:** `v3.0-SLICE1` SHA-256 `98e3422093d9cbf5cace834c370b6dd940b38c0dfca832ce0a19f9285b1c86f2` source commit `62835a37`. Status remains **CANDIDATE / OWNER-SMOKE REQUIRED / NOT OWNER-ACCEPTED**. Do not relabel as accepted.
- **v3.1.x:** active ZSS marathon `docs/agent-runs/2026-09-03-zss-v3-1x`. Not copied into Arcade this pass.
