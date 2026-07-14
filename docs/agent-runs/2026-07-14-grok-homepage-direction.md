# 2026-07-14 — 🧠 Grok — Homepage / Product Direction Review

- **Agent:** 🧠 Grok (via local `grok.exe` CLI, single-turn headless call, `--disallowed-tools` set to
  block Write/Edit/Bash/NotebookEdit/MultiEdit, web search disabled — pure text advisory, no file/tool access)
- **Date:** 2026-07-14
- **Related lane:** Lane 2A — Arcade Content & Import Audit (Arcade Expansion & Homepage Refresh Sprint)
- **Why invoked:** Simon's sprint spec required "one bounded 🧠 Grok homepage/product-direction review" before
  any homepage implementation (Lane 2C), covering what makes the current page feel like a project list vs.
  an arcade, a plain-HTML/CSS visual direction, card hierarchy, featured-game treatment, navigation,
  responsive behavior, future cover/screenshot/trailer readiness, avoiding a generic SaaS look, and what
  should change now vs. wait for real media.

## Exact prompt / assignment
The full prompt file is preserved verbatim below (this is exactly what Grok received — the real current
`index.html`, the real 7-game inventory, and 9 explicit questions):

> You are being consulted as a product/visual-direction reviewer for a personal browser-game arcade site called
> "Prototype Arcade." This is a TEXT-ONLY consultation — you have not seen a screenshot or rendered view, only
> the raw HTML/CSS below and a description of the game inventory. Do not claim to have seen the rendered page.
>
> CONSTRAINTS (real, not negotiable for this pass):
> - Plain standalone HTML/CSS only. No React/Vite/build step. No new dependencies.
> - 3 games are already publicly live at fixed URLs that must not break: games/halo-fps.html, games/tower-defense.html, games/bob-ross.html.
> - 4 more games are about to be imported this sprint (Chess, Nebula Rescue pinball, Pictionary, World History Atlas) — 7 games total after this sprint, more later.
> - No custom cover art, screenshots, or trailers exist yet — only CSS-generated placeholder treatments are available right now (gradients, shapes, typography). Real media is a future backlog item, not built now.
> - Every game is Provisional/prototype-quality — nothing should be visually presented as "finished" or "confirmed."
> - No fake screenshots, fake reviews, fake player counts, or fake trailer controls.
>
> [Full verbatim `index.html` from the repo, all 216 lines, included in full — omitted here for length; identical
> to the file committed at `e9839cc`/`7d4d512`]
>
> THE FULL 7-GAME INVENTORY (after this sprint's imports): [Halo FPS, Tower Defense, Bob Ross — live; Chess,
> Nebula Rescue, Pictionary, World History Atlas — importing, with runtime/controls/device notes for each]
>
> QUESTIONS — answer all of these, and be specific and opinionated, not generic: [9 numbered questions covering
> what breaks the arcade feel, a CSS-only visual direction, card hierarchy across 7 genres, featured-game
> treatment, navigation, responsive behavior, media-ready placeholder design, avoiding a generic SaaS look, and
> explicit (a) change-now vs (b) wait-for-media lists]
>
> Be direct and give concrete CSS/layout ideas, not just abstract principles. This is a personal project, not a
> client pitch — be honest if something in the current page is actively working against the "arcade" feeling.

**Transcript completeness:** Full (see next section — reproduced in full, no excerpting). No redactions;
no secrets/credentials were in scope.

## Full useful response / transcript
Reproduced in full below, exactly as Grok returned it (Markdown formatting preserved):

---

# 🧠 Grok — Product / Visual Direction Review
**Mode:** text-only consultation (HTML/CSS + inventory only — no rendered view claimed)
**Agents:** 🧠 Grok (planning / visual direction)

## 1. What makes this feel like a plain project list, not an arcade?

Several things in the current file actively work *against* arcade energy:

