import { PartyDto } from "@/api/back";
import {
  GameModeAccessLevel,
  getGameModeAccessLevelForMap,
} from "@/const/game-mode-access-level";

export const getPartyAccessLevel = (party: PartyDto): GameModeAccessLevel => {
  let min: GameModeAccessLevel = GameModeAccessLevel.HUMAN_GAMES;
  for (const { summary } of party.players) {
    const al = getGameModeAccessLevelForMap(summary.accessMap);
    if (al < min) {
      min = al;
    }
  }

  return min;
};

export const isPartyInGame = (party: PartyDto) =>
  party.players.findIndex((t) => !!t.session) !== -1;

export const isPartyInLobby = (party: PartyDto) =>
  party.players.findIndex((t) => !!t.lobbyId) !== -1;
