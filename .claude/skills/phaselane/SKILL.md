---
name: phaselane
description: Use when Simon asks about the current active phase or lane, its checklist, remaining subtasks, or "where are we in this lane" for Prototype Arcade. Do NOT use for the broad roadmap (use roadmap), the immediate next action only (use whatsnext), or a full status brief (use handoff). The command is singular, phaselane, not phaselanes.
---

# /phaselane

Read-only. Shows the single current active phase/lane checklist for Prototype Arcade.
Never edits, stages, commits, pushes, or deploys.

## Gather fresh
- `docs/PHASE_LANES.md` (the active lane and its scope)
- `docs/PROJECT_STATE.md` (current lane + next action)
- `docs/ROADMAP.md` (where this lane sits)
- `docs/BACKLOG.md` (subtask detail when relevant)

## Output — ~20 lines max
- **Current active phase/lane** (name + goal, one line each).
- **Completed subtasks** (checked).
- **Remaining subtasks** (unchecked), in order.
- **Immediate next task** (one line).
- **Parked / not-now** items that belong specifically to this lane.
- Close with a one-line **model/effort suggestion** for the next subtask, per `AGENTS.md`.

If `PHASE_LANES.md`, `PROJECT_STATE.md`, and `ROADMAP.md` disagree about which lane is active,
**report the disagreement** instead of silently choosing one.
