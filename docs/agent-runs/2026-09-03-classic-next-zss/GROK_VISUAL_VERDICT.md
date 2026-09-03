# GROK VISUAL / PRODUCT VERDICT — Arcade Classic vs Next + ZSS Floor

**Date:** 2026-09-03  
**Role:** Grok visual/product critique, read-only  
**Worktree:** `C:\Users\smurp\Documents\Projects\AI Projects 26\arcade-classic-next-2026-09-03`  
**HEAD:** `c9d865c` (`origin/main` gold cabinet row) · branch `arcade/classic-next-zss-2026-09-03` · **not pushed**  
**Evidence rung reached:** static inspection of HTML/CSS + direct viewing of the JPEG covers/hero. **Not** a served-browser Normal-Play Trace. Interaction/gameplay = **NOT VERIFIED**.  
**Did not:** edit product source, push, touch the live ZSS goal, invent a v3.1.x Arcade artifact, or relabel the candidate as accepted.

---

## Owner raw words (verbatim, authoritative)

> is this looking right? also what can i say to grok to make sure i can navigate to zss on the arcade? and how do we implement the graphics we came up with? we can preserve this version of the arcade as the 'Classic' style. but id like to implement these new graphics, if not too tacky. thats why we can roll back if needed, but using the most recent and making a new graphic for ZSS. what can i tell grok? also preserving my raw words.

Do not paraphrase-replace. Source: `docs/agent-runs/2026-09-03-classic-next-zss/OWNER_RAW.txt`.

---

## Verdict (one screen)

**Next is cool and intentional, not a SaaS template — and it is committed 80s/90s neon, which is a taste call, not a bug.** Keep it as an opt-in preview. **Do not make it the default until the ZSS poster is retitled.** Classic is fully recoverable and should stay the default. ZSS **is** on the Floor and Play **does** reach the candidate landing. The new ZSS graphic is the right *mood* (fog, diner, boomstick, not a green horde) and the wrong *name* (the poster says **BOOMSTICK '88**, the cabinet says **Zombie Survivors**).

| Question | Answer |
|---|---|
| Is Next looking right? | Yes as a *preview room*. No as a replacement for Classic until the ZSS title is fixed. |
| Too tacky? | The *art* is arcade-pastiche on purpose. The *CSS chrome* is thinner than the art. Not accidental AI-slop. Still magenta/cyan. |
| Classic recoverable? | **Yes.** One click. Isolated `next/`. Default remains gold `index.html`. |
| ZSS navigable from Floor? | **Yes** on both skins. Classic: first Floor card. Next: last of nine. Same Play URL. |
| Ship Next as default now? | **No.** Keep Classic default. Fix the poster title first. |

**No BLOCKER** for this preview worktree's job (Classic preserved, Next isolated, ZSS Floor card, candidate not faked as accepted). **Do not publish Next as the live homepage** until the identity items below are fixed.

---

## 1. Is Next tacky, or is it a place?

I looked at the actual stills, not just the CSS.

**Intentional, not template.** R2.2 is a coherent laser-tag arcade: magenta/cyan/lime system, PROTO ARCADE marquee, 3:4 cabinet posters, Prize Lab annex, lobbies as a second room. That is the opposite of Classic's 2026-07-14 problem (SaaS-gray project list). The July Grok note still holds: Classic does documentation well and arcade poorly; Next does arcade well and documentation as a side room. That split is correct if Classic stays the recoverable default.

**Where the tackiness lives:**

- **Hero still** (`next/assets/environment/marquee-entrance.jpg`): theatrical, fog, tube neon, black epoxy floor, cabinets receding. This is a *place*. Slightly over-the-top, as the prompt asked. Not generic.
- **CSS glow:** reduced `text-shadow` 24px → 10px (`next/arcade.css` h1). The leftover neon is the *palette* (magenta brand, cyan links/buttons, lime "Playable" pills, two body radials), not a blown-out halo. That reduction was the right first trim.
- **Cabinet posters:** Echo Yard / Grid Siege / Cube Orbit / Happy Accidents / Nebula Tilt / Kingboard are 80s insert-coin pastiche. That is the GEN2.1 brief. They read as *cabinet side art*, not as screenshots. Party Sketch (sketchbook) and True Atlas (wizard + globe) are the two that break the neon-chrome sameness, which helps.
- **Chrome around the posters is thinner than the art.** Trebuchet, `.24em` magenta `PROTO ARCADE`, identical 3:4 stage + pills + Lobby/Launch on every card. The *pictures* carry the design. The *page* is a thin laser-tag skin. If Next ever feels like a template, it is this chrome, not the stills.
- **Study A vs Study B:** if the marquee is "too much," Study A (`study-a-laser-tag-foyer.jpg`) is the tasteful Next — almost-black room, one PROTO booth, sparse lasers. Study B (mall kiosk "NEON BLAST / TOUCH FRENZY") is *more* tacky, not less. Do not "fix" Next by swapping to B.
- **ZSS on that floor is the right exception.** A grim sodium-fog diner next to magenta Cube Orbit looks like a different machine in the same hall, not a broken card. Do **not** neon-ify the ZSS cover to match. That would be the tacky move.

**Call:** Next is **arcade-intentional**. Keep it. Do not default it. Owner taste is the only remaining question on the magenta room, and Classic is the rollback.

---

## 2. Is Classic recoverable?

**Yes. Mechanically, not just in prose.**

| Surface | What it is |
|---|---|
| Default homepage | `index.html` — gold accent, `#0a0a0c` cabinet row, sticky nav, Tonight's Cabinet Halo, Floor grid. Same visual system as `origin/main` @ `c9d865c`. |
| Style switch | Classic `is-on` · Next → `next/index.html` |
| Next → Classic | Top nav `../index.html` · banner `NEXT PREVIEW · Classic remains default · not published` · title `Classic recoverable` · footer `R2.2 · HOLD · R1 is still the fallback.` |
| Isolation | `next/` is a copied R2.2 preview. It does not replace Classic files. |
| Rollback | Ignore / do not publish `next/`. Restore `index.html` from `c9d865c` if the ZSS Floor card should also go. Do **not** delete `games/zombie-survivors/candidates/`. |
| Worktree | HEAD is still `c9d865c`. Local dirty: `index.html`, `games/zombie-survivors-latest.html`, untracked `assets/`, `next/`, this agent-run. **Not pushed.** |

Classic is not a museum label. It is still the live page.

---

## 3. Is ZSS navigable from Floor?

**Yes.** Static path is complete. I did not click it in a served browser.

### Classic

1. `index.html` → `#floor` ("Playable Cabinets")
2. **First** Floor card: **Zombie Survivors**
3. Whole card is the link: `games/zombie-survivors-latest.html`
4. Landing: honest `CANDIDATE / OWNER SMOKE REQUIRED / NOT OWNER ACCEPTED`
5. `Play the candidate` → `./zombie-survivors/candidates/v3.0-SLICE1-98e3422093d9/index.html`
6. Back links: Classic Floor · Next preview

Chips: Survival FPS · Candidate · Owner-smoke required. Status: `CANDIDATE · NOT OWNER-ACCEPTED`. Pitch names SHA `98e34220…` and says v3.1.x is **not** an Arcade artifact. That honesty is correct. Keep it.

Cover treatment: real JPEG `assets/covers/zombie-survivors.jpg` (not a CSS placeholder). Accent `#c4b48a` (bone/olive), not neon green. Right temperature for Classic.

### Next

1. `next/index.html` → skip link `#floor` or nav Floor
2. Floor grid, **ninth / last** cabinet: **Zombie Survivors**
3. `Play` → `../games/zombie-survivors-latest.html` (same landing)
4. No Lobby (correct — this is a candidate, not a themed room)
5. Cover: `next/assets/covers/zombie-survivors.jpg` (byte-identical)

District Zero is gone from the Floor HTML. Slot is Zombie Survivors. Do not bring "District Zero" back as the Arcade name.

### Path proof (static)

- `games/zombie-survivors-latest.html` exists
- Candidate `games/zombie-survivors/candidates/v3.0-SLICE1-98e3422093d9/index.html` exists
- `three.min.js` exists beside it (the 2026-09-02 incomplete-publish lesson)
- `CANDIDATE.json`: `owner_accepted: false`, SHA `98e3422093d9cbf5cace834c370b6dd940b38c0dfca832ce0a19f9285b1c86f2`, source commit `62835a37`

**Not a v3.1.x Arcade artifact.** Landing says so. Leave it.

---

## 4. The new ZSS graphic — right mood, wrong title

**Files (byte-identical, SHA-256 `96B0A0E0847DD5D813FB9AD856053BD2BE8844172C8451BBD33A0C930A5B860D`):**

- `docs/agent-runs/2026-09-03-classic-next-zss/assets/zss-cover-original.jpg`
- `assets/covers/zombie-survivors.jpg`
- `next/assets/covers/zombie-survivors.jpg`

**What is right (keep):**

- First-person boomstick: short double-barrel, wood furniture, gloved hands. Not an assault rifle. This is the protected weapon, shown as a *gun*, which is what the prompt asked.
- Foggy American small-town street, sodium lamps, wet asphalt, slow walkers — not a comic horde, not neon zombies.
- Diner / boarded glass / newspapers / "last call" energy. Grounded, grim, grainy.
- Palette: olive, rust, bone, wet concrete. The anti-magenta of the Next floor. That contrast is a feature.

**What is wrong (do not ship as the public face):**

- Baked title is **BOOMSTICK '88**, with **SURVIVAL SHOOTER / INSERT COIN**. The game is **Zombie Survivors**. Boomstick is OWNER-PROTECTED as the shotgun, not as the cabinet name. A player will think they are launching Boomstick '88.
- Extra invented marks: **MABEL'S**, **STREET CLEANER** on the receiver, rainbow oil slick in the gutter (the one neon artifact in an anti-neon poster), bandage + blood on the forearm. Flavor is fine; a second title on the gun is not.
- Prompt said no logos. Imagine wrote a logo anyway. Typical. The next gen pass must *force* the title string.

**Classic crop problem:** Classic `.cover` is **16:10** `center/cover`. The poster is **3:4**. Center-crop will eat the top marquee *and* the boomstick hands — the two things that make the image. Next's 3:4 stage shows the whole poster, including the wrong title. So Classic hides the identity bug by clipping it, and also hides the gun. Both are bad, for opposite reasons.

**Regen rule:** same street / fog / diner / boomstick-in-hands. Title lettering **ZOMBIE SURVIVORS** only. Boomstick stays in the hands, unlabeled. No '88, no STREET CLEANER, no rainbow slick, no Mabel's unless the owner wants a diner name. Keep 3:4 for Next; for Classic either letterbox the 3:4 or crop from the *upper third* (street + walkers) and accept the gun is Next-only, **or** give Classic a 3:4 tile. Do not center-crop.

---

## 5. Findings

### BLOCKER

None for this isolated preview. Navigation exists. Classic is default. Candidate is not labeled accepted. v3.1.x is not copied in.

**Publishing Next as the live Arcade homepage while the poster still says BOOMSTICK '88 would become a BLOCKER.** It is not one yet because Next is labeled preview / not published.

### IMPORTANT

1. **Cover identity.** Poster title `BOOMSTICK '88` ≠ cabinet / HUD / landing name `Zombie Survivors`. Boomstick is the gun. Regen before Next can be default. Artifact: the three identical JPEGs above.
2. **Classic 16:10 center/cover of a 3:4 poster.** Clips title and boomstick. `index.html` `.cover` `aspect-ratio: 16 / 10` + `center/cover`.
3. **Next Floor buries ZSS last of nine.** Owner asked to *navigate to ZSS*. Classic already puts it first. Next should too (or second, after Echo Yard if Halo stays the house FPS). Last card is how people miss it.
4. **Lobby Launch URLs were not remapped.** Floor Launch correctly hits `../games/*.html`. Every Next lobby still points at the sibling `PROTOTYPE ARCADE` archive (`../../../PROTOTYPE%20ARCADE/...`). Floor → Launch is fine. Floor → Lobby → Launch leaves Arcade landings. ZSS has no lobby, so the ZSS path is clean. The rest of Next is not, if anyone uses Lobby.

### NIT

- Rainbow oil-slick + "STREET CLEANER" + bandage clutter on the ZSS still.
- Invented diner name MABEL'S vs the product diner (Unit/Block/District Zero). Do not bake a new diner brand unless the owner asks.
- Echo Yard stills say **MIDWAY 1998** (franchise-adjacent). Existing R2.2, not this pass.
- Kingboard tag **ONE BOARD TO RULE THEM ALL**. Existing.
- Happy Accidents is still very Bob-Ross-coded. Existing. Prompt forbade celebrity likeness; the studio still reads as him.
- ZSS has no Next lobby. Correct for a candidate. Do not invent a District Zero lobby to "match the template."
- Next Settings has no Classic link (only Floor). Classic is on the Next topbar already. Fine.
- Classic overlay `.cover-title` "Zombie Survivors" will double-title if the 3:4 poster is shown uncropped.

---

## 6. How to implement the graphics (already done, plus the remaining pass)

What this worktree already did — this is the right shape:

1. Freeze Classic as `index.html` (gold row from `c9d865c` + ZSS Floor card).
2. Copy newest applicable set **PA-GEN2.1-20260819-R2.2** into isolated `next/`.
3. Remap **Floor** Launch to `../games/*.html`.
4. Fill the empty District Zero slot with Zombie Survivors + a new still.
5. Keep Next labeled preview. Keep Classic default. Do not push.

What is **not** done, and should be the next graphic pass (not a rewrite of Classic):

1. Regen the ZSS poster with the title **ZOMBIE SURVIVORS** (prompt below).
2. Replace the three byte-identical JPEGs together so Classic / Next / original stay in lockstep, or keep original as provenance and only swap the two web covers.
3. Fix Classic crop (letterbox or top-weighted crop, or a 3:4 Classic tile).
4. Move the Next ZSS cabinet up the Floor.
5. Remap lobby Launch URLs the same way Floor was remapped — or leave lobbies as look-only until that is done. Do not claim Next Launch is fully remapped while lobbies still point at the archive.
6. Optional taste dial: if magenta marquee is too much, swap **hero only** to Study A. Do not restyle ZSS to cyan.

Rollback remains: do not publish `next/`; Classic stays.

---

## 7. What to tell Grok (pasteable)

Use this for a **graphic regen + Floor placement** pass. It is not a license to touch the live ZSS goal or to publish.

```
Read my raw words first and do not paraphrase-replace them:

is this looking right? also what can i say to grok to make sure i can navigate to zss on the arcade? and how do we implement the graphics we came up with? we can preserve this version of the arcade as the 'Classic' style. but id like to implement these new graphics, if not too tacky. thats why we can roll back if needed, but using the most recent and making a new graphic for ZSS. what can i tell grok? also preserving my raw words.

Worktree (do not touch the dirty nebula branch or the live ZSS goal):
C:\Users\smurp\Documents\Projects\AI Projects 26\arcade-classic-next-2026-09-03

Classic = origin/main c9d865c gold cabinet row (index.html). Next = isolated next/ from PA-GEN2.1-20260819-R2.2. Keep Classic the default. Next stays a preview. Do not push. Do not invent a v3.1.x Arcade artifact. Candidate v3.0-SLICE1 SHA 98e34220… is NOT owner-accepted.

Prior Grok verdict: docs/agent-runs/2026-09-03-classic-next-zss/GROK_VISUAL_VERDICT.md
Current cover (wrong title): assets/covers/zombie-survivors.jpg — it says BOOMSTICK '88. The game is Zombie Survivors. Boomstick is the shotgun in the hands, never the cabinet name.

Do this:
1. Regen a 3:4 cabinet poster. Title lettering must read ZOMBIE SURVIVORS only. First-person weathered gloved hands holding the short double-barrel boomstick, unlabeled. Foggy American small-town street, boarded diner, sodium lamps, wet asphalt, slow walking figures in haze. Muted olive / rust / bone / wet concrete. No neon, no comic horde, no '88, no STREET CLEANER, no rainbow oil slick, no second title. Original design, no logos, no franchise marks, no celebrity likeness.
2. Replace the two web covers (Classic assets/covers/ and next/assets/covers/) with the new still. Keep zss-cover-original.jpg as provenance.
3. Put the Zombie Survivors cabinet first or second on the Next Floor, not last.
4. Fix Classic's 16:10 center/cover crop so it does not clip the gun and the title. Letterbox or top-weight. Do not neon-ify this cover to match Next.
5. Keep Classic one click away. If you change visuals, Classic remains recoverable.

Do not: rewrite product game code, publish, retitle the candidate as accepted, add a fake District Zero lobby, or restyle the grim ZSS still into magenta/cyan.
```

For a **navigation-only smoke** (no regen):

```
Open the Arcade worktree homepage. Confirm Classic Floor first card is Zombie Survivors and Play opens games/zombie-survivors-latest.html. Confirm Next Floor has a Zombie Survivors cabinet whose Play hits the same URL. Confirm the landing still says CANDIDATE / NOT OWNER ACCEPTED and Play the candidate opens v3.0-SLICE1-98e3422093d9. Confirm Classic is one click from Next. Do not push. Do not edit the live ZSS goal.
```

Existing shorter prompt remains at `docs/agent-runs/2026-09-03-classic-next-zss/GROK_PROMPT.txt`. The block above is the follow-up after this verdict.

---

## 8. What I would not do

- Do not neon-grade the ZSS still to "fit" Next. The grim card is the point.
- Do not rename the Arcade game Boomstick '88. Boomstick stays the gun.
- Do not delete Classic, and do not merge Next into `index.html` as a silent replace.
- Do not copy v3.1.x into Arcade because a marathon is running.
- Do not treat HTTP 200 or "the card exists" as owner-accepted play.
- Do not write a ZSS lobby stuffed with District Zero lore to fill the template. Floor Play is enough until the owner wants a lobby.

---

## Evidence lines

- Next is intentional arcade pastiche, not SaaS → `next/index.html` + `next/arcade.css` + `next/assets/environment/marquee-entrance.jpg` + cabinet JPEGs under `next/assets/covers/` → static / image view → open risk: owner taste on magenta
- Hero glow reduced, not gone → `next/arcade.css` `h1 { text-shadow: 0 0 10px rgba(255,43,214,.22); }` → static → still a magenta/cyan system
- Classic recoverable → `index.html` gold `:root --accent: #f0b429` + style-switch + `next/index.html` Classic link → static → Next not published
- ZSS on Classic Floor → `index.html` first `.grid` cabinet `href="games/zombie-survivors-latest.html"` → static, **not** clicked in a served browser
- ZSS on Next Floor → `next/index.html` last cabinet `href="../games/zombie-survivors-latest.html"` → static, last-of-nine placement
- Play path → `games/zombie-survivors-latest.html` → `./zombie-survivors/candidates/v3.0-SLICE1-98e3422093d9/index.html` + `CANDIDATE.json` `owner_accepted: false` → static
- Cover identity miss → viewed JPEG, title **BOOMSTICK '88** vs card **Zombie Survivors** → image inspection
- Cover hash lockstep → SHA-256 `96B0A0E0847DD5D813FB9AD856053BD2BE8844172C8451BBD33A0C930A5B860D` on original + both web copies
- Lobby Launch still archive-pathed → `next/lobbies/*.html` `../../../PROTOTYPE%20ARCADE/...` vs Floor `../games/*.html`

---

## Bottom Action Brief

**TL;DR.** Next is a real arcade room (intentional neon, not a template). Keep it as preview. Classic stays default and is one click away. ZSS is on both Floors and Play hits the candidate landing. The new graphic is the right fog/diner/boomstick mood with the wrong title (BOOMSTICK '88). Regen titled **ZOMBIE SURVIVORS** before Next can be default. Do not publish.

**Smoke:** not required for this critique — docs/read-only, static + image inspection. Owner can still walk Classic Floor → first card → Play, and Next Floor → Zombie Survivors → Play, in a real browser when they want.

**Exact next action.** Owner taste: (a) keep Classic default + Next preview as-is except retitle the ZSS still, or (b) also swap the Next hero to Study A if the marquee is too much. Then paste the regen prompt in §7 into a fresh Grok. Do not arm a live ZSS goal from this. Do not push.
