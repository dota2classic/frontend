import "@/styles/globals.css";
import App, { AppContext } from "next/app";
import { Layout } from "@/components";
import Cookies from "cookies";

import localFont from "next/font/local";
import { SWRConfig } from "swr";
import { createContext } from "react";
import { HydrateRootData, RootStore, useRootStore } from "@/store";
import Head from "next/head";

// Font files can be colocated inside of `pages`
const myFont = localFont({ src: "./TrajanPro3Regular.ttf" });

export const MobxContext = createContext<RootStore>({} as any);

// export default function App({ Component, pageProps }: AppProps) {
//
// }

export default class MyApp extends App<{ initialState: HydrateRootData }> {
  static async getInitialProps(appContext: AppContext) {
    const appProps = await App.getInitialProps(appContext);
    if (!appContext.ctx.req || !appContext.ctx.res) return { ...appProps };

    const cookies = new Cookies(appContext.ctx.req, appContext.ctx.res);
    const cookieToken = cookies.get("dota2classic_auth_token");

    const initialState: HydrateRootData = {
      auth: { token: cookieToken },
      queue: {},
      notify: {},
    };

    return { ...appProps, initialState };
  }

  render() {
    const { Component, pageProps, initialState } = this.props;
    const store = useRootStore(initialState);

    return (
      <MobxContext.Provider value={store}>
        <Head>
          <title>Dota 2 classic</title>
        </Head>
        <SWRConfig>
          <Layout className={myFont.className}>
            <Component {...pageProps} />
          </Layout>
        </SWRConfig>
      </MobxContext.Provider>
    );
  }
}
