import React, { ReactNode } from "react";
import c from "./GenericTable.module.scss";
import {
  HeroIcon,
  ItemIcon,
  KDABarChart,
  PageLink,
  Table,
  TableRowLoading,
} from "..";
import { AppRouter, NextLinkProp } from "@/route";
import { SingleWeightedBarChart } from "@/components/BarChart/BarChart";
import heroName from "@/util/heroName";
import cx from "classnames";
import { maxBy } from "@/util/iter";

export enum ColumnType {
  Raw,
  Item,
  Hero,
  Player,
  IntWithBar,
  FloatWithBar,
  PercentWithBar,
  KDA,
  Items,
}

interface Column {
  name: ReactNode;
  type: ColumnType;
  color?: string;
  noname?: boolean;

  forceInteger?: boolean;

  format?: (d: any) => ReactNode;

  link?: (d: Data) => NextLinkProp;
}

type Data = any[];

interface Props {
  columns: Column[];
  data: Data[];
  keyProvider: (d: Data) => React.Key;
  isLoading: boolean;
  placeholderRows: number;
  className?: string;
}

interface KDATableDataProps {
  forceInteger?: boolean;
  kills: number;
  deaths: number;
  assists: number;
}

export const KDATableData = ({
  kills,
  deaths,
  assists,
  forceInteger,
}: KDATableDataProps) => {
  return (
    <div className={c.kda}>
      {forceInteger ? (
        <span>
          {kills} / {deaths} / {assists}
        </span>
      ) : (
        <span>
          {kills.toFixed(2)} / {deaths.toFixed(2)} / {assists.toFixed(2)}
        </span>
      )}
      <KDABarChart kills={kills} deaths={deaths} assists={assists} />
    </div>
  );
};

const ColRenderer: React.FC<{
  value: any;
  col: Column;
  ctx: any;
  data: Data;
}> = ({ value, col, ctx, data }) => {
  const type = col.type;

  if (type === ColumnType.Player) {
    return (
      <td>
        <div className={c.player}>
          <img
            className={c.avatar}
            src={value.avatar || "/avatar.png"}
            alt=""
          />
          <PageLink
            link={
              col.link
                ? col.link(data)
                : AppRouter.players.player(value.steam_id).link
            }
          >
            {Number(value.steam_id) > 10 ? value.name : "Бот"}
          </PageLink>
        </div>
      </td>
    );
  } else if (type === ColumnType.Hero) {
    return (
      <td className={c.hero}>
        <PageLink
          link={col.link ? col.link(data) : AppRouter.heroes.hero(value).link}
        >
          {col.noname ? (
            <HeroIcon small hero={value} />
          ) : (
            <div className={c.player}>
              <HeroIcon small hero={value} />
              <span>{heroName(value)}</span>
            </div>
          )}
        </PageLink>
      </td>
    );
  } else if (type === ColumnType.KDA) {
    return (
      <td>
        <KDATableData
          forceInteger={col.forceInteger}
          deaths={value.deaths}
          assists={value.assists}
          kills={value.kills}
        />
      </td>
    );
  } else if (type === ColumnType.Item) {
    return (
      <td style={{ width: 20 }} className={c.item}>
        <ItemIcon small item={value} />
      </td>
    );
  } else if (type === ColumnType.Items) {
    return (
      <td>
        {value.map((item: string, idx: number) => (
          <ItemIcon small key={idx} item={item} />
        ))}
      </td>
    );
  } else if (type === ColumnType.IntWithBar) {
    return (
      <td>
        <div>{col.format ? col.format(value) : value}</div>
        <SingleWeightedBarChart
          value={value / ctx.max}
          color={col.color || "red"}
        />
      </td>
    );
  } else if (type === ColumnType.FloatWithBar) {
    return (
      <td>
        <div>{value.toFixed(2)}</div>
        <SingleWeightedBarChart
          value={value / ctx.max}
          color={col.color || "red"}
        />
      </td>
    );
  } else if (type === ColumnType.PercentWithBar) {
    return (
      <td>
        <div>{value.toFixed(2)}%</div>
        <SingleWeightedBarChart
          value={value / ctx.max}
          color={col.color || "red"}
        />
      </td>
    );
  } else if (type === ColumnType.Raw) {
    return <td className={c.raw}>{col.format ? col.format(value) : value}</td>;
  }

  return <td></td>;
};

const RowRendererMemo: React.FC<{ data: Data; columns: Column[]; ctx: any[] }> =
  React.memo(({ data, columns, ctx }) => {
    return (
      <tr>
        {data.slice(0, columns.length).map((it, index) => (
          <ColRenderer
            data={data}
            key={index}
            ctx={ctx[index]}
            value={it}
            col={columns[index]}
          />
        ))}
      </tr>
    );
  });

export const GenericTable: React.FC<Props> = ({
  columns,
  data,
  keyProvider,
  isLoading,
  placeholderRows,
  className,
}) => {
  const ctx = columns.map((it, index) => {
    if (
      it.type === ColumnType.IntWithBar ||
      it.type === ColumnType.FloatWithBar ||
      it.type === ColumnType.PercentWithBar
    ) {
      const max = maxBy(data, (it) => it[index]);
      return { max: (max && max[index]) || 1 };
    }

    return {};
  });

  return (
    <Table className={cx("compact", className)}>
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th
              key={index}
              className={cx({
                [c.hero]: col.type === ColumnType.Hero,
              })}
            >
              {col.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <TableRowLoading columns={columns.length} rows={placeholderRows} />
        ) : data.length === 0 ? (
          <tr>
            <td colSpan={6} className={c.empty}>
              К сожалению, за данный период статистики нет.
            </td>
          </tr>
        ) : (
          data.map((it) => (
            <RowRendererMemo
              key={keyProvider(it)}
              columns={columns}
              data={it}
              ctx={ctx}
            />
          ))
        )}
      </tbody>
    </Table>
  );
};
