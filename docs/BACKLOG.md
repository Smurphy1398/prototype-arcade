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

## Idea reservoir
Simon's full raw idea list (Tower Defense v7 notes, RTS, Minecraft-style, survival horror, audio visualizer,
AI DAW/synth, educational games, Quiplash/Cards-style, Dominos, Boxes, Sudoku/Crossword, Poker/Solitaire/Blackjack,
Peggle, etc.) is preserved verbatim in `RAW_IDEA_INBOX.md`. Promote items here as structured specs when they become active.
