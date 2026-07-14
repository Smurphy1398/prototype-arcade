# Backlog

Durable feature/problem history. Items get organized, prioritized, and marked done — **not deleted**
when priorities change. Major concepts are preserved as **full structured specs**, never compressed into
vague one-liners (honors `..\HARD_RULE_BACKLOG_SPEC_PRESERVATION.md`). Raw source ideas live verbatim in
`RAW_IDEA_INBOX.md`; this file is the structured layer.

Status keys: `NEXT` · `QUEUED` · `PARKED` · `DONE`

---

## Near-term (from the accepted audit)

### B1 — Canonicalize the 3 published builds  · NEXT
Resolve provenance for what's already live, record hashes in `GAME_CATALOG.md`, lock Confirmed status.
- **Halo (blocking sub-item):** the live `halo-fps-game.html` (`eb9e655c`) matches no local build and its own
  `<title>` says v1.7.5.2 while the site advertises v1.7.6. Decide whether the live file or local
  `arena-fps-v1-7-6.html` (`f7d1714e`) is canonical; make the advertised version honest.
- Tower Defense & Bob Ross: diff published vs local candidate, playtest, Confirm.
- **Non-goals:** no new games, no homepage redesign.

### B2 — Import the cleanest missing game (Chess)  · QUEUED
3D Chess + Checkers is self-contained (inlined Three.js), single-file, easy to validate.
- Playtest v2.2 vs v2.3 first (labels can't rank them — see catalog), pick the winner, add as `games/chess/`.
- Proves the import + URL pattern for later games. **Non-goals:** homepage redesign.

### B3 — Import additional confirmed games  · QUEUED
Nebula Rescue pinball (v6.4), Pictionary "Draw It!" (the game file, not the gallery exports),
World History Atlas (v8). One sub-step each; Leaflet/Babylon CDN checks for the CDN games.

### B4 — Arcade homepage: real arcade feel  · QUEUED
Turn the plain card list into an arcade. Visual-direction pass with 🧠 Grok, then implementation,
then 🔍 Codex regression/path/responsive review. **Constraint:** must not break existing public URLs.

### B5 — Shared game shell  · PARKED
Common back-to-arcade nav, pause, and home behavior across games. Revisit once ≥4 games are imported.

### B6 — Workflow & tooling  · (B6a DONE · B6b/B6c QUEUED)
- **B6a — Status-skills port (DONE):** `/handoff`, `/roadmap`, `/phaselane`, `/whatsnext` authored Arcade-native
  (Lane 1B), backed by `ROADMAP.md` + `PHASE_LANES.md` + `AGENTS.md` routing.
- **B6b — Generic / global promotion (QUEUED):** once stable, promote generic versions of these skills to global
  `~/.claude` or a future **VIBE CODE OS** repo for cross-project reuse. Keep Arcade-specific wording out of the global copy.
- **B6c — `/peer-review` adaptation (QUEUED):** adapt MLB's `/peer-review` as its own later lane — depends on
  🧠 Grok / 🔍 Codex wrapper scripts and needs careful, non-MLB adaptation. Not part of Lane 1B.

---

## Preserved concept specs (do not compress)

### Bob Ross Painting Sim — full simulator vision
- **Raw intent:** (verbatim in `RAW_IDEA_INBOX.md`) canvas + correct tools (brushes, knives, colors, palettes);
  preview the brush/tool with color applied; simulate brush physics / knife scraping; clean the brush and "beat the
  devil out of it"; paint thinner for different texture; mix colors on your own palette; "no mistakes, just happy accidents."
- **Current MVP (shipped):** `Happy Accidents Painting Simulator` prototype (v0.1), Canvas 2D, with save-image.
- **Future parts:** campaign mode (follow instructions to paint the level's target within a time limit for fun pressure);
  free mode (no timer); richer tool/paint physics; palette mixing; save masterpiece image "to keep forever."
- **Non-goals (now):** multiplayer, account system.

### Halo FPS Arena — scalable architecture + hosting questions
- **Raw intent:** (verbatim in `RAW_IDEA_INBOX.md`) a basic 3D Halo-style arena for classic PvP, starting with one map,
  built to be scalable/efficient to update. Open questions Simon wants answered:
  - How to structure a big FPS across multiple connected HTML files (menu/lobby, campaign levels, multiplayer levels)?
  - How to implement host/join multiplayer servers from HTML (or peer-to-peer)?
  - How to run a live site as a library to organize/showcase/share the HTML projects, and whether it can host multiplayer.
- **Current MVP (shipped):** single-file arena prototype (v1.7.x), Babylon.js, bots, loadouts, pickups, radar.
- **Future parts:** simple base campaign (~3 missions, AI NPCs, HUD, radar, objectives/dialogue); multiplayer lobby;
  multi-map structure. **Non-goals (now):** committing to a multi-file split before the architecture question is answered.

### Pictionary — multiplayer + AI image generation
- **Raw intent:** (verbatim in `RAW_IDEA_INBOX.md`) a Pictionary-style **multiplayer** game that, once the drawing is
  guessed, **generates an image-to-image photo from the drawing** at the end of the round.
- **Current MVP (shipped-ish):** `Draw It! Master Party Edition` local/hotseat build (Canvas 2D) with a gallery export.
- **Vision gap:** current build is local-only with no AI image generation. Multiplayer + image-to-image are future parts.
- **Non-goals (now):** wiring an image-gen API before the arcade foundation is solid.

---

### B8 — Nebula Rescue rescue/hardening  · TOP PRIORITY (blocked on Simon's review of Game History Recovery — do not start yet)
Simon's direct verdict after watching the Lane 2C build (2026-07-14, verbatim in `RAW_IDEA_INBOX.md`):
*"the nebula rescue probably needs the most rescue, the slide doesnt work and its glitchy and needs some
serious work to get it balanced, we just barely got the spinners right."*

- **🔒 Protected win — do not regress:** the spinners were only recently brought to an acceptable state.
  Any rescue/hardening pass must fix the rest **without casually destabilizing the spinner behavior.**
- **Known-broken:** the slide/ramp mechanic does not work.
- **General:** the game is glitchy overall and needs serious balance work (scoring/mission progression,
  difficulty).
- **Secondary evidence (not proof):** a screen-recording review flagged a ~24s white screen before the game
  appears (cause unconfirmed — could be genuine load time, the CDN-loaded Three.js dependency, a navigation
  artifact, or a recording pause), a distant camera framing that makes the ball hard to track, and a crowded
  playfield hierarchy. Full notes: `docs/game-history/raw/2026-07-14-video-review.md`.
- **Hard prerequisite — satisfied 2026-07-14:** the **Game History Recovery** lane
  (`docs/PHASE_LANES.md`) has recovered Nebula Rescue's version/checkpoint history from the source archive.
  See `docs/game-history/nebula-rescue.md` — confirms the protected spinner tuning (v6.3→v6.4 torque/damping
  changes), finds **no archive evidence explaining the slide/ramp break** (no ramp/rail changes exist
  between v6.3 and v6.4, so the break likely predates or survived both archived builds — requires hands-on
  diagnosis, not further archive reading), and documents a rejected "v6.4 Red Spider Cleanup" build (not
  archived as a file) as the one known abandoned experiment to avoid repeating. **Now blocked only on
  Simon's review of the recovery output**, not on the recovery work itself.
- **Non-goals (now):** no Nebula source edits of any kind until history recovery is complete and reviewed.

### B10 — Homepage accent-color CSS scoping bug  · QUEUED, non-blocking (found by 🔍 Codex, Lane 2C release review, 2026-07-14)
`--game-accent` is defined only on each `.cover[data-game="..."]` element, but `.cabinet:hover`'s
border-color/box-shadow and `.chip.genre`'s color/border-color try to read it from `.cabinet-body` and
`.cabinet:hover` — siblings/parents of `.cover`, not descendants. CSS custom properties don't cascade
sideways or upward, so these all silently fall back to the global `--accent` (amber) instead of showing
per-game colors. **Not a release blocker** — degrades gracefully to the already-approved amber look, doesn't
break links/layout/readability. Fix: move `data-game="..."` (and the corresponding `--game-accent` custom
property) onto the `.cabinet` element itself, or scope the accent selectors to `.cabinet[data-game="..."]`
so descendants (`.cover`, `.cabinet-body`, `.chip`) can all inherit it. Also fold in the related find: the
featured Halo `.cover` is missing its `data-media="placeholder"` attribute (all 6 other covers have it).
Full record: `docs/agent-runs/2026-07-14-codex-homepage-refresh-review.md`.

### B9 — Landing-page cleanup (light polish)  · QUEUED, not scoped yet
Simon: the 7 games' landing pages "could be a little cleaned up." Not detailed or scoped — captured here so
it isn't lost. Likely candidate for the same lane as the eventual Codex review of Lane 2C, or its own small
follow-up pass; revisit once Lane 2C is accepted.

### B7 — Arcade Media Library  · PARKED (future, not built this sprint)
Structured spec for real cover art / screenshots / trailers, preserved in full rather than compressed:
- **Per game:** one custom cover image; one or more screenshots; an optional short trailer/gameplay clip;
  a poster/fallback image shown before the trailer loads or if it's missing.
- **Recommended targets:** cover ~16:9 or a defined arcade-card ratio (TBD in Lane 2C once the grid shape is
  set), reasonable web file-size budget (covers/screenshots optimized, e.g. WebP where practical); trailers
  short (a few seconds to ~30s) and compressed for web delivery.
- **Accessibility:** every image needs real alt text; any trailer needs a caption/description; never rely on
  color alone for status/genre badges.
- **Loading behavior:** images lazy-load below the fold; trailers **never autoplay with audio**; a poster
  image must always show before any video interaction.
- **Where assets live:** a per-game assets folder (exact path decided in Lane 2C alongside the card markup),
  kept separate from game runtime files so media updates never touch game logic.
- **How cards declare media:** the card metadata schema from Lane 2A (title, description, version, status,
  genre, controls, technology, Play link) gains optional fields — cover image, screenshot list, trailer
  URL, poster image, featured flag — documented now, populated later. Missing fields must **gracefully
  fall back** to the current CSS-placeholder treatment, never to a broken image icon or empty box.
- **Non-goals now:** no real assets created this sprint; no autoplay; no fake placeholder media that pretends
  to be final art.

## Idea reservoir
Simon's full raw idea list (Tower Defense v7 notes, RTS, Minecraft-style, survival horror, audio visualizer,
AI DAW/synth, educational games, Quiplash/Cards-style, Dominos, Boxes, Sudoku/Crossword, Poker/Solitaire/Blackjack,
Peggle, etc.) is preserved verbatim in `RAW_IDEA_INBOX.md`. Promote items here as structured specs when they become active.
