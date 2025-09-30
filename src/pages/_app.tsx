import "@/styles/globals.css";
import "@/styles/scrollbars.css";
import App, { AppContext, AppInitialProps } from "next/app";
import { ReferralSniffer } from "@/components/ReferralSniffer";
import { Layout } from "@/components/Layout";
import Cookies from "cookies";
import "../util/promise";
// import * as Fonts from 'next/font/google'
import { SWRConfig } from "swr";
import React from "react";
import { getRootStore, HydrateRootData } from "@/store";
import Head from "next/head";
import "../ext";
import cx from "clsx";
import { ToastContainer } from "react-toastify";
import { FeedbackModalContainer } from "@/containers/FeedbackModal/FeedbackModalContainer";
// Font files can be colocated inside of `pages`
import "@/styles/editor.css";
import { TrajanPro } from "@/const/fonts";
import { ReportModalContainer } from "@/containers/ReportModal/ReportModalContainer";
import { getApi } from "@/api/hooks";
import { MaintenanceDto } from "@/api/back";
import "../i18n/i18n";
import i18n from "@/i18n/i18n";
import { detectLocale } from "@/util/detectLocale";
import { DevVersionIndicator } from "@/containers/DevVersionIndicator";
import { ClaimContainer } from "@/containers/ClaimContainer";
import { GreedyFocusManager } from "@/containers/GreedyFocusManager";
import { PaidFeatureModal } from "@/containers/PaidFeatureModal";
import { AcceptCookiesContainer } from "@/containers/AcceptCookiesContainer";
import { MobxContext } from "@/store/MobxContext";
import { AUTH_TOKEN_COOKIE_KEY } from "@/const/cookie";

export default class MyApp extends App<{
  initialState: HydrateRootData;
  maintenance: MaintenanceDto;
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
    let maintenance: MaintenanceDto;
    try {
      maintenance = await getApi().statsApi.statsControllerMaintenance();
    } catch (e) {
      console.warn(e);
      maintenance = { active: true };
    }

    let hostname = appContext.ctx.req
      ? appContext.ctx.req.headers.host
      : window.location.hostname;

    if (hostname && hostname.includes(":")) {
      hostname = hostname.split(":")[0];
    }

    const locale = detectLocale(hostname || "");

    await i18n.changeLanguage(locale);

    if (!appContext.ctx.req || !appContext.ctx.res) return { ...appProps };

    const cookies = new Cookies(appContext.ctx.req, appContext.ctx.res);

    const cookieToken =
      cookies.get(AUTH_TOKEN_COOKIE_KEY) ||
      cookies.get(encodeURIComponent(AUTH_TOKEN_COOKIE_KEY));

    const inferredState: Partial<HydrateRootData> =
      MyApp.inferPagePropsAsHydratable(appProps);

    const initialState: HydrateRootData = {
      auth: { token: cookieToken },
      queue: { defaultModes: [] },
      threads: { emoticons: [] },
      ...inferredState,
    };

    return { ...appProps, initialState, maintenance };
  }

  componentDidMount() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js").then();
      // .then((registration) =>
      //   console.log("" + "scope is: ", registration.scope),
      // );
    }
  }

  render() {
    const { Component, pageProps, initialState, maintenance } = this.props;
    const store = getRootStore(initialState);

    return (
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
          <Layout className={cx(TrajanPro.className)}>
            <Component {...pageProps} />
          </Layout>
        </SWRConfig>
      </MobxContext.Provider>
    );
  }
}
