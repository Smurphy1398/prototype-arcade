# weapon-kit-cc0 — provenance

| Field | Value |
|---|---|
| Pack id | `weapon-kit-cc0` |
| Display name | ZSS Weapon Kit CC0 (FPS viewmodel recipes) |
| License | **CC0-1.0** (public domain dedication) |
| License URL | https://creativecommons.org/publicdomain/zero/1.0/ |
| Author | ZSS craft lane (Grok) for Normal Forward Run 3 / P25 |
| Acquired | 2026-07-26 |
| Format | JSON mesh recipes (box / cylZ / lathe parts) + embedded runtime table |
| Commercial use | Allowed |
| Modification | Allowed |
| Attribution required | No (CC0) |

## What this pack is

A **curated free weapon/item pack** bound to **existing** `WEP` / `ITEM_REGISTRY`
rows. It is not a download sitting unwired: every model file is committed,
hashed, licensed, and consumed by `buildWeaponVM` via `WEAPON_KIT_PACK`.

## Covered registry leaves (held viewmodels)

| Leaf | WEP name | Boomstick-safe? |
|---|---|---|
| `crowbar` | Crowbar | n/a |
| `sidearm` | Sidearm | n/a |
| `nailgun` | Nailgun | n/a |
| `m16_rifle` | M16 Rifle | n/a |
| `mac_smg` | MAC SMG | n/a |
| `pump_shotgun` | Pump Shotgun | **Yes — separate row, never Boomstick** |

**Boomstick is intentionally NOT in this pack.** Boomstick identity is
owner-protected (`WEP[1].name === "Boomstick"`, dualBarrel). Presentation
and reload direction for Boomstick are a separate task (P9), not a pack absorb.

## Hard constraints honored

- Does **not** rename or re-register Boomstick
- Does **not** merge Pump Shotgun into Boomstick
- Binds only to **existing** registry rows (no new weapon rows)
- Files under `v2.0-ec/assets/packs/weapon-kit-cc0/` + runtime embed
  `v2.0-ec/src/weapon-pack.js`
