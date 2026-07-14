# World History Atlas — Game History

**Agents:** 🧭 Claude (Sonnet, Explore-agent-assisted read-only archive research) · outside agents (🧠 Grok/🔍 Codex) — not used, this is Claude reading the local archive per lane spec.
Source archive folder: `..\PROTOTYPE ARCADE\world history map\` (protected, read-only, not modified).
This has the longest clean-rebuild lineage in the archive (v1-v8, no folders beyond v8 exist — verified by
recursive listing) and no per-version changelog files — folder names carry real evidence here (e.g. "v7 -
NOTworking UI benchmark" literally documents its own regression), verified against actual file content
rather than trusted blindly.

## Current provisional build
`v8 - clean rebuild\true-atlas-v8.html` — internally titled "True History Atlas — Friend Test Benchmark."
Imported into the repo as `games/world-history-game.html` (source hash `cb66b407`, byte-identical — see
`GAME_CATALOG.md`). Byte-identical to `world_history_map_prototype (19).html` in the same v8 folder
(confirmed via diff).

## Source archive locations
| Version | Path | Title evidence |
|---|---|---|
| v1 | `v1 - wireframe\true-atlas-v1.html` (== `world_history_map_prototype.html`, same folder, diff-confirmed) | "AI Prototype — World History Map" |
| v2 | `v2 - real map upgrade\world_history_map_prototype (1).html` | "World History Map — Cleaner Prototype" |
| v3 | `v3 - atlas dashboard\world_history_map_prototype (2).html` | "World History Atlas — Dashboard Prototype" |
| v4 | `v4 - visual foundation\world_history_map_prototype (4).html` | "World History Atlas — Dashboard Prototype" |
| v5 | `v5 - True History Atlas — Course Prototype\world_history_map_prototype (5).html` | "True History Atlas — Course Prototype" |
| v6 | `v6 - Key fixes and upgrades\world_history_map_prototype (6).html` | "True History Atlas — Course Prototype" |
| v7 | `v7 - NOTworking UI benchmark\world_history_map_prototype (7).html` | "True History Atlas — Course Prototype" (unchanged — never version-bumped, consistent with not being treated as a real release) |
| v7.1 | `v7.1 - clean stable benchmark build\world_history_map_prototype (8).html` | "True History Atlas — Stable Benchmark" |
| v7.2 | `v7.2 - safer benchmark\world_history_map_prototype (10).html` | "True History Atlas — Stable Benchmark" |
| v7.3 | `v7.3 - clean final benchmark build\world_history_map_prototype (12).html` | "True History Atlas — Final Benchmark" |
| v7.4 | `v7.4 - last final stable benchmark\world_history_map_prototype (14).html` | "True History Atlas — Final Stable Benchmark" |
| v7.5 | `v7.5 - Remastered Final Benchmark\world_history_map_prototype (15).html` | "True History Atlas — Remastered Final Benchmark" |
| v7.6 | `v7.6 - Clean final rebuild True Atlas\world_history_map_prototype (17).html` | "True History Atlas — Clean Final Benchmark" |
| v8 | `v8 - clean rebuild\true-atlas-v8.html` (== `world_history_map_prototype (19).html`) | "True History Atlas — **Friend Test Benchmark**" — **current provisional build** |

Top-level `.txt` files (all read in full, preserved verbatim under `docs/game-history/raw/`):
`prompt notes.txt` (founding vision doc), `history.txt` (corrected era framework, superset), `historical
timeline articles FACTS from school.txt` (earlier, uncorrected duplicate of history.txt's first section).

## Evidence confidence: **High**
Every claim is backed by direct byte-level evidence: diff-confirmed file identity (v1 pair, v8 pair, and
the FACTS/history.txt overlap), grep-confirmed CDN/library URLs per version, grep-confirmed `<title>` tag
progression, and structural function-name diffing across the v6→v7→v7.1 break/fix boundary. The one lower-
confidence area is *why* v7 broke and whether v7.1 fully resolved Simon's specific complaints (bubble
sizing, timeline-selection coupling) — no code comments document root causes anywhere in this tree, so
that inference rests on folder naming + circumstantial function-rename evidence, not an explicit changelog.

## Clean-rebuild lineage: what broke in v7 and how it was fixed
v1 (wireframe, no real map) → v2 (real Leaflet map introduced) → v3/v4 (dashboard UI + visual polish,
coarser era set) → v5/v6 (full corrected 14-era framework + US states added, "Course Prototype" branding)
→ **v7 (broke while adding bubble/subregion-lesson UI — folder name literally says "NOTworking")** → v7.1-
v7.6 (successful rebuild/hardening chain, all "benchmark" branded, each shrinking/consolidating the
codebase while keeping the same GeoJSON/Wikipedia/US-states dependencies) → v8 (final clean rebuild,
internally titled "Friend Test Benchmark" — the strongest signal in the tree that this was the version
considered ready to hand to an outside tester).

v7 added a cluster of new popup/anchoring functions on top of v6 (`hideBubble`, `placeLesson`,
`safeLayerCenter`, `subregionSelectionLesson`, `updateAnchorDot`) — this lines up with Simon's own
complaint (preserved in `history.txt`) about pop-out bubbles "get[ting] big when you scroll out making it
expand off the screen," and sub-region popups sharing generic tour facts instead of per-subregion detail.
v7 likely attempted to fix exactly those complaints but broke the UI doing it.

v7.1 is the actual fix: a near-total rename/refactor of the popup/content-rendering functions
(`civicsHTML→civics`, `overviewHTML→overview`, `fetchPopupImage→fetchBubbleImage`, new `showBubble`/
`bubbleFact`/`renderRequirements`) plus the title change from "Course Prototype" to "Stable Benchmark" —
the first hard evidence the app was being treated as a benchmark/deliverable rather than a WIP prototype.
**This is a single unbroken forward-progress lineage with one localized regression (v7), promptly fixed
one step later (v7.1) — no evidence of parallel abandoned branches; every version's data-source/CDN
footprint is a superset or equal to the prior version, never a rollback.**

## Map provider/CDN dependencies
- **v1**: none (pure CSS/div wireframe, no map library).
- **v2 onward**: Leaflet 1.9.4 from `unpkg.com/leaflet@1.9.4` — **this exact CDN/version string never
  changed across the entire v2→v8 lineage** (Leaflet itself was never upgraded).

## GeoJSON/data source changes
- **v2**: `cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json` (TopoJSON, requires client-side conversion).
- **v3 onward (permanent switch)**: `raw.githubusercontent.com/datasets/geo-countries/.../countries.geojson`
  (plain GeoJSON) — became the permanent country-boundary source through v8.
- **v5 onward (added, never removed)**: `raw.githubusercontent.com/PublicaMundi/MappingAPI/.../us-states.json`
  for the US-states drill-down feature requested in `prompt notes.txt`.
- Wikipedia used throughout v2-v8 for both page-summary facts (`en.wikipedia.org/api/rest_v1/page/summary/`)
  and citation links (`en.wikipedia.org/wiki/`) — matching Simon's explicit request ("I think Wikipedia
  might be the best bet").

## Timeline/navigation feature changes
Year/timeline slider present from v3 onward. TTS narration rate/volume sliders present from v3 onward; the
playback-rate range widened substantially over time (v3: 0.65-1.5 → v7.6/v8: 0.75-2.8), likely a UX
refinement with no corresponding comment. `TOURS` array + `startTour` present v5 through v8 unchanged in
name, implementing the guided-tours feature from `prompt notes.txt`. v8 renames the slider CSS class
`timelineSlider`→`slider` (cosmetic only). **Gap**: no code comments anywhere confirm which release
actually fixed the timeline-selection-coupling bug Simon reported (year-slider changing map/region
selection) — this needs live-testing to confirm, not archive inference.

## Region/era coverage changes
v1-v2: no formal era array evident. v3/v4: coarser era set (e.g. "Modern/industrial age" combined). **v5
onward**: full corrected 14-stage era framework matching `history.txt`'s appended table (Prehistoric,
Early Historic Civilizations, Carthage/Phoenician, Roman Kingdom/Republic/Empire, Late Antiquity, Early/
High/Late Middle Ages, Renaissance, Early Modern, Modern Industrial, Postwar/Cold War, 21st Century) —
essentially unchanged through v8. US-state-level sub-region coverage added v5, retained through v8.

## Performance/load issues
No explicit performance-issue comments exist anywhere (comment grep across v6-v8 for fix/bug/issue/known/
broken/todo returned zero matches). The CDN switch from TopoJSON (v2) to plain GeoJSON (v3+) reduces
client-side parsing overhead — may have been a load-time optimization, though undocumented as such. The
"benchmark" naming convention (v7.1-v8) implies performance/stability testing was a goal of that whole
sub-series, but no logs/timing/profiler artifacts survive to substantiate specific metrics.

## Historical-content architecture
The three top-level `.txt` files are **specification artifacts, not runtime data** — no HTML file `fetch()`s
any of them. Historical content is instead: (1) hard-coded in JS objects/arrays inside each HTML file (era
arrays, per-region facts, `TOURS` steps) — the corrected era table from `history.txt` was manually
transcribed into these arrays by whoever built each version; (2) fetched live at runtime from Wikipedia's
REST summary API for supplementary facts/images; (3) country/state boundary shapes loaded live from
GitHub-hosted public GeoJSON datasets, not stored locally at all.

## Design intent (from `prompt notes.txt`, verbatim)
> "Interactive map of world history, zoom in/out and navigate history with a year slider starting from earth's evolution to modern day; including but not limited to the evolution of human and civilization, Pangaea to the biblical days..."

> "Include an separate option on the menu for American history... be sure to list historical events, and highlight each presidential term and summary of the president and the achievements..." — **this American-history/presidential mode does not appear to exist in any surviving version file** — an unrealized vision item, not a bug.

> "...guided experiences that can automatically take you through a tour... Maybe include the option to narrate the tours with subtitles and text to speech(option to disable tts, volume controls, speed, voice type)" — implemented (`TOURS`, TTS rate/volume sliders).

> "the information needs to be factual, maybe with citations/links to sources, I think Wikipedia might be the best bet, but I trust you on this project" — implemented (Wikipedia REST API + wiki links).

Full text preserved verbatim at `docs/game-history/raw/world-history-prompt-notes.txt`.

## Which top-level `.txt` files most warrant verbatim preservation
**`history.txt` is the single most important** — it's the superset containing both the original
school-notes example and the corrected era-date table that became the game's canonical timeline schema
(preserved at `docs/game-history/raw/world-history-history.txt`). **`prompt notes.txt` is second
priority** — the only place the original unconstrained vision (Pangaea-to-present scope, American-history
mode, TTS narration, Wikipedia sourcing) is stated before scope narrowed to timeline mechanics (preserved
at `docs/game-history/raw/world-history-prompt-notes.txt`). `historical timeline articles FACTS from
school.txt` is a lower-priority subset/earlier duplicate of `history.txt`'s first section (not separately
preserved — its unique content is fully contained in `history.txt`).

## What still requires hands-on playtesting
Live in-browser testing with real internet access to confirm map tiles/GeoJSON/Wikipedia fetches actually
load (per `GAME_CATALOG.md`, this was never exercised — local-server validation has no bearing on whether
`unpkg.com`/`raw.githubusercontent.com`/Wikipedia are reachable at runtime). Whether the timeline-selection-
coupling bug and pop-out-bubble sizing bug Simon reported are actually fixed in v8. Whether the widened TTS
rate range (0.75-2.8) feels usable at its extremes.

## Recommended next hardening/rescue lane
In-browser playtest of `games/world-history-game.html` with live internet access, specifically checking:
map/GeoJSON/Wikipedia load success, bubble-sizing-on-zoom behavior, and whether selecting a year still
incorrectly changes the map/region selection (Simon's reported complaint, never confirmed fixed in the
archive record).
