import { toast, ToastContent, ToastContentProps } from "react-toastify";
import c from "./Toast.module.scss";
import React, { ReactNode } from "react";
import {
  MatchmakingMode,
  NotificationDto,
  NotificationType,
  ThreadType,
} from "@/api/back";
import { GenericToast } from "./GenericToast";
import { PageLink } from "../PageLink";
import { getApi } from "@/api/hooks";
import { PartyInviteReceivedMessageS2C } from "@/store/queue/messages/s2c/party-invite-received-message.s2c";
import { AchievementMapping } from "../AchievementStatus";
import { PleaseGoQueueToast } from "./PleaseGoQueueToast";
import { SimpleToast } from "./SimpleToast";
import { AppRouter } from "@/route";
import { Trans } from "react-i18next";
import { clientStoreManager } from "@/store/ClientStoreManager";
import { ItemDroppedNotification } from "@/components/Toast/ItemDroppedNotification";

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
        clientStoreManager.getRootStore()!.queue.acceptParty(invite.inviteId)
      }
      declineText={"Отклонить"}
      onDecline={() =>
        clientStoreManager.getRootStore()!.queue.declineParty(invite.inviteId)
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
  if (
    notification.notificationType === NotificationType.SUBSCRIPTIONPURCHASED
  ) {
    clientStoreManager.getRootStore()!.claim.claimSubscription(notification);
    clientStoreManager.getRootStore()!.auth.forceRefreshToken().then();
    return;
  }

  // if (notification.notificationType === NotificationType.ITEMDROPPED) {
  //   clientStoreManager.getRootStore()!.claim.claimSubscription(notification);
  //   clientStoreManager.getRootStore()!.auth.forceRefreshToken().then();
  //   return;
  // }

  let title: ReactNode = notification.title;
  let content: ReactNode = notification.content;
  const ttl = new Date(notification.expiresAt).getTime() - Date.now();

  const isFeedback =
    notification.notificationType === NotificationType.FEEDBACKCREATED;

  const acknowledge = () => {
    clientStoreManager
      .getRootStore()!
      .notify.acknowledge(notification.id)
      .then();
  };

  const showFeedback = async () => {
    const feedback = await getApi().feedback.feedbackControllerGetFeedback(
      Number(notification.entityId),
    );
    if (!feedback || feedback.finished) return;

    clientStoreManager.getRootStore()!.notify.startFeedback(feedback);
  };

  const onAccept = async () => {
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
      const params = notification.params as {
        checkpoints: number[];
        progress: number;
      };
      const cp = (params.checkpoints as number[]).findLast(
        (t) => t <= params.progress,
      );
      content = (
        <PageLink
          className={c.horizontal}
          link={
            AppRouter.players.player.achievements(notification.steamId).link
          }
        >
          <img src={AchievementMapping[ak]?.img} alt="" />
          <div>
            <span className="gold">
              <Trans
                i18nKey={AchievementMapping[ak]?.title || notification.title}
              />
            </span>
            :{" "}
            <Trans
              i18nKey={
                AchievementMapping[ak]?.description || notification.content
              }
              components={{
                cp: <span className="gold">{cp}</span>,
              }}
            />
          </div>
        </PageLink>
      );
      break;
    case NotificationType.FEEDBACKCREATED:
      title = notification.feedback!.title;
      content = "Нам очень важно твое мнение";
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

    case NotificationType.ITEMDROPPED:
      title = <Trans i18nKey={"notifications.itemDropped"} />;
      content = <ItemDroppedNotification notification={notification} />;
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
      const threadType = notification.thread!.externalId.split(
        "_",
        2,
      )[0] as ThreadType;
      const threadId = notification.thread!.externalId.split("_", 2)[1];

      content = (
        <>
          <PageLink
            link={AppRouter.forum.thread(threadId, threadType).link}
            onClick={acknowledge}
          >
            Посмотреть новое сообщение
          </PageLink>
        </>
      );
      break;
    case NotificationType.TRADEOFFEREXPIRED:
      title = `Обмен предметами истек по времени!`;
      content = (
        <>
          Ты не принял обмен и он был отменен. Ты можешь получить свои предметы
          заново:{" "}
          <PageLink
            className="link"
            link={AppRouter.players.player.drops(notification.entityId).link}
            onClick={acknowledge}
          >
            Запросить обмен наград
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

export const makeLinkToast = (
  title: string,
  content: ReactNode,
  time: number,
) => {
  toast(<SimpleToast variant="simple" title={title} content={content} />, {
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
