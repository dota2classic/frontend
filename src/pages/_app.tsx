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
// Font files can be colocated inside of `pages`
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
          party: pageProps["@party"],
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

    const inferredState = MyApp.inferPagePropsAsHydratable(appProps);

    const initialState: HydrateRootData = {
      auth: { token: cookieToken },
      queue: {},
      notify: {},
      user: {},
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
