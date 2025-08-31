import {
  AdminApi,
  AdminFeedbackApi,
  AuthApi,
  BlogApi,
  CustomizationApi,
  DropsApi,
  FeedbackApi,
  ForumApi,
  LiveApi,
  LobbyApi,
  MatchApi,
  MetaApi,
  NotificationApi,
  PlayerApi,
  RecordApi,
  ReportApi,
  RulesApi,
  SettingsApi,
  StatsApi,
  StorageApi,
  UserPaymentApi,
} from "./back/apis";
import {
  Configuration,
  ConfigurationParameters,
  FetchParams,
  RequestContext,
  Role,
} from "./back";
import { getCache } from "@/api/api-cache";
import BrowserCookies from "browser-cookies";
import { __unsafeGetClientStore } from "@/store";
import { parseJwt } from "@/util";
import { getBaseCookieDomain, getBaseDomain } from "@/util/getBaseCookieDomain";
import { AuthStore } from "@/store/AuthStore";

// const PROD_URL = "http://localhost:6001";
// const PROD_URL = "https://dotaclassic.ru/api";
const PROD_URL = (process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL) as string;

interface JwtPayload {
  sub: string;
  roles: Role[];
  name: string | undefined;
  avatar: string | undefined;
  version?: "1";

  exp: number;
  iat: number;
}

export class AppApi {
  cache = getCache();

  apiParams: ConfigurationParameters = {
    basePath: `${PROD_URL}`,
    accessToken:
      typeof window !== "undefined"
        ? BrowserCookies.get("dota2classic_auth_token") || undefined
        : undefined,
    middleware: [
      {
        pre: async (context: RequestContext): Promise<FetchParams | void> => {
          if (typeof window === "undefined") return;

          if (context.url.includes("refresh_token")) {
            // Do nothing
            return;
          }

          const h = context.init.headers as Record<string, string>;
          const auth = h["Authorization"];
          if (auth) {
            const token = auth.replace("Bearer ", "");
            await this.requestRefreshToken(token);
          }
        },
      },
    ],
    fetchApi: async (
      input: RequestInfo | URL,
      init?: RequestInit,
    ): Promise<Response> => {
      return fetch(input, init).then((t) => {
        if (typeof window === "undefined") return t;
        const auth = __unsafeGetClientStore().auth;
        if (t.status === 401 && auth.isAuthorized) {
          auth.logout();
        }
        return t;
      });
    },
  };

  requestRefreshToken = (token: string) => {
    const jwt = parseJwt<JwtPayload>(token);

    if (jwt.exp < Date.now()) {
      // Already expired long time ago
      if (typeof window !== "undefined") {
        BrowserCookies.erase(AuthStore.cookieTokenKey, {
          domain: "." + getBaseCookieDomain(),
        });

        BrowserCookies.erase(AuthStore.cookieTokenKey, {
          domain: getBaseDomain(),
        });

        window.location.reload();
        return
      }
    }

    const isExpiringSoon = jwt.exp * 1000 - new Date().getTime() <= 1000 * 60; // Less than a

    const isTokenStale = new Date().getTime() - jwt.iat * 1000 >= 1000 * 60 * 5; // 5 minutes is stale enough

    const shouldRevalidateToken = isExpiringSoon || isTokenStale;

    if (jwt.version === undefined || shouldRevalidateToken) {
      // We should refresh token
      console.log(
        `Need refresh token because: ${jwt.version === undefined} or ${isExpiringSoon} | ${isTokenStale}`,
      );

      return this.refreshToken();
    }
  };

  refreshToken = async () => {
    const newToken = await this.authApi.steamControllerRefreshToken();
    BrowserCookies.set("dota2classic_auth_token", newToken, {
      expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30),
      path: "/",
      domain: getBaseCookieDomain(),
    });
    this.apiParams.accessToken = newToken;
  };

  private readonly apiConfig = new Configuration(this.apiParams);

  readonly authApi = new AuthApi(this.apiConfig);
  readonly settings = new SettingsApi(this.apiConfig);
  readonly matchApi = new MatchApi(this.apiConfig);
  readonly liveApi = new LiveApi(this.apiConfig);
  readonly forumApi = new ForumApi(this.apiConfig);
  readonly playerApi = new PlayerApi(this.apiConfig);
  readonly adminApi = new AdminApi(this.apiConfig);
  readonly statsApi = new StatsApi(this.apiConfig);
  readonly metaApi = new MetaApi(this.apiConfig);
  readonly lobby = new LobbyApi(this.apiConfig);
  readonly feedback = new FeedbackApi(this.apiConfig);
  readonly adminFeedback = new AdminFeedbackApi(this.apiConfig);
  readonly notificationApi = new NotificationApi(this.apiConfig);
  readonly storageApi = new StorageApi(this.apiConfig);
  readonly blog = new BlogApi(this.apiConfig);
  readonly record = new RecordApi(this.apiConfig);
  readonly decoration = new CustomizationApi(this.apiConfig);
  readonly payment = new UserPaymentApi(this.apiConfig);
  readonly rules = new RulesApi(this.apiConfig);
  readonly report = new ReportApi(this.apiConfig);
  readonly drops = new DropsApi(this.apiConfig);
}

export const appApi = new AppApi();

export const getApi = () => appApi;
