import { NextPageContext } from "next";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { getApi } from "@/api/hooks";
import { MatchmakingInfo, QueueStateDTO } from "@/api/back";
import {
  Button,
  ForumUserEmbed,
  Panel,
  Section,
  UserPreview,
} from "@/components";
import { formatGameMode } from "@/util/gamemode";
import c from "./AdminStyles.module.scss";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import cx from "clsx";
import { useTransition } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaBell } from "react-icons/fa";

interface Props {
  queues: QueueStateDTO[];
  modeInfo: MatchmakingInfo[];
}

const OnlineList = observer(() => {
  const { queue } = useStore();
  return (
    <Panel
      className={cx(c.parties, c.onlineList)}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <ul>
        {queue.online.map((steamid) => (
          <li key={steamid}>
            <ForumUserEmbed key={steamid} steamId={steamid} />
          </li>
        ))}
      </ul>
    </Panel>
  );
});

export default function QueuesPage({ queues: initialQueues, modeInfo }: Props) {
  const { data } = getApi().adminApi.useServerControllerQueues({
    fallbackData: initialQueues,
    refreshInterval: 5000,
  });
  const [isPending, startTransition] = useTransition();

  const queues: QueueStateDTO[] = data!.filter(
    (t) =>
      modeInfo.findIndex((minfo) => minfo.enabled && minfo.mode === t.mode) !==
      -1,
  );

  return (
    <div className={c.gridPanel}>
      <Section className={c.grid8}>
        {queues.map((queue) => (
          <div key={queue.mode}>
            <header>
              {formatGameMode(queue.mode)} (
              {queue.entries
                .map((t) => t.players.length)
                .reduce((a, b) => a + b, 0)}
              )
            </header>
            <Button
              onClick={() =>
                startTransition(async () => {
                  await getApi().notificationApi.notificationControllerNotifyAboutQueue(
                    { mode: queue.mode },
                  );
                })
              }
            >
              Отправить уведомление о поиске
              {isPending ? (
                <AiOutlineLoading3Quarters className="loading" />
              ) : (
                <FaBell style={{ float: "right" }} />
              )}
            </Button>
            <Panel className={c.parties} key={queue.mode}>
              {queue.entries.length > 0 ? (
                queue.entries.map((entry) => (
                  <div key={entry.partyId} className={c.withBorder}>
                    <div>Party {entry.partyId}</div>
                    {entry.players.map((plr) => (
                      <UserPreview key={plr.steamId} user={plr} />
                    ))}
                  </div>
                ))
              ) : (
                <div>Очередь пуста</div>
              )}
            </Panel>
          </div>
        ))}
      </Section>
      <Section className={c.grid4}>
        <header>Онлайн</header>
        <OnlineList />
      </Section>
    </div>
  );
}

QueuesPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  return {
    queues: await withTemporaryToken(ctx, () =>
      getApi().adminApi.serverControllerQueues(),
    ),
    modeInfo: await getApi().statsApi.statsControllerGetMatchmakingInfo(),
  };
};
