import React, { useCallback, useState } from "react";
import { Button, GenericModal, Input } from "@/components";
import { LobbyDto } from "@/api/back";
import { getApi } from "@/api/hooks";
import { AppRouter } from "@/route";
import c from "./JoinLobbyModal.module.scss";
import { useTranslation } from "react-i18next";

interface IJoinLobbyModalProps {
  onClose: () => void;
  lobby: LobbyDto;
}

export const JoinLobbyModal: React.FC<IJoinLobbyModalProps> = ({
  onClose,
  lobby,
}) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | undefined>(undefined);
  const canJoin = lobby.requiresPassword ? password.length > 0 : true;

  const join = useCallback(async () => {
    try {
      const r = await getApi().lobby.lobbyControllerJoinLobby(lobby.id, {
        password: lobby.requiresPassword ? password : undefined,
      });
      AppRouter.lobby.lobby(r.id).open(false);
    } catch (err: unknown) {
      const e = err as Response;
      if (e.status === 403) {
        setError(t("join_lobby_modal.incorrectPassword"));
      } else {
        setError(e.statusText);
      }
    }
  }, [lobby.id, lobby.requiresPassword, password]);
  return (
    <GenericModal
      onClose={onClose}
      title={t("join_lobby_modal.joinToLobby")}
      className={c.modal}
    >
      <header>
        {t("join_lobby_modal.lobby", { ownerName: lobby.owner.name })}
      </header>
      {lobby.requiresPassword && (
        <Input onChange={(e) => setPassword(e.target.value)} value={password} />
      )}

      {error && <span>{error}</span>}
      <Button disabled={!canJoin} onClick={join}>
        {t("join_lobby_modal.join")}
      </Button>
    </GenericModal>
  );
};
