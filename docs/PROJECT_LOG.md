# Project Log

Append-oriented executive record of meaningful decisions and agent involvement. Skimmable layer —
full evidence for agent runs lives in `docs/agent-runs/`. Newest entries at the top. See `AGENTS.md`
for the attribution rules (exact quotes only; never claim an agent ran unless it did).

---

## 2026-07-14 — Live: 7-game arcade homepage shipped
**Agent Snapshot:** 🧭 Claude (Opus, release execution + live verification; no outside agents this entry).

**TL;DR:** The Lane 2C homepage is live at https://smurphy1398.github.io/prototype-arcade/ (source commit
`af0bc0b`), verified by actual rendered visual inspection (headless Chrome, screenshots viewed directly —
not HTTP alone) plus HTTP 200 on the homepage and all 7 game URLs. The 3 pre-existing public URLs remain
valid.

**Verification method:** two production screenshot attempts — the first (immediately after push) still
showed the old 3-card page (GitHub Pages hadn't redeployed yet); the second (~90s later, with a
cache-busting query param) showed the new 7-game homepage fully rendered — featured Halo, Floor grid of 6,
Bonus/Side Room with True History Atlas. Followed by a full-page capture confirming section order and
content. All 8 URLs (homepage + 7 games) independently confirmed via `curl` to return HTTP 200.

**Preserved facts:**
- Simon's local acceptance: homepage "looks fine"; Nebula Rescue loads ~5s locally with no white screen.
- **Deeper Nebula Rescue gameplay, physics, slide/ramp, and balance remain unresolved** — tonight's
  acceptance covers homepage presentation and imported-game launch smoke only.
- **Game History Recovery is the next project lane** — not started, hard prerequisite before Nebula/Halo
  source work.
- Reporting-format follow-up (short at-a-glance smoke checklist beside the TL;DR) is **deferred** to the
  later laptop-Claude / Vibe Code foundation review, per Simon's explicit instruction not to revise the
  contract again tonight.

**Decision:** Ship complete. Committing this checkpoint, pushing, then stopping for the night.

**Transcript records:** none new this entry.

---

## 2026-07-14 — Lane 2C accepted + final release sequence
**Agent Snapshot:** 🔍 Codex (final read-only Lane 2C release review) · 🧭 Claude (Opus, integration, commit, release).

**TL;DR:** Simon accepted the Lane 2C homepage in his real browser and confirmed Nebula Rescue now loads in
~5 seconds with no white screen (down from ~24s blank in the original recording). 🔍 Codex's final release
review found no blockers. Committing and pushing tonight.

**Simon's acceptance (preserved facts, not compressed):**
- Visually reviewed the new Lane 2C homepage: "looks fine."
- Real-browser Nebula Rescue observation: ~5 seconds to load, white screen no longer present.
- This is acceptance of the **homepage presentation and imported-game launch smoke** — explicitly **not**
  acceptance of deep Nebula gameplay, physics, slide/ramp, or balance. Those remain open, gated behind Game
  History Recovery (`docs/BACKLOG.md` B8).

**🔍 Codex final review:** no release blocker across links/HTML-validity/responsive-a11y-basics/fake-content/
game-source-changes/Pages-compatibility. Two non-blocking findings, both dispositioned: a `--game-accent`
CSS scoping bug (degrades gracefully to the already-accepted amber look — deferred as `BACKLOG.md` B10,
*not* fixed tonight so the shipped visual matches exactly what Simon reviewed) and stale commit facts in
`PROJECT_STATE.md` (fixed). Full transcript: `docs/agent-runs/2026-07-14-codex-homepage-refresh-review.md`.

**Reporting-format follow-up (deferred, not acted on tonight):** Simon flagged that the smoke checklist
should sit directly beside the TL;DR as a genuinely short 3–6 item at-a-glance list, with full context
appearing later — the current contract still buries the practical checklist inside a larger report. Per his
explicit instruction, **the report contract is not being revised again tonight**; this is preserved as a
follow-up for the later laptop-Claude / Vibe Code foundation review.

**Decision:** Ship tonight. Commit docs/workflow checkpoint (`9f0c517`) and Lane 2C (`index.html` +
Lane-2C-specific docs) as separate commits, then push and verify the public site.

**Transcript records:** `docs/agent-runs/2026-07-14-codex-homepage-refresh-review.md` (Full).

---

## 2026-07-14 — Workflow hard-rule repair: report contract regression fixed
**Agent Snapshot:** 🧭 Claude (Opus, sole editor; workflow-rule repair, no outside agents needed).

