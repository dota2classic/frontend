# Product Context

## What It Is
A matchmaking portal for players of Dota 2 Classic. Users sign in, join queues, get matched into games, and participate in tournaments and community discussion.

## Key User Flows
1. **Matchmaking** — join/create party → select game mode → enter queue → ready check → game found
2. **Tournaments** — register → bracket view → match results
3. **Profiles** — view own/other player stats, hero performance, match history
4. **Forum** — threaded discussions with rich text, mentions, reactions
5. **Admin** — manage bans, create tournaments, handle feedback, moderation

## Game Modes / Access Tiers
Defined in `src/const/game-mode-access-level.ts`:
- `NOTHING` — no access
- `EDUCATION` — new player modes
- `SIMPLE_MODES` — casual
- `HUMAN_GAMES` — ranked/competitive

## UX Objectives
- Real-time feedback: socket events for party invites, queue state, match found
- Audio cues for key events (match found, ready check, party invite)
- Non-blocking toasts for notifications
- Responsive admin tools for moderation
