# PROTOTYPE-ONLY / NOT CLEARED FOR DISTRIBUTION / REPLACE BEFORE SHIPPING

**Owner-authorized 2026-08-23** (same Valve-placeholder ruling as `zombie-prototype-l4d2/`).
BL-56P adds HL2 `npc/zombie`, `npc/fast_zombie`, `npc/zombie_poison` vocals as extra
walker / runner / brute variants. Credit is not a shipping license.

## Runtime

Merged into `SFX_ZOMBIE_VOICE_BANKS_PROTO` (alongside L4D2). Gated by
`AR_ZOMBIE_VOICE_PROTO_EAR` / `arUnclearedProtoEar()` — flip that flag false and
these paths are not preloaded or played.

## Replace-before-shipping

- [ ] Record or license replacements.
- [ ] Remove this folder.
- [ ] Flip `AR_ZOMBIE_VOICE_PROTO_EAR` to `false` (drops HL2 voices, L4D2 voices, and Valve ambience together).
