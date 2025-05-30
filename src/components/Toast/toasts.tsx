import { toast, ToastContent, ToastContentProps } from "react-toastify";
import c from "@/components/Toast/Toast.module.scss";
import React, { ReactNode } from "react";
import { MatchmakingMode, NotificationDto, NotificationType } from "@/api/back";
import { GenericToast, PageLink } from "@/components";
import { getApi } from "@/api/hooks";
import { __unsafeGetClientStore } from "@/store";
import { PartyInviteReceivedMessageS2C } from "@/store/queue/messages/s2c/party-invite-received-message.s2c";
import { AchievementMapping } from "@/components/AchievementStatus/achievement-mapping";
import { PleaseGoQueueToast } from "@/components/Toast/PleaseGoQueueToast";
import { SimpleToast } from "@/components/Toast/SimpleToast";
import { AppRouter } from "@/route";

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

export const handleNotification = (notification: NotificationDto) => {
  let title: ReactNode = notification.title;
  let content: ReactNode = notification.content;
  const ttl = new Date(notification.expiresAt).getTime() - Date.now();

  const isFeedback =
    notification.notificationType === NotificationType.FEEDBACKCREATED;

  const acknowledge = () => {
    getApi()
      .notificationApi.notificationControllerAcknowledge(notification.id)
      .then(() => toast.dismiss(notification.id));
  };

  const showFeedback = async () => {
    const feedback = await getApi().feedback.feedbackControllerGetFeedback(
      Number(notification.entityId),
    );
    if (!feedback || feedback.finished) return;

    __unsafeGetClientStore().notify.startFeedback(feedback);
  };

  const onAccept = async () => {
    // Acknowledge notification
    await acknowledge();

    if (isFeedback) {
      await showFeedback();
    }
  };

  const onDecline = () => {
    acknowledge();
  };

  switch (notification.notificationType) {
    case NotificationType.REPORTCREATED:
      title = "Жалоба создана";
      content = (
        <>
          Отслеживать ее можешь по{" "}
          <PageLink
            link={
              AppRouter.forum.report.report(
                notification.entityId.replace("report_", ""),
              ).link
            }
            onClick={acknowledge}
          >
            ссылке
          </PageLink>
        </>
      );
      break;
    case NotificationType.ACHIEVEMENTCOMPLETE:
      const ak = notification.achievement!.key;
      title = `Достижение получено`;
      content = (
        <>
          <span className="gold">{AchievementMapping[ak]?.title || title}</span>
          : {AchievementMapping[ak]?.description || content}
        </>
      );
      break;
    case NotificationType.FEEDBACKCREATED:
      title = notification.feedback!.title;
      content = "Расскажи, что пошло не по плану";
      break;
    case NotificationType.PLAYERFEEDBACK:
      title = `Тебе оставили отзыв!`;
      content = (
        <>
          <PageLink
            link={AppRouter.matches.match(notification.match!.id).link}
            onClick={acknowledge}
          >
            Оставить отзывы другим игрокам
          </PageLink>
        </>
      );
      break;
    case NotificationType.PLAYERREPORTBAN:
      // TODO: reuse
      break;
    case NotificationType.TICKETCREATED:
      title = `Создан тикет с твоей обратной связью`;
      content = (
        <>
          Отслеживать его можешь по{" "}
          <PageLink
            link={
              AppRouter.forum.ticket.ticket(notification.thread!.externalId)
                .link
            }
            onClick={acknowledge}
          >
            ссылке
          </PageLink>
        </>
      );
      break;
    case NotificationType.TICKETNEWMESSAGE:
      title = `Новое сообщение в твоем тикете!`;
      content = (
        <>
          <PageLink
            link={
              AppRouter.forum.ticket.ticket(notification.thread!.externalId)
                .link
            }
            onClick={acknowledge}
          >
            Посмотреть новое сообщение
          </PageLink>
        </>
      );
      break;
  }

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
};

export const makeSimpleToast = (
  title: string,
  content: string,
  time: number,
  variant: "simple" | "error" = "simple",
) => {
  toast(<SimpleToast variant={variant} title={title} content={content} />, {
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