**TL;DR:** The prior Lane 2C/capability report regressed on Simon's actual ask — it lacked a detailed
`Agent Contributions` section (because the old rule only required it "when an outside agent was used," and
that pass was Claude-solo) and gave no smoke-test instructions at all. Fixed at the source: `AGENTS.md`'s
report contract now requires `Agent Contributions` on **every** report (with an explicit solo-work form) and
adds a mandatory `Smoke Test — Do This Now` block for any runnable/visual work, adapted from Simon's
`VIBE_CODE_DEFAULT_PROJECT_FOUNDATION_v1.1.md` §7.

**What changed:** `AGENTS.md`'s "Report format when an outside agent was used" section replaced with
"Required report contract (HARD RULE — v1.1)" — 9-part required order (Agent Snapshot → TL;DR → What
Changed/Current State → Smoke Test-or-Not-Required → Agent Contributions → Claude Synthesis → Work
Completed/Evidence → Git/Commit/Push/Deploy State → Exact Next Action), carried-forward-contribution
labeling rule, and the always-required Agent Contributions section (solo-work template included).

**What didn't need to change:** `CLAUDE.md` — already thin, already references `@AGENTS.md`, no duplicated
report-format text to drift. The 4 status skills (`/handoff`, `/roadmap`, `/phaselane`, `/whatsnext`) —
inspected, no genuinely conflicting report-format instructions found (only a passing, non-conflicting
mention of "smoke" in `/handoff`'s validation-sources line); their compact, command-specific output formats
are intentionally different from this lane-report contract and were left intact.

**Decision:** This repair is deliberately kept separable from the still-pending Lane 2C homepage diff — only
`AGENTS.md` and this log entry changed; `index.html` remains exactly the pre-existing, unrelated Lane 2C
diff (`+479/-120`, unstaged, uncommitted). This repair can become its own docs-only checkpoint independent
of Lane 2C's acceptance.

**Transcript records:** none (rule repair, not an agent consultation).

---

## 2026-07-14 — Visual-capability check + video-review capture + Game History Recovery defined
**Agent Snapshot:** 🧭 Claude (Opus, capability probe + docs; no outside agents this entry).

**TL;DR:** Confirmed Claude *can* genuinely see rendered pages (headless Chrome + `Read` on the resulting
PNG — verified, not assumed); confirmed Grok's local CLI is text-only (no image support) while Codex's
supports image input; preserved Simon's raw Nebula Rescue feedback and a secondary-evidence review record
from his screen recording; defined (not started) a Game History Recovery lane as the explicit next step
after Lane 2C, ahead of any hands-on Nebula/Halo repairs.

**Visual-capability result: "visual capture available and verified."** Chrome and Edge both exist locally;
headless Chrome screenshot capture against the local server was run and the resulting PNGs were viewed
directly via the `Read` tool. Two pages captured with dual timing each (immediate + a 25,000ms
`--virtual-time-budget` "delayed" pass, per Simon's request to distinguish an initial loading state from a
page that never initializes):
- `index.html` — immediate: 291,611 B; delayed: 291,611 B (byte-identical — static page, expected).
- `games/nebula-rescue-game.html` — immediate: 644,961 B; delayed: 647,699 B.

**Nebula Rescue finding — important nuance, not a contradiction of Simon's report:** both headless captures
show a **fully rendered main menu** (title "NEBULA RESCUE", a "START GAME" button, a populated mission-computer
HUD, a controls legend, and 3D table geometry visible behind the menu) — not a blank/white screen. However:
the *first* ("immediate") capture took roughly 4 minutes of real wall-clock time to complete, despite a
2,000ms virtual-time-budget request, most plausibly because it was Chrome's cold start plus the real network
fetch of Three.js from `cdn.jsdelivr.net` (see the Lane 2B Codex-caught dependency finding) — virtual time
does not accelerate real network I/O. The *second* pass (after Chrome/CDN was already warm) completed in
~78 seconds. **This does not confirm or deny Simon's observed ~24-second white screen** — headless capture
conditions (no GPU, different cache state, different machine load) are not the same as his real browser
session, and no claim is made that this reproduces or disproves it. What it *does* establish: the page does
reach a fully-formed, non-crashed main menu, and the menu is stable (identical before/after the 25s virtual
delay — nothing auto-advances without clicking Start, as expected). The actual white-screen *duration and
cause* in a normal browser session remains genuinely unconfirmed and is exactly the kind of question the
Game History Recovery lane (and eventual hands-on Nebula testing) should resolve — not this probe.

**🧠 Grok / 🔍 Codex capability:** Grok's local CLI has no image/attach flag (confirmed via full `--help`
scan) — it is text-only through this integration and cannot see a screenshot or video frame. Codex's CLI
does support `-i/--image <FILE>` — a genuine secondary visual opinion from Codex is possible once a
screenshot exists, unlike Grok. `ffmpeg` is not installed, so no video-frame extraction is available without
an explicit package-install approval (flagged, not silently installed).

