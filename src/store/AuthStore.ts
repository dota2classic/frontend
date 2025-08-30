import {
  action,
  autorun,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { HydratableStore } from "@/store/HydratableStore";
import { parseJwt } from "@/util";
import BrowserCookies from "browser-cookies";
import { appApi, getApi } from "@/api/hooks";
import { MeDto, Role } from "@/api/back";
import { metrika } from "@/ym";
import { getBaseCookieDomain } from "@/util/getBaseCookieDomain";

export interface JwtAuthToken {
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
    return (
      this.parsedToken?.roles.includes(Role.MODERATOR) || this.isAdmin || false
    );
  }

  @computed
  public get isOld(): boolean {
    return this.parsedToken?.roles.includes(Role.OLD) || false;
  }

  @computed
  public get hasReports(): boolean {
    return (this.me?.reportsAvailable || 0) > 0;
  }

  constructor() {
    makeObservable(this);

    if (typeof window !== "undefined") {
      this.setTokenFromCookies();
      this.periodicallyFetchMe();
    }
    autorun(() => {
      metrika("userParams", {
        UserID: this.parsedToken?.sub,
      });
      console.log(`Set user id to ${this.parsedToken?.sub}`);
    });
  }

  @action
  private setTokenFromCookies = () => {
    if (typeof window !== "undefined") {
      const cookie = BrowserCookies.get(AuthStore.cookieTokenKey);
      if (cookie) {
        this.setToken(cookie, false);
      }
    }
  };

  private periodicallyFetchMe() {
    this.fetchMe().finally();
    setInterval(() => {
      this.fetchMe().finally();
    }, 5000);
  }

  @action
  public fetchMe = async () => {
    if (!this.parsedToken) return;
    appApi.playerApi
      .playerControllerMe()
      .then((data) =>
        runInAction(() => {
          this.me = data;
          if (this.parsedToken?.roles.length !== data.user.roles.length) {
            this.forceRefreshToken();
          }
        }),
      )
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
  public setToken = (token: string | undefined, fetchMe: boolean = true) => {
    this.token = token;
    appApi.apiParams.accessToken = token;

    if (fetchMe) {
      this.fetchMe();
    }
  };

  @action
  public logout = () => {
    console.trace("Logout called");
    this.token = undefined;
    appApi.apiParams.accessToken = undefined;
    BrowserCookies.set(AuthStore.cookieTokenKey, "", {
      domain: getBaseCookieDomain(),
      path: "/",
    });
    BrowserCookies.set(AuthStore.cookieTokenKey, "");
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  public async forceRefreshToken() {
    if (!this.token) return;
    return getApi().refreshToken().then(this.setTokenFromCookies);
  }

  hydrate = (data?: { token?: string }) => {
    if (!data) return;
    this.setToken(data.token, false);
  };
}
