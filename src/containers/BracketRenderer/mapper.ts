// We map our current format into desired rendering format

import {
  Group,
  Match,
  RichParticipant,
  Round,
  Stage,
  TournamentBracketDto,
} from "@/containers/BracketRenderer/types";
import { TournamentBracketInfoDto, UserDTO } from "@/api/back";

export const someShit = {
  stage: [
    {
      id: 1,
      tournament_id: 2,
      name: "Example",
      type: "single_elimination",
      settings: {
        grandFinal: "simple",
        consolationFinal: false,
        matchesChildCount: 0,
        size: 4,
        seedOrdering: ["inner_outer"],
      },
      number: 1,
    },
  ],
  group: [
    {
      id: 1,
      stage_id: 1,
      number: 1,
    },
  ],
  round: [
    {
      id: 1,
      number: 1,
      stage_id: 1,
      group_id: 1,
    },
    {
      id: 2,
      number: 2,
      stage_id: 1,
      group_id: 1,
    },
  ],
  participant: [
    {
      id: 1,
      tournament_id: 2,
      players: [
        {
          steamId: "116514945",
          name: "кури бабмук",
          avatar:
            "https://avatars.steamstatic.com/72b86ac794d4c0a8c2522ea2c2a36edb9f89a989_full.jpg",
          roles: [
            {
              role: "OLD",
              endTime: "2026-07-28T18:24:13.000Z",
            },
            {
              role: "ADMIN",
              endTime: "2032-10-02T17:04:20.000Z",
            },
          ],
          connections: [],
          avatarSmall:
            "https://avatars.steamstatic.com/72b86ac794d4c0a8c2522ea2c2a36edb9f89a989_medium.jpg",
        },
      ],
    },
    {
      id: 2,
      tournament_id: 2,
      players: [
        {
          steamId: "57082420",
          name: "Loading",
          avatar: "",
          roles: [],
          connections: [],
          avatarSmall: "",
        },
      ],
    },
    {
      id: 3,
      tournament_id: 2,
      players: [
        {
          steamId: "466056687",
          name: "Loading",
          avatar: "",
          roles: [],
          connections: [],
          avatarSmall: "",
        },
      ],
    },
    {
      id: 4,
      tournament_id: 2,
      players: [
        {
          steamId: "1688941860",
          name: "Loading",
          avatar: "",
          roles: [],
          connections: [],
          avatarSmall: "",
        },
      ],
    },
  ],
  match: [
    {
      id: 1,
      stage_id: 1,
      group_id: 1,
      round_id: 1,
      child_count: 1,
      number: 1,
      status: 2,
      opponent1: {
        id: 3,
        position: 1,
        participant: {
          tournament_id: 2,
          id: 3,
          players: [
            {
              steamId: "466056687",
              name: "Loading",
              avatar: "",
              roles: [],
              connections: [],
              avatarSmall: "",
            },
          ],
        },
      },
      opponent2: {
        id: 4,
        position: 4,
        participant: {
          tournament_id: 2,
          id: 4,
          players: [
            {
              steamId: "1688941860",
              name: "Loading",
              avatar: "",
              roles: [],
              connections: [],
              avatarSmall: "",
            },
          ],
        },
      },
      startDate: "2026-02-27T14:50:49.441Z",
      games: [
        {
          id: "a9cc212b-a919-41cd-99d6-f19d5a691c87",
          bracketMatchId: 1,
          scheduledDate: "2026-02-27T14:50:49.441Z",
          teamOffset: 0,
          number: 1,
          status: 2,
          finished: false,
          opponent1: {
            id: 3,
            position: 1,
            participant: {
              tournament_id: 2,
              id: 3,
            },
          },
          opponent2: {
            id: 4,
            position: 4,
            participant: {
              tournament_id: 2,
              id: 4,
            },
          },
        },
      ],
    },
    {
      id: 3,
      stage_id: 1,
      group_id: 1,
      round_id: 2,
      child_count: 3,
      number: 1,
      status: 0,
      opponent1: {
        id: null,
      },
      opponent2: {
        id: null,
      },
      startDate: "2026-02-27T15:50:49.441Z",
      games: [
        {
          id: "f900b2a6-95cf-4697-9726-924e3e2b6ca7",
          bracketMatchId: 3,
          scheduledDate: "2026-02-27T15:50:49.441Z",
          teamOffset: 0,
          number: 1,
          status: 0,
          finished: false,
          opponent1: {
            id: null,
            participant: {
              tournament_id: 2,
              id: 0,
            },
          },
          opponent2: {
            id: null,
            participant: {
              tournament_id: 2,
              id: 0,
            },
          },
        },
        {
          id: "6ea8bb88-6b48-427e-bfaf-0d293d4363ac",
          bracketMatchId: 3,
          scheduledDate: "2026-02-27T16:50:49.441Z",
          teamOffset: 0,
          number: 2,
          status: 0,
          finished: false,
          opponent1: {
            id: null,
            participant: {
              tournament_id: 2,
              id: 0,
            },
          },
          opponent2: {
            id: null,
            participant: {
              tournament_id: 2,
              id: 0,
            },
          },
        },
        {
          id: "59512b59-56e1-4f76-ae72-fc930a34258e",
          bracketMatchId: 3,
          scheduledDate: "2026-02-27T17:50:49.441Z",
          teamOffset: 0,
          number: 3,
          status: 0,
          finished: false,
          opponent1: {
            id: null,
            participant: {
              tournament_id: 2,
              id: 0,
            },
          },
          opponent2: {
            id: null,
            participant: {
              tournament_id: 2,
              id: 0,
            },
          },
        },
      ],
    },
    {
      id: 2,
      stage_id: 1,
      group_id: 1,
      round_id: 1,
      child_count: 1,
      number: 2,
      status: 2,
      opponent1: {
        id: 1,
        position: 2,
        participant: {
          tournament_id: 2,
          id: 1,
          players: [
            {
              steamId: "116514945",
              name: "кури бабмук",
              avatar:
                "https://avatars.steamstatic.com/72b86ac794d4c0a8c2522ea2c2a36edb9f89a989_full.jpg",
              roles: [
                {
                  role: "OLD",
                  endTime: "2026-07-28T18:24:13.000Z",
                },
                {
                  role: "ADMIN",
                  endTime: "2032-10-02T17:04:20.000Z",
                },
              ],
              connections: [],
              avatarSmall:
                "https://avatars.steamstatic.com/72b86ac794d4c0a8c2522ea2c2a36edb9f89a989_medium.jpg",
            },
          ],
        },
      },
      opponent2: {
        id: 2,
        position: 3,
        participant: {
          tournament_id: 2,
          id: 2,
          players: [
            {
              steamId: "57082420",
              name: "Loading",
              avatar: "",
              roles: [],
              connections: [],
              avatarSmall: "",
            },
          ],
        },
      },
      startDate: "2026-02-27T14:50:49.441Z",
      games: [
        {
          id: "85b751da-f3b0-4229-b822-53ef2a46310f",
          bracketMatchId: 2,
          scheduledDate: "2026-02-27T14:50:49.441Z",
          teamOffset: 0,
          number: 1,
          status: 2,
          finished: false,
          opponent1: {
            id: 1,
            position: 2,
            participant: {
              tournament_id: 2,
              id: 1,
            },
          },
          opponent2: {
            id: 2,
            position: 3,
            participant: {
              tournament_id: 2,
              id: 2,
            },
          },
        },
      ],
    },
  ],
};

export function mapBracket(t: TournamentBracketInfoDto): TournamentBracketDto {
  return {
    participant: t.participant.map((p) => {
      return {
        id: p.id,
        tournament_id: p.tournamentId,
        name: p.name || "Участник",
        players: p.players as UserDTO[],
        image_url: p.avatar,
      } satisfies RichParticipant;
    }),
    group: t.group as unknown as Group[],
    stage: t.stage as unknown as Stage[],
    round: t.round as unknown as Round[],
    match: t.match as unknown as Match[],
    match_game: [],
  };
}
