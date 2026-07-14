# Game History Recovery

Durable version/checkpoint history recovered read-only from the protected source archive
(`..\PROTOTYPE ARCADE\`) for the five games named in `docs/PHASE_LANES.md`'s Game History Recovery lane.
Completed 2026-07-14. No game source, no source-archive files, and no repo runtime files were touched —
this is documentation only.

**Agents:** 🧭 Claude (Sonnet, sole editor) — used 5 parallel read-only `Explore` subagents (no edit/write
tools) to investigate each game's archive folder concurrently, then synthesized and wrote all files below
personally. 🧠 Grok / 🔍 Codex were not used — per the lane's own scope, this is Claude reading a local
archive directly, no outside review judged necessary.

## Per-game files
- [`nebula-rescue.md`](nebula-rescue.md) — Cosmic Pinball 3D → Nebula Rescue lineage, v1 through v6.4.
  Includes the protected spinner-tuning win and passover.txt's rejected "Red Spider Cleanup" build.
- [`halo-fps.md`](halo-fps.md) — the largest tree (~60 versions, V0.1→v1.7.6). Resolves the
  v1.7.5.2-vs-v1.7.6 published-label conflict (stale boilerplate title, not a real fork) and documents the
  never-implemented multiplayer/netcode folders.
- [`pictionary.md`](pictionary.md) — thinnest evidence of the five (no changelogs, no code comments); traces
  the v6→v7 engine lineage and its two real play-session exports.
- [`tower-defense.md`](tower-defense.md) — highest-confidence report; a clean, fully-changelogged v1→v6.1
  ladder confirming v6.1 as canonical.
- [`world-history-atlas.md`](world-history-atlas.md) — longest clean-rebuild lineage (v1→v8); traces the
  v7 UI regression and its v7.1 fix.

## Preserved raw source notes
Small unique-context `.txt` files copied verbatim (never summarized/paraphrased) under `raw/`:
- [`nebula-rescue-passover.txt`](raw/nebula-rescue-passover.txt) — the build brief that produced Nebula
  Rescue v6.4 and the only record of the rejected "Red Spider Cleanup" build.
- [`halo-fps-continuation-prompt.txt`](raw/halo-fps-continuation-prompt.txt) — the only authored
  project-handoff document for Halo FPS; names v1.7.6 as source-of-truth.
- [`world-history-history.txt`](raw/world-history-history.txt) — the corrected 14-era timeline framework
  that became the game's canonical schema.
- [`world-history-prompt-notes.txt`](raw/world-history-prompt-notes.txt) — the original founding vision
  document (predates all built versions).
- [`2026-07-14-video-review.md`](raw/2026-07-14-video-review.md) — pre-existing secondary visual evidence
  (screen-recording review), seeded before this lane; not re-verified here.

Tower Defense and Pictionary had no `.txt` notes files worth separately preserving (Tower Defense's
per-version `changelog.txt` files are summarized in full inside `tower-defense.md` instead of copied
verbatim, since they are numerous, short, and already fully quoted; Pictionary has none at all).

## Cross-cutting findings
- **Stale-title bugs are a systemic pattern, not isolated incidents.** Halo FPS shows the exact same
  "title never updated after a save" bug independently in three separate version clusters (v0.8.2-v0.9.1,
  v1.4.6-v1.5.3, and the v1.7.6/"v1.7.5.2" published-label conflict) — always cosmetic, never a sign of a
  functional fork. Treat any future internal-title mismatch in this archive as **suspect-stale-boilerplate
  first**, not automatically a real version conflict, until a byte/feature diff says otherwise.
- **Regressions do happen and get caught in this project's own workflow**: Halo's v1.7.2 HUD/ammo break
  (fixed v1.7.3, confirmed by the build's own beta checklist), World History's v7 UI break (fixed v7.1),
  and Nebula Rescue's rejected "Red Spider Cleanup" build all show a working pattern of "ship → break →
  explicitly note it → fix next version" — useful precedent for how future rescue work should be logged.
- **Never rank builds by filename/version number alone** was upheld throughout: every "current provisional
  build" claim above is corroborated by content evidence (diffs, internal titles, function-name changes),
  not folder-name trust alone.

## Confidence summary
| Game | Confidence | Why |
|---|---|---|
| Tower Defense | High | Full authored changelog trail, v2-v6.1 |
| World History Atlas | High | Byte-level diffs + consistent title/CDN progression, v1-v8 |
| Halo FPS | High (tree/conflict) / Medium (post-v0.5 feature detail) | Only 5 of ~60 versions have authored changelogs; rest reconstructed from titles/HUD strings |
| Nebula Rescue | Medium-High | Strong v6.3→v6.4 diff evidence; early v1-v3 gap undocumented |
| Pictionary | Low-Medium | No changelogs, no code comments anywhere; only 4 files total |

## Integration
Linked from `docs/GAME_CATALOG.md` (canonical-build entries), `docs/PHASE_LANES.md` (lane record), and
`docs/PROJECT_STATE.md` (current lane / next action) — see those files for status. `docs/BACKLOG.md` B8
(Nebula Rescue rescue work) should treat `nebula-rescue.md`'s protected-spinner-win and slide/ramp findings
as its starting evidence.

## Explicit exclusions honored
No game source changes. No source-archive changes (verified: archive folder listings before/after this
lane are unchanged). No commit/push/deploy performed as part of this lane — stopping here for Simon's
review per the lane's own terms.
