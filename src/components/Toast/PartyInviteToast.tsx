import { ToastContentProps } from "react-toastify";
import c from "@/components/Toast/Toast.module.scss";
import React, { useCallback } from "react";
import { Button } from "@/components";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { UserDTO } from "@/api/back";

interface PartyInviteToastProps {
  inviteId: string;
  inviter: UserDTO;
}
export const PartyInviteToastFactory: React.FC<
  ToastContentProps & PartyInviteToastProps
> = observer(({ closeToast, inviteId, inviter }) => {
  const { queue } = useStore();

  const accept = useCallback(() => {
    queue.acceptParty(inviteId);
  }, [inviteId, queue]);

  const decline = useCallback(() => {
    queue.declineParty(inviteId);
  }, [inviteId, queue]);
  return (
    <div className={c.toast}>
      <div className={c.content}>
        <span className="gold">{inviter.name}</span> приглашает тебя в группу
      </div>
      <div className={c.buttons}>
        <Button onClick={accept} className={c.accept}>
          Принять
        </Button>
        <Button
          onClick={() => {
            decline();
            closeToast();
          }}
        >
          Отклонить
        </Button>
      </div>
    </div>
  );
});
