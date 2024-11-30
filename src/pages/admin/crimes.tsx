import { NextPageContext } from "next";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { getApi } from "@/api/hooks";
import { BanReason, CrimeLogPageDto } from "@/api/back";
import { numberOrDefault } from "@/util/urls";
import { Button, GenericTable, Pagination, Panel, TimeAgo } from "@/components";
import { ColumnType } from "@/components/GenericTable/GenericTable";
import React, { useCallback, useState } from "react";
import { AppRouter } from "@/route";
import { formatBanReason } from "@/util/bans";
import { InvitePlayerModalRaw } from "@/components/InvitePlayerModal/InvitePlayerModalRaw";

interface Props {
  crime: CrimeLogPageDto;
  page: number;
  steamId?: string;
}

export default function CrimesPage({ crime, steamId }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  const close = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);
  const open = useCallback(() => {
    setModalOpen(true);
  }, [setModalOpen]);
  return (
    <>
      <InvitePlayerModalRaw
        isOpen={modalOpen}
        close={close}
        onSelect={(user) => {
          AppRouter.admin.crimes(0, user.steamId).open();
          close();
        }}
      />
      <Panel>
        <Button onClick={open}>Фильтровать по игроку</Button>
        <Button
          disabled={!steamId}
          onClick={() => AppRouter.admin.crimes(0).open()}
        >
          Сбросить фильтр по игроку
        </Button>
      </Panel>
      <Pagination
        page={crime.page}
        maxPage={crime.pages}
        linkProducer={(pg) => AppRouter.admin.crimes(pg).link}
      />
      <GenericTable
        keyProvider={(it) => it[4]}
        columns={[
          {
            type: ColumnType.Player,
            name: "Игрок",
          },
          {
            type: ColumnType.Raw,
            name: "Нарушение",
            format: (t: BanReason) => (
              <span style={{ whiteSpace: "nowrap" }}>{formatBanReason(t)}</span>
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
  const steamId = ctx.query.steam_id as string | undefined;

  return {
    crime: await withTemporaryToken(ctx, () =>
      getApi().adminApi.adminUserControllerCrimes(page, undefined, steamId),
    ),
    page,
    steamId,
  };
};
