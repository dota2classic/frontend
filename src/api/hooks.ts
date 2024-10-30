import {
  AdminApi,
  ForumApi,
  LiveApi,
  MatchApi,
  MetaApi,
  PlayerApi,
  StatsApi,
} from "./back/apis";
import { Configuration, ConfigurationParameters } from "./back";
import { create } from "apisauce";
import Qs from "qs";
import { getCache } from "@/api/api-cache";

// const PROD_URL = "http://localhost:6001";
// const PROD_URL = "https://dotaclassic.ru/api";
const PROD_URL = (process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL) as string;

export class AppApi {
  cache = getCache();

  apiParams: ConfigurationParameters = {
    basePath: `${PROD_URL}`,
    fetchApi: async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const key = JSON.stringify(input);
      const cached = this.cache.get(key);
      if (cached) {
        // Need to create mock of response
        const data = new Blob([JSON.stringify(cached)], {
          type: "application/json",
        });
        const r = new Response(data, {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });

        return r.clone() as Response;
      }

      const result = fetch(input, init).catch((e) => {
        console.log("hehehe", e);
        return undefined as unknown;
      });

      result
        .then((it) => it.clone().json())
        .then((json) => {
          this.cache.set(key, json);
          return json;
        });
      return result;
    },
  };
  private readonly apiConfig = new Configuration(this.apiParams);

  readonly matchApi = new MatchApi(this.apiConfig);
  readonly liveApi = new LiveApi(this.apiConfig);
  readonly forumApi = new ForumApi(this.apiConfig);
  readonly playerApi = new PlayerApi(this.apiConfig);
  readonly adminApi = new AdminApi(this.apiConfig);
  readonly statsApi = new StatsApi(this.apiConfig);
  readonly metaApi = new MetaApi(this.apiConfig);
}

export const appApi = new AppApi();

export const getApi = () => appApi;

export const apiInner = create({
  baseURL: `${PROD_URL}/api`,
  paramsSerializer: (params) => Qs.stringify(params, { arrayFormat: "repeat" }),
});