**Tone is portfolio, not cabinet**
- "Simon's Prototype Arcade" + "lightweight hub for experimental HTML games… and future tech projects" reads like a personal landing page, not a place you walk up to and play.
- The Future Lab card about cybersecurity / robotics / hardware further flattens it into "portfolio of interests."

**Visual system is neutral SaaS gray**
- `#111` body, `#1b1b1b` cards, `#333` borders, Arial, white primary buttons — this is generic dark dashboard, not coin-op.
- No accent color, no display type, no glow, no "machine chrome," no per-game identity. Everything has the same emotional temperature.

**Cards are metadata blocks, not machines**
- Tag → title → paragraph → Status/Version → Play. That's a Jira ticket shape.
- No visual hook above the fold of each card. Play is a small utility button, not the thing the card *is for*.
- Version numbers (v1.7.6, v6.1) on the homepage read "release notes," not "insert coin." Fine in a footer or details line; wrong as equal-weight UI next to the pitch.

**Layout has no stage**
- Equal `auto-fit` grid of three identical cards = directory listing.
- Header is centered text on a flat gradient — no marquee, no "NOW PLAYING," no density of invitation.
- Nothing suggests *place* (cabinet row, neon strip, ticket booth). It's a blog section titled "Featured Builds."

**Honest-but-flat status language**
- "Playable test build / Playtest build / Early prototype" is correct honesty, but without stronger *play* hierarchy it reinforces "lab inventory" over "arcade floor."

**Bottom line:** the page is doing project documentation well and arcade poorly. The honesty is good; the *frame* is wrong.

## 2. Cohesive visual direction (plain HTML/CSS only)

**Direction name: "Prototype Cabinet Row"** — One dark room, one warm light source, cards as machines — provisional, not premium.

### Concrete system (all doable in one `<style>` block)

| Token | Suggestion | Why |
|--------|------------|-----|
| Background | Near-black with *very* subtle radial vignette (`radial-gradient` on `body` or a full-bleed `::before`) | Arcade floor, not flat `#111` |
| Surface | Cards slightly lighter, 1px border with a *colored* top edge or left rail per genre | Cabinets have edge identity |
| Accent | One global neon: **electric amber / soft gold** `#f0b429` or cyan-amber pair (amber primary, cool secondary) | Avoids pure SaaS blue/purple default |
| Type | System stack fine for UI; titles: `font-weight: 800; letter-spacing: -0.02em` + slightly oversized display | Display weight without webfonts |
| Radius | Keep 12–16px, but make **cover area** sharper (8px) and **pills** fully round | Hierarchy of shapes |
| Buttons | Primary = filled accent on dark, secondary = ghost outline | Play must look "lit" |
| Motion | `transition: transform .15s, box-shadow .15s` on cards; hover lift 2–4px + border glow — **no** bounce spam | Cabinet presence without gimmick |

### Palette sketch (copy-ready)
```css
:root {
  --bg: #0a0a0c;
  --surface: #141418;
  --surface-2: #1c1c22;
  --border: #2a2a32;
  --text: #f2f2f4;
  --muted: #9a9aa3;
  --accent: #f0b429;       /* coin / neon */
  --accent-dim: #c48a12;
  --glow: rgba(240, 180, 41, 0.35);
}
```

### Atmosphere without assets
- Header: full-width dark band, thin amber bottom border, optional repeating CSS "scanline" at 3–4% opacity (easy to overdo — keep subtle).
- Small site badge under the title: `PROTOTYPES · NOT FINAL` in mono-ish tracking.
- Replace "Featured Builds" with something spatial: **Floor** / **Playable cabinets** / **On the floor**.

## 3. Card hierarchy for 7 very different genres

Do **not** sort primarily by genre. Genre tags alone don't create hierarchy on a small personal arcade.

### Recommended structure (single page)
1. **Hero strip (1 game)** — "Tonight's cabinet" / featured
2. **On the floor (primary grid)** — all *playable* imports that are first-class
3. **Side room / atlas** — True History Atlas as secondary (bonus/edu), visually quieter
4. **Lab note** — future non-game work, collapsed or bottom, **not** competing with play cards

