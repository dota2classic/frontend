import {
  AdminApi,
  AuthApi,
  ForumApi,
  LiveApi,
  LobbyApi,
  MatchApi,
  MetaApi,
  NotificationApi,
  PlayerApi,
  StatsApi,
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
import { AuthStore } from "@/store/AuthStore";
import { __unsafeGetClientStore } from "@/store";
import { parseJwt } from "@/util";

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
        ? BrowserCookies.get(AuthStore.cookieTokenKey) || undefined
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
            await this.refreshToken(token);
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
      // const key = JSON.stringify(input);
      // const cached = this.cache.get(key);
      // if (cached) {
      //   // Need to create mock of response
      //   const data = new Blob([JSON.stringify(cached)], {
      //     type: "application/json",
      //   });
      //   const r = new Response(data, {
      //     status: 200,
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   });
      //
      //   return r.clone() as Response;
      // }

      //
      // result
      //   .then((it) => it.clone().json())
      //   .then((json) => {
      //     this.cache.set(key, json);
      //     return json;
      //   });
    },
  };

  refreshToken = async (token: string) => {
    const jwt = parseJwt<JwtPayload>(token);

    const isExpiringSoon = jwt.exp * 1000 - new Date().getTime() <= 1000 * 60; // Less than a

    const isTokenStale = new Date().getTime() - jwt.iat * 1000 >= 1000 * 60 * 5; // 5 minutes is stale enough

    const shouldRevalidateToken = isExpiringSoon || isTokenStale;

    if (jwt.version === undefined || shouldRevalidateToken) {
      // We should refresh token
      console.log(
        `Need refresh token because: ${jwt.version === undefined} or ${isExpiringSoon} | ${isTokenStale}`,
      );

      const newToken = await this.authApi.steamControllerRefreshToken();

      // console.log(parseJwt(newToken));
      // getRootStore(undefined).auth.setToken(newToken);
      BrowserCookies.set(AuthStore.cookieTokenKey, newToken);
      // const tmp = BrowserCookies.get(AuthStore.cookieTokenKey);
      // if (tmp) {
      //   console.log(parseJwt(newToken));
      // }
      this.apiParams.accessToken = newToken;
    }
  };

  private readonly apiConfig = new Configuration(this.apiParams);

  readonly authApi = new AuthApi(this.apiConfig);
  readonly matchApi = new MatchApi(this.apiConfig);
  readonly liveApi = new LiveApi(this.apiConfig);
  readonly forumApi = new ForumApi(this.apiConfig);
  readonly playerApi = new PlayerApi(this.apiConfig);
  readonly adminApi = new AdminApi(this.apiConfig);
  readonly statsApi = new StatsApi(this.apiConfig);
  readonly metaApi = new MetaApi(this.apiConfig);
  readonly lobby = new LobbyApi(this.apiConfig);
  readonly notificationApi = new NotificationApi(this.apiConfig);
}

export const appApi = new AppApi();

export const getApi = () => appApi;
