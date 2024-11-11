import React from "react";

import c from "./PartyInviteNotification.module.scss";

interface IPartyInviteNotificationProps {
  onAccept: () => void;
  onDecline: () => void;
  inviter: string;
}

export const PartyInviteNotification: React.FC<
  IPartyInviteNotificationProps
> = ({ onAccept, onDecline, inviter }) => {
  return (
    <div className={c.invite}>
      <header>
        <span className="gold">{inviter}</span> приглашает в группу
      </header>

      <div className={c.buttons}>
        <button className={c.accept} onClick={onAccept}>
          Принять
        </button>
        <button className={c.decline} onClick={onDecline}>
          Отклонить
        </button>
      </div>
    </div>
  );
};
