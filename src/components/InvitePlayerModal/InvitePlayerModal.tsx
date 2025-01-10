import React, { useRef, useState } from "react";

import { GenericModal, Input } from "..";

import c from "./InvitePlayerModal.module.scss";
import { getApi } from "@/api/hooks";
import { useStore } from "@/store";
import { NotificationDto } from "@/store/NotificationStore";
import cx from "clsx";
import useOutsideClick from "@/util/useOutsideClick";
import { UserDTO } from "@/api/back";
import Image from "next/image";
import { observer } from "mobx-react-lite";
import { useGreedyFocus } from "@/util/useTypingCallback";

interface IInvitePlayerModalProps {
  isOpen: boolean;

  close(): void;
}

export const InvitePlayerModal: React.FC<IInvitePlayerModalProps> = observer(
  ({ isOpen, close }) => {
    const [search, setSearch] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);

    const { data } = getApi().playerApi.usePlayerControllerSearch(search);
    useGreedyFocus(100, inputRef);

    const comp = useRef<HTMLDivElement | null>(null);
    const { queue, notify } = useStore();
    useOutsideClick(close, comp);

    return (
      <GenericModal className={cx(!isOpen && "mobileHidden")}>
        <div className="modal" ref={comp}>
          <h2>Искать</h2>
          <Input
            ref={inputRef}
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
                  <Image
                    width={40}
                    height={40}
                    src={it.avatar || "/avatar.png"}
                    alt={`Avatar of ${it.name}`}
                  />
                  <span>{it.name}</span>
                </div>
              ))}
          </div>
        </div>
      </GenericModal>
    );
  },
);
