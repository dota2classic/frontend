import { NextPageContext } from "next";
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
import { EditProfileDecorations } from "@/containers/EditProfileDecorations";
import { formatDate } from "@/util/dates";
import { createPortal } from "react-dom";
import { SiAdblock } from "react-icons/si";
import { GiAngelWings } from "react-icons/gi";
import { AppRouter } from "@/route";
import { useAsyncButton } from "@/util/use-async-button";
import { makeSimpleToast } from "@/components/Toast";
import { useRefreshPageProps } from "@/util/usePageProps";
import { paidAction } from "@/util/subscription";
import { Trans, useTranslation } from "react-i18next";
import { EmbedProps } from "@/components/EmbedProps";
import { PlayerSummary } from "@/components/PlayerSummary";
import { EmptyState } from "@/components/EmptyState";
import { Field } from "@/components/Field";
import { Table } from "@/components/Table";
import { TimeAgo } from "@/components/TimeAgo";
import { UserPreview } from "@/components/UserPreview";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { InvitePlayerModalRaw } from "@/components/InvitePlayerModal";
import { SectionBlock } from "@/components/SectionBlock";
import { Surface } from "@/components/Surface";
import { DetailPanel } from "@/components/DetailPanel";
import { ActionCard } from "@/components/ActionCard";

interface Props {
  summary: PlayerSummaryDto;
  decorations: ProfileDecorationDto[];
  playerId: string;
}

export default function PlayerSettings({ summary, decorations }: Props) {
  const { t } = useTranslation();
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
      if (
        !confirm(
          "Точно начать перекалибровку? Это сбросит рейтинг до изначального",
        )
      ) {
        return;
      }
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
    <div className={c.playerPage}>
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
      <SectionBlock
        className={cx(c.fullwidth)}
        title={
          <>
            <Logo size={30} /> dotaclassic plus
          </>
        }
      >
        <DetailPanel
          className={NotoSans.className}
          lead={
            oldSubscription
              ? t("player_settings.activeSubscription")
              : t("player_settings.inactiveSubscription")
          }
        >
          <ActionCard
            title="Dotaclassic Plus"
            description={
              oldSubscription ? (
                <>
                  Подписка активна до <TimeAgo date={oldSubscription.endTime} />
                </>
              ) : (
                "Оформите подписку, чтобы открыть дополнительные элементы профиля и премиум-функции."
              )
            }
            actions={
              <Button
                mega
                className={cx(c.inlineButton, c.recalibrationButton)}
                pageLink={AppRouter.store.index.link}
              >
                {oldSubscription
                  ? t("player_settings.renewSubscription")
                  : t("player_settings.subscribe")}
              </Button>
            }
          />
        </DetailPanel>
      </SectionBlock>
      <SectionBlock
        className={cx(c.fullwidth)}
        title={
          <>
            <GiAngelWings className={"gold"} />{" "}
            {t("player_settings.profileDecoration")}
          </>
        }
      >
        <EditProfileDecorations decorations={decorations} user={summary.user} />
      </SectionBlock>
      <SectionBlock
        className={cx(c.fullwidth)}
        title={
          <>
            <SiAdblock className={"red"} /> {t("player_settings.recalibration")}
          </>
        }
      >
        <DetailPanel
          className={NotoSans.className}
          lead={t("player_settings.recalibrationDescription")}
        >
          <ActionCard
            title={t("player_settings.recalibration")}
            description={
              summary.recalibration ? (
                <Trans
                  i18nKey={"player_settings.startedRecalibration"}
                  components={{
                    timeStarted: (
                      <TimeAgo date={summary.recalibration.createdAt} />
                    ),
                  }}
                />
              ) : (
                t("player_settings.startNow")
              )
            }
            actions={
              summary.recalibration ? (
                <Button
                  mega
                  disabled
                  className={cx(c.inlineButton, c.recalibrationButton)}
                >
                  {t("player_settings.recalibration")}
                </Button>
              ) : (
                <Button
                  disabled={isStartingRecalibration}
                  mega
                  onClick={startRecalibration}
                  className={cx(c.inlineButton, c.recalibrationButton)}
                >
                  {t("player_settings.recalibration")}
                </Button>
              )
            }
          />
        </DetailPanel>
      </SectionBlock>
      <SectionBlock
        className={cx(c.fullwidth)}
        title={
          <>
            <SiAdblock className={"red"} />{" "}
            {t("player_settings.avoidedPlayers")}
          </>
        }
      >
        <DetailPanel className={NotoSans.className}>
          <div className={c.sectionTopRow}>
            <p className={c.sectionLead}>
              {t("player_settings.avoidedPlayersInfo")}
            </p>
            <Button
              className={c.inlineButton}
              onClick={() => setDodgeListOpen(true)}
            >
              {t("player_settings.avoidPlayer")}
            </Button>
          </div>
          {dodgeList.length > 0 ? (
            <Surface className={c.tableShell} padding="sm" variant="raised">
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
            </Surface>
          ) : (
            <EmptyState
              className={c.emptyState}
              title={t("player_settings.avoidedPlayers")}
              description={t("player_settings.avoidedPlayersInfo")}
              actions={
                <Button onClick={() => setDodgeListOpen(true)}>
                  {t("player_settings.avoidPlayer")}
                </Button>
              }
            />
          )}
        </DetailPanel>
      </SectionBlock>

      <SectionBlock
        className={cx(c.fullwidth)}
        title={
          <>
            <FaTwitch className={c.twitch} /> {t("player_settings.twitch")}
          </>
        }
      >
        <DetailPanel className={NotoSans.className}>
          <div className={c.detailSection}>
            <Field
              label={t("player_settings.connectTwitchProfile")}
              hint={t("player_settings.twitchBenefits")}
            >
              <div className={c.noteBox}>
                <span className={c.noteLabel}>
                  {t("player_settings.attention")}
                </span>
                <span className={c.noteText}>
                  {t("player_settings.twitchRequirements")}
                </span>
              </div>
            </Field>
            <ActionCard
              title={t("player_settings.connectedAccount")}
              description={
                twitchConnection ? undefined : t("player_settings.notConnected")
              }
              actionsClassName={c.actionButtons}
              actions={
                <>
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
                </>
              }
            >
              {twitchConnection && (
                <a
                  target={"__blank"}
                  className={cx("link", c.accountLink)}
                  href={`https://twitch.tv/${twitchConnection.externalId}`}
                >
                  twitch.tv/{twitchConnection.externalId}
                </a>
              )}
            </ActionCard>
          </div>
        </DetailPanel>
      </SectionBlock>
    </div>
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
