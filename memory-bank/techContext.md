# Tech Context

## Stack
| Layer | Tech | Version |
|-------|------|---------|
| Framework | Next.js | 15 |
| UI | React | 19 |
| Language | TypeScript | 5.7 |
| State | MobX + mobx-react-lite | 6 |
| Server data | SWR | 2 |
| Real-time | Socket.IO client | 4.8 |
| Styling | SCSS Modules (Sass) | 1.85 |
| Rich text | Lexical | 0.24 |
| i18n | i18next + react-i18next | 25 |
| Monitoring | Grafana Faro Web SDK | — |
| Testing | Playwright | — |
| API gen | OpenAPI Generator (TS Fetch SWR) | — |

## Dev Commands
```bash
yarn dev           # prod API (api.dotaclassic.ru)
yarn dev:local     # local backend (localhost:6001)
yarn dev:staging   # staging
yarn build         # production build
yarn lint          # ESLint with auto-fix
yarn apigen        # regenerate src/api/back/ from prod OpenAPI spec
yarn apigen:staging
yarn apigen:local
yarn knip          # dead code analysis
yarn analyze       # bundle analyzer
yarn create-component   # scaffold new component
yarn create-container   # scaffold new container
```

## Environment Variables
| Var | Purpose |
|-----|---------|
| `API_URL` | Backend REST URL |
| `SOCKET_URL` | WebSocket URL for game coordinator |
| `IS_DEV_VERSION` | Dev flag |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Push notifications |
| `NEXT_PUBLIC_APP_VERSION` | App version for Faro |

## Deployment
- Docker, `standalone` Next.js output
- `yarn start:standalone` to run built output

## Notable Config
- `reactStrictMode: false` — intentional
- Webpack 5 bundler
- Faro endpoint: `https://logsink.dotaclassic.ru/collect` (TODO: move to env var)
