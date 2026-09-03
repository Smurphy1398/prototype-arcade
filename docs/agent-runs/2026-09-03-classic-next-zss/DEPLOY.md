# Public Arcade promotion — 2026-09-03

## Identity

| | SHA |
|---|---|
| Classic baseline (former public treatment) | `c9d865c3f17bebda4f69d3715353b3f496fa75c6` |
| Preview commit | `15ab6cf0dbc1a8fd82b7fc9f5f4fc0045f09c530` |
| Deployed SHA | *fill at push* |

- Public default: Next (R2.2) at repo root `index.html`
- Live Classic route: `/classic/` (`classic/index.html`) — selectable, not a buried Git-only rollback
- Classic assets: gold-row HTML in `classic/index.html` (inline CSS). Cover JPEG shared at `assets/covers/zombie-survivors.jpg`. No Classic files deleted.
- Candidate still: `v3.0-SLICE1` SHA-256 `98e3422093d9cbf5cace834c370b6dd940b38c0dfca832ce0a19f9285b1c86f2` · OWNER-SMOKE REQUIRED / NOT OWNER-ACCEPTED
- v3.1.x: not an Arcade artifact yet

## ZSS cover

- Titled poster: `docs/agent-runs/2026-09-03-classic-next-zss/assets/zss-cover-titled-zombie-survivors.jpg`
- Web: `assets/covers/zombie-survivors.jpg` and `next/assets/covers/zombie-survivors.jpg`
- Previous untitled/wrong-title original kept: `docs/agent-runs/2026-09-03-classic-next-zss/assets/zss-cover-original.jpg`

## Rollback (one command)

From a clone of prototype-arcade, restore former public `index.html` from Classic baseline without deleting `/classic/` or candidates:

```bash
git checkout c9d865c3f17bebda4f69d3715353b3f496fa75c6 -- index.html
git commit -m "rollback: restore Classic gold-row index.html from c9d865c"
git push origin HEAD:main
```

To restore the entire tree to the former public SHA (destructive of later commits — last resort):

```bash
git revert --no-edit <deployed-sha>
git push origin HEAD:main
```

Do not `git reset --hard` + force-push.
