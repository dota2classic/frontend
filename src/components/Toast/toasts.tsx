import { toast, ToastContent, ToastContentProps } from "react-toastify";
import c from "@/components/Toast/Toast.module.scss";
import React, { ReactNode } from "react";
import {
  AchievementKey,
  MatchmakingMode,
  NotificationDto,
  NotificationDtoEntityTypeEnum,
  NotificationType,
} from "@/api/back";
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

export const createNotificationToast = (notification: NotificationDto) => {
  let title = notification.title;
  let content: ReactNode = notification.content;

  const isFeedback =
    notification.entityType === NotificationDtoEntityTypeEnum.FEEDBACK;
  const isAchievement =
    notification.entityType === NotificationDtoEntityTypeEnum.ACHIEVEMENT;
  const isFeedbackTicket =
    notification.entityType === NotificationDtoEntityTypeEnum.FEEDBACKTICKET;

  const isPlayerFeedback =
    notification.notificationType === NotificationType.PLAYERFEEDBACK;

  const isReportBan =
    notification.notificationType === NotificationType.PLAYERREPORTBAN;

  const ttl = new Date(notification.expiresAt).getTime() - Date.now();

  const acknowledge = () => {
    getApi()
      .notificationApi.notificationControllerAcknowledge(notification.id)
      .then(() => toast.dismiss(notification.id));
  };

  if (isAchievement) {
    const ak = Number(notification.entityId) as AchievementKey;
    title = `Достижение получено`;
    content = (
      <>
        <span className="gold">{AchievementMapping[ak]?.title || title}</span>:{" "}
        {AchievementMapping[ak]?.description || content}
      </>
    );
  } else if (isFeedbackTicket) {
    if (notification.notificationType === NotificationType.TICKETCREATED) {
      title = `Создан тикет с твоей обратной связью`;
      content = (
        <>
          Отслеживать его можешь по{" "}
          <PageLink
            link={AppRouter.forum.ticket.ticket(notification.entityId).link}
            onClick={acknowledge}
          >
            ссылке
          </PageLink>
        </>
      );
    } else if (
      notification.notificationType === NotificationType.TICKETNEWMESSAGE
    ) {
      title = `Новое сообщение в твоем тикете!`;
      content = (
        <>
          <PageLink
            link={AppRouter.forum.ticket.ticket(notification.entityId).link}
            onClick={acknowledge}
          >
            Посмотреть новое сообщение
          </PageLink>
        </>
      );
    }
  } else if (isPlayerFeedback) {
    title = `Тебе оставили отзыв!`;
    content = (
      <>
        <PageLink
          link={AppRouter.matches.match(Number(notification.entityId)).link}
          onClick={acknowledge}
        >
          Оставить отзывы другим игрокам
        </PageLink>
      </>
    );
  } else if (isReportBan) {
    title = `Тебе временно запрещен поиск`;
    content = (
      <>
        В последнее время ты получил много жалоб и почти не получил похвал. В
        связи с этим система временно приостановила твой доступ к поиску игр.
        Если подобное поведение повторится, наказание станет более длительным.
      </>
    );
  } else if (
    notification.entityType === NotificationDtoEntityTypeEnum.REPORTTICKET
  ) {
    if (notification.notificationType === NotificationType.REPORTCREATED) {
      title = `Создана жалоба`;
      content = (
        <>
          Отслеживать ее можешь по{" "}
          <PageLink
            link={AppRouter.forum.report.report(notification.entityId).link}
            onClick={acknowledge}
          >
            ссылке
          </PageLink>
        </>
      );
    } else if (
      notification.notificationType === NotificationType.TICKETNEWMESSAGE
    ) {
      title = `Новое сообщение в твоей жалобе!`;
      content = (
        <>
          <PageLink
            link={AppRouter.forum.report.report(notification.entityId).link}
            onClick={acknowledge}
          >
            Посмотреть новое сообщение
          </PageLink>
        </>
      );
    }
  }

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

  console.log(ttl, "TTL?");

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
  variant: "simple" | "error" = "simple"
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
