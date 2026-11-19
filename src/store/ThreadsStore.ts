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
      this.loadEmoticons().catch((e) => console.warn(e));
    }
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
