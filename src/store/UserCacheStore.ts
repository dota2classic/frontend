import { action, makeObservable, observable, runInAction } from "mobx";
import { HydratableStore } from "@/store/HydratableStore";
import { getApi } from "@/api/hooks";
import { UserDTO } from "@/api/back";

interface UserEntry {
  user: UserDTO;
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
      .playerApi.playerControllerUser(id)
      .then((user) => {
        runInAction(() => {
          this.userMap[id].entry = {
            user: user,
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
