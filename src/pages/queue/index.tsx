import c from "./Queue.module.scss";
import { useStore } from "@/store";
import { useApi } from "@/api/hooks";
import { MatchmakingInfo } from "@/api/back";
import { useDidMount } from "@/util/hooks";
import { MatchmakingOption, QueuePartyInfo } from "@/components";
import { NextPageContext } from "next";

interface Props {
  modes: MatchmakingInfo[];
}

export default function QueuePage(props: Props) {
  const mounted = useDidMount();
  const { data: modes } =
    useApi().statsApi.useStatsControllerGetMatchmakingInfo({
      fallbackData: props.modes,
      isPaused() {
        return !mounted;
      },
    });

  const queueStore = useStore().queue;

  const d84 = modes!
    .filter((it) => it.version === "Dota_684" && it.enabled)
    .sort((a, b) => Number(a.mode) - Number(b.mode));

  return (
    <div className={c.queue}>
      <div className={c.modes}>
        {d84.map((info) => (
          <MatchmakingOption
            key={`${info.mode}${info.version}`}
            onSelect={queueStore.setSelectedMode}
            version={info.version as any}
            mode={info.mode as any}
          />
        ))}
      </div>
      <div className={c.main}>
        <QueuePartyInfo />
      </div>
    </div>
  );
}

QueuePage.getInitialProps = async (ctx: NextPageContext) => {
  return {
    modes: await useApi().statsApi.statsControllerGetMatchmakingInfo(),
  };
};
