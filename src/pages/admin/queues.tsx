import { NextPageContext } from "next";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { getApi } from "@/api/hooks";
import { QueueStateDTO } from "@/api/back";
import { Typography, UserPreview } from "@/components";
import { formatGameMode } from "@/util/gamemode";
import c from "./AdminStyles.module.scss";

interface Props {
  queues: QueueStateDTO[];
}

export default function QueuesPage({ queues: initialQueues }: Props) {
  const { data } = getApi().adminApi.useServerControllerQueues({
    fallbackData: initialQueues,
    refreshInterval: 5000,
  });

  const queues: QueueStateDTO[] = data || [];

  return (
    <>
      {queues.map((queue) => (
        <div key={queue.mode} className={c.withBorder}>
          <Typography.Header>{formatGameMode(queue.mode)}</Typography.Header>
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
        </div>
      ))}
    </>
  );
}

QueuesPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  return {
    queues: await withTemporaryToken(ctx, () =>
      getApi().adminApi.serverControllerQueues(),
    ),
  };
};
