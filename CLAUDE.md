# CLAUDE.md — Prototype Arcade (🧭 Claude Code entrypoint)

Shared agent rules, roles, boundaries, source-of-truth order, and the attribution/reporting system
live in **`AGENTS.md`** — read it first and follow it. This file adds only Claude-specific startup guidance.

@AGENTS.md

## Startup checklist for 🧭 Claude

1. Read the current truth in order: `docs/PROJECT_STATE.md` (now-truth, current lane, exact next action) →
   `docs/PHASE_LANES.md` (active lane) → `docs/ROADMAP.md` (milestone/priorities) →
   `docs/GAME_CATALOG.md` when canonical-build questions arise. (`AGENTS.md` is already loaded above, incl. model/effort routing.)
2. Check real state before acting: run `git status` / `git log --oneline -3` and compare the canonical docs'
   freshness claims (each carries a `Last updated:` / `Reflects: <commit>` line) against actual `git HEAD`,
   branch ahead/behind state, and (when relevant) the live site — the durable-doc staleness guard in
   `AGENTS.md`. **If they disagree, surface the drift before relying on the docs or editing; never silently
   rewrite history to hide it.** Do not trust memory of prior state.
3. For canonical-build questions, use `docs/GAME_CATALOG.md` — never assume the newest filename or version number is best.
4. Preserve raw ideas in `docs/RAW_IDEA_INBOX.md`; capture structured specs in `docs/BACKLOG.md`; log decisions and
   agent involvement in `docs/PROJECT_LOG.md` (+ full evidence in `docs/agent-runs/`).

## Claude-specific reminders

- 🧭 Claude is the **sole editor** unless Simon explicitly opens another lane. One active editor per dirty tree.
- **Docs lanes** (like Lane 1) change only documentation — never a game runtime file, never a copied source file.
- **Source lanes** change games; keep the two kinds of lane separate and validate before reporting.
- Never claim something was saved unless it was written to the repo. Never claim PASS without evidence.
- **No commit / push / deploy / package install / restructure without Simon's explicit approval.**
- The source collection `..\PROTOTYPE ARCADE` is a **protected, read-only import archive** — do not modify it.

## Navigation skills
`/whatsnext` (immediate 1–3 actions) · `/phaselane` (active-lane checklist) · `/roadmap` (broad phases) ·
`/handoff` (full status brief). New project skills appear after a `/reload-skills` or session restart.

## Environment notes

- Windows + PowerShell primary; a Bash tool is available for POSIX scripts.
- All games are standalone HTML — no Node/npm/build step. Two use a CDN library (Babylon.js, Leaflet).
- `gh` (GitHub CLI) is **not installed** and the `github` MCP is currently erroring — GitHub automation is unavailable until fixed.
