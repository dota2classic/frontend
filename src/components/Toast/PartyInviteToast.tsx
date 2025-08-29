import { ToastContentProps } from "react-toastify";
import c from "@/components/Toast/Toast.module.scss";
import React, { useCallback } from "react";
import { Button } from "@/components";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { UserDTO } from "@/api/back";
import { useTranslation } from "react-i18next";

interface PartyInviteToastProps {
  inviteId: string;
  inviter: UserDTO;
}
export const PartyInviteToastFactory: React.FC<
  ToastContentProps & PartyInviteToastProps
> = observer(({ closeToast, inviteId, inviter }) => {
  const { queue } = useStore();
  const { t } = useTranslation();

  const accept = useCallback(() => {
    queue.acceptParty(inviteId);
  }, [inviteId, queue]);

  const decline = useCallback(() => {
    queue.declineParty(inviteId);
  }, [inviteId, queue]);
  return (
    <div className={c.toast}>
      <div className={c.content}>
        {t("party_invite.groupInvite", {
          username: inviter.name,
        })}
      </div>
      <div className={c.buttons}>
        <Button onClick={accept} className={c.accept}>
          {t("party_invite.accept")}
        </Button>
        <Button
          onClick={() => {
            decline();
            closeToast();
          }}
        >
          {t("party_invite.decline")}
        </Button>
      </div>
    </div>
  );
});