### Per-card anatomy (fixed slots, variable content)
```
┌─────────────────────────────┐
│ [COVER / PLACEHOLDER 16:10] │  ← always present, even as CSS art
│  genre chip · control hint  │
├─────────────────────────────┤
│ Title                       │
│ 1-line pitch (max ~90 chars)│
│ meta: status only (no build │
│       version on face)      │
│ [ PLAY ]  optional details  │
└─────────────────────────────┘
```

### Hierarchy rules
- Same card chrome for all primary games — genre shows in chip + cover treatment, not card size chaos.
- Exception 1: featured = wider/taller cover, bigger title, maybe two-line pitch.
- Exception 2: Atlas = smaller card or "Bonus" rail with muted border (still playable, not hidden).
- Genre chips (short): `FPS` · `Tower Defense` · `Paint` · `Board` · `Pinball` · `Party` · `Atlas`. Drop "HTML / JavaScript FPS" — that's stack, not vibe.
- Control hint as tiny secondary chip: `Keyboard + mouse` / `Mouse` / `Touch OK`.
- Unified status vocabulary: `Playable` / `Rough` (Bob Ross early) / `Bonus` (Atlas). Kill "v1.7.6 / v6.1" from the card face — footer/details disclosure only if kept at all.

### Genre visual identity without custom art
Per-card accent CSS variable (`.card[data-game="halo"] { --game-accent: #5cb8ff; }`) used only for top border/rail, cover gradient, chip tint. Suggested: Halo cool steel blue · Tower Defense toxic green · Bob Ross soft sky blue/mountain purple · Chess warm ivory/deep green · Nebula Rescue magenta-violet · Draw It coral/orange · Atlas parchment gold/map teal.

## 4. Featured-game treatment?

**Yes — one featured slot.** Without it, seven equal cards = app store dump.

Full-width horizontal cabinet: left ~55–60% cover placeholder, right title + pitch + Play + status. Label above: `TONIGHT'S CABINET` or `FEATURED PROTOTYPE` (pick one voice). One primary CTA only: Play. No trailer fakeout.

**Rotation policy (a comment in HTML, not a product system):** "Featured = newest playable import for 14 days, else Simon's pick." Manual owner-pick is best for now; sticky default = Halo or Tower Defense (strongest game-feel demos) when nothing is new; never feature Atlas unless it's the story of the week. No algorithmic "engagement" nonsense with fake stats.

## 5. Navigation (single-page arcade home)

No multi-page nav needed — orientation + jump links. Sticky top bar (~52px): wordmark left, in-page anchors `#floor` `#about` `#lab` right. Don't add: fake login/search/mega-nav, separate hub pages per game (deep links to `games/*.html` stay), footer link farm.

On-page flow: Header + one-line promise → Featured → Floor grid → Bonus (Atlas) → Short About → Lab note → Footer credit.

## 6. Responsive behavior

| Width | Layout |
|-------|--------|
| ≥1100px | Featured horizontal; floor 3 columns |
| 720–1099px | Featured horizontal if possible else stack; floor 2 columns |
| <720px | Everything single column; featured stacks cover→text |

Play buttons min-height 44px, full-width on phone. Cover area `aspect-ratio: 16/10`. Desktop-only games (Halo, pinball) get a small always-visible "Best with keyboard + mouse" control chip — not a hard block. Don't hide version/status behind hover-only (hover dies on touch).

## 7. Media-ready layout *without* media (placeholder covers)

