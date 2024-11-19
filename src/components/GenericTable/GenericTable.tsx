/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: Refactor from any => Types for columns and type guards by column type
import React, { ReactNode, useState } from "react";
import c from "./GenericTable.module.scss";
import {
  HeroIcon,
  ItemIcon,
  ItemIconRaw,
  KDABarChart,
  PageLink,
  PlayerAvatar,
  Table,
  TableRowLoading,
} from "..";
import { AppRouter, NextLinkProp } from "@/route";
import { SingleWeightedBarChart } from "@/components/BarChart/BarChart";
import heroName, { itemName } from "@/util/heroName";
import cx from "clsx";
import { maxBy } from "@/util/iter";
import { FaSort } from "react-icons/fa6";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import { colors } from "@/colors";

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
  PM_PAIR,
  ExternalLink,
}

interface Column {
  name: ReactNode;
  type: ColumnType;
  color?: string;
  noname?: boolean;

  mobileOmit?: boolean;

  sortable?: boolean;
  sortKey?: (d: any) => number;
  defaultSort?: "asc" | "desc";

  forceInteger?: boolean;

  format?: (d: any) => ReactNode;

  link?: (d: Data) => NextLinkProp;
}

type Data = any[];

interface Props {
  columns: Column[];
  data: Data[];
  keyProvider: (d: Data) => React.Key;
  isLoading?: boolean;
  placeholderRows: number;
  className?: string;
}

interface KDATableDataProps {
  forceInteger?: boolean;
  kills: number;
  deaths: number;
  assists: number;
}

function Comparator(a: any, b: any) {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
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
          {kills.toFixed(1)} / {deaths.toFixed(1)} / {assists.toFixed(1)}
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
      <td className={col.mobileOmit ? "omit" : undefined}>
        <div className={c.player}>
          <PlayerAvatar
            width={40}
            height={40}
            className={c.avatar}
            src={value.avatarSmall || "/avatar.png"}
            alt={`Avatar of player ${value.name}`}
          />
          <PageLink
            className="link"
            link={
              col.link
                ? col.link(data)
                : AppRouter.players.player.index(value.steamId).link
            }
          >
            {Number(value.steamId) > 10 ? value.name : "Бот"}
          </PageLink>
        </div>
      </td>
    );
  } else if (type === ColumnType.Hero) {
    return (
      <td className={cx({ [c.hero]: !col.noname, omit: col.mobileOmit })}>
        <PageLink
          link={
            col.link ? col.link(data) : AppRouter.heroes.hero.index(value).link
          }
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
      <td className={col.mobileOmit ? "omit" : undefined}>
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
      <td
        style={{ width: col.noname ? 20 : 120, overflow: "hidden" }}
        className={cx(c.item, col.mobileOmit ? "omit" : undefined)}
      >
        {col.noname ? (
          <ItemIcon small item={value} />
        ) : (
          <PageLink
            link={AppRouter.items.item(value).link}
            className={c.oneliner}
          >
            <ItemIconRaw small item={value} />
            <span>{!col.noname && itemName(value)}</span>
          </PageLink>
        )}
      </td>
    );
  } else if (type === ColumnType.Items) {
    return (
      <td className={col.mobileOmit ? "omit" : undefined}>
        {value.map((item: string, idx: number) => (
          <ItemIcon small key={idx} item={item} />
        ))}
      </td>
    );
  } else if (type === ColumnType.PM_PAIR) {
    return (
      <td className={col.mobileOmit ? "omit" : undefined}>
        {Math.round(value[0]).toString()} / {Math.round(value[1]).toString()}
      </td>
    );
  } else if (type === ColumnType.IntWithBar) {
    return (
      <td className={col.mobileOmit ? "omit" : undefined}>
        <div>{col.format ? col.format(value) : Math.round(value)}</div>
        <SingleWeightedBarChart
          value={value / ctx.max}
          color={col.color || "red"}
        />
      </td>
    );
  } else if (type === ColumnType.FloatWithBar) {
    return (
      <td className={col.mobileOmit ? "omit" : undefined}>
        <div>{value.toFixed(2)}</div>
        <SingleWeightedBarChart
          value={value / ctx.max}
          color={col.color || "red"}
        />
      </td>
    );
  } else if (type === ColumnType.PercentWithBar) {
    return (
      <td className={col.mobileOmit ? "omit" : undefined}>
        <div>{value.toFixed(2)}%</div>
        <SingleWeightedBarChart
          value={value / ctx.max}
          color={col.color || "red"}
        />
      </td>
    );
  } else if (type === ColumnType.Raw) {
    return (
      <td className={cx(c.raw, col.mobileOmit ? "omit" : undefined)}>
        {col.format ? col.format(value) : value}
      </td>
    );
  } else if (type === ColumnType.ExternalLink) {
    return (
      <td className={cx(c.raw, col.mobileOmit ? "omit" : undefined)}>
        <a style={{ color: colors.green }} target="__blank" href={value.link}>
          {value.label}
        </a>
      </td>
    );
  }

  return <td></td>;
};

