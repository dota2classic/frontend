import "@/styles/globals.css";
import App, { AppContext, AppInitialProps } from "next/app";
import { Layout, ReferralSniffer } from "@/components";
import Cookies from "cookies";
import "../util/promise";
// import * as Fonts from 'next/font/google'
import localFont from "next/font/local";
import { SWRConfig } from "swr";
import React, { createContext } from "react";
import { getRootStore, HydrateRootData, RootStore } from "@/store";
import Head from "next/head";
import "../ext";
import cx from "clsx";
import { GreedyFocusManager } from "@/containers";
// Font files can be colocated inside of `pages`

/**
 * Same as Partial<T> but goes deeper and makes Partial<T> all its properties and sub-properties.
 */
export type DeepPartial<T> =
  | T
  | (T extends Array<infer U>
      ? DeepPartial<U>[]
      : T extends Map<infer K, infer V>
        ? Map<DeepPartial<K>, DeepPartial<V>>
        : T extends Set<infer M>
          ? Set<DeepPartial<M>>
          : T extends object
            ? {
                [K in keyof T]?: DeepPartial<T[K]>;
              }
            : T);

const myFont = localFont({
  src: [
    { path: "./Trajan Pro 3 Regular.otf", weight: "500" },
    { path: "./TrajanPro3SemiBold.ttf", weight: "800" },
  ],
});

export const MobxContext = createContext<RootStore>({} as RootStore);

export default class MyApp extends App<{ initialState: HydrateRootData }> {
  private static inferPagePropsAsHydratable(
    props: AppInitialProps,
  ): Partial<HydrateRootData> {
    const pageProps = props.pageProps;
    let hydration: Partial<HydrateRootData> = {};

    if (pageProps["@party"]) {
      //
      hydration = {
        ...hydration,
        queue: {
          ...hydration.queue,
          party: pageProps["@party"],
          defaultModes: [],
        },
      };
    }

    if (pageProps["@defaultModes"]) {
      hydration = {
        ...hydration,
        queue: {
          ...hydration.queue,
          defaultModes: pageProps["@defaultModes"],
        },
      };
    }

    return hydration;
  }

  static async getInitialProps(appContext: AppContext) {
    const appProps = await App.getInitialProps(appContext);
    if (!appContext.ctx.req || !appContext.ctx.res) return { ...appProps };

    const cookies = new Cookies(appContext.ctx.req, appContext.ctx.res);
    const cookieToken = cookies.get("dota2classic_auth_token");

    const inferredState: Partial<HydrateRootData> =
      MyApp.inferPagePropsAsHydratable(appProps);

    const initialState: HydrateRootData = {
      auth: { token: cookieToken },
      queue: { defaultModes: [] },
      notify: {},
      user: {},
      threads: { emoticons: [] },
      greedyFocus: {},
      ...inferredState,
    };

    return { ...appProps, initialState };
  }

  componentDidMount() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) =>
          console.log("" + "scope is: ", registration.scope),
        );
    }
  }

  render() {
    const { Component, pageProps, initialState } = this.props;
    const store = getRootStore(initialState);

    return (
      <MobxContext.Provider value={store}>
        <ReferralSniffer />
        <GreedyFocusManager />
        <Head>
          <title>Dota2Classic</title>
        </Head>
        <SWRConfig>
          {/*<PushNotificationManager />*/}
          <Layout className={cx(myFont.className)}>
            <Component {...pageProps} />
          </Layout>
        </SWRConfig>
      </MobxContext.Provider>
    );
  }
}
