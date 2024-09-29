import { makeObservable, observable, runInAction } from "mobx";
import { HydratableStore } from "@/store/HydratableStore";
import { useApi } from "@/api/hooks";

interface UserEntry {
  steamId: string;
  avatar: string;
  name: string;
  rank?: number;
  mmr?: number;
  gamesPlayed: number;
  wins: number;
  loss: number;
}

export class UserCacheStore implements HydratableStore<{}> {
  @observable
  public userMap: Map<string, UserEntry | Promise<any>> = new Map();

  constructor() {
    makeObservable(this);
  }

  public tryGetUser(id: string): UserEntry | undefined {
    const v = this.userMap.get(id);

    if (!v) {
      this.requestUser(id);
      return undefined;
    }

    if (v instanceof Promise) {
      return undefined;
    }

    return v;
  }

  public requestUser(id: string) {
    console.trace("User requested");

    const promise = useApi()
      .playerApi.playerControllerPlayerSummary(id)
      .then((user) => {
        runInAction(() => {
          this.userMap.set(id, {
            steamId: user.steamId,
            name: user.name,
            avatar: user.avatar,
            gamesPlayed: user.gamesPlayed,
            wins: user.wins,
            loss: user.loss,
            rank: user.rank,
            mmr: user.mmr,
          });
        });
      })
      .catch();
    this.userMap.set(id, promise);
  }

  hydrate(d: {}): void {}
}