**Preserved feedback:**
- Simon's raw Nebula Rescue quote → `docs/RAW_IDEA_INBOX.md` (2026-07-14 entry), verbatim.
- ChatGPT's screen-recording observations (Atlas, Halo, Chess, Nebula Rescue, Pictionary, Tower Defense, Bob
  Ross, homepage) → `docs/game-history/raw/2026-07-14-video-review.md`, explicitly marked as secondary
  evidence, not a formal `AGENTS.md` agent run, and not console/gameplay proof.
- Structured backlog entry `docs/BACKLOG.md` B8 — Nebula Rescue elevated to top rescue priority, with the
  spinners marked as a **protected win** and the slide/ramp marked **known-broken**, gated behind Game
  History Recovery completing first. Also B9 — landing-page cleanup, captured but not yet scoped.

**Game History Recovery** — defined in full in `docs/PHASE_LANES.md` (goal, archive-evidence types, 5
required output files, per-game tracking lists for Nebula/Halo/Pictionary/Tower Defense/Atlas, raw-note
preservation rule, integration points, exclusions) and sequenced in `docs/ROADMAP.md` as the **explicit next
lane immediately after Lane 2C is finished/checkpointed** — not buried in `Later`. **Not started** —
gated behind Simon's acceptance of the still-pending Lane 2C visual review, and a hard prerequisite before
any hands-on Nebula/Halo source work.

**Decision:** Lane 2C's own status is unchanged by this entry — still 🟡 awaiting Simon's visual acceptance.
This was a parallel capture/definition pass, not a Lane 2C edit.

**Transcript records:** none new (capability probe + doc capture, not an agent consultation). Screenshot
PNGs remain in the local scratchpad only — **not added to Git this lane**, per Simon's instruction.

---

## 2026-07-14 — Lane 2C: Homepage Arcade Refresh (implemented, awaiting visual review) + Agent Snapshot rule
**TL;DR:** Implemented the Claude-selected, Grok-informed "Prototype Cabinet Row" homepage direction across
all 7 games (single-file `index.html`, no build step). Added the required "Agent Snapshot" one-line
attribution rule to `AGENTS.md` per Simon's correction. Confirmed the live-site 3-game state was expected
(Lane 2B never touched `index.html`); committed Lane 2B (`7d19000`); ran a local browser gate (server +
exact URLs) for Simon's own visual pass instead of claiming an automated one Claude can't actually perform.

**Agents:** 🧭 Claude (sole editor/implementer this entry). 🧠 Grok and 🔍 Codex's contributions to the
direction and the import review are logged in their own earlier entries below — not re-claimed here.

**Captain's synthesis (🧭 Claude):**
- Simon correctly flagged two gaps: reports needed a compact agent-attribution line *before* the TL;DR (not
  just the longer Agent Contributions section), and he hadn't seen Grok's contribution reflected clearly
  enough. Fixed by adding the `Agent Snapshot:` rule to `AGENTS.md` as a hard requirement on every
  checkpoint/audit/handoff/lane/release report going forward.
- Clarified (not fixed, because nothing was broken): the production site correctly still shows only 3 games
  — Lane 2B only added files to `games/`, never touched `index.html` or pushed anything. This was the
  expected state, not a regression.
- Implemented Lane 2C using Grok's own highest-leverage subset (cover placeholders, featured slot, accent +
  Play hierarchy, card anatomy, responsive rules) plus the structural pieces needed to onboard all 7 games:
  amber-on-dark tokens, per-game accent + CSS-marquee covers, one featured cabinet (Halo — Grok's "sticky
  default" since all 4 new imports landed the same day, avoiding an arbitrary pick among them), a primary
  Floor grid, a dashed-border Bonus rail for the Atlas, sticky in-page nav, and `data-media="placeholder"`
  hooks for future real covers. Used Simon's own status vocabulary (Playable/Early Prototype, Experimental
  Build) rather than Grok's suggested "Rough," since Simon had already specified that wording in his Lane 2B
  instructions.
