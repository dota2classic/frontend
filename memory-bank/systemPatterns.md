# System Patterns

## Directory Layout
```
src/pages/        — Next.js pages router (33+ pages)
src/containers/   — Smart components with data fetching (47+)
src/components/   — Reusable UI components (114+)
src/store/        — MobX global stores
src/api/          — API layer (hooks.ts + generated back/)
src/util/         — Utility functions
src/const/        — Constants (hero names, game modes, items)
src/i18n/         — i18next setup
src/styles/       — Global SCSS
src/route.ts      — Typed AppRouter helper
```

## State Management
- **MobX 6** for global/shared state — wrap components with `observer()` from mobx-react-lite
- `useStore()` hook → accesses RootStore (via MobxContext)
- **SWR 2** for server data — hooks in `src/api/hooks.ts`
- All stores implement `HydratableStore<T>` for SSR hydration

## RootStore Substores
| Store | File | Role |
|-------|------|------|
| AuthStore | `store/AuthStore.ts` | JWT, user `me`, roles |
| QueueStore | `store/queue/QueueStore.tsx` | Party, queue, socket.io (670 lines) |
| NotificationStore | `store/NotificationStore.ts` | Toasts, push notifications |
| UserCacheStore | `store/UserCacheStore.ts` | Player profile cache |
| ThreadStore | `store/ThreadStore.ts` | Forum messaging |
| ThreadsStore | `store/ThreadsStore.ts` | Thread metadata/emoticons |
| LiveStore | `store/LiveStore.ts` | Live match state |
| GreedyFocusStore | `store/GreedyFocusStore.ts` | Modal/focus management |
| ImageStore | `store/ImageStore.ts` | Image caching |
| ReportStore | `store/ReportStore.ts` | Player reports |
| ClaimItemStore | `store/ClaimItemStore.ts` | Drop/reward claims |
| SubStore | `store/SubStore.ts` | Subscription/payment |

## API Layer
- `src/api/back/` — **GENERATED**, never edit. Regenerate: `yarn apigen`
- `src/api/hooks.ts` — `AppApi` class wrapping generated APIs; handles token refresh (on every call checks JWT exp) and auto-logout on 401
- Pattern: `await getApi().playerApi.playerControllerMe()`
- SWR hooks wrap AppApi for data fetching with caching

## Real-Time (Socket.IO)
- Managed in `QueueStore`
- Typed message objects: `C2S` (client→server), `S2C` (server→client)
- Events: party invites, queue state, ready checks, match found, server searching

## Component Pattern
- Component: `src/components/<Name>/<Name>.tsx` + `<Name>.module.scss`
- Container: `src/containers/<Name>/`
- Scaffold with `yarn create-component` / `yarn create-container`
- Use `observer()` on any component reading MobX store
- Use `getInitialProps` for SSR data; avoid `getServerSideProps`

## Routing
- `src/route.ts` — typed `AppRouter` object for all routes
- e.g. `AppRouter.queue`, `AppRouter.admin.tournaments`

## Error Monitoring
- Grafana Faro SDK in `src/util/faro.ts`
- `logError(err, context)` for manual error reporting
- `faro.api.setUser({ id, username })` to enrich events with user identity
- `faro.api.resetUser()` on logout
