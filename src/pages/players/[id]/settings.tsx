import { NextPageContext } from "next";
import {
  Button,
  EmbedProps,
  InvitePlayerModalRaw,
  Logo,
  Panel,
  PlayerSummary,
  Section,
  Table,
  TimeAgo,
  UserPreview,
} from "@/components";
import React, { useState } from "react";
import {
  DodgeListEntryDto,
  PlayerSummaryDto,
  ProfileDecorationDto,
  Role,
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
import { AppRouter } from "@/route";
import { useAsyncButton } from "@/util/use-async-button";
import { makeSimpleToast } from "@/components/Toast/toasts";
import { useRefreshPageProps } from "@/util/usePageProps";
import { paidAction } from "@/util/subscription";

interface Props {
  summary: PlayerSummaryDto;
  decorations: ProfileDecorationDto[];
  playerId: string;
}

export default function PlayerSettings({ summary, decorations }: Props) {
  const { data, mutate } = getApi().playerApi.usePlayerControllerGetDodgeList();
  const [dodgeListOpen, setDodgeListOpen] = useState(false);
  const reloadProps = useRefreshPageProps();

  const dodgeList: DodgeListEntryDto[] = data || [];

  const twitchConnection = summary.user.connections.find(
    (t) => t.connection === UserConnectionDtoConnectionEnum.TWITCH,
  );

  const oldSubscription = summary.user.roles.find((t) => t.role === Role.OLD);

  const [isStartingRecalibration, startRecalibration] = useAsyncButton(
    paidAction(async () => {
      try {
        await getApi().playerApi.playerControllerStartRecalibration();
        reloadProps().then();
        return;
      } catch (e) {
        let msg = "";
        if (e instanceof Response) {
          msg = await e.json().then((t) => t["message"]);
        }
        makeSimpleToast(
          t("player_settings.startRecalibrationError"),
          msg,
          5000,
        );
      }
    }),
    [reloadProps],
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
        description={t("player_settings.profileSettings")}
        title={t("player_settings.settings")}
      />
      <PlayerSummary
        session={summary.session}
        banStatus={summary.banStatus}
        stats={summary.overallStats}
        user={summary.user}
        rank={summary.seasonStats.rank}
        mmr={summary.seasonStats.mmr}
      />
      <Section className={cx(c.section)}>
        <header className={c.heading}>
          <Logo size={30} /> dotaclassic plus
        </header>
        <Panel className={cx(c.panel, NotoSans.className)}>
          <p>
            {oldSubscription ? (
              <>
                {t("player_settings.activeSubscription")}
                <span className="gold">
                  <TimeAgo date={oldSubscription.endTime} />
                </span>
              </>
            ) : (
              t("player_settings.inactiveSubscription")
            )}
          </p>
          <Button
            className={c.inlineButton}
            small
            pageLink={AppRouter.store.index.link}
          >
            {oldSubscription
              ? t("player_settings.renewSubscription")
              : t("player_settings.subscribe")}
          </Button>
        </Panel>
      </Section>
      <Section className={cx(c.section)}>
        <header className={c.heading}>
          <GiAngelWings className={"gold"} />{" "}
          {t("player_settings.profileDecoration")}
        </header>

        <EditProfileDecorations decorations={decorations} user={summary.user} />
      </Section>
      <Section className={cx(c.section)}>
        <header className={c.heading}>
          <SiAdblock className={"red"} /> {t("player_settings.recalibration")}
        </header>
        <Panel className={cx(c.panel, NotoSans.className)}>
          <p>{t("player_settings.recalibrationDescription")}</p>
          {summary.recalibration ? (
            <Button
              mega
              disabled
              className={cx(c.inlineButton, c.recalibrationButton)}
            >
              {t("player_settings.recalibration")}
              <div>
                {t("player_settings.startedRecalibration", {
                  time: <TimeAgo date={summary.recalibration.createdAt} />,
                })}
              </div>
            </Button>
          ) : (
            <Button
              disabled={isStartingRecalibration}
              mega
              onClick={startRecalibration}
              className={cx(c.inlineButton, c.recalibrationButton)}
            >
              {t("player_settings.recalibration")}
              <div>{t("player_settings.startNow")}</div>
            </Button>
          )}
        </Panel>
      </Section>
      <Section className={cx(c.section)}>
        <header className={c.heading}>
          <SiAdblock className={"red"} /> {t("player_settings.avoidedPlayers")}
        </header>
        <Panel className={cx(c.panel, NotoSans.className)}>
          <p>{t("player_settings.avoidedPlayersInfo")}</p>
          <Table>
            <thead>
              <tr>
                <th>{t("player_settings.player")}</th>
                <th>{t("player_settings.dateDodge")}</th>
                <th>{t("player_settings.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {dodgeList.map((it) => (
                <tr key={it.user.steamId}>
                  <td>
                    <UserPreview roles user={it.user} />
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
                      {t("player_settings.remove")}
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
            {t("player_settings.avoidPlayer")}
          </Button>
        </Panel>
      </Section>

      <Section className={cx(c.section)}>
        <header className={c.heading}>
          <FaTwitch className={c.twitch} /> {t("player_settings.twitch")}
        </header>

        <Panel className={cx(c.panel, NotoSans.className)}>
          <p>
            <b>{t("player_settings.connectTwitchProfile")}</b>{" "}
            {t("player_settings.twitchBenefits")}
          </p>
          <p>
            <span className="gold">{t("player_settings.attention")}</span>{" "}
            {t("player_settings.twitchRequirements")}
          </p>
          <div className={c.twitchBlock}>
            <span>{t("player_settings.connectedAccount")}</span>
            {twitchConnection ? (
              <a
                target={"__blank"}
                className={"link"}
                href={`https://twitch.tv/${twitchConnection.externalId}`}
              >
                twitch.tv/{twitchConnection.externalId}
              </a>
            ) : (
              t("player_settings.notConnected")
            )}
          </div>

          <div className={c.buttons}>
            <Button link href={getTwitchConnectUrl()}>
              {twitchConnection
                ? t("player_settings.connectOtherAccount")
                : t("player_settings.connectAccount")}
            </Button>
            {twitchConnection && (
              <Button
                onClick={async () => {
                  await getApi().settings.authControllerRemoveTwitchConnection();
                  window.location.reload();
                }}
              >
                {t("player_settings.disconnectAccount")}
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