- Because there is no headless-browser or screenshot tool available, Claude cannot itself verify visual
  rendering/responsive behavior — this is stated honestly rather than claimed. A local HTTP server was left
  running with exact URLs handed to Simon for his own in-browser check, matching his explicit instruction not
  to point him at production until this is committed and pushed.

**Decision:** Hold before commit and before the 🔍 Codex review of `index.html` — both come after Simon's
visual acceptance. No push/deploy until then.

**Transcript records:** none new this entry (implementation work, not an agent consultation).

---

## 2026-07-14 — Lane 2B: Import Missing Games + 🔍 Codex import review
**TL;DR:** Imported all 4 missing games (Chess, Nebula Rescue, Pictionary, World History Atlas) as
landing+game file pairs, byte-verified against their source hashes, honestly labeled Provisional. Ran one
bounded 🔍 Codex read-only review, which caught and Claude fixed two real documentation errors (Chess/Nebula
Rescue were wrongly documented as offline-capable; they load Three.js from a CDN). Existing 6 game files and
`index.html` untouched. Nothing committed yet.

**Agents:** 🔍 Codex (one bounded read-only review — path/link/runtime/dependency audit) · 🧭 Claude (sole editor).

**Captain's synthesis (🧭 Claude):**
- All 4 imports were byte-copied from the exact Lane 2A-evidenced source candidates and hash-verified
  identical (no unintentional alteration): Chess `73d677e7`, Nebula Rescue `a5693986`, Pictionary `d729e200`,
  World History `cb66b407`.
- 🔍 Codex's review surfaced a genuine error, not a false positive: my landing-page and catalog copy claimed
  Chess and Nebula Rescue were "inlined/self-contained/no internet required." I verified this directly with
  `grep` before touching anything — Codex was right. Both load Three.js via ES-module `import` from
  `cdn.jsdelivr.net`. This also revealed the *original Lane 1 audit* had the same error (its `<script src=...>`
  grep missed ES-module `importmap`/`import` patterns) — now corrected everywhere it appeared.
- Codex also caught that World History's documented dependency list was incomplete (missing GitHub-raw
  GeoJSON and the Wikipedia REST API) — fixed.
- Codex's third finding (incomplete lane bookkeeping) reflected expected mid-lane sequencing, not a defect —
  the closing docs pass (this entry) was always the next step.
- Validation depth is stated precisely: HTTP 200 + byte-content verification + navigation-link verification
  were performed via a local server; **in-browser render/gameplay testing was not performed this lane** and
  is not claimed.

**Decision:** Stop before commit. Return the Lane 2B report to Simon; Lane 2C (homepage refresh) is proposed
next, pending his review of the imports and the Codex-driven corrections.

**Transcript records:** `docs/agent-runs/2026-07-14-codex-missing-games-import-review.md` (Excerpted — full
substantive findings verbatim, mechanical tool-call log omitted).

---

## 2026-07-14 — Lane 2A: Arcade Content & Import Audit + 🧠 Grok homepage direction
**TL;DR:** Reprioritized the roadmap (Arcade Expansion & Homepage Refresh sprint is now current; deep Halo/
published-build reconciliation deferred, not dropped). Ran a read-only audit reconfirming the 3 live games
still launch and the strongest import candidate per missing game (already evidence-backed in
`GAME_CATALOG.md`). Ran one bounded 🧠 Grok text-only homepage/product-direction review. Docs-only; no game
files or `index.html` touched; nothing committed.

**Agents:** 🧠 Grok (one bounded call — planning/challenge/visual-direction) · 🧭 Claude (sole editor, docs +
audit + decision).

**Captain's synthesis (🧭 Claude):**
- Live-site spot check (WebFetch) reconfirmed Halo, Tower Defense, and Bob Ross all still resolve with
  correct Play links before proposing any import plan.
- Grok's review (full record: `docs/agent-runs/2026-07-14-grok-homepage-direction.md`) diagnosed the current
  homepage as honest-but-visually-neutral — *"clean and shippable as a repo homepage, but as an arcade it
  undersells every game you're about to put on the floor."* Proposed a named, concrete direction
  ("Prototype Cabinet Row": amber-on-dark palette, CSS-only per-game cover placeholders, one featured slot,
  unified honest status vocabulary) that answers the "media-ready without media" requirement directly.
