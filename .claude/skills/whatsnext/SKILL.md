---
name: whatsnext
description: Use when Simon asks "what's next", "next step", or the immediate next action(s) for Prototype Arcade and there is no in-flight task already dictating it. Keep it to 1-3 actions. Do NOT expand into a full status brief (use handoff), the active-lane checklist (use phaselane), or the broad roadmap (use roadmap).
---

# /whatsnext

Read-only. Gives Simon only the next one-to-three practical actions for Prototype Arcade.
Never edits, stages, commits, pushes, or deploys. Do not expand into a full handoff.

## Gather fresh
- `docs/PROJECT_STATE.md` (current lane + exact next action)
- `docs/PHASE_LANES.md` (active lane subtasks)
- `docs/ROADMAP.md` (only if next action is between lanes)
- `docs/BACKLOG.md` only when necessary
- `git status --short` for real working-tree state

## Output — ~8 lines max
- **Current state:** one line (lane + repo state).
- **Next:** 1–3 actions, most immediate first.
- **Model/effort:** one-line suggestion for the immediate next action, per `AGENTS.md`.
- **Hold note:** only if a real blocker exists (e.g. unresolved Halo provenance before Lane 2 game changes).

Keep it tight. If a task is already in flight, just name the next step for that task — don't produce a project brief.
