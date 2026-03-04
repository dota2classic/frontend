# Project Brief

## Product
**Dota 2 Classic** — community-run matchmaking & esports platform at `dotaclassic.ru`.
This repo is the **Next.js 15 frontend** only. Backend is separate (REST + WebSocket).

## Core Goals
- Provide matchmaking queues for classic Dota 2 game modes
- Handle parties, ready checks, live match tracking
- Support tournaments with bracket management
- Community features: forum, player profiles, leaderboards, blog
- Admin/moderation tooling

## Non-Goals
- This repo does NOT include the backend/game coordinator
- `src/api/back/` is auto-generated — never manually edited

## Key Constraints
- `reactStrictMode: false` — intentional (avoid double-rendering side effects)
- Docker `standalone` output — no custom server
- Multi-language (i18next), locale detected from hostname
- SCSS modules only — no Tailwind, no CSS-in-JS
