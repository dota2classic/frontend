import { action, makeObservable, observable, runInAction } from "mobx";
import { HydratableStore } from "@/store/HydratableStore";
import { getApi } from "@/api/hooks";
import { UserDTO } from "@/api/back";

interface UserEntry {
  user: UserDTO;
  // rank?: number;
  // mmr?: number;
  // gamesPlayed: number;
  // wins: number;
  // loss: number;
}

interface UserHolder {
  entry?: UserEntry;
  resolver?: Promise<unknown>;
}

export class UserCacheStore implements HydratableStore<unknown> {
  @observable
  // public userMap: Map<string, UserEntry | Promise<void>> = new Map();
  public userMap: Record<string, UserHolder> = {};

  constructor() {
    makeObservable(this);
  }

  public tryGetUser(id: string): UserHolder {
    // Validate
    if (!id || Number.isNaN(Number(id)))
      return { resolver: undefined, entry: undefined };

    let v = this.userMap[id];
    if (!v) {
      this.userMap[id] = { entry: undefined, resolver: undefined };
      v = this.userMap[id];
    }

    if (!v.entry && !v.resolver) {
      this.requestUser(id);
    }

    return v;
  }

  public requestUser(id: string) {
    this.userMap[id].resolver = getApi()
      .playerApi.playerControllerPlayerSummary(id)
      .then((user) => {
        console.log("User loaded, resoving into entry");
        runInAction(() => {
          this.userMap[id].entry = {
            user: user.user,
            // gamesPlayed: user.gamesPlayed,
            // wins: user.wins,
            // loss: user.loss,
            // rank: user.rank,
            // mmr: user.mmr,
          };
          this.userMap[id].resolver = undefined;
        });
      })
      .catch();
  }

  hydrate(): void {}

  @action populate(users: UserDTO[]) {
    users.forEach((user) => {
      this.userMap[user.steamId] = {
        resolver: undefined,
        entry: {
          user,
        },
      };
    });
  }
}
