import {
  EmbedProps,
  MatchHistoryTable,
  Pagination,
  Panel,
  SelectOptions,
} from "@/components";
import { getApi } from "@/api/hooks";
import { NextPageContext } from "next";
import { MatchPageDto } from "@/api/back";
import { AppRouter } from "@/route";
import { useQueryBackedParameter, useRouterChanging } from "@/util";
import React, { useEffect } from "react";
import { numberOrDefault } from "@/util/urls";
import { MatchComparator } from "@/util/sorts";
import { useGameModeOptions } from "@/const/options";
import { useTranslation } from "react-i18next";

interface MatchHistoryProps {
  matches: MatchPageDto;
}

export default function MatchHistory({ matches }: MatchHistoryProps) {
  const { t } = useTranslation();
  const [page, setPage] = useQueryBackedParameter("page");
  const [mode, setMode] = useQueryBackedParameter("mode");

  const gameModeOptions = useGameModeOptions();

  const [isLoading] = useRouterChanging();

  const data = matches;

  useEffect(() => {
    if (data && numberOrDefault(page, 0) >= data.pages) {
      setPage(data.pages - 1);
    }
  }, [data, data.pages, page, setPage]);

  return (
    <>
      <EmbedProps
        title={t("match_history.historyTitle")}
        description={t("match_history.historyDescription")}
      />
      <Panel style={{ flexDirection: "row" }}>
        <SelectOptions
          options={gameModeOptions}
          selected={mode === undefined ? "undefined" : mode}
          onSelect={({ value }) => {
            if (value === "undefined") setMode(undefined);
            else setMode(value);
          }}
          defaultText={t("match_history.gameMode")}
        />
      </Panel>
      <div>
        <MatchHistoryTable
          loading={isLoading}
          data={(data?.data || []).sort(MatchComparator)}
        />
        <Pagination
          linkProducer={(page) =>
            AppRouter.matches.index(page, mode || undefined).link
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
  const page = numberOrDefault(ctx.query.page as string, 0);
  const mode = numberOrDefault(ctx.query.mode, undefined);

  return {
    matches: await getApi().matchApi.matchControllerMatches(
      page,
      undefined,
      mode,
    ),
  };
};
