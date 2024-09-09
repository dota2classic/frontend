import {MatchHistoryTable, SelectOptions} from "@/components";
import { useApi } from "@/api/hooks";
import { useQueryBackedParameter } from "@/util/hooks";
import { NextPageContext } from "next";
import PlayerPage from "@/pages/player/[id]";
import { MatchPageDto } from "@/api/back";
import c from "./History.module.scss";
import { MatchmakingMode } from "@/const/enums";
import {formatGameMode} from "@/util/gamemode";

interface MatchHistoryProps {
  matches: MatchPageDto;
}

const GameModeOptions = [
  { value: "undefined", label: "Все режимы" },
  ...[MatchmakingMode.RANKED, MatchmakingMode.UNRANKED, MatchmakingMode.SOLOMID, MatchmakingMode.BOTS].map(it => ({
    value: it,
    label: formatGameMode(it)
  }))
]
export default function MatchHistory({ matches }: MatchHistoryProps) {
  const [page, setPage] = useQueryBackedParameter("page", 0);
  const [mode, setMode] = useQueryBackedParameter("mode", undefined);
  // const [mode, setMode] = useState<MatchmakingMode | undefined>(undefined);
  const { data } = useApi().matchApi.useMatchControllerMatches(
    page || 0,
    undefined,
    mode,
    {
      fallbackData: matches,
      isPaused() {
        return !!matches;
      },
    },
  );

  return (
    <>
      <div className={c.panel}>
        <SelectOptions
          options={GameModeOptions}
          selected={mode}
          onSelect={(value) => {
            if (value === "undefined") setMode(undefined);
            else setMode(value);
          }}
          defaultText={"Режим игры"}
        />
      </div>
      <MatchHistoryTable data={data?.data || []} />
    </>
  );
}

PlayerPage.getInitialProps = async (
  ctx: NextPageContext,
): Promise<MatchHistoryProps> => {
  const page = Number(ctx.query.page as string) || 0;

  const matches = await useApi().matchApi.matchControllerMatches(page);

  return {
    matches,
  };
};
