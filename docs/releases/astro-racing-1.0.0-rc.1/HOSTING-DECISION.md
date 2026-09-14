# Public room hosting — decision and remaining access

Checked 14 September 2026. No service has been purchased or publicly deployed.

## Recommendation

Start with **Render Free for a limited first friend playtest**, using the prepared
`services/astro-racing/render.yaml`. It supports the existing Node 24 HTTP/WebSocket
process and managed TLS without a protocol rewrite. Use a Free Hobby workspace with
no payment method, so exceeding the allowance suspends service rather than charging.
If Render requires billing authorization for the account, pause and ask Simon first.

Current [Free service documentation](https://render.com/docs/free) confirms $0 compute,
750 instance hours per workspace per month, idle sleep after 15 minutes, roughly a minute
to wake, possible restarts, and a single instance. Restarts lose this game's in-memory rooms.
Active inbound WebSocket messages count as activity. The
[Blueprint resource specifications](https://render.com/docs/blueprint-spec) list 0.1 CPU
and 512 MB RAM for Free. This is a test option, not verified hosted 60 Hz capacity.

[Render bandwidth](https://render.com/docs/outbound-bandwidth) includes 5 GB/month on
Hobby, shared across the workspace. WebSocket output counts. With a payment method,
overage is $0.15/GB; without one, services suspend at the limit. Build minutes have
separate limits and possible overages on billing-enabled workspaces. A paid workspace
or compute upgrade does not eliminate all usage charges. Confirm the dashboard before creation.

## Measurements relevant to suitability

`server-check.json` records a 60.76-second local production-mode check with two WebSocket
clients, twelve racers, the normal server clock, and independent input pilots:

- Server step mean 0.857 ms, maximum 7.533 ms on this machine.
- Process used about 0.099 CPU cores including both client pilots, and 132 MiB RSS.
- Server output to both clients averaged 917,862 bytes/second, or about 3.30 GB/hour.
- At that sample rate, 5 GB permits roughly 1.5 hours of two-player room activity if the
  whole allowance is unused. Course/events and protocol overhead can change this estimate.

These are local measurements, not a cloud capacity guarantee. Free CPU is tight; public
race timing must pass before announcing friend races as available. Do not reduce tick rate,
alter physics, compress/change the protocol, or change game content merely to fit a host in
this publication lane. If Free cannot keep up, bring Simon the measured failure and paid choice.

## Paid alternatives checked, not authorized

- [Fly.io](https://fly.io/docs/about/pricing/) offers smaller shared VMs with regional,
  per-second prices: one 512 MB shared-CPU machine starts around $3.32 per 30 days in the
  lowest priced regions, plus bandwidth and other selected resources. No permanent free
  tier for a new account is assumed. This is the lowest base-price always-on managed option
  among the checked candidates, but final region/billing and hosted performance need confirmation.
- [Railway Hobby](https://docs.railway.com/pricing) is $5/month minimum, including $5 usage;
  usage above that is additional.
- [Render paid compute](https://render.com/pricing) starts at $7/month for 0.5 CPU / 512 MB,
  plus applicable usage. It is the simpler upgrade if the Free trial fails CPU checks.

No paid plan is selected. Ask before any new charge, including automatic usage overages.

## Exact missing connection

GitHub access is authenticated and publication is complete. Arcade/Astro repository
secrets and variables are empty, and Arcade deployments are Pages only. Available
connected tools have no suitable room host. The portable official Render CLI v2.28.0
reports `run render login to authenticate`; there is no existing Render login.
The Render Blueprint CLI cannot perform its account-level validation without a workspace.

In the Astro workspace, run **`Connect-Astro-Racing-Multiplayer.cmd`**. It launches the
verified portable CLI's normal browser login. Sign in, click **Authorize CLI**, and select
the workspace. Tell Codex the selected workspace name. Do not paste credentials into chat.
The launcher saves CLI auth in the Git-ignored `deployment-v1.0/private/render/` folder.
It creates no service and chooses no paid plan. Instructions follow
[Render's CLI login workflow](https://render.com/docs/cli).

If Render needs a GitHub connection for repository deployment, grant it access to
**Smurphy1398/prototype-arcade**. The source is public; no access to unrelated repositories is needed.

## Work to complete after connection

1. Inspect the selected workspace's existing services and billing/usage state. Reuse a
   suitable existing service when available; otherwise confirm Free can run without new charges.
2. Validate the Blueprint and deploy one Node service from branch `main`, root directory
   `services/astro-racing`, with the exact checked settings. Keep auto-deploy off so later
   Arcade changes do not restart active rooms unexpectedly.
3. Record the actual service URL, verify TLS, `/health`, `version:1.0.0-rc.1`, protocol 2,
   `verify:false`, and the exact Arcade-origin allow-list.
4. Run `scripts/check-public-rooms.mjs` with `ASTRO_PUBLIC_ROOM_URL=wss://ACTUAL_HOST/rooms`
   and the installed Playwright module. It checks the exact copied guest link, two browser
   contexts, separate racer IDs, a complete normal-time race, agreed results and a full rematch.
5. Configure the landing with `python scripts/configure-endpoint.py wss://ACTUAL_HOST/rooms`.
   Commit/push the small integration update, verify the default link publicly, and save results.

Guest instructions once enabled: **Race Together → Create Room → Copy Join Link**.
Friend opens link and chooses **Join Room**. Both choose **Ready**; host **Start Race**.
After the full field finishes, host **Rematch Lobby**, both ready again, host starts.
Current capacity is two human guests plus ten bots, not an arbitrary number of human players.
