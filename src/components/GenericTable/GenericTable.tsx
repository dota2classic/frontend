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
}

interface Column {
  name: ReactNode;
  type: ColumnType;
  color?: string;
  noname?: boolean;

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
              col.link ? col.link(data) : AppRouter.player(value.steam_id).link
            }
          >
            {value.name}
          </PageLink>
        </div>
      </td>
    );
  } else if (type === ColumnType.Hero) {
    return (
      <td className={c.item}>
        {col.noname ? (
          <HeroIcon small hero={value} />
        ) : (
          <div className={c.player}>
            <HeroIcon small hero={value} />
            <PageLink
              link={
                col.link ? col.link(data) : AppRouter.heroes.hero(value).link
              }
            >
              {heroName(value)}
            </PageLink>
          </div>
        )}
      </td>
    );
  } else if (type === ColumnType.KDA) {
    return (
      <td>
        <div className={c.kda}>
          <span>
            {value.kills.toFixed(2)} / {value.deaths.toFixed(2)} /{" "}
            {value.assists.toFixed(2)}
          </span>
          <KDABarChart
            kills={value.kills}
            deaths={value.deaths}
            assists={value.assists}
          />
        </div>
      </td>
    );
  } else if (type === ColumnType.Item) {
    return (
      <td style={{ width: 20 }} className={c.item}>
        <ItemIcon small item={value} />
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

const RowRenderer: React.FC<{ data: Data; columns: Column[]; ctx: any[] }> = ({
  data,
  columns,
  ctx,
}) => {
  return (
    <tr>
      {data.slice(0, columns.length).map((it, index) => (
        <ColRenderer
          data={data}
          key={it}
          ctx={ctx[index]}
          value={it}
          col={columns[index]}
        />
      ))}
    </tr>
  );
};

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
      return { max: maxBy(data, (it) => it[index])[index] };
    }

    return {};
  });

  return (
    <Table className={cx("compact", className)}>
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index}>{col.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <TableRowLoading columns={columns.length} rows={placeholderRows} />
        ) : (
          data.map((it) => (
            <RowRenderer
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