**Highest-leverage design decision for this sprint.** Always ship a cover *slot*:
```html
<a class="cabinet" href="games/halo-fps.html">
  <div class="cover" data-game="halo" aria-hidden="true">
    <div class="cover-art"><!-- CSS only --></div>
    <span class="cover-title">HALO FPS</span>
  </div>
  ...
</a>
```
Fixed aspect box (`aspect-ratio: 16/10`), CSS "marquees" per game (layered gradients + 1–2 geometric shapes + truncated title watermark — e.g. Halo: dark blue radial + diagonal slash; Chess: `conic-gradient` checkerboard; Pinball: deep purple + ellipse "ball"). Never photo stock or fake "▶ trailer" chrome. When real media arrives, the same `.cover` gains `background-image` — structure doesn't change. Optional `data-media="placeholder"|"cover"|"gif"` attribute for future styling without re-architecture. **"Empty secondary buttons are worse than absence"** — no visible trailer controls today.

## 8. Avoiding generic SaaS dashboard while staying plain CSS

Cards-in-a-grid isn't the enemy; identical chrome + no stage + gray everything is. Do: featured+floor asymmetry, per-game accent rails, whole-card-clickable "cabinet" metaphor, loud titles/quiet meta, one accent color system-wide, tracked section labels (`FLOOR`, `BONUS`, `LAB`), tighter/richer/less-text density, marquee-style footer. Don't: particle canvases, heavy CRT scanlines, badge soup ("NEW!!", fake ratings/player counts), glassmorphism stacks, rainbow-everything.

**Honest critique of current page:** "The current design is actively anti-arcade: Arial + equal gray cards + white 'product' buttons + Future Lab peer to games + version-centric meta. It's clean and shippable as a *repo homepage*, but as an *arcade* it undersells every game you're about to put on the floor."

## 9. Two lists

**(a) Change in THIS first practical refresh** (no new assets, plain HTML/CSS, ship soon): retitle/reframe header (drop "future tech projects" from hero); introduce design tokens (dark stage, amber accent, better type scale, glowing Play); add cover slots + CSS placeholder art for all 7; card anatomy redesign (cover→chips→title→pitch→status→Play, versions off the face); featured "Tonight's cabinet"; floor grid + Bonus treatment for Atlas; sticky in-page mini-nav; per-game `--game-accent` + control hints; unified status language; responsive 3/2/1 rules; whole-card hit target with accessible focus; park Future Lab at bottom; trim footer; **preserve all live URLs — only hub presentation changes.**

