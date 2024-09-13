import { action, computed, makeObservable, observable } from "mobx";
import { HydratableStore } from "@/store/HydratableStore";
import { parseJwt } from "@/util/math";
import BrowserCookies from "browser-cookies";

interface JwtAuthToken {
  sub: string;
  roles: string[];
  name: string;
  avatar: string;
}
export class AuthStore implements HydratableStore<{ token?: string }> {
  public static cookieTokenKey: string = "dota2classic_auth_token";

  @observable
  public token: string | undefined = undefined;

  constructor() {
    makeObservable(this);

    console.log(typeof window);
    if (typeof window !== "undefined") {
      // Get cookies from browser cookies
      const cookie = BrowserCookies.get(AuthStore.cookieTokenKey);
      console.log(BrowserCookies.all());
      if (cookie) {
        this.setToken(cookie);
      }
    }
  }

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

  hydrate = (data) => {
    if (!data) return;
    this.setToken(data.token);
  };
}
