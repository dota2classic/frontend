import { NextPageContext } from "next";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { getApi } from "@/api/hooks";
import { MatchmakingInfo, QueueEntryDTO, UserDTO } from "@/api/back";
import { Button, Panel, Section, UserPreview } from "@/components";
import c from "./AdminStyles.module.scss";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import cx from "clsx";
import { useTransition } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaBell } from "react-icons/fa";
import { useTranslation } from "react-i18next";

interface Props {
  queueEntries: QueueEntryDTO[];
  modeInfo: MatchmakingInfo[];
}

const OnlineList = observer(() => {
  const { queue } = useStore();
  return (
    <Panel
      className={cx(c.parties, c.onlineList)}
      style={{ display: "flex", flexDirection: "column" }}
    >
      {queue.online.length}
    </Panel>
  );
});

export default function QueuesPage({
  queueEntries: initialQueues,
  modeInfo,
}: Props) {
  const { t } = useTranslation();
  const { data } = getApi().adminApi.useServerControllerQueues({
    fallbackData: initialQueues,
    refreshInterval: 5000,
  });
  const [isPending, startTransition] = useTransition();

  const groupedParties = modeInfo
    .filter((t) => t.enabled)
    .map((modeInfo) => {
      const partiesInQueue: QueueEntryDTO[] = (data || initialQueues)!.filter(
        (t) => t.modes.includes(modeInfo.lobbyType),
      );

      return {
        mode: modeInfo.lobbyType,
        entries: partiesInQueue,
      };
    });

  return (
    <div className={c.gridPanel}>
      <Section className={c.grid8}>
        {groupedParties.map(({ mode, entries }) => (
          <div key={mode.toString()}>
            <header>
              {t(`matchmaking_mode.${mode}`)} (
              {entries.map((t) => t.players.length).reduce((a, b) => a + b, 0)})
            </header>
            <Button
              onClick={() =>
                startTransition(async () => {
                  await getApi().notificationApi.notificationControllerNotifyAboutQueue(
                    { mode: mode },
                  );
                })
              }
            >
              {t("queues.sendNotification")}
              {isPending ? (
                <AiOutlineLoading3Quarters className="loading" />
              ) : (
                <FaBell style={{ float: "right" }} />
              )}
            </Button>
            <Panel className={c.parties} key={mode}>
              {entries.length > 0 ? (
                entries.map((entry: QueueEntryDTO) => (
                  <div key={entry.partyId} className={c.withBorder}>
                    <div>
                      {t("queues.party")}
                      {entry.partyId}
                    </div>
                    {entry.players.map((plr: UserDTO) => (
                      <UserPreview roles key={plr.steamId} user={plr} />
                    ))}
                  </div>
                ))
              ) : (
                <div>{t("queues.emptyQueue")}</div>
              )}
            </Panel>
          </div>
        ))}
      </Section>
      <Section className={c.grid4}>
        <header>{t("queues.online")}</header>
        <OnlineList />
      </Section>
    </div>
  );
}

QueuesPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  return {
    queueEntries: await withTemporaryToken(ctx, () =>
      getApi().adminApi.serverControllerQueues(),
    ),
    modeInfo: await getApi().statsApi.statsControllerGetMatchmakingInfo(),
  };
};
