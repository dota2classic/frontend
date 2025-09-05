import {
  action,
  autorun,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { HydratableStore } from "@/store/HydratableStore";
import { parseJwt } from "@/util/parseJwt";
import BrowserCookies from "browser-cookies";
import { appApi, getApi, JwtPayload } from "@/api/hooks";
import { MeDto, Role } from "@/api/back";
import { metrika } from "@/ym";
import { getBaseCookieDomain, getBaseDomain } from "@/util/getBaseCookieDomain";
import * as Sentry from "@sentry/nextjs";

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
      this.fixCookies();
      this.setTokenFromCookies();
      this.periodicallyFetchMe();
    }
    autorun(() => {
      metrika("userParams", {
        UserID: this.parsedToken?.sub,
      });
      const userId = this.parsedToken?.sub;
      Sentry.setUser(
        userId
          ? {
              id: userId,
            }
          : null,
      );
    });
  }

  private fixCookies() {
    // delete old cookie for dotaclassic.ru(not .dotaclassic.ru)
    // BrowserCookies.erase(AuthStore.cookieTokenKey, {
    //   domain: "dotaclassic.ru",
    // });
  }

  @action
  private setTokenFromCookies = () => {
    if (typeof window !== "undefined") {
      let cookie: string | undefined | null = BrowserCookies.get(
        AuthStore.cookieTokenKey,
      );
      if (cookie) {
        const jwt = parseJwt<JwtPayload>(cookie);
        if (jwt.exp * 1000 < Date.now()) {
          console.warn("Outdated token in cookies! Removing");
          cookie = undefined;
          BrowserCookies.erase(AuthStore.cookieTokenKey, {
            domain: "." + getBaseCookieDomain(),
          });
          BrowserCookies.erase(AuthStore.cookieTokenKey, {
            domain: getBaseDomain(),
          });
        }
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
    console.trace(`Logout called, erasing cookie ${getBaseCookieDomain()}`);
    this.token = undefined;
    appApi.apiParams.accessToken = undefined;

    BrowserCookies.erase(AuthStore.cookieTokenKey, {
      domain: "." + getBaseCookieDomain(),
    });

    BrowserCookies.erase(AuthStore.cookieTokenKey, {
      domain: getBaseDomain(),
    });

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
    if (typeof window !== "undefined") {
      return;
    }
    this.setToken(data.token, false);
  };
}
