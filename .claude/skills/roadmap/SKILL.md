---
name: roadmap
description: Use when Simon asks for the broad Prototype Arcade roadmap, project phases, priorities, or progress toward the next public-arcade milestone. Do NOT use for the single active-lane checklist (use phaselane), the immediate next action (use whatsnext), or a full status brief (use handoff).
---

# /roadmap

Read-only. Shows the broad Prototype Arcade roadmap and progress toward the next public-arcade milestone.
Never edits, stages, commits, pushes, or deploys.

## Gather fresh
- `docs/ROADMAP.md` (source of truth for this view)
- `docs/PHASE_LANES.md` (active lane)
- `docs/PROJECT_STATE.md` (now-truth)
- `docs/BACKLOG.md` and `docs/GAME_CATALOG.md` (for context)

## Output — concise, ~25 lines max
- **Current milestone** (one line, from `ROADMAP.md`).
- **Completed phases** as checked boxes.
- **Remaining phases** as unchecked boxes, in priority order; clearly mark the **current** phase.
- A brief **Later / Parked** section.
- Close with a one-line **model/effort suggestion** for the next roadmap-level task, per `AGENTS.md`.

Do not invent a fixed lane list — reflect `ROADMAP.md` as it actually is (priorities are living, not immutable).
If the docs disagree about the current phase, surface it rather than guessing.
