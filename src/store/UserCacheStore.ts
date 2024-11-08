import { makeObservable, observable, runInAction } from "mobx";
import { HydratableStore } from "@/store/HydratableStore";
import { getApi } from "@/api/hooks";
import { UserDTO } from "@/api/back";

interface UserEntry {
  user: UserDTO;
  rank?: number;
  mmr?: number;
  gamesPlayed: number;
  wins: number;
  loss: number;
}

export class UserCacheStore implements HydratableStore<unknown> {
  @observable
  public userMap: Map<string, UserEntry | Promise<void>> = new Map();

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
    const promise = getApi()
      .playerApi.playerControllerPlayerSummary(id)
      .then((user) => {
        runInAction(() => {
          this.userMap.set(id, {
            user: user.user,
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

  hydrate(): void {}
}
