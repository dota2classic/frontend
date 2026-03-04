# CLAUDE.md

## Project Overview

Next.js 15 frontend for Dota 2 Classic matchmaking platform (dotaclassic.ru). Uses React 19, TypeScript, SCSS modules, MobX, SWR, and Socket.IO.

## Key Conventions

### Directory Structure
- `src/pages/` — Next.js pages router
- `src/components/` — Reusable UI components
- `src/containers/` — Feature-level containers (smart components with data fetching)
- `src/store/` — MobX stores (global client state)
- `src/api/` — API layer:
  - `src/api/back/` — **GENERATED CODE, DO NOT EDIT** (OpenAPI generated, regenerate with `yarn apigen`)
  - `src/api/hooks.ts` — SWR hooks wrapping generated API
  - `src/api/mapped-models/` — Domain model mappings
- `src/i18n/` — i18n setup
- `src/const/` — Constants

### Component Pattern
- Components go in `src/components/<ComponentName>/` with `<ComponentName>.tsx` and `<ComponentName>.module.scss`
- Containers (smart/data-fetching) go in `src/containers/<ContainerName>/`
- Use `yarn create-component` / `yarn create-container` scripts for scaffolding

### Styling
- SCSS modules (`.module.scss`) per component
- Global styles in `src/styles/` and `src/common.scss`
- Sass is used — no Tailwind, no CSS-in-JS

### State Management
- MobX for global/shared state (`src/store/`)
- SWR for server state / data fetching
- `MobxContext.ts` provides store context

### API Usage
- **Never edit** `src/api/back/` — it's auto-generated
- Regenerate with `yarn apigen` (prod), `yarn apigen:staging`, or `yarn apigen:local`
- Wrap API calls via SWR hooks in `src/api/hooks.ts` or similar

### Env Variables
- `API_URL` — backend REST URL
- `SOCKET_URL` — WebSocket URL
- `IS_DEV_VERSION` — dev flag
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` — push notifications

## Dev Commands

```bash
yarn dev          # against prod API (api.dotaclassic.ru)
yarn dev:local    # against local backend
yarn dev:staging  # against staging
yarn build        # production build
yarn lint         # ESLint with auto-fix
yarn apigen       # regenerate src/api/back/ from prod OpenAPI spec
yarn knip         # dead code analysis
yarn analyze      # bundle analyzer
```

## Tech Stack

- **Next.js 15** (pages router, standalone output)
- **React 19**
- **TypeScript**
- **SCSS Modules** (sass)
- **MobX 6** + mobx-react-lite
- **SWR 2** for data fetching
- **Socket.IO client** for real-time
- **i18next** + react-i18next for translations
- **Playwright** for E2E tests
- **Lexical** for rich text editing

## Important Notes

- `reactStrictMode: false` — intentional
- Output is `standalone` for Docker deployment
- Do NOT scan or edit `src/api/back/` — generated code
- i18n translation keys are typed via `TranslationKey.d.ts`