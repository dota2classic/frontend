import { getApi } from "@/api/hooks";
import { LiveMatchDto, TwitchStreamDto } from "@/api/back";
import { makeObservable, observable, runInAction } from "mobx";
import { HydratableStore } from "@/store/HydratableStore";

export class LiveStore implements HydratableStore<unknown> {
  @observable
  public liveMatches: LiveMatchDto[] = [];
  @observable
  public streams: TwitchStreamDto[] = [];

  constructor() {
    makeObservable(this);
    if (typeof window !== "undefined") {
      this.periodicallyFetchLiveData();
    }
  }

  private periodicallyFetchLiveData() {
    this.updateLiveData().finally();
    setInterval(() => {
      this.updateLiveData().finally();
    }, 5000);
  }

  async updateLiveData() {
    const [liveMatches, streams] = await Promise.combine([
      getApi().liveApi.liveMatchControllerListMatches(),
      getApi().statsApi.statsControllerGetTwitchStreams(),
    ]);

    runInAction(() => {
      this.liveMatches = liveMatches;
      this.streams = streams;
    });
  }

  hydrate(): void {}
}
