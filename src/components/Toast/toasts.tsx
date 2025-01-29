import { toast, ToastContent, ToastContentProps } from "react-toastify";
import c from "@/components/Toast/Toast.module.scss";
import React, { ReactNode } from "react";
import {
  AchievementKey,
  MatchmakingMode,
  NotificationDto,
  NotificationDtoEntityTypeEnum,
} from "@/api/back";
import { GenericToast } from "@/components";
import { getApi } from "@/api/hooks";
import { __unsafeGetClientStore } from "@/store";
import { PartyInviteReceivedMessageS2C } from "@/store/queue/messages/s2c/party-invite-received-message.s2c";
import { AchievementMapping } from "@/components/AchievementStatus/achievement-mapping";
import { PleaseGoQueueToast } from "@/components/Toast/PleaseGoQueueToast";
import { SimpleToast } from "@/components/Toast/SimpleToast";

export const createAcceptPartyToast = (
  invite: PartyInviteReceivedMessageS2C,
) => {
  const PartyToast: React.FC<ToastContentProps> = (props) => (
    <GenericToast
      {...props}
      title={`${invite.inviter.name}`}
      content={"Приглашает присоединиться к своей группе"}
      acceptText={"Принять"}
      onAccept={() =>
        __unsafeGetClientStore().queue.acceptParty(invite.inviteId)
      }
      declineText={"Отклонить"}
      onDecline={() =>
        __unsafeGetClientStore().queue.declineParty(invite.inviteId)
      }
    />
  );
  toast(PartyToast as ToastContent, {
    toastId: invite.inviteId,
    autoClose: 60_000,
    closeButton: false,
    className: c.partyToast,
  });
};

export const createNotificationToast = (notification: NotificationDto) => {
  let title = notification.title;
  let content: ReactNode = notification.content;

  const isFeedback =
    notification.entityType === NotificationDtoEntityTypeEnum.FEEDBACK;
  const isAchievement =
    notification.entityType === NotificationDtoEntityTypeEnum.ACHIEVEMENT;

  const ttl = new Date(notification.expiresAt).getTime() - Date.now();

  if (isAchievement) {
    const ak = notification.entityId as AchievementKey;
    title = `Достижение получено`;
    content = (
      <>
        <span className="gold">{AchievementMapping[ak]?.title || title}</span>:
        {AchievementMapping[ak]?.description || content}
      </>
    );
  }

  const showFeedback = async () => {
    const feedback = await getApi().feedback.feedbackControllerGetFeedback(
      notification.entityId,
    );
    if (!feedback || feedback.finished) return;

    __unsafeGetClientStore().notify.startFeedback(feedback);
  };

  const onAccept = async () => {
    // Acknowledge notification
    await getApi().notificationApi.notificationControllerAcknowledge(
      notification.id,
    );

    if (isFeedback) {
      await showFeedback();
    }
  };
  const onDecline = () => {
    getApi()
      .notificationApi.notificationControllerAcknowledge(notification.id)
      .then();
  };

  const Toast: React.FunctionComponent<ToastContentProps<unknown>> = (
    props,
  ) => (
    <GenericToast
      {...props}
      title={title}
      content={content}
      acceptText={"Хорошо"}
      onAccept={onAccept}
      onDecline={onDecline}
      declineText={isFeedback ? "Нет, спасибо" : undefined}
      {...props}
    />
  );

  // Forgive me
  toast(Toast as ToastContent, {
    toastId: notification.id,
    autoClose: ttl > 1000 * 60 ? false : Math.max(ttl, 5_000),
    pauseOnHover: false,
    pauseOnFocusLoss: false,
    closeButton: false,
    className: c.partyToast,
  });

  //
};

export const makeSimpleToast = (
  title: string,
  content: string,
  time: number,
) => {
  toast(<SimpleToast title={title} content={content} />, {
    autoClose: time,
    className: c.partyToast,
    closeButton: false,
  });
};

export const makeEnterQueueToast = (mode: MatchmakingMode, inQueue: number) => {
  toast(<PleaseGoQueueToast mode={mode} inQueue={inQueue} />, {
    autoClose: 60_000,
    className: c.partyToast,
    closeButton: false,
    data: {
      mode,
      inQueue,
    },
  });
};
