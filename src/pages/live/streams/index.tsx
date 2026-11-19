import c from "./Streams.module.scss";
import { TwitchStreamDto } from "@/api/back";
import React from "react";
import { getApi } from "@/api/hooks";
import { PollInterval } from "@/const/poll-interval";
import { EmbedProps } from "@/components/EmbedProps";
import { useTranslation } from "react-i18next";
import { getRequestApi } from "@/api/request-api";
import { NextPageContext } from "next";

interface InitialProps {
  streams: TwitchStreamDto[];
}

export default function LiveStreams({ streams }: InitialProps) {
  const { data } = getApi().statsApi.useStatsControllerGetTwitchStreams({
    fallbackData: streams,
    refreshInterval: PollInterval.LIVE,
  });

  const fakeData: TwitchStreamDto[] = data ?? streams;

  const domain = "dotaclassic.ru";
  const { t } = useTranslation();

  return (
    <>
      <EmbedProps
        title={t("live_streams.streamsTitle")}
        description={t("live_streams.streamsDescription")}
      />

      {fakeData!.length === 0 && (
        <div className={c.queue}>
          <span>{t("live_streams.noStreamsFound")}</span>
          <p>{t("live_streams.maybeYouAreALegend")}</p>
        </div>
      )}

      <div className={c.streams}>
        {fakeData.map((it) => (
          <div className={c.stream} key={it.link}>
            <iframe
              src={`https://player.twitch.tv/?channel=${it.link.split("twitch.tv/")[1]}&parent=${domain}&muted=true&autoplay=false`}
              allowFullScreen={false}
            />
          </div>
        ))}
      </div>
    </>
  );
}

LiveStreams.getInitialProps = async (
  ctx: NextPageContext,
): Promise<InitialProps> => {
  const api = getRequestApi(ctx);
  const streams = await api.statsApi.statsControllerGetTwitchStreams();

  return {
    streams,
  };
};
