---
name: handoff
description: Use when Simon asks for a full Prototype Arcade status brief, morning/handoff brief, "where are we", or the overall project state and roadmap. Do NOT use for an in-context "what's next" about the current task (answer directly or use whatsnext), the single active-lane checklist (use phaselane), or the broad roadmap alone (use roadmap).
---

# /handoff

Read-only. Produces a short, coffee-morning-readable status brief for Prototype Arcade from the current
repo state. Never edits, stages, commits, pushes, or deploys as part of running this skill.

## When to run
`/handoff`, "status update", "where are we", "morning brief", or "the roadmap / overall plan". A plain
mid-task "what's next" is not a handoff — answer that directly or use `/whatsnext`.

## Gather fresh (do not rely on memory of a prior brief)
- `git status --short --branch` and `git log --oneline -5`
- `AGENTS.md` (rules + model/effort routing)
- `docs/PROJECT_STATE.md` (now-truth, current lane, next action)
- `docs/ROADMAP.md` and `docs/PHASE_LANES.md` (milestone + lanes)
- `docs/GAME_CATALOG.md` (canonical status + provenance conflicts)
- `docs/PROJECT_LOG.md` (top entry)

## Output — exactly these four sections
Plain prose, light bullets, coffee-readable — no compliance-report tone and no fixed lane count.

### 1. What We Did
2–4 sentences: the latest accepted checkpoint, what changed and why it mattered, how it was validated
(git/smoke). Skip anything not new since the last checkpoint.

### 2. Where We Are Now
Short scannable list: live/public state · local vs remote Git state · current phase/lane ·
canonical-game status · any blockers or unresolved provenance conflicts (e.g. the Halo version conflict).

### 3. What's Next, Right Now
1–3 practical next actions given the actual repo state. Don't pad to a fixed count.

### 4. Roadmap Snapshot
Concise view of completed / active / next / parked lanes, pulled from `ROADMAP.md` + `PHASE_LANES.md`.

Close with a one-line **model/effort suggestion** for the next task, per the routing table in `AGENTS.md`
(do not restate the whole table). If `PROJECT_STATE.md`, `ROADMAP.md`, and `PHASE_LANES.md` disagree about
the active lane, report the disagreement instead of silently picking one.
