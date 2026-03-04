# Active Context

## Current Focus (2026-03-04)
- Grafana Faro observability recently integrated
- Next step: enrich Faro events with user ID via `faro.api.setUser()` after auth

## Recent Decisions
- Faro URL is currently hardcoded in `src/util/faro.ts` — should be moved to env var
- `faro.api.setUser({ id, username })` should be called when `AuthStore.me` becomes available
- `faro.api.resetUser()` should be called on logout

## Pending / Next Steps
- Wire Faro user enrichment to AuthStore (call setUser after login/hydration)
- Move Faro URL to `NEXT_PUBLIC_FARO_URL` env var
