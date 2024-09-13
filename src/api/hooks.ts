import {
  AdminApi,
  LiveApi,
  MatchApi,
  MetaApi,
  PlayerApi,
  StatsApi,
} from "./back/apis";
import { Configuration, ConfigurationParameters } from "./back";
import { create } from "apisauce";
import Qs from "qs";

// const PROD_URL = "http://localhost:6001";
const PROD_URL = "https://dotaclassic.ru/api";

export class AppApi {
  apiParams: ConfigurationParameters = {
    basePath: `${PROD_URL}`,
    fetchApi: (input: any, init: any) => {
      return fetch(input, init)
        .then((t) => {
          // if (t.status === 401 && AuthService.authorized && typeof window !== "undefined") {
          //   AuthService.logout();
          //   window.location.reload();
          // }
          return t;
        })
        .catch((e) => {
          console.log("hehehe", e);
          return undefined as any;
        });
    },
  };
  private readonly apiConfig = new Configuration(this.apiParams);

  readonly matchApi = new MatchApi(this.apiConfig);
  readonly liveApi = new LiveApi(this.apiConfig);
  readonly playerApi = new PlayerApi(this.apiConfig);
  readonly adminApi = new AdminApi(this.apiConfig);
  readonly statsApi = new StatsApi(this.apiConfig);
  readonly metaApi = new MetaApi(this.apiConfig);
}

export const appApi = new AppApi();

export const useApi = () => appApi;

export const apiInner = create({
  baseURL: `${PROD_URL}/api`,
  paramsSerializer: (params) => Qs.stringify(params, { arrayFormat: "repeat" }),
});
