# PROTOTYPE-ONLY / NOT CLEARED FOR DISTRIBUTION / REPLACE BEFORE SHIPPING

**Owner-authorized 2026-08-23** for local prototype/development use ONLY (see
`docs/POST_SLICE_BACKLOG.md` 2026-08-23 entry and memory `decision_zombie_audio_licensing_prototype`).
Credit alone does not create shipping rights. This entire folder must be swapped for
owned/licensed replacements before any public distribution or release build.

## Provenance

136 clips selected from the Valve Left 4 Dead 2 shipped infected-voice audio corpus, sourced from
`SIMONS FILES/3rd party reference sounds/SOUNDS-SOURCE/l4d2/sound/npc/infected/` (already classified
in this project's history as `THIRD_PARTY_PLACEHOLDER_AUDIO / NOT_RELEASE_ELIGIBLE /
REPLACE_BEFORE_RELEASE` — see `audio-runtime.js` header comments around `AR_PROTO_PCM`). Rights:
**VALVE_PROTO_NOT_RELEASE**. Selected/copied by `build_zombie_voice_manifest.mjs`
(script + full copy log preserved at
`docs/agent-runs/2026-08-21-slice-1-ten-minutes/T5-evidence/zombie-voice-144-wiring-2026-08-23/`).

## Structure

One subfolder per ZSS archetype (`walker/`, `runner/`, `breacher/`, `husk/`, `hunter/`, `spitter/`,
`banshee/`, `boomer/`, `brute/`), each with 14-17 clips named `<state>_NN.wav` where state is one
of `idle` / `alert` / `aggro` / `hurt` / `death`. Source category mapping (L4D2 folder → ZSS state):
- `idle` ← `idle/breathing`, `idle/moaning`, `idle/mumbling`
- `alert` ← `alert/alert`, `alert/becomealert`, `alert/becomeenraged`
- `aggro` ← `action/rage` (+ male/female), `action/rageat` (+ male/female)
- `hurt` ← `action/been_shot` (+ male/female)
- `death` ← `action/die` (+ male/female/mp)

## Runtime wiring

Consumed by `SFX_ZOMBIE_VOICE_BANKS_PROTO` in `audio-runtime.js`, gated behind
`AR_ZOMBIE_VOICE_PROTO_EAR` (same isolation pattern as the existing `AR_PROTO_PCM` /
`AR_PROTO_PRODUCT_EAR` prototype-audio gate for weapon fire sounds) — flip that one flag to false
and the game falls back to the original 10-clip shipped-safe `SFX_ZOMBIE_VOICE_BANKS` pool with zero
other code changes. This isolation is the "replaceable manifest" layer: a shipping pass replaces
this folder + flips the flag, it does not re-architect the voice system.

## Replace-before-shipping checklist (not yet done — do not ship with this folder present)

- [ ] Record or license replacement audio per archetype/state (same folder structure).
- [ ] Remove this folder and everything under `assets/sfx/zombie-prototype-l4d2/`.
- [ ] Flip `AR_ZOMBIE_VOICE_PROTO_EAR` to `false` (or delete the proto bank entirely once real
      assets replace it).
- [ ] Update the project credits file to remove the Valve L4D2 attribution once no longer used.
