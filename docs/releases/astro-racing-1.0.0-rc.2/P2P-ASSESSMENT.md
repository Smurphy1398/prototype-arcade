# Astro Racing: bounded browser-host P2P assessment

14 September 2026. Assessment only; no networking conversion or service provisioned. Render connection request is paused at Simon's instruction. The prepared Node/WebSocket implementation remains unchanged. Public friend races are unavailable until a transport is deployed and verified.

**Recommendation:** retain the prepared authoritative server as the shortest route to reliable friend testing. First reduce snapshot bandwidth in a separate networking change. A browser host is feasible for casual two-player rooms, but it adds signaling, relay, and host-lifecycle work. Prefer a foreground desktop host for an initial P2P prototype; do not promise uninterrupted races hosted by a phone.

## Reuse and necessary changes

The existing `RaceSimulation`, bot drivers, items, track mechanics and physics already run in both Node and the browser. Reuse those. `Game` currently either steps a local solo simulation or consumes authoritative snapshots. `RoomClient` directly owns a WebSocket. The Node room manager owns room codes, seats, ready/start/rematch, input sequence checks, timeouts and the simulation clock.

1. Extract transport-independent room/session authority from `server/room-server.ts`. Retain the Node adapter and add a browser-host adapter using browser crypto and timers. The host runs the full twelve-racer simulation, with local input and one remote input stream; consider a Worker to separate simulation from rendering.
2. Give `RoomClient` a transport interface and add `RTCPeerConnection`/`RTCDataChannel`. Keep reliable ordered delivery for lobby changes, start/rematch and acknowledged item/trick commands. Send replaceable, sequenced snapshots and steering on a separate low-latency channel with bounded retransmission. Handle dropped delta bases with keyframes, backpressure, late packets and ICE restart. Existing input/event deduplication can be adapted; it is not sufficient unchanged.
3. Add hosted HTTPS/WSS signaling for room-code lookup, SDP offer/answer, ICE candidates, host role, expiration and reconnect. A static GitHub Pages site cannot perform this coordination. Add STUN for discovery and TURN for networks where direct peer connectivity fails. STUN alone cannot guarantee phone/cellular/friend connectivity. [WebRTC peer connection guide](https://webrtc.org/getting-started/peer-connections)
4. Issue short-lived TURN credentials from a protected server endpoint; never ship a permanent TURN API key in Pages assets. Add rate limits, room/seat authentication, protocol/content matching, disconnect UI and usage limits. Re-test two real devices on different networks, forced relay, latency/loss, rematch, sleep/lock and reconnect. A peer host is trusted for casual play, not an authority for a later competitive leaderboard.

## Free services and approval boundary

A Cloudflare Worker plus a hibernating SQLite-backed Durable Object is a suitable *candidate* for lightweight signaling, not a drop-in host for the Node simulation. Workers Free supports those Objects, with 100,000 Object requests/day and 13,000 GB-seconds/day; free-limit exhaustion fails operations. WebSocket message accounting and Workers limits also apply. Avoid a continuously ticking room Object for this design. [Durable Objects pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/)

Cloudflare Realtime currently advertises 1,000 GB of free egress shared across SFU and TURN, then **$0.05/GB**. TURN egress includes protocol overhead; direct traffic does not pass through the relay. This is a metered service with a free allowance, not a guarantee of no bill. [Realtime pricing](https://developers.cloudflare.com/realtime/sfu/pricing/), [TURN FAQ](https://developers.cloudflare.com/realtime/turn/faq/)

No account was connected and no billing authorized. A future P2P implementation needs a Cloudflare account connection with permission to deploy the signaling Worker/Object and manage TURN credentials. Any required payment-method enrollment or paid/overage exposure must be presented for approval first. Quota monitoring and an application cutoff should precede a wider test; an application cutoff is not a provider billing cap. Free service availability and throttling must be tested, not inferred from advertised quotas.

## What 3.3 GB/hour means

The prior [60-second production-mode local measurement](../astro-racing-1.0.0-rc.1/server-check.json) recorded **917,862 outbound bytes/second across two clients**: about **3.30 decimal GB/hour per active two-human room** at that measured load. It is JSON simulation state, not video or a download of course textures. The server sends full twelve-racer state 20 times/second, repeating garage/livery data, progress, item/mechanic collections and the last 96 events. The actual rate varies with state and race activity; this was not a hosted capacity test.

With an otherwise unchanged two-player browser-host design, the host does not need its own state sent back over the network. **Inference:** one remote recipient would be roughly 1.65 GB/hour plus input and transport overhead under similar load. P2P moves that upload to the host's connection; it does not remove it. Relay-selected traffic still consumes TURN allowance. Two TURN allocations or overhead can increase metered traffic, so measure actual relay usage rather than assuming the estimate is the bill.

Optimize the shared protocol before choosing a permanent hosting plan: send immutable setup once, encode compact/quantized state, remove repeated historical events with acknowledgments, and use deltas plus periodic full keyframes. Preserve item/trick delivery and recovery state. Measure byte rate and latency with the existing two-client harness; no unmeasured reduction percentage is promised.

## Host disconnects

The existing Node server keeps simulating when a player disconnects, substitutes a bot, allows a short reconnect and can transfer the *lobby* host role. A browser-host design loses simulation authority when that browser closes, locks, backgrounds or stalls. Start with an explicit connection-lost screen and recreate the room after host loss. A brief connection grace period is possible while the host is still alive.

Seamless host migration is separate work: current render snapshots omit internal physics/bot timers, item requests, random-generator state and other authority state. Transferring a complete deterministic checkpoint, electing one host and preventing split-brain races is substantially more than promoting the other seat. A Worker does not guarantee continued execution after the browser or OS suspends the page.
