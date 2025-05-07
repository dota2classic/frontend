import { NextPageContext } from "next";
import { Button, Panel, PlayerSummary, Section } from "@/components";
import React from "react";
import { PlayerSummaryDto, UserConnectionDtoConnectionEnum } from "@/api/back";
import { getApi } from "@/api/hooks";
import { FaTwitch } from "react-icons/fa";
import c from "./PlayerPage.module.scss";
import { getTwitchConnectUrl } from "@/util/getAuthUrl";
import cx from "clsx";
import { threadFont } from "@/const/fonts";

interface Props {
  summary: PlayerSummaryDto;
  playerId: string;
}

export default function PlayerSettings({ summary }: Props) {
  const twitchConnection = summary.user.connections.find(
    (t) => t.connection === UserConnectionDtoConnectionEnum.TWITCH,
  );
  return (
    <>
      <PlayerSummary
        stats={summary.overallStats}
        user={summary.user}
        rank={summary.seasonStats.rank}
        mmr={summary.seasonStats.mmr}
      />
      <Section>
        <header className={c.heading}>
          <FaTwitch className={c.twitch} /> Twitch
        </header>

        <Panel className={cx(c.panel, threadFont.className)}>
          <p>
            <b>
              Подключите свой Twitch-профиль к учетной записи и получите
              дополнительные возможности!
            </b>{" "}
            После привязки в вашем профиле появится ссылка на ваш стрим, а в
            чате — специальная иконка, которая выделит вас среди других
            пользователей. Если вы ведёте трансляцию нашей игры, мы
            автоматически будем показывать ссылку на ваш запущенный стрим, чтобы
            зрители могли легко найти ваш канал. Это отличный способ привлечь
            новую аудиторию и сделать ваш стрим более заметным! 🎮📺
          </p>
          <div className={c.twitchBlock}>
            <span>Подключенный аккаунт:</span>
            {twitchConnection ? (
              <a
                target={"__blank"}
                className={"link"}
                href={`https://twitch.tv/${twitchConnection.externalId}`}
              >
                twitch.tv/{twitchConnection.externalId}
              </a>
            ) : (
              "Не подключен"
            )}
          </div>

          <div className={c.buttons}>
            <Button link href={getTwitchConnectUrl()}>
              Подключить{twitchConnection ? " другой" : ""} аккаунт twitch
            </Button>
            {twitchConnection && (
              <Button
                onClick={async () => {
                  await getApi().settings.authControllerRemoveTwitchConnection();
                  window.location.reload();
                }}
              >
                Отвязать twitch аккаунт
              </Button>
            )}
          </div>
        </Panel>
      </Section>
    </>
  );
}

PlayerSettings.getInitialProps = async (
  ctx: NextPageContext,
): Promise<Props> => {
  const playerId = ctx.query.id as string;

  return {
    summary: await getApi().playerApi.playerControllerPlayerSummary(playerId),
    playerId,
  };
};
