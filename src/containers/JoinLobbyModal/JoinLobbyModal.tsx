import React, { useCallback, useState } from "react";
import { Button } from "@/components/Button";
import { GenericModal } from "@/components/GenericModal";
import { Input } from "@/components/Input";
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
      <Button disabled={canJoin}>
        {t("join_lobby_modal.join")}
      </Button>
    </GenericModal>
  );
};
