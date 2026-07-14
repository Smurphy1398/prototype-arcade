# Agent Runs — evidence library

Full records of **meaningful** 🧠 Grok, 🔍 Codex, and 🛠️ Fable runs. This is the deep-evidence layer
behind `../PROJECT_LOG.md`. It preserves each agent's real voice — exact prompts, transcripts, and
verbatim quotes — so contributions are visible, not paraphrased away.

## When to create a record
- **Substantive run** (real planning, review, or build input) → create a file here **and** add a `PROJECT_LOG.md` line.
- **Trivial one-line check** → a single `PROJECT_LOG.md` line, no file.

## Naming
`YYYY-MM-DD-<agent>-<topic>.md` — e.g. `2026-07-13-grok-homepage-direction.md`,
`2026-07-13-codex-chess-import-review.md`. Use `grok` / `codex` / `fable`.

## Rules (from `../../AGENTS.md`)
- **Never invent, reconstruct, or lightly rewrite a quote.** Copy exactly from the agent's real output,
  or write "no verbatim output captured."
- Never claim an agent ran unless it actually ran.
- No secrets, credentials, tokens, or sensitive machine data. Redact only when necessary and mark it.

## Record template
```markdown
# YYYY-MM-DD — <agent> — <topic>

- **Agent:** 🧠 Grok | 🔍 Codex | 🛠️ Fable
- **Date:**
- **Related lane:**
- **Why invoked:**

## Exact prompt / assignment
> (verbatim)

## Full useful response / transcript
> (verbatim; mark Full / Partial / Excerpted)

## TL;DR

## Important exact quotes
> "…exact…"

## Concrete contributions

## Risks / disagreements raised

## 🧭 Claude's disposition
Accepted | Accepted with modification | Rejected | Parked — and why.

## Resulting changes (plan / code / docs)

## Transcript completeness
Full | Partial | Excerpted — plus any redactions and the reason.
```

---

_No agent-run records yet — the first outside-agent lane will add them here._
