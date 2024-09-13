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
      <header>{inviter} приглашает в группу</header>

      <div className={c.buttons}>
        <button onClick={onAccept}>Принять</button>
        <button onClick={onDecline}>Отклонить</button>
      </div>
    </div>
  );
};
