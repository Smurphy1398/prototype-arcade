# Prototype Arcade

A personal browser-game arcade, experimental game laboratory, and creative-coding sandbox.
Every game is a self-contained HTML file — open it in a browser and it runs. No build step.

**Live site:** https://smurphy1398.github.io/prototype-arcade/
**Owner:** Simon Murphy (🧭 Claude Code is the project captain/integrator — see `AGENTS.md`)

---

## What's published now

| Game | Card version | Play |
|---|---|---|
| Halo FPS Prototype | v1.7.6 | `games/halo-fps.html` → `games/halo-fps-game.html` |
| Tower Defense Prototype | v6.1 | `games/tower-defense.html` → `games/tower-defense-game.html` |
| Bob Ross Painting Sim | v0.1 | `games/bob-ross.html` → `games/bob-ross-game.html` |

More prototypes exist locally and are queued for import (Chess/Checkers, Nebula Rescue pinball,
Pictionary, World History Atlas). See `docs/GAME_CATALOG.md`.

---

## Repository structure

```
index.html                 # arcade homepage
games/
  <slug>.html              # per-game landing page (build info + controls + Launch)
  <slug>-game.html         # the actual playable game
docs/                      # durable project memory (see below)
README.md  AGENTS.md  CLAUDE.md
```

Games are standalone HTML. Two of them pull a library from a CDN (Halo → Babylon.js,
World History → Leaflet); the rest inline everything (Three.js, or plain Canvas 2D).
There are **no** `.jsx` / build-required projects — nothing here needs React, Vite, Node, or npm.

---

## Project intent (stable)

- Preserve and organize existing prototypes; never silently delete a historical build.
- Track **one canonical build per game** with evidence, not guesswork.
- Add the strongest missing games to the public arcade.
- Make the homepage feel like a real arcade, not a plain project list.
- Keep experimenting across FPS, pinball, 3D, canvas, and board games.
- Make the project easy to resume after a break — project truth lives in this repo, not in chat.

Move faster and lighter than the MLB Live Bet Radar project: no live-data trust gates, no betting
safeguards, no micro-patching. But durable memory, canonical tracking, clean Git history, agent
boundaries, and easy rollback are mandatory.

---

## Working docs (durable memory)

| File | Purpose |
|---|---|
| `AGENTS.md` | Agent roles, boundaries, source-of-truth order, attribution + reporting rules |
| `CLAUDE.md` | 🧭 Claude Code entrypoint (thin; references `AGENTS.md`) |
| `docs/GAME_CATALOG.md` | Canonical inventory of every game (path, version, hash, status, conflicts) |
| `docs/PROJECT_STATE.md` | What is true right now + the current lane + exact next action |
| `docs/BACKLOG.md` | Structured feature/idea history (never compressed away) |
| `docs/RAW_IDEA_INBOX.md` | Simon's raw ideas preserved verbatim |
| `docs/PROJECT_LOG.md` | Append-oriented executive record of decisions and agent involvement |
| `docs/agent-runs/` | Full evidence records for meaningful 🧠 Grok / 🔍 Codex / 🛠️ Fable runs |

---

## Publishing

GitHub Pages serves `main` at the repo root. To publish a change: commit to `main` and push —
Pages redeploys automatically. Existing public URLs (`games/halo-fps.html`, etc.) must not break;
if files are ever restructured, leave redirect stubs at the old paths.

Commit / push / deploy happen **only** on Simon's explicit approval.
