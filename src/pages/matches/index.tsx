import { MatchHistoryTable, Pagination, SelectOptions } from "@/components";
import { useApi } from "@/api/hooks";
import { NextPageContext } from "next";
import { MatchPageDto } from "@/api/back";
import c from "./History.module.scss";
import { AppRouter } from "@/route";
import { useQueryBackedParameter, useRouterChanging } from "@/util/hooks";
import React, { useEffect } from "react";
import { numberOrDefault } from "@/util/urls";
import Head from "next/head";
import { GameModeOptions } from "@/components/SelectOptions/SelectOptions";

interface MatchHistoryProps {
  matches: MatchPageDto;
  initialPage: number;
  initialMode?: number;
}

export default function MatchHistory({
  matches,
  initialPage,
  initialMode,
}: MatchHistoryProps) {
  const [page, setPage] = useQueryBackedParameter("page");
  const [mode, setMode] = useQueryBackedParameter("mode");

  const [isLoading] = useRouterChanging();

  const data = matches;

  useEffect(() => {
    if (data && numberOrDefault(page, 0) >= data.pages) {
      setPage(data.pages - 1);
    }
  }, [data?.pages]);

  return (
    <>
      <Head>
        <title>Матчи</title>
      </Head>
      <div className={c.panel}>
        <SelectOptions
          options={GameModeOptions}
          selected={mode === undefined ? "undefined" : mode}
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