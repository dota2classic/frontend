import { NextPageContext } from "next";
import { MatchPageDto } from "@/api/back";
import { AppRouter } from "@/route";
import { useQueryBackedParameter } from "@/util/useQueryBackedParameter";
import { useRouterChanging } from "@/util/useRouterChanging";
import React, { useEffect } from "react";
import { numberOrDefault, parsePage } from "@/util/urls";
import { MatchComparator } from "@/util/sorts";
import { useGameModeOptions } from "@/const/options";
import { useTranslation } from "react-i18next";
import { EmbedProps } from "@/components/EmbedProps";
import { SelectOptions } from "@/components/SelectOptions";
import { Pagination } from "@/components/Pagination";
import { MatchHistoryTable } from "@/components/MatchHistoryTable";
import { Surface } from "@/components/Surface";
import { getRequestApi } from "@/api/request-api";

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
    if (data && parsePage(page) >= data.pages) {
      setPage(data.pages - 1);
    }
  }, [data, data.pages, page, setPage]);

  return (
    <>
      <EmbedProps
        title={t("match_history.historyTitle")}
        description={t("match_history.historyDescription")}
      />
      <Surface className="horizontal" padding="xs" variant="panel">
        <SelectOptions
          options={gameModeOptions}
          selected={mode === undefined ? "undefined" : mode}
          onSelect={({ value }) => {
            if (value === "undefined") setMode(undefined);
            else setMode(value);
          }}
          defaultText={t("match_history.gameMode")}
        />
      </Surface>
      <div>
        <MatchHistoryTable
          loading={isLoading}
          data={(data?.data || []).sort(MatchComparator)}
        />
        <Pagination
          linkProducer={(page) =>
            AppRouter.matches.index(page, mode || undefined).link
          }
          page={parsePage(page)}
          maxPage={data?.pages || 0}
        />
      </div>
    </>
  );
}

MatchHistory.getInitialProps = async (
  ctx: NextPageContext,
): Promise<MatchHistoryProps> => {
  const api = getRequestApi(ctx);
  const page = parsePage(ctx.query.page);
  const mode = numberOrDefault(ctx.query.mode, undefined);

  return {
    matches: await api.matchApi.matchControllerMatches(page, undefined, mode),
  };
};
