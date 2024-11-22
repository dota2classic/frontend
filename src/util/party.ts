import { PartyDto } from "@/api/back";

export const isNewbieParty = (party: PartyDto) =>
  party.players.findIndex((t) => !t.summary.playedAnyGame) !== -1;
