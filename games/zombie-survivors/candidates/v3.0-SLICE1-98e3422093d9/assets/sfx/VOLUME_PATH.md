# P24 — Volume path for imported SFX

Imported samples connect into the existing AudioRuntime six-bus graph:

```
BufferSource → local Gain → busGains[Weapons|Zombies|Ambience|UI|Music] → masterGain → destination
```

Settings UI (`ui.js` audioBuses / `applyAudioBusesToLegacy`) drives the same
`arSyncBusesFromSettings()` path used by procedural beds. There is no parallel
audio graph for samples.

## Measured (lane proof, headless Chrome CDP)

Artifact: `docs/agent-runs/2026-07-26-normal-forward-3/lane5-sfx-runtime-proof.json`

| Setting | Weapons bus node gain | effectiveWeapons (Master×Weapons) |
|---|---|---|
| High (Master 1, Weapons 1) | **1.0** | **1.0** |
| Low (Master 0.4, Weapons 0.15) | **0.15** | **0.06** |
| Master muted | master node **0** | **0** |

Same imported clip family (`gun/fire_shotgun_*.ogg`) played at high and low.
Sample plays route through `busGains.Weapons` — not a second unmanaged destination.

Harness: `v2.0-ec/tools/sfx-runtime-proof.mjs` (uses existing bus setters, not a new volume system).
