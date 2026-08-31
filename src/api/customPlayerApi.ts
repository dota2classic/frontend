import { PlayerApi } from "@/api/back";
import { UserDTOFromJSON } from "@/api/back/models/UserDTO";

// Manual extension for the leaderboard's sort/sort_dir params and the
// winrate/kda response fields — none of it is in the generated client yet
// (dota2classic/gameserver#12 / public-api-gateway#49 not deployed, so
// apigen hasn't regenerated against them). Two gaps to work around here,
// not just one: playerControllerLeaderboard takes fixed positional args
// (no room to add sort params), and LeaderboardEntryDtoFromJSON explicitly
// allowlists known fields — it would silently drop winrate/kda even if the
// backend already sends them. So this bypasses both the method and its
// deserializer rather than just casting. Drop this file once apigen picks
// up the new backend shape.
export type LeaderboardSort =
  | "mmr"
  | "games"
  | "wins"
  | "winrate"
  | "kda"
  | "playtime"
  | "abandons";

interface RawLeaderboardEntry {
  user: unknown;
  id: number;
  mmr: number;
  rank: number;
  games: number;
  wins: number;
  abandons: number;
  kills: number;
  deaths: number;
  assists: number;
  play_time: number;
  winrate?: number;
  kda?: number;
}

export class PlayerLeaderboardApi extends PlayerApi {
  leaderboardSorted = async (
    page: number,
    perPage: number | undefined,
    seasonId: number | undefined,
    sort: LeaderboardSort | undefined,
    sortDir: "ASC" | "DESC" | undefined,
  ) => {
    const query: Record<string, string | number> = { page };
    if (perPage !== undefined) query["per_page"] = perPage;
    if (seasonId !== undefined) query["season_id"] = seasonId;
    if (sort !== undefined) query["sort"] = sort;
    if (sortDir !== undefined) query["sort_dir"] = sortDir;

    const response = await this.request({
      path: "/v1/player/leaderboard",
      method: "GET",
      headers: {},
      query,
    });
    const json = await response.json();

    return {
      data: (json.data as RawLeaderboardEntry[]).map((it) => ({
        user: UserDTOFromJSON(it.user),
        id: it.id,
        mmr: it.mmr,
        rank: it.rank,
        games: it.games,
        wins: it.wins,
        abandons: it.abandons,
        kills: it.kills,
        deaths: it.deaths,
        assists: it.assists,
        playTime: it.play_time,
        // Not in the generated LeaderboardEntryDto type yet — real values
        // on the response body once dota2classic/gameserver#12 deploys,
        // just untyped on our side until then. Computed fallback covers
        // the gap so this doesn't render "NaN%" against the current prod
        // API in the meantime; drop the fallback once that PR is live.
        winrate:
          typeof it.winrate === "number"
            ? it.winrate
            : it.games > 0
              ? it.wins / it.games
              : 0,
        kda:
          typeof it.kda === "number"
            ? it.kda
            : (it.kills + it.assists) / Math.max(it.deaths, 1),
      })),
      page: json.page as number,
      perPage: json.perPage as number,
      pages: json.pages as number,
    };
  };
}
