import React from "react";

import { Duration, HeroIcon, PageLink, Table, TimeAgo } from "..";
import { MatchDto } from "@/api/back";
import c from "./MatchHistoryTable.module.scss";
import { AppRouter } from "@/route";
import {formatGameMode} from "@/util/gamemode";

interface IMatchHistoryTableProps {
  data: MatchDto[];
}

export const MatchHistoryTable: React.FC<IMatchHistoryTableProps> = ({
  data,
}) => {
  return (
    <Table className='compact'>
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
        {data.map((it) => (
          <tr key={it.id}>
            <td>
              <div className={c.matchId}>
                <PageLink
                  link={AppRouter.match(it.id).link}
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
              <PageLink
                link={AppRouter.match(it.id).link}
              >
                {it.winner === 2 ? "Победа Сил Света" : "Победа Сил Тьмы"}
              </PageLink>
            </td>
            <td>
              <Duration duration={it.duration} />
            </td>
            <td>
              {it.radiant.map((plr) => (
                <HeroIcon small key={plr.hero} hero={plr.hero} />
              ))}
            </td>
            <td>
              {it.dire.map((plr) => (
                <HeroIcon small key={plr.hero} hero={plr.hero} />
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
