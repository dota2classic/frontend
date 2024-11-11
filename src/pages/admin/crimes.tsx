import { NextPageContext } from "next";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { getApi } from "@/api/hooks";
import { BanReason, CrimeLogPageDto } from "@/api/back";
import { numberOrDefault } from "@/util/urls";
import { GenericTable, Pagination, TimeAgo } from "@/components";
import { ColumnType } from "@/components/GenericTable/GenericTable";
import React, { ReactNode } from "react";
import { AppRouter } from "@/route";

interface Props {
  crime: CrimeLogPageDto;
}

const s: Record<BanReason, ReactNode> = {
  [BanReason.GAME_DECLINE]: "Отклонил игру",
  [BanReason.INFINITE_BAN]: "Пермабан",
  [BanReason.REPORTS]: "Репорт",
  [BanReason.LOAD_FAILURE]: "Не загрузился",
};

export default function CrimesPage({ crime }: Props) {
  return (
    <>
      <Pagination
        page={crime.page}
        maxPage={crime.pages}
        linkProducer={(pg) => AppRouter.admin.crimes(pg).link}
      />
      <GenericTable
        keyProvider={(it) => it[3]}
        columns={[
          {
            type: ColumnType.Player,
            name: "Игрок",
          },
          {
            type: ColumnType.Raw,
            name: "Нарушение",
            format: (t: BanReason) => (
              <span style={{ whiteSpace: "nowrap" }}>{s[t]}</span>
            ),
          },
          {
            type: ColumnType.Raw,
            name: "Дата",
            format: (t) => (
              <span style={{ whiteSpace: "nowrap" }}>
                <TimeAgo date={t} />
              </span>
            ),
          },
          {
            type: ColumnType.Raw,
            name: "Обработано?",
            format: (t) => <input type="checkbox" readOnly checked={t} />,
          },
        ]}
        data={crime.data.map((t) => [
          t.user,
          t.crime,
          t.createdAt,
          t.handled,
          t.id,
        ])}
        placeholderRows={5}
      />
      <Pagination
        page={crime.page}
        maxPage={crime.pages}
        linkProducer={(pg) => AppRouter.admin.crimes(pg).link}
      />
    </>
  );
}

CrimesPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const page = numberOrDefault(ctx.query.page as string, 0);

  return {
    crime: await withTemporaryToken(ctx, () =>
      getApi().adminApi.adminUserControllerCrimes(page),
    ),
  };
};
