import Cookies from "cookies";
import type { IncomingMessage } from "http";
import { NextPageContext } from "next";
import { AppApi, getApi } from "@/api/hooks";
import { AUTH_TOKEN_COOKIE_KEY } from "@/const/cookie";

type RequestContext = Pick<NextPageContext, "req" | "res">;

const requestApis = new WeakMap<IncomingMessage, AppApi>();

export function getRequestToken(ctx: RequestContext): string | undefined {
  if (typeof window !== "undefined") return getApi().accessToken();
  if (!ctx.req || !ctx.res) return undefined;
  return new Cookies(ctx.req, ctx.res).get(AUTH_TOKEN_COOKIE_KEY);
}

export function getRequestApi(ctx: RequestContext): AppApi {
  if (typeof window !== "undefined" || !ctx.req) return getApi();

  const existing = requestApis.get(ctx.req);
  if (existing) return existing;

  const token = getRequestToken(ctx);
  const api = new AppApi(() => token);
  requestApis.set(ctx.req, api);
  return api;
}
