# Progress

## What's Working
- Matchmaking queue system (parties, ready checks, game coordinator via socket.io)
- Tournament bracket creation and visualization
- Player profiles, match history, leaderboards
- Forum with rich text (Lexical), mentions, reactions
- Admin panel (bans, moderation, tournament management, feedback)
- Drop/reward system
- Subscription/paid features
- Push notifications + service worker
- Grafana Faro error monitoring
- Multi-language support

## Recent Work (as of 2026-03-04)
- Fixed service worker registration
- Integrated Grafana Faro observability
- Removed abandon button from 5x5 games
- Drop item system
- Ban stage flags in lobby
- Tournament bracket regeneration fixes
- Recalibration fixes
- Game reset button

## Known Issues / TODOs
- `src/util/faro.ts`: Faro URL hardcoded — should be `process.env`
- `src/components/GenericTable/GenericTable.tsx`: typed `any` — TODO refactor to proper types
- `src/brackets-viewer/main.ts`: `update()` function incomplete (win/loss/forfeit scoreboard)
- `src/containers/TournamentRegisterModal`: FIXME — needs to be extractable
- `src/store/queue/QueueStore.tsx`: i18next import noted as potentially bad
- Faro user enrichment: `faro.api.setUser()` should be called after auth — not yet wired up

## Architecture Debt
- `QueueStore` is 670 lines — could be split further
- Some SWR hooks may not handle all error states
