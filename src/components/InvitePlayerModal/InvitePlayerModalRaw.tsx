import React, { useRef, useState } from "react";

import { GenericModal, Input, UserPreview } from "..";

import c from "./InvitePlayerModal.module.scss";
import { getApi } from "@/api/hooks";
import { UserDTO } from "@/api/back";
import { GreedyFocusPriority, useGreedyFocus } from "@/util/useTypingCallback";

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
  return (
    <GenericModal
      className={c.invitePlayerModal}
      onClose={close}
      title="Выбрать игрока"
    >
      {/*<h2>Искать</h2>*/}
      <Input
        ref={inputRef}
        placeholder={"Никнейм игрока"}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className={c.playerList}>
        {(data || [])
          .filter((it) => it.steamId.length > 2)
          .map((it: UserDTO) => (
            <UserPreview
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
