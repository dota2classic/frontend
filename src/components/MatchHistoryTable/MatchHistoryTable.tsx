import React from "react";

import {
  Duration,
  HeroIcon,
  PageLink,
  Table,
  TableRowLoading,
  TimeAgo,
} from "..";
import { MatchDto } from "@/api/back";
import c from "./MatchHistoryTable.module.scss";
import { AppRouter } from "@/route";
import { formatGameMode } from "@/util/gamemode";
import cx from "classnames";
import { SingleWeightedBarChart } from "@/components/BarChart/BarChart";
import { colors } from "@/colors";
import { maxBy } from "@/util/iter";

interface IMatchHistoryTableProps {
  data: MatchDto[];
  loading: boolean;
  perPage?: number;
  className?: string;
}

export const MatchHistoryTable: React.FC<IMatchHistoryTableProps> = ({
  data,
  loading,
  perPage,
  className,
}) => {
  const maxDuration = maxBy(data, (it) => it.duration)?.duration || 1;
  return (
    <Table className={cx("compact", className)}>
      <thead>
        <tr>
          <th>Номер матча</th>
          <th>Режим игры</th>
          <th>Результат</th>
          <th>Длительность</th>
          <th>Силы Света</th>
          <th>Силы Тьмы</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <TableRowLoading rows={perPage || 25} columns={6} />
        ) : (
          data.map((it) => (
            <tr key={it.id}>
              <td>
                <div className={c.matchId}>
                  <PageLink
                    link={AppRouter.matches.match(it.id).link}
                    className={c.matchId__id}
                  >
                    {it.id}
                  </PageLink>
                  <span className={c.matchId__timeAgo}>
                    <TimeAgo date={it.timestamp} />
                  </span>
                </div>
              </td>
              <td>{formatGameMode(it.mode)}</td>
              <td className={it.winner === 2 ? c.radiant : c.dire}>
                <PageLink link={AppRouter.matches.match(it.id).link}>
                  {it.winner === 2 ? "Победа Сил Света" : "Победа Сил Тьмы"}
                </PageLink>
              </td>
              <td>
                <Duration duration={it.duration} />
                <SingleWeightedBarChart
                  value={it.duration / maxDuration}
                  color={colors.grey}
                />
              </td>
              <td className={c.heroes}>
                {it.radiant.map((plr) => (
                  <HeroIcon small key={plr.hero} hero={plr.hero} />
                ))}
              </td>
              <td className={c.heroes}>
                {it.dire.map((plr) => (
                  <HeroIcon small key={plr.hero} hero={plr.hero} />
                ))}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
};
