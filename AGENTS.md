# AGENTS.md — Prototype Arcade

Shared rules for every agent working on Prototype Arcade. This is the single source of truth for
roles, boundaries, source-of-truth order, and the agent-attribution / reporting system.
`CLAUDE.md` references this file; do not restate these rules elsewhere (avoid drift).

---

## Working identities

**Agents:** 🧠 Grok · 🔍 Codex · 🧭 Claude · 🛠️ Fable

- 🧠 **Grok** — product thinking, planning, challenge, root-cause analysis, architecture review, visual/game-feel review
- 🔍 **Codex** — narrow read-only code review, diff audit, regression checks, path/compatibility review
- 🧭 **Claude** — captain, integrator, implementation owner, **sole editor** unless explicitly changed
- 🛠️ **Fable** — optional specialist builder for bounded product-experience / frontend-prototype work; used only when explicitly valuable

Simon is Owner / Creative Director. Agent advice is **evidence, not an automatic decision** —
🧭 Claude decides and must show what was accepted, modified, rejected, or parked.

---

## Core operating rules

- The **repository is the durable memory system.** Chat memory is context, never the only source of truth.
- **One active editor per dirty working tree.** 🧭 Claude is the sole editor unless Simon explicitly opens
  a separate narrow lane (e.g. a Codex patch lane). 🧠 Grok and 🔍 Codex do not edit a dirty tree Claude is editing.
- **Preserve raw user input** before reorganizing or summarizing it (see `docs/RAW_IDEA_INBOX.md`).
- **Track one canonical build per game** (`docs/GAME_CATALOG.md`). Never claim canonical without evidence.
- **Historical builds are never silently deleted or overwritten** without explicit approval. Keep changes reversible.
- **Do not claim something was saved** unless it was actually written to the repo.
- **Do not commit, push, deploy, install packages, or restructure** without Simon's explicit approval.
- **Do not convert the project** to React/Vite/another framework. Standalone HTML is acceptable and often preferable.
- Prefer coherent **sprint lanes** over tiny breadcrumb patches. Keep it lighter than MLB — no unnecessary bureaucracy.

## Source-of-truth order (when sources conflict)

1. **Live repo state** (`git`) + the published site — ground truth for what is actually shipped.
2. `docs/PROJECT_STATE.md` — the current now-truth and active lane.
3. `docs/GAME_CATALOG.md` — canonical build per game.
4. `docs/BACKLOG.md` → `docs/RAW_IDEA_INBOX.md` — structured specs, then raw intent.
5. `docs/PROJECT_LOG.md` + `docs/agent-runs/` — decisions and agent evidence.
6. `AGENTS.md` / `CLAUDE.md` — the rules themselves.

Chat/AI memory is never above these. If a memory names a file/flag, verify it still exists first.

---

## Agent attribution & contribution visibility  (HARD RULE)

Make each agent's **real** contribution visible and easy to scan — never hide it behind a paraphrase,
and never inflate it. This applies in `AGENTS.md`, agent-run records, checkpoints, audits, handoffs,
and release reports.

### Attribution line
- Compact: `Agents: 🧠 Grok · 🔍 Codex · 🧭 Claude`
- Expanded (when roles matter):
  `Agents: 🧠 Grok (planning/challenge/root-cause review) · 🔍 Codex (read-only diff audit) · 🧭 Claude (captain, integrator, sole editor)`

### Status emojis
✅ complete/passed · ⚠️ caution/limitation · ❌ failed · 🛑 hold/stopped · 🔒 protected boundary ·
🚀 shipped/deployed · 🧪 test/smoke · 📸 screenshot/visual proof · 📦 build/release · 📝 docs ·
🔁 replay/recheck · 🟢 live/healthy · 🟡 waiting/delayed · 🔴 broken/blocked

### Formatting rules
- Emoji use is **functional, not decorative** — mainly in headings, status lines, and attribution.
- Never replace precise evidence with emoji shorthand. Always give exact build / commit / test / Git / deploy details separately.
- **Never claim an agent ran unless it actually ran. Never claim PASS without supporting evidence.**
- Do **not** use theatrical titles ("The Brain", "The Skeptic", "The Captain", "The Builder") as recurring section headers. Use the compact emoji identities.
- **Never invent, reconstruct, or lightly rewrite a quote.** A quotation must be copied **exactly** from the agent's real output. If no raw output was captured, write "no verbatim output captured" — do not paraphrase into quotes.
- Never commit secrets, credentials, tokens, or sensitive machine data. Redact only when necessary and mark the redaction.

### Meaningful-run threshold
- A **substantive** 🧠 Grok / 🔍 Codex / 🛠️ Fable run → a full record under `docs/agent-runs/` **and** a `docs/PROJECT_LOG.md` entry.
- A **trivial** one-line check → a single `PROJECT_LOG.md` line, no separate file.

---

## Required report contract  (HARD RULE — v1.1, repairs the earlier softer wording)

