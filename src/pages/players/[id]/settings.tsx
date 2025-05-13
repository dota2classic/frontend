import { NextPageContext } from "next";
import {
  Button,
  EmbedProps,
  Panel,
  PlayerSummary,
  Section,
} from "@/components";
import React from "react";
import {
  PlayerSummaryDto,
  ProfileDecorationDto,
  UserConnectionDtoConnectionEnum,
} from "@/api/back";
import { getApi } from "@/api/hooks";
import { FaTwitch } from "react-icons/fa";
import c from "./PlayerPage.module.scss";
import { getTwitchConnectUrl } from "@/util/getAuthUrl";
import cx from "clsx";
import { NotoSans } from "@/const/notosans";
import { EditProfileDecorations } from "@/containers";

interface Props {
  summary: PlayerSummaryDto;
  decorations: ProfileDecorationDto[];
  playerId: string;
}

export default function PlayerSettings({ summary, decorations }: Props) {
  const twitchConnection = summary.user.connections.find(
    (t) => t.connection === UserConnectionDtoConnectionEnum.TWITCH,
  );

  return (
    <>
      <EmbedProps
        description={"Настройки своего профиля"}
        title={"Настройки"}
      />
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

        <Panel className={cx(c.panel, NotoSans.className)}>
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
          <p>
            <span className="gold">Внимание:</span> чтобы твой стрим отображался
            на главной странице, игра должны быть Dota 2, а название включать в
            себя <span className="gold">dotaclassic.ru</span>
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

      <Section>
        <header className={c.heading}>
          <FaTwitch className={c.twitch} /> Подписка dotaclassic plus
        </header>

        <EditProfileDecorations decorations={decorations} user={summary.user} />
      </Section>
    </>
  );
}

PlayerSettings.getInitialProps = async (
  ctx: NextPageContext,
): Promise<Props> => {
  const playerId = ctx.query.id as string;

  const [summary, decorations] = await Promise.combine([
    getApi().playerApi.playerControllerPlayerSummary(playerId),
    getApi().decoration.customizationControllerAll(),
  ]);
  return {
    summary,
    decorations,
    playerId,
  };
};
