# 2026-07-14 — Screen-Recording Review (Secondary Evidence)

**Source:** Simon recorded `Screen Recording 2026-07-14 005153.mp4` of the local Lane 2C homepage and games
running at `http://127.0.0.1:8791/`, uploaded it to ChatGPT, and relayed ChatGPT's visual observations plus
his own direct assessment back into this project.

**⚠️ Classification — read before using this record:**
- This is **not** a 🧠 Grok / 🔍 Codex / 🧭 Claude agent run under the `AGENTS.md` attribution system.
  ChatGPT is not one of that system's defined roles; it is an external tool Simon used independently and
  relayed into the project.
- This is **secondary visual evidence** — a description of what appeared on screen in a short recording.
  It is **not** console output, not a code-level diagnosis, not a gameplay/physics verification, and not
  proof of any specific bug. Treat it as "what it looked like," not "what the code does."
- Where Simon's own direct testing experience conflicts with or exceeds what the video shows (e.g. Nebula
  Rescue's slide/ramp and balance), **Simon's own description is authoritative**, not the video.

---

## Homepage (local Lane 2C build)
- Clear improvement over the old production 3-card page — feels like one coherent project (consistent
  dark/amber styling, featured Halo treatment, distinct CSS cover placeholders, all 7 experiences
  represented, Atlas appropriately separated as a bonus/side-room item, About/Lab quieter and not competing
  with games).
- On the wide desktop recording, the whole arcade reads as **undersized** — small cards/type, significant
  unused space. The Floor currently forms a 4-card row plus one orphan Pictionary card. A wider container
  and a more deliberate 3-column desktop grid with larger cards would likely feel stronger.
- Placeholder covers are adequate for this checkpoint but still visibly read as patterns, not real art —
  expected until the media lane.

## True History Atlas — ~0:33
Map initializes; region navigation and historical labels appear; timeline and side panels are populated.
Looks content-rich and functional, if visually dense — supports treating it as a Side Room/bonus experience
rather than forcing a conventional-game presentation.

## Halo FPS — ~0:55
Visibly runs: movement and combat happening, weapon/health-shield/score/minimap/enemies/arena all render.
Looks like a legitimate playable prototype in this short segment. Debug/status overlays consume a lot of
screen space; presentation is utilitarian. No launch blocker observed in this segment.

## Chess + Checkers — ~1:29
**Currently reads as the strongest-looking imported game.** Board and pieces render cleanly; piece selection
works; legal moves highlight; a move visibly completes; surrounding controls appear substantial and coherent.
Interface-dense but more immediately understandable than most of the collection.

## Nebula Rescue — ~2:02–3:05  ⚠️ highest-priority concern
This is the game flagged as needing the most work, both by the video and by Simon directly.
- **~24 seconds of a completely white screen** before the game appears. **Unconfirmed** whether this is a
  genuine loading delay, a CDN/ES-module startup issue (Nebula Rescue loads Three.js from `cdn.jsdelivr.net`
  — see `docs/GAME_CATALOG.md`), a navigation artifact, or a recording pause. Do not assume a cause — this
  needs direct verification, not inference from video alone.
- Camera/table framing reads as too distant; the starfield dominates the frame while the active playfield is
  comparatively small; the ball is hard to track.
- Playfield hierarchy is crowded: rails, lights, planets, targets, overlays, scoreboard, mission computer,
  and a developer-control block all compete for attention; the lower play area and flippers don't command
  enough visual weight.
- Score/mission state progressed quickly in the short sample — consistent with Simon's own "needs serious
  work to get it balanced."
- **No convincing successful slide/ramp traversal was visible in the recording.** This does not prove the
  slide code is broken on its own, but the video did not show it doing useful work — and Simon has
  separately and directly confirmed the slide doesn't work.
- Spinner physics could not be reliably judged from the video alone, though they appear visually present.
  **Simon has directly confirmed the spinners were just brought to an acceptable state — this is a protected
  win. See the raw quote in `docs/RAW_IDEA_INBOX.md` (2026-07-14) and the structured entry in
  `docs/BACKLOG.md`.**

## Pictionary — ~3:20
Round/secret-word UI, locked canvas, tools, drawing, team controls, and visible drawing output all appear to
work. Busy but reads as an actual local party game rather than a tech demo.

## Tower Defense — ~3:53
Only the **landing page** was shown in the recording — no gameplay was captured. **No conclusion about
current gameplay is supported by this video.**

## Bob Ross — ~4:05
Painting canvas and drawing visibly work. Functional; presentation is plainer/more utilitarian than the
newer imports.

---

## How this record should be used
- Seed evidence for the future **Game History Recovery** lane (see `docs/PHASE_LANES.md`) — a starting
  hypothesis of where to look, not a substitute for the archive investigation itself.
- Referenced from `docs/BACKLOG.md`'s Nebula Rescue entry as supporting (not proving) context.
- Should **not** be cited as console/runtime/gameplay verification in any future report.
