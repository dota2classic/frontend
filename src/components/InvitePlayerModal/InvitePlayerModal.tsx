import React, { useRef, useState } from "react";

import { GenericModal, Input } from "..";

import c from "./InvitePlayerModal.module.scss";
import { useApi } from "@/api/hooks";
import { useStore } from "@/store";
import { NotificationDto } from "@/store/NotificationStore";
import cx from "classnames";
import useOutsideClick from "@/util/useOutsideClick";
import { UserDTO } from "@/api/back";

interface IInvitePlayerModalProps {
  isOpen: boolean;

  close(): void;
}

export const InvitePlayerModal: React.FC<IInvitePlayerModalProps> = ({
  isOpen,
  close,
}) => {
  const [search, setSearch] = useState("");

  const { data } = useApi().playerApi.usePlayerControllerSearch(search);

  const comp = useRef<HTMLDivElement | null>(null);
  const { queue, notify } = useStore();
  useOutsideClick(close, comp);

  return (
    <GenericModal className={cx(!isOpen && "hidden")}>
      <div className="modal" ref={comp}>
        <h2>Искать</h2>
        <Input
          placeholder={"Никнейм игрока"}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <br />

        <div className={c.playerList}>
          {(data || [])
            .filter((it) => it.steamId.length > 2)
            .map((it: UserDTO) => (
              <div
                className={c.playerPreview}
                key={it.steamId}
                onClick={async () => {
                  queue.inviteToParty(it.steamId);
                  notify.enqueueNotification(
                    new NotificationDto(`Приглашение отправлено ${it.name}`),
                  );
                  close();
                }}
              >
                <img src={it.avatar} alt={`Avatar of ${it.name}`} />
                <span>{it.name}</span>
              </div>
            ))}
        </div>
      </div>
    </GenericModal>
  );
};
