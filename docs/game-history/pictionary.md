# Pictionary "Draw It! Master Party Edition" — Game History

**Agents:** 🧭 Claude (Sonnet, Explore-agent-assisted read-only archive research) · outside agents (🧠 Grok/🔍 Codex) — not used, this is Claude reading the local archive per lane spec.
Source archive folder: `..\PROTOTYPE ARCADE\pictionary\` (protected, read-only, not modified). This game
has **the thinnest evidence of the five researched** — no changelog/notes `.txt` files exist, and none of
the 4 HTML files contain a single code comment (all are minified/generated output) — everything below is
inferred from titles, UI strings, and code structure.

## Current provisional build
`pictionary_party_game (7).html` — internally titled "Draw It! Master Party Edition." Imported into the
repo as `games/pictionary-game.html` (source hash `d729e200`, byte-identical — see `GAME_CATALOG.md`).

## Source archive locations
| File | Size | Modified | Role |
|---|---|---|---|
| `pictionary_party_game (6).html` | 58,245 B | 2026-05-23 01:19 | game engine build "v6" |
| `2026-05-23-dirty-that-was-pretty-good.html` | 965,297 B | 2026-05-23 01:44 | exported play-session gallery (Dirty word pack, 14 drawings) |
| `pictionary_party_game (7).html` | 61,168 B | 2026-05-23 02:05 | **game engine build "v7" — current provisional build** |
| `2026-05-23-mixed.html` | 473,379 B | 2026-05-23 02:20 | exported play-session gallery (Mixed Clean+Dirty pack, 10 drawings) |

## Evidence confidence: **Low-Medium (thinnest of the five games)**
No changelog exists; no code comments exist anywhere in any of the 4 files. However, confidence that the 4
files form **one single lineage** (engine + its two real play-session exports) is **High** — the engine's
own gallery-export code literally reproduces the exact markup/title/caption format found in the two dated
export files, and the word-pack option labels match the export filenames almost verbatim. This is strong
internal corroborating evidence, not filename/date guesswork.

## Version/checkpoint timeline
1. **`(6).html` built 01:19** — "v6" engine build.
2. **Played, exported "dirty" gallery at 01:44** — captions reference only challenge types present in v6
   (Spinning canvas, Drunk mode, Speed round, Wrong hand, One-line, Ink limit, Shapes only); no
   v7-only-feature references appear.
3. **Engine revised to `(7).html` at 02:05** — adds a "Blackout"/"Blind Start" mode and a "Black ink only"
   challenge card, a strict superset addition over v6 (first byte-level divergence is in the CSS at
   `.blackout-active .lock-overlay{...}`).
4. **Played again, exported "mixed" gallery at 02:20**, plausibly on v7 or a build very close to it (no
   embedded version string ties an export to a specific engine file — inferred from timestamp ordering).

**Medium confidence** on the precise claim that "dirty" came from exactly v6's bits and "mixed" from
exactly v7's bits — no version string is embedded in either export.

## Party-flow changes
Both engine builds share the same setup screen (game mode: Classic/Challenge; word pack: Clean/Dirty 18+/
Mixed; round time 45/60/75s; win score; dynamic team list) and turn flow: reveal privately → hide word →
start timer → draw → others guess → capture/score → New Round. Real play-session captions confirm rounds
cycled through players in turn order across 4-5 rounds per session. No structural round/turn changes
between v6 and v7 were found — the only diff is the added Blackout/Black-ink-only challenge modifiers.

## Drawing tools present (both v6 and v7)
HTML5 `<canvas>` with color swatches, brush-size slider (2-42px, default 8), eraser, undo, clear, save.
Challenge modifiers alter tool behavior: `oneLine`/`brushOnly` (brush-only, no pen-lift, undo disabled),
`shapesOnly` (fixed-ratio shapes only), `inkLimit` (ink meter drains while drawing), `jitter` ("Drunk
mode" — wobbly pen + shaking canvas), `spin` ("Spinning canvas" — rotating canvas). **v7 adds**: Blackout/
"Blind Start" mode (canvas blacked out while drawing) and "Black ink only" restriction — not present in v6.

## Secret-word/reveal flow
`currentWord` state; `revealWordBtn`/`hideWordBtn`; word drawn from a per-game `wordDeck` built from the
selected pack, tracked via a `usedWords` Set to avoid repeats. In-app copy: *"Reveal the word privately"* /
*"Everyone else should look away. Then hide it and start the timer."* Identical in both v6 and v7.

## Team/scoring mechanics
Dynamic team list (add/remove), each team has a `.score` property and a configurable win-score target
(default 15). Challenge cards carry a `bonus` value (0-2) for harder modifiers. **In the real captured
play sessions, "teams" were actually solo individual players** (Bao, Simon, Trevor and nickname variants
across the two sessions) used as a free-for-all rather than true 2+-person teams — i.e. the team system
exists but wasn't exercised as designed in the only recorded sessions.

## Gallery-export vs. live-game vs. multiplayer/AI-image ambitions
- **Gallery/export: real, fully implemented.** `captureDrawing()` pushes each round's PNG into a
  `drawings[]` array; `renderGallery()` shows them live in-app; a "Download Gallery" button serializes
  them into a standalone HTML file — precisely what produced the two dated export files.
- **Live-game: real, fully implemented** (canvas drawing, timers, reveal/hide, modifiers, scoring, turn
  order, slideshow replay).
- **No multiplayer (networked) functionality** — zero hits for "multiplayer" in either engine build; this
  is a single-device, pass-the-device party game.
- **No AI-image-generation functionality or ambitions found anywhere** in the archive (no comments, TODOs,
  or dead code referencing an AI-art feature) — the "multiplayer + AI image-to-image" vision referenced in
  `GAME_CATALOG.md`'s "vision gap" note is **not evidenced in this source folder at all**; it must have
  been stated elsewhere (e.g. `RAW_IDEA_INBOX.md`) rather than in this archive.

## Exact useful quotes (from HTML content — no `<!-- -->` comments exist in any file)
> `<title>Draw It! Master Party Edition</title>` — both `(6).html` and `(7).html`

> `"Reveal the word privately"` / `"Everyone else should look away. Then hide it and start the timer."` — both engines

> `{id:"oneLine",text:"One-line draw. Brush only. Once you lift the pen, your drawing is locked. Undo is disabled.",short:"One-line",bonus:2,...}` — `pictionary_party_game (7).html`, CHALLENGES array

> `<h2>1. blow-up doll</h2><p>Bao · Round 1 · Spinning canvas</p>` — `2026-05-23-dirty-that-was-pretty-good.html`

## What still requires hands-on playtesting
Everything — this game has never been in-browser playtested by Claude or Codex per `GAME_CATALOG.md`. In
particular: whether v7's Blackout/Black-ink-only modes function correctly, whether the team-scoring system
works as designed (never exercised in the only two recorded sessions), and general party-flow usability.

## Recommended next hardening/rescue lane
In-browser playtest of `games/pictionary-game.html` (the imported v7 build) focused on the party-flow loop
and the two v7-only challenge modes (Blackout, Black-ink-only) that have no recorded play-session evidence
either way.
