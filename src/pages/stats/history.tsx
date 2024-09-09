import { MatchHistoryTable, Pagination, SelectOptions } from "@/components";
import { useApi } from "@/api/hooks";
import { NextPageContext } from "next";
import { MatchPageDto } from "@/api/back";
import c from "./History.module.scss";
import { MatchmakingMode } from "@/const/enums";
import { formatGameMode } from "@/util/gamemode";
import { AppRouter } from "@/route";
import { useDidMount, useQueryBackedParameter } from "@/util/hooks";
import React, { useEffect } from "react";

interface MatchHistoryProps {
  matches: MatchPageDto;
  initialPage: number;
  initialMode?: number;
}

const GameModeOptions = [
  { value: "undefined", label: "Все режимы" },
  ...[
    MatchmakingMode.RANKED,
    MatchmakingMode.UNRANKED,
    MatchmakingMode.SOLOMID,
    MatchmakingMode.BOTS,
  ].map((it) => ({
    value: it,
    label: formatGameMode(it),
  })),
];
export default function MatchHistory({
  matches,
  initialPage,
  initialMode,
}: MatchHistoryProps) {
  const [page, setPage] = useQueryBackedParameter(
    "page",
    initialPage.toString(),
  );
  const [mode, setMode] = useQueryBackedParameter(
    "mode",
    initialMode?.toString(),
  );

  const didMount = useDidMount();

  const { data, isLoading, isValidating, mutate } =
    useApi().matchApi.useMatchControllerMatches(
      Number(page),
      undefined,
      Number(mode),
      {
        fallbackData: matches,
        isPaused() {
          return !didMount;
        },
      },
    );

  useEffect(() => {
    if (data && page >= data.pages) {
      console.log("snap!");
      setPage(data.pages - 1);
    }
  }, [data?.pages]);

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
      <div>
        <MatchHistoryTable loading={isLoading} data={data?.data || []} />
        <Pagination
          linkProducer={(page) =>
            AppRouter.history.page(page, mode | undefined).link
          }
          page={Number(page) || data?.page || 0}
          maxPage={data?.pages || 0}
        />
      </div>
    </>
  );
}

MatchHistory.getInitialProps = async (
  ctx: NextPageContext,
): Promise<MatchHistoryProps> => {
  const page = Number(ctx.query.page as string) || 0;
  const mode = Number(ctx.query.mode as string);

  const matches = await useApi().matchApi.matchControllerMatches(
    page,
    undefined,
    mode,
  );

  return {
    matches,
    initialPage: page,
    initialMode: mode,
  };
};