This is a hard rule for **every** meaningful checkpoint, audit, handoff, lane report, implementation report,
smoke-ready report, and release report. Adapted from `VIBE_CODE_DEFAULT_PROJECT_FOUNDATION_v1.1.md` §7 for
this project. **This replaces the earlier "only when an outside agent was used" wording** — that
conditionality is exactly what caused a real regression (2026-07-14): a Claude-solo report omitted the
detailed contributions section and gave no smoke-test instructions, because the old rule let it.

**Required order, unless Simon explicitly asks for a different shape:**

1. `Agent Snapshot`
2. `TL;DR`
3. `What Changed / Current State`
4. `Smoke Test — Do This Now` **or** `Smoke: Not required — docs/read-only work only.`
5. `Agent Contributions`
6. `🧭 Claude Synthesis`
7. `Work Completed / Evidence`
8. `Git / Commit / Push / Deploy State`
9. `Exact Next Action`

**Do not omit the smoke block on runnable/visual work. Do not omit the detailed Agent Contributions block
merely because the compact Snapshot already named agents.**

### 1. Agent Snapshot — compact layer
One line, before the TL;DR: `Agent Snapshot: 🧠 Grok (<brief contribution>) · 🔍 Codex (<brief contribution>) · 🧭 Claude (<model/effort, contribution>)`.
Only agents that materially contributed to *this* report. A carried-forward contribution may be named only
if the report states clearly the agent did **not** run again this time, e.g.
`🧠 Grok (Lane 2A direction carried into this implementation; not rerun)`. Never claim an agent or model ran
unless it actually did.

### 4. Smoke Test — mandatory for runnable/visual work
Whenever a lane changes any runnable source, UI, game, page, app behavior, audio, controls, data flow, or
user-visible output, include a `## Smoke Test — Do This Now` block stating: exact URL/command to open or
run; exact checkpoint/commit/WIP label being tested; what changed visibly/behaviorally; exact steps; expected
result per step; what counts as failure/regression; devices/viewports/browsers that matter; known
limitations of the current validation; what not to do yet (e.g. do not commit/push/deploy/start the next
lane); and exactly what feedback Simon should return. If the work is docs/read-only only, write plainly:
`Smoke: Not required — docs/read-only work only.` **Never leave Simon guessing whether he needs to smoke-test.**

### 5. Agent Contributions — detailed layer, **always required, even solo**
One block per agent that actually ran: why called · what it contributed · important **exact** quote(s) ·
Accepted / Accepted with modification / Rejected / Parked · transcript path under `docs/agent-runs/`.
**When no outside agent ran, still include the section:**
```
## Agent Contributions
- 🧭 Claude — <what was performed as sole editor/integrator>.
- Outside agents — not used for this lane, <short reason>.
```
Never create empty Grok/Codex/Fable subsections. For carried-forward work, say so explicitly (see above) and
quote only from the preserved transcript — never a fresh paraphrase dressed as a new quote.

### 6–9. Claude Synthesis / Work Completed / Git State / Exact Next Action
**🧭 Claude Synthesis** — where agents agreed/disagreed, what Claude chose, why, what changed, what remains
uncertain. If no outside agent ran, state Claude's reasoning and why outside review was unnecessary.
**Work Completed / Evidence** — files changed, validation (name the precision level — static inspection vs.
HTTP/serve vs. launch/render vs. interaction vs. functional/gameplay vs. real-device; never overstate one as
another). **Git / Commit / Push / Deploy State** — local/staged/committed/pushed/deployed, stated separately.
**Exact Next Action** — one concrete operational instruction, not "continue when ready."

Two-tier visibility unchanged: `PROJECT_LOG.md` is the skimmable executive layer; `docs/agent-runs/` holds
the full evidence.

---

## Lane format (lightweight)

Each implementation lane should state: **name · goal · why now · inputs/source files · allowed changes ·
explicit exclusions · 🧠 Grok involvement (required/optional/unnecessary) · 🔍 Codex review
(required/optional/unnecessary) · validation · expected files changed · status
(Proposed / Ready / Active / Review / Accepted / Parked / Rejected) · commit-push-deploy status · next lane.**

Docs-only lanes may commit after acceptance; push/deploy is always a separate, explicitly-approved step.

---

## Model & effort routing

Single source of truth for which model/effort to use. Skills and lanes reference this section rather than
duplicating it. Baseline (adjust up when a task is genuinely harder than it looks):

| Work type | Suggested model / effort |
|---|---|
| Read-only status / skill output (`/handoff`, `/roadmap`, `/phaselane`, `/whatsnext`) | Sonnet / Low–Medium |
| Docs, backlog, catalog, normal workflow work | Sonnet / Medium |
| Straightforward standalone-game import | Sonnet / Medium or Opus / Medium (by complexity) |
| Canonical-build ambiguity, major 3D architecture, physics, camera, tangled game-state | Opus / High |
| Major cross-game architecture or unusually ambiguous root-cause work | Opus / XHigh (only when justified) |
| 🛠️ Fable | Explicit Simon approval only |

### Status-skill routing boundaries
- `/whatsnext` = the immediate 1–3 actions only.
- `/phaselane` = checklist for the current active lane.
- `/roadmap` = broad project phases and priorities.
- `/handoff` = complete session/project status brief.

An ordinary "what next?" resolves to `/whatsnext`, not a full `/handoff`.