- Grok explicitly separated what to change now vs. what to wait for real assets, and explicitly kept the
  Halo provenance question out of scope for this lane — matching Simon's sprint boundaries without being told to.
- 🧭 Claude accepted the direction as the **Claude-selected, Grok-informed** direction (evidence, not
  automatic authority), with one modification: Lane 2C's first pass will scope to the highest-leverage
  subset Grok itself flagged (cover placeholders, featured slot, accent/Play hierarchy, card anatomy,
  responsive rules) rather than all 14 of Grok's "change now" items in a single diff, to keep the lane
  reviewable. Nothing was rejected. Grok's "wait for real media" list matches the `BACKLOG.md` Arcade Media
  Library spec and was parked accordingly.

**Decision:** Return the Lane 2A deliverable (this entry + the audit + the import/homepage plan) to Simon and
stop before any game or homepage edits. Lane 2B/2C/2D await separate approval.

**Transcript records:** `docs/agent-runs/2026-07-14-grok-homepage-direction.md` (Full).

---

## 2026-07-13 — Lane 1B: status-skills port
**TL;DR:** Added Arcade-native `/handoff`, `/roadmap`, `/phaselane`, `/whatsnext` skills plus `docs/ROADMAP.md`,
`docs/PHASE_LANES.md`, and a model/effort routing table in `AGENTS.md`; corrected the stale `PROJECT_STATE.md`
(Lane 1 is committed `e9839cc` and pushed). Docs/workflow-only; nothing committed this lane.

**Agents:** 🧭 Claude (Opus, sole editor). No 🧠 Grok / 🔍 Codex / 🛠️ Fable runs — the lane excludes agent invocation.

**Captain's synthesis (🧭 Claude):**
- Verified Git truth before writing: `e9839cc` is committed and pushed, local == `origin/main`, tree clean — so
  the earlier "nothing is committed / Lane 1 active" language was stale and is now fixed.
- Provenance: the local MLB clone holds only `handoff` (+`switchdevice`); `roadmap`/`phaselane`/`whatsnext` were
  **absent locally** (GPT read them from the GitHub remote). All four Arcade skills were therefore **authored fresh**
  from Simon's spec — not copied — and kept free of MLB-specific terms.
- Encoded routing boundaries so an ordinary "what next?" resolves to `/whatsnext`, not a full `/handoff`.
- Applied skill-authoring principles (valid `name`, "Use when…" trigger-only descriptions, conciseness) but not the
  subagent pressure-test loop (out of scope; lane forbids agent invocation).

**Decision:** Accepted by Simon after all four skills were reloaded and functionally tested in order
(`/whatsnext` → `/phaselane` → `/roadmap` → `/handoff`, all passed). Committed. Push and Lane 2 are separate,
explicitly-approved next steps.

**Transcript records:** none (no outside-agent runs this lane).

---

## 2026-07-13 — Orientation audit + Lane 1 foundation
**TL;DR:** Read-only two-folder audit completed and accepted; built the docs-only project-memory
foundation (9 components) and encoded the agent-attribution system. No game files touched, nothing committed.

**Agents:** 🧭 Claude (Opus, sole editor). No 🧠 Grok / 🔍 Codex / 🛠️ Fable runs — this was a docs-only lane
and the audit found outside agents unnecessary here.

**Captain's synthesis (🧭 Claude):**
- Audit found the repo (`main`, clean, == origin) and the `..\PROTOTYPE ARCADE` source collection both readable.
- Key truth: all three **published** game files differ by hash from every local build → repo and archive have diverged.
- ⚠️ Recorded conflicts to preserve: Halo published `<title>` v1.7.5.2 vs advertised v1.7.6 (matches no local build);
  Chess v2.1/v2.2/v2.3 all internally titled "v2.0"; Nebula Rescue "v6.3" files internally titled "v4.9".
- Simon amended the workflow with a compact emoji attribution system (🧠🔍🧭🛠️), corrected away from theatrical titles,
  persisted in `AGENTS.md` + personal memory (his choice: AGENTS.md as single source, no standalone hard-rule doc).
- Recommended a lean 7→9 file foundation instead of the proposed 13, merging overlaps (ACTIVE_TASK→PROJECT_STATE,
  DECISION_LOG+WORKFLOW_LOG→this log) with no truth lost.

**Decision:** Proceed docs-only; stop before commit for Simon's review. Next lane = reconcile the 3 published builds
(Halo conflict first).

**Transcript records:** none (no outside-agent runs this lane).
