import React, { useRef, useState } from "react";

import { GenericModal, Input } from "..";

import c from "./InvitePlayerModal.module.scss";
import { getApi } from "@/api/hooks";
import cx from "clsx";
import useOutsideClick from "@/util/useOutsideClick";
import { UserDTO } from "@/api/back";
import Image from "next/image";

interface IInvitePlayerModalProps {
  isOpen: boolean;
  onSelect: (user: UserDTO) => void;
  close(): void;
}

export const InvitePlayerModalRaw: React.FC<IInvitePlayerModalProps> = ({
  isOpen,
  onSelect,
  close,
}) => {
  const [search, setSearch] = useState("");

  const { data } = getApi().playerApi.usePlayerControllerSearch(search);

  const comp = useRef<HTMLDivElement | null>(null);
  useOutsideClick(close, comp);

  return (
    <GenericModal className={cx(!isOpen && "mobileHidden")}>
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
                onClick={() => {
                  console.log("On selecte:", it);
                  onSelect(it);
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
};