const RowRendererMemo: React.FC<{ data: Data; columns: Column[]; ctx: any[] }> =
  React.memo(function RowRenderer({ data, columns, ctx }) {
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

interface SortOptions {
  columnIndex: number;
  order: "asc" | "desc";
}

export const GenericTable: React.FC<Props> = ({
  columns,
  data,
  keyProvider,
  isLoading,
  placeholderRows,
  className,
}) => {
  const defaultSortColIndex = columns.findIndex(
    (it) => it.sortable && it.defaultSort,
  );

  const defaultSort: SortOptions | undefined =
    defaultSortColIndex !== -1
      ? {
          columnIndex: defaultSortColIndex,
          order: columns[defaultSortColIndex].defaultSort || "desc",
        }
      : undefined;
  const [sortBy, setSortBy] = useState<SortOptions | undefined>(defaultSort);

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

  const sortedData =
    sortBy === undefined
      ? data
      : data.toSorted((a, b) => {
          const v1 = a[sortBy.columnIndex];
          const v2 = b[sortBy.columnIndex];

          const sortFunction =
            columns[sortBy.columnIndex].sortKey ||
            function (t) {
              return t;
            };

          const diff = Comparator(sortFunction(v1), sortFunction(v2));

          return sortBy.order === "asc" ? diff : -diff;
        });

  return (
    <Table className={cx("compact", className)}>
      <thead>
        <tr>
          {columns.map((col, index) => {
            const sortable = col.sortable;
            const isSortedByThisColumn = sortBy && sortBy.columnIndex === index;
            const sortOrder = sortBy?.order;

            return (
              <th
                className={cx(c.sortable, {
                  [c.hero]: col.type === ColumnType.Hero,
                  omit: col.mobileOmit,
                })}
                key={index}
                onClick={() => {
                  if (!sortable) return;

                  const sOrder = isSortedByThisColumn ? sortOrder : undefined;
                  switch (sOrder) {
                    case undefined:
                      setSortBy({ columnIndex: index, order: "desc" });
                      break;
                    case "desc":
                      setSortBy({ columnIndex: index, order: "asc" });
                      break;
                    case "asc":
                      setSortBy(undefined);
                      break;
                  }
                }}
              >
                {col.name}{" "}
                {sortable && isSortedByThisColumn && sortOrder === "desc" && (
                  <FaSortAmountDown />
                )}
                {sortable && isSortedByThisColumn && sortOrder === "asc" && (
                  <FaSortAmountUp />
                )}
                {sortable &&
                  (!isSortedByThisColumn || sortOrder === undefined) && (
                    <FaSort />
                  )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <TableRowLoading columns={columns.length} rows={placeholderRows} />
        ) : sortedData.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className={c.empty}>
              К сожалению, за данный период статистики нет.
            </td>
          </tr>
        ) : (
          sortedData.map((it) => (
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
