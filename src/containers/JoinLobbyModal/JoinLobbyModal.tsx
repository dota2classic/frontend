import React, { useCallback, useState } from "react";
import { Button, GenericModal, Input } from "@/components";
import { LobbyDto } from "@/api/back";
import { getApi } from "@/api/hooks";
import { AppRouter } from "@/route";
import c from "./JoinLobbyModal.module.scss";

interface IJoinLobbyModalProps {
  onClose: () => void;
  lobby: LobbyDto;
}

export const JoinLobbyModal: React.FC<IJoinLobbyModalProps> = ({
  onClose,
  lobby,
}) => {
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
        setError("Неправильный пароль");
      } else {
        setError(e.statusText);
      }
    }
  }, [lobby.id, lobby.requiresPassword, password]);
  return (
    <GenericModal
      onClose={onClose}
      title={"Присоединиться к лобби"}
      className={c.modal}
    >
      <header>Лобби {lobby.owner.name}</header>
      {lobby.requiresPassword && (
        <Input onChange={(e) => setPassword(e.target.value)} value={password} />
      )}

      {error && <span>{error}</span>}
      <Button disabled={!canJoin} onClick={join}>
        Присоединиться
      </Button>
    </GenericModal>
  );
};
