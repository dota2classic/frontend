import Head from "next/head";
import { getApi } from "@/api/hooks";
import c from "./Streams.module.scss";
import { TwitchStreamDto } from "@/api/back";
import React from "react";
import { usePeriodicRefreshPageProps } from "@/util/usePageProps";
import { getDomain } from "@/util/domain";

interface InitialProps {
  streams: TwitchStreamDto[];
}

export default function LiveStreams({ streams }: InitialProps) {
  usePeriodicRefreshPageProps(5000);

  const fakeData: TwitchStreamDto[] = streams;

  return (
    <>
      <Head>
        <title>Текущие матчи - dota2classic.ru</title>
      </Head>

      {fakeData!.length === 0 && (
        <div className={c.queue}>
          <span>Мы не нашли ни одного стрима по dotaclassic :(</span>
          <p>Может, ты новая легенда твича?</p>
        </div>
      )}

      <div className={c.streams}>
        {fakeData.map((it) => (
          <div className={c.stream} key={it.link}>
            <iframe
              src={`https://player.twitch.tv/?channel=${it.link.split("twitch.tv/")[1]}&parent=${getDomain()}&muted=true&autoplay=false`}
              allowFullScreen={false}
            />
          </div>
          // <CarouselItem
          //   key={it.user.steamId}
          //   unoptimized
          //   title={`Стрим ${it.user.name}`}
          //   image={it.preview}
          //   link={it.link}
          //   badge={it.viewers}
          //   alwaysShowDescription
          //   description={it.title}
          // />
        ))}
      </div>
    </>
  );
}

LiveStreams.getInitialProps = async (): Promise<InitialProps> => {
  const streams = await getApi().statsApi.statsControllerGetTwitchStreams();

  return {
    streams,
  };
};
