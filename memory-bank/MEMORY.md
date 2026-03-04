# Memory Bank — d2c-new (dotaclassic.ru frontend)

## Memory Bank Files
- [projectbrief.md](projectbrief.md) — What the project is and its constraints
- [productContext.md](productContext.md) — User flows, game modes, UX objectives
- [systemPatterns.md](systemPatterns.md) — Architecture, stores, component/API patterns
- [techContext.md](techContext.md) — Tech stack, dev commands, env vars
- [progress.md](progress.md) — What works, recent work, known issues/TODOs
- [activeContext.md](activeContext.md) — Current focus and next steps

## Quick Reference
- Project: Next.js 15 frontend for Dota 2 Classic matchmaking platform
- Stack: React 19, TypeScript, MobX 6, SWR 2, Socket.IO, SCSS Modules
- Key complexity: `src/store/queue/QueueStore.tsx` (matchmaking + socket.io)
- Generated code: `src/api/back/` — never edit, regenerate with `yarn apigen`
- Scaffolding: `yarn create-component` / `yarn create-container`
- Monitoring: Grafana Faro (`src/util/faro.ts`)
- Routing: `AppRouter` in `src/route.ts`
