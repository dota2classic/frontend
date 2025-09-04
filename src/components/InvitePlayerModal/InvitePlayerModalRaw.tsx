import React, { useRef, useState } from "react";

import c from "./InvitePlayerModal.module.scss";
import { getApi } from "@/api/hooks";
import { UserDTO } from "@/api/back";
import { GreedyFocusPriority, useGreedyFocus } from "@/util/useTypingCallback";
import { useTranslation } from "react-i18next";
import { GenericModal } from "../GenericModal";
import { Input } from "../Input";
import { UserPreview } from "../UserPreview";

interface IInvitePlayerModalProps {
  onSelect: (user: UserDTO) => void;
  close(): void;
}

export const InvitePlayerModalRaw: React.FC<IInvitePlayerModalProps> = ({
  onSelect,
  close,
}) => {
  const [search, setSearch] = useState("");

  const { data } = getApi().playerApi.usePlayerControllerSearch(search, 25);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useGreedyFocus(GreedyFocusPriority.INVITE_PLAYER_MODAL, inputRef);
  const { t } = useTranslation();
  return (
    <GenericModal
      className={c.invitePlayerModal}
      onClose={close}
      title={t("invite_player_modal.selectPlayer")}
    >
      <Input
        ref={inputRef}
        placeholder={t("invite_player_modal.playerNickname")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className={c.playerList}>
        {(data || [])
          .filter((it) => it.steamId.length > 2)
          .map((it: UserDTO) => (
            <UserPreview
              roles
              onClick={() => onSelect(it)}
              nolink
              key={it.steamId}
              user={it}
              className={c.playerPreview}
            />
          ))}
      </div>
    </GenericModal>
  );
};
