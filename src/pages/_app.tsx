import "@/styles/globals.css";
import "@/styles/design-tokens.css";
import "@/styles/scrollbars.css";
import App, { AppContext, AppInitialProps } from "next/app";
import { ReferralSniffer } from "@/components/ReferralSniffer";
import { Layout, LayoutConfig } from "@/components/Layout";
import "../util/promise";
// import * as Fonts from 'next/font/google'
import { SWRConfig } from "swr";
import React from "react";
import { getRootStore, HydrateRootData } from "@/store";
import Head from "next/head";
import "../ext";
import cx from "clsx";
import { ToastContainer } from "react-toastify";
import { FeedbackModalContainer } from "@/containers/FeedbackModal";
// Font files can be colocated inside of `pages`
import "@/styles/editor.css";
import { TrajanPro } from "@/const/fonts";
import { ReportModalContainer } from "@/containers/ReportModal";
import { getApi } from "@/api/hooks";
import { MaintenanceDto } from "@/api/back";
import { getLocaleI18n } from "@/i18n/i18n";
import { I18nextProvider } from "react-i18next";
import { detectLocale } from "@/util/detectLocale";
import { DevVersionIndicator } from "@/containers/DevVersionIndicator";
import { ClaimContainer } from "@/containers/ClaimContainer";
import { GreedyFocusManager } from "@/containers/GreedyFocusManager";
import { PaidFeatureModal } from "@/containers/PaidFeatureModal";
import { AcceptCookiesContainer } from "@/containers/AcceptCookiesContainer";
import { MobxContext } from "@/store/MobxContext";
import { getRequestToken } from "@/api/request-api";
import { ttlMemo } from "@/util/server-ttl-cache";

const getMaintenance = ttlMemo(
  (): Promise<MaintenanceDto> =>
    getApi()
      .statsApi.statsControllerMaintenance()
      .catch((e) => {
        console.warn(e);
        return { active: true };
      }),
  5_000,
);

export default class MyApp extends App<{
  initialState: HydrateRootData;
  maintenance?: MaintenanceDto;
  locale: string;
}> {
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

    let hostname = appContext.ctx.req
      ? appContext.ctx.req.headers.host
      : window.location.hostname;

    if (hostname && hostname.includes(":")) {
      hostname = hostname.split(":")[0];
    }

    const locale = detectLocale(hostname || "");

    if (!appContext.ctx.req || !appContext.ctx.res)
      return { ...appProps, locale };

    const maintenance = await getMaintenance();
    const cookieToken = getRequestToken(appContext.ctx);

    const inferredState: Partial<HydrateRootData> =
      MyApp.inferPagePropsAsHydratable(appProps);

    const initialState: HydrateRootData = {
      auth: { token: cookieToken },
      queue: { defaultModes: [] },
      threads: { emoticons: [] },
      ...inferredState,
    };

    return { ...appProps, initialState, maintenance, locale };
  }

  componentDidMount() {
    import("@/util/faro").then(({ initFaro }) => initFaro());

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js").then();
      // .then((registration) =>
      //   console.log("" + "scope is: ", registration.scope),
      // );
    }
  }

  render() {
    const { Component, pageProps, initialState, maintenance, locale } =
      this.props;
    const store = getRootStore(initialState);

    return (
      <I18nextProvider i18n={getLocaleI18n(locale)}>
        <MobxContext.Provider value={store}>
          <ReferralSniffer />
          <DevVersionIndicator maintenance={maintenance} />
          <ToastContainer />
          <ReportModalContainer />
          <ClaimContainer />
          <FeedbackModalContainer />
          <GreedyFocusManager />
          <PaidFeatureModal />
          <AcceptCookiesContainer />
          <Head>
            <title>Dota2Classic</title>
          </Head>
          <SWRConfig>
            {/*<PushNotificationManager />*/}
            <Layout
              className={cx(TrajanPro.className)}
              config={
                (Component as { layoutConfig?: LayoutConfig }).layoutConfig
              }
            >
              <Component {...pageProps} />
            </Layout>
          </SWRConfig>
        </MobxContext.Provider>
      </I18nextProvider>
    );
  }
}