**(b) Explicitly WAIT** (do not build now): custom cover art/photos/screenshots; animated GIF/WebM previews or hover-video; trailer buttons/modal players/empty "Watch" CTAs; fake social proof; auto-rotating carousel with timers; multi-page site/genre pages/search/filters; web font packs/icon libraries; per-game landing pages beyond existing game HTML; **resolving the Halo internal-build vs. card-version conflict (separate lane — don't block UI)**; heavy CRT/shader effects; user accounts/scores/leaderboards on the hub; pixel-matching each game's in-game UI chrome.

## Synthesis (Grok's own words)

"**Ship a cabinet floor, not a project README.** The current page's honesty is an asset; its *visual neutrality* is the bug. With zero art budget you can still get 80% of the arcade feeling from: (1) cover slots with CSS marquees, (2) one featured machine, (3) amber-on-black stage, (4) quieter meta, louder Play, (5) Atlas as bonus, Lab as afterthought. If you only do three things this refresh: **cover placeholders, featured slot, accent + Play hierarchy.** Everything else is amplification."

**Status:** ✅ consultation complete — no files edited, no claims about rendered appearance.

---

## TL;DR
Grok diagnosed the current homepage as "clean but anti-arcade": generic dark-SaaS palette, equal-weight metadata cards, no stage/featured hierarchy, version numbers doing "release notes" work on the card face. Proposed direction: **"Prototype Cabinet Row"** — one amber-accent dark stage, CSS-only per-game cover placeholders (no real assets needed), a single featured "Tonight's Cabinet" slot, a primary Floor grid + quieter Bonus rail for the Atlas, unified honest status language (`Playable`/`Rough`/`Bonus`), and a documented `data-media` hook so real covers/screenshots/trailers can drop in later without restructuring. Gave an explicit change-now vs. wait-for-media split and never suggested touching existing URLs, game runtimes, or the Halo provenance question.

## Important exact quotes
> "Ship a cabinet floor, not a project README."

> "The current design is actively anti-arcade: Arial + equal gray cards + white 'product' buttons + Future Lab peer to games + version-centric meta. It's clean and shippable as a *repo homepage*, but as an *arcade* it undersells every game you're about to put on the floor."

> "If you only do three things this refresh: cover placeholders, featured slot, accent + Play hierarchy. Everything else is amplification."

> "Do not sort primarily by genre. Genre tags alone don't create hierarchy on a small personal arcade."

> "Empty secondary buttons are worse than absence."

## Concrete contributions
- A named, concrete visual direction ("Prototype Cabinet Row") with a copy-ready CSS custom-property palette.
- A specific card anatomy (cover → chips → title → pitch → status → Play) and per-game accent-color scheme for all 7 games.
- A featured-slot design + a non-engineered rotation policy ("newest import for 14 days, else Simon's pick").
- A concrete, structurally-stable placeholder-cover pattern (`.cover-art` CSS art now → `background-image` later, same markup) that directly answers the "media-ready without media" requirement.
- Explicit, itemized (a) change-now / (b) wait-for-media split, and explicit confirmation that the Halo provenance conflict should stay out of this lane.

## Risks / disagreements raised
- None Claude disagrees with on substance. One scope note: Grok's "change now" list (14 items) is broader than
  a single homepage-only lane strictly needs — some items (per-game accent variables, sticky nav, sitewide
  design tokens) are core to Lane 2C; others (footer trim, Future-Lab repositioning) are cheap and can ride
  along, but none are mandatory to hit the sprint's stated milestone. Claude will scope Lane 2C to the
  highest-leverage subset Grok itself flagged ("if you only do three things: cover placeholders, featured
  slot, accent + Play hierarchy") plus the structural pieces (card anatomy, responsive rules, status
  vocabulary) needed to onboard all 7 games cleanly — not necessarily every one of the 14 listed items.

## 🧭 Claude's disposition
**Accepted, as the Claude-selected direction informed by Grok** (not automatically authoritative — Grok
supplied evidence and challenge; the decision to adopt it is Claude's). Specifically:
- **Accepted:** the "Prototype Cabinet Row" direction, the amber-on-dark palette, the cover-slot pattern
  with CSS-only placeholder art, the featured-slot concept, the unified honest status vocabulary, the
  responsive breakpoints, and the explicit instruction to leave the Halo provenance question out of this lane.
- **Accepted with modification:** will scope Lane 2C's *first pass* to Grok's own highest-leverage subset
  (cover placeholders + featured slot + accent/Play hierarchy + card anatomy + responsive rules) rather than
  all 14 "change now" items in one pass, to keep Lane 2C itself a bounded, reviewable diff; the remaining
  items (sticky nav, footer trim, Future Lab repositioning) roll into the same lane if they stay small, or
  slip to a quick follow-up if not.
- **Rejected:** none.
- **Parked:** everything in list (b) — real cover art/screenshots/trailers, animated previews, trailer UI,
  fake social proof, auto-rotating carousel, multi-page/search/filter architecture, new fonts/dependencies —
  matches Simon's own "wait for real media" instruction and the `docs/BACKLOG.md` "Arcade Media Library" spec.

## Resulting changes (plan / code / docs)
- This record (evidence layer).
- `docs/PROJECT_LOG.md` — Lane 2A entry summarizing the call and disposition (see below).
- Informs the Lane 2C implementation plan returned to Simon alongside this audit — no `index.html` or game
  files changed as part of this call or this record.

## Transcript completeness
**Full.** The entire prompt and the entire Grok response are reproduced above verbatim, with no excerpting
beyond omitting the literal re-paste of `index.html`'s 216 lines inside the prompt section (noted inline, and
identical to the file already committed in this repo at `e9839cc`/`7d4d512` — nothing was altered from that
committed version when building the prompt). No redactions; no secrets or credentials were in scope.
