import { getApi } from "@/api/hooks";
import { LiveMatchDto, TwitchStreamDto } from "@/api/back";
import { makeObservable, observable, runInAction } from "mobx";
import { HydratableStore } from "@/store/HydratableStore";
import { visiblePoll } from "@/util/visible-poll";
import { PollInterval } from "@/const/poll-interval";

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
    visiblePoll(() => this.updateLiveData(), PollInterval.LIVE);
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

  getLiveStream(steamId: string): TwitchStreamDto | undefined {
    return this.streams.find((t) => t.user.steamId === steamId);
  }
}
