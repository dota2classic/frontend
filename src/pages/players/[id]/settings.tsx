import { NextPageContext } from "next";
import {
  Button,
  EmbedProps,
  InvitePlayerModalRaw,
  Panel,
  PlayerSummary,
  Section,
  Table,
  UserPreview,
} from "@/components";
import React, { useState } from "react";
import {
  DodgeListEntryDto,
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
import { formatDate } from "@/util/dates";
import { createPortal } from "react-dom";
import { SiAdblock } from "react-icons/si";
import { GiAngelWings } from "react-icons/gi";

interface Props {
  summary: PlayerSummaryDto;
  decorations: ProfileDecorationDto[];
  playerId: string;
}

export default function PlayerSettings({ summary, decorations }: Props) {
  const { data, mutate } = getApi().playerApi.usePlayerControllerGetDodgeList();
  const [dodgeListOpen, setDodgeListOpen] = useState(false);

  const dodgeList: DodgeListEntryDto[] = data || [];

  const twitchConnection = summary.user.connections.find(
    (t) => t.connection === UserConnectionDtoConnectionEnum.TWITCH,
  );

  const close = () => setDodgeListOpen(false);

  return (
    <>
      {dodgeListOpen &&
        createPortal(
          <InvitePlayerModalRaw
            close={close}
            onSelect={(user) => {
              getApi()
                .playerApi.playerControllerDodgePlayer({
                  dodgeSteamId: user.steamId,
                })
                .then(mutate);
              close();
            }}
          />,
          document.body,
        )}
      <EmbedProps
        description={"Настройки своего профиля"}
        title={"Настройки"}
      />
      <PlayerSummary
        banStatus={summary.banStatus}
        stats={summary.overallStats}
        user={summary.user}
        rank={summary.seasonStats.rank}
        mmr={summary.seasonStats.mmr}
      />

      <Section className={cx(c.section)}>
        <header className={c.heading}>
          <GiAngelWings className={"gold"} /> Оформление профиля
        </header>

        <EditProfileDecorations decorations={decorations} user={summary.user} />
      </Section>
      <Section className={cx(c.section)}>
        <header className={c.heading}>
          <SiAdblock className={"red"} /> Избегаемые игроки
        </header>
        <Panel className={cx(c.panel, NotoSans.className)}>
          <p>
            Обладатели подписки dotaclassic plus могут добавить до одного игрока
            в список избегаемых игроков. Это позволит никогда не попадаться с
            неприятными игрокам за одну команду.
          </p>
          <Table>
            <thead>
              <tr>
                <th>Игрок</th>
                <th>Дата доджа</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {dodgeList.map((it) => (
                <tr key={it.user.steamId}>
                  <td>
                    <UserPreview user={it.user} />
                  </td>
                  <td>{formatDate(new Date(it.createdAt))}</td>
                  <td>
                    <Button
                      onClick={() =>
                        getApi()
                          .playerApi.playerControllerUnDodgePlayer({
                            dodgeSteamId: it.user.steamId,
                          })
                          .then(mutate)
                      }
                    >
                      Убрать
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button
            className={c.inlineButton}
            onClick={() => setDodgeListOpen(true)}
          >
            Избегать игрока
          </Button>
        </Panel>
      </Section>

      <Section className={cx(c.section)}>
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
