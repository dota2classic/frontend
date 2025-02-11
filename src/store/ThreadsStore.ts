import { makeObservable, observable, runInAction } from "mobx";
import { EmoticonDto } from "@/api/back";
import { HydratableStore } from "@/store/HydratableStore";
import { getApi } from "@/api/hooks";
import { AuthStore } from "@/store/AuthStore";

interface HydrateData {
  emoticons: EmoticonDto[];
}
export class ThreadsStore implements HydratableStore<HydrateData> {
  @observable
  emoticons: EmoticonDto[] = [];

  constructor(private readonly auth: AuthStore) {
    makeObservable(this);
    if (typeof window !== "undefined") {
      this.fetchEmoticons();
    }
  }

  private async fetchEmoticons() {
    await this.loadEmoticons();
    setInterval(() => {
      this.loadEmoticons();
    }, 10_000);
  }
  public async loadEmoticons() {
    if (this.emoticons.length === 0) {
      const emoticons = await getApi().forumApi.forumControllerEmoticons(
        this.auth.parsedToken?.sub,
      );
      runInAction(() => {
        this.emoticons = emoticons;
      });
    }
  }

  hydrate({ emoticons }: HydrateData) {
    runInAction(() => {
      this.emoticons = emoticons;
    });
  }
}
