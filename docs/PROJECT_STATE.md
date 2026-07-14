# Project State

_What is true right now._ Update this whenever the truth changes. Keep it short and current.
Last updated: **2026-07-13**.

## Current phase
Foundation. Orientation audit complete and accepted; building durable project memory.

## Current lane
**Lane 1 — Project Foundation & Canonical Game Catalog** (docs-only).
Status: **Active → Review**. 🧭 Claude sole editor. No outside agents required.

## Exact next action
Simon reviews the Lane 1 foundation docs. **Nothing is committed.** On approval:
`git add` the 9 foundation components and commit (docs-only) — **push/deploy stays separate and unapproved**.
Then queue **Lane 2 — reconcile the 3 published builds** (resolve the Halo version conflict first).

## Published state (live == repo, confirmed 2026-07-13)
- 🟢 Live: https://smurphy1398.github.io/prototype-arcade/ — Halo FPS (card v1.7.6), Tower Defense (v6.1), Bob Ross (v0.1).
- GitHub Pages serves `main` at repo root (inferred; no CNAME/.nojekyll/workflow). Live site matches the repo.

## Canonical games (all Provisional — see `GAME_CATALOG.md`)
- Halo FPS — ⚠️ published file matches no local build and mislabels its own version (title v1.7.5.2 vs card v1.7.6).
- Tower Defense — published ≈ local v6.1 (High).
- Bob Ross — only meaningful build (High).
- Chess/Checkers, Nebula Rescue pinball, Pictionary, World History Atlas — local only, import candidates.

## Repo status
- Branch `main`, clean at audit start; local == `origin/main`.
- Lane 1 adds only documentation (README + AGENTS + CLAUDE + `docs/`). No game files touched.

## Known risks / watch items
- ⚠️ Halo provenance conflict (above) — resolve before adding new games.
- ⚠️ `gh` (GitHub CLI) not installed; `github` MCP returning HTTP 400 → GitHub automation unavailable.
- ⚠️ Halo (Babylon) and World History (Leaflet) depend on CDNs — fine on Pages, broken offline.
- 🔒 `..\PROTOTYPE ARCADE` source collection is a protected read-only archive; a separate-drive backup also exists.

## Agents this session
**Agents:** 🧭 Claude (Opus, sole editor). No 🧠 Grok / 🔍 Codex / 🛠️ Fable runs yet.
