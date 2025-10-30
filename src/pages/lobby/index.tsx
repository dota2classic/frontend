import { getApi } from "@/api/hooks";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { NextPageContext } from "next";
import { LobbyDto } from "@/api/back";
import { Button } from "@/components/Button";
import { EmbedProps } from "@/components/EmbedProps";
import { Table } from "@/components/Table";
import { UserPreview } from "@/components/UserPreview";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import c from "./Lobby.module.scss";
import React, { useCallback, useEffect, useState } from "react";
import { JoinLobbyModal } from "@/containers/JoinLobbyModal";
import { observer } from "mobx-react-lite";
import { paidAction } from "@/util/subscription";
import { handleException } from "@/util/handleException";
import { useTranslation } from "react-i18next";
import { TranslationKey } from "@/TranslationKey";

interface Props {
  lobbies: LobbyDto[];
}
const ListLobbies = observer(function ListLobbies({ lobbies }: Props) {
  const { t } = useTranslation();
  const { auth } = useStore();
  const router = useRouter();

  const [pendingLobby, setPendingLobby] = useState<LobbyDto | undefined>(
    undefined,
  );

  useEffect(() => {
    const joinLobbyId = router.query.join;
    const lobby = lobbies.find((t) => t.id === joinLobbyId);
    if (lobby) {
      setPendingLobby(lobby);
    }
  }, [lobbies, router]);

  const createLobby = useCallback(
    paidAction(async () => {
      try {
        return getApi()
          .lobby.lobbyControllerCreateLobby()
          .then((lobby) => router.push(`/lobby/[id]`, `/lobby/${lobby.id}`));
      } catch (e) {
        await handleException(t("lobby.createError"), e);
      }
    }),
    [],
  );

  return (
    <>
      <EmbedProps
        title={t("lobby.listTitle")}
        description={t("lobby.listDescription")}
      />
      {pendingLobby && (
        <JoinLobbyModal
          lobby={pendingLobby}
          onClose={() => setPendingLobby(undefined)}
        />
      )}
      <Button className={c.createLobby} onClick={createLobby}>
        {t("lobby.createLobby")}
      </Button>
      <Table>
        <thead>
          <tr>
            <th>{t("lobby.table.lobby")}</th>
            <th>{t("lobby.table.host")}</th>
            <th>{t("lobby.table.mode")}</th>
            <th>{t("lobby.table.map")}</th>
            <th>{t("lobby.table.playerCount")}</th>
            <th>{t("lobby.table.privacy")}</th>
            <th>{t("lobby.table.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {lobbies.length === 0 ? (
            <td colSpan={7} className={c.empty}>
              {t("lobby.emptyList")}
            </td>
          ) : (
            lobbies.map((lobby) => (
              <tr key={lobby.id}>
                <td>{lobby.name}</td>
                <td>
                  <UserPreview avatarSize={30} user={lobby.owner} />
                </td>
                <td>
                  <dd>{t(`game_mode.${lobby.gameMode}` as TranslationKey)}</dd>
                </td>
                <td>{t(`dota_map.${lobby.map}` as TranslationKey)}</td>
                <td>
                  {lobby.slots.filter((t) => t.user).length}
                  {" / "}
                  {lobby.slots.length}
                </td>
                <td>
                  {lobby.requiresPassword
                    ? t("lobby.passwordRequired")
                    : t("lobby.passwordNotRequired")}
                </td>
                <td>
                  <Button
                    disabled={!auth.isAuthorized}
                    small
                    onClick={() => setPendingLobby(lobby)}
                  >
                    {t("lobby.join")}
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </>
  );
});

export default ListLobbies;

ListLobbies["getInitialProps"] = async (
  ctx: NextPageContext,
): Promise<Props> => {
  const lobbies = await withTemporaryToken(ctx, () =>
    getApi().lobby.lobbyControllerListLobbies(),
  );

  return {
    lobbies,
  };
};
