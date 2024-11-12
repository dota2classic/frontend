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
import { appApi } from "@/api/hooks";
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

  @computed
  public get isModerator(): boolean {
    return this.parsedToken?.roles.includes(Role.MODERATOR) || false;
  }

  constructor() {
    makeObservable(this);

    if (typeof window !== "undefined") {
      // Get cookies from browser cookies
      const cookie = BrowserCookies.get(AuthStore.cookieTokenKey);
      if (cookie) {
        this.setToken(cookie);
      }
      this.periodicallyFetchMe();
    }
  }

  private periodicallyFetchMe() {
    this.fetchMe().finally();
    setInterval(() => {
      this.fetchMe().finally();
    }, 5000);
  }

  @action
  public makeDefaultUser = () => {
    this.token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTY1MTQ5NDUiLCJyb2xlcyI6W10sIm5hbWUiOiJQc3ljaG9sb2d5IFByb2Zlc3NvciIsImF2YXRhciI6Imh0dHBzOi8vYXZhdGFycy5zdGVhbXN0YXRpYy5jb20vNzJiODZhYzc5NGQ0YzBhOGMyNTIyZWEyYzJhMzZlZGI5Zjg5YTk4OV9mdWxsLmpwZyIsImlhdCI6MTczMDI5MTA5OCwiZXhwIjoxNzM4OTMxMDk4fQ.KZp6Si-ItozPMRWAArEJxCoOr13PXPz-VWc8KKdnhlw`;
    appApi.apiParams.accessToken = this.token;
  };

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

  @computed
  public get smallAvatar(): string | undefined {
    const av = this.parsedToken?.avatar;
    if (!av) return undefined;
    return av.replace("_full", "_medium");
  }

  @action
  public setToken = (token: string | undefined) => {
    this.token = token;
    appApi.apiParams.accessToken = token;
  };

  @action
  public logout = () => {
    this.token = undefined;
    appApi.apiParams.accessToken = undefined;
    localStorage.removeItem("AuthStore.cookieTokenKey");
    BrowserCookies.erase(AuthStore.cookieTokenKey);
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  hydrate = (data?: { token?: string }) => {
    if (!data) return;
    this.setToken(data.token);
  };
}
