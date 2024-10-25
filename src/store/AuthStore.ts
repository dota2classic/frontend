import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { HydratableStore } from "@/store/HydratableStore";
import { parseJwt } from "@/util/math";
import BrowserCookies from "browser-cookies";
import { apiInner, appApi } from "@/api/hooks";
import { MeDto, Role } from "@/api/back";

interface JwtAuthToken {
  sub: string;
  roles: Role[];
  name: string;
  avatar: string;
}
export class AuthStore implements HydratableStore<{ token?: string }> {
  public static cookieTokenKey: string = "dota2classic_auth_token";

  @observable
  public token: string | undefined = undefined;

  @observable
  public me: MeDto | undefined = undefined;

  @computed
  public get isAdmin(): boolean {
    return this.parsedToken?.roles.includes(Role.ADMIN) || false;
  }

  constructor() {
    makeObservable(this);

    if (typeof window !== "undefined") {
      // Get cookies from browser cookies
      const cookie = BrowserCookies.get(AuthStore.cookieTokenKey);
      if (cookie) {
        this.setToken(cookie);
      }
      this.fetchMe().finally();
    }
  }

  @action
  public fetchMe = async () => {
    appApi.playerApi
      .playerControllerMe()
      .then((data) => runInAction(() => (this.me = data)))
      .catch(() => (this.me = undefined));
  };

  @computed
  public get isAuthorized(): boolean {
    return !!this.token;
  }

  @computed
  public get parsedToken(): JwtAuthToken | undefined {
    if (!this.token) return undefined;
    return parseJwt<JwtAuthToken>(this.token);
  }

  @action
  public setToken = (token: string | undefined) => {
    this.token = token;
    appApi.apiParams.accessToken = token;
    apiInner.setHeader(`Authorization`, `Bearer ${token}`);
  };

  @action
  public logout() {
    this.token = undefined;
    // apiInner.deleteHeader(`Authorization`);
    // appApi.apiParams.accessToken = undefined;
    // localStorage.removeItem("token");
    BrowserCookies.erase(AuthStore.cookieTokenKey);
    // cookies.erase(AuthServiceService.cookieTokenKey);
  }

  hydrate = (data?: { token?: string }) => {
    if (!data) return;
    this.setToken(data.token);
  };
}
