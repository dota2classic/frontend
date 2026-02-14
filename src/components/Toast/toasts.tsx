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
import { ForumUserEmbed } from "@/components/ForumUserEmbed";
import { handleException } from "@/util/handleException";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface NotificationConfig {
  title: ReactNode;
  content: ReactNode;
  acceptText?: ReactNode;
  declineText?: ReactNode;
  onAccept?: () => void | Promise<void>;
  onDecline?: () => void | Promise<void>;
}

type NotificationHandler = (
  notification: NotificationDto,
) => NotificationConfig | null;

// ============================================================================
// HELPERS
// ============================================================================

const doAcknowledge = (notification: NotificationDto) => {
  clientStoreManager.getRootStore()!.notify.acknowledge(notification.id).then();
};

const showFeedback = async (notification: NotificationDto) => {
  const feedback = await getApi().feedback.feedbackControllerGetFeedback(
    Number(notification.entityId),
  );
  if (!feedback || feedback.finished) return;
  clientStoreManager.getRootStore()!.notify.startFeedback(feedback);
};

export const createAcceptPartyToast = (
  invite: PartyInviteReceivedMessageS2C,
) => {
  const PartyToast: React.FC<ToastContentProps> = (props) => (
    <GenericToast
      {...props}
      title={`${invite.inviter.name}`}
      content={<Trans i18nKey="notifications.partyInviteContent" />}
      acceptText={<Trans i18nKey="notifications.actionAccept" />}
      onAccept={() =>
        clientStoreManager.getRootStore()!.queue.acceptParty(invite.inviteId)
      }
      declineText={<Trans i18nKey="notifications.actionDecline" />}
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

// ============================================================================
// NOTIFICATION HANDLERS
// ============================================================================

const handleReportCreated: NotificationHandler = (notification) => {
  const acknowledge = () => doAcknowledge(notification);
  return {
    title: <Trans i18nKey="notifications.reportCreatedTitle" />,
    content: (
      <>
        <Trans i18nKey="notifications.reportCreatedContent" />{" "}
        <PageLink
          link={
            AppRouter.forum.report.report(
              notification.entityId.replace("report_", ""),
            ).link
          }
          onClick={acknowledge}
        >
          <Trans i18nKey="notifications.reportCreatedLink" />
        </PageLink>
      </>
    ),
    acceptText: <Trans i18nKey="notifications.actionOk" />,
    onAccept: acknowledge,
  };
};

const handleAchievementComplete: NotificationHandler = (notification) => {
  const ak = notification.achievement!.key;
  const params = notification.params as {
    checkpoints: number[];
    progress: number;
  };
  const cp = (params.checkpoints as number[]).findLast(
    (t) => t <= params.progress,
  );

  return {
    title: <Trans i18nKey="notifications.achievementCompleteTitle" />,
    content: (
      <PageLink
        className={c.horizontal}
        link={AppRouter.players.player.achievements(notification.steamId).link}
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
    ),
    acceptText: <Trans i18nKey="notifications.actionOk" />,
    onAccept: () => doAcknowledge(notification),
  };
};

const handleFeedbackCreated: NotificationHandler = (notification) => {
  return {
    title: notification.feedback!.title,
    content: <Trans i18nKey="notifications.feedbackCreatedContent" />,
    acceptText: <Trans i18nKey="notifications.actionOk" />,
    declineText: <Trans i18nKey="notifications.actionNoThanks" />,
    onAccept: async () => {
      await doAcknowledge(notification);
      await showFeedback(notification);
    },
    onDecline: () => doAcknowledge(notification),
  };
};

const handlePlayerFeedback: NotificationHandler = (notification) => {
  const acknowledge = () => doAcknowledge(notification);
  return {
    title: <Trans i18nKey="notifications.playerFeedbackTitle" />,
    content: (
      <PageLink
        link={AppRouter.matches.match(notification.match!.id).link}
        onClick={acknowledge}
      >
        <Trans i18nKey="notifications.playerFeedbackLink" />
      </PageLink>
    ),
    acceptText: <Trans i18nKey="notifications.actionOk" />,
    onAccept: acknowledge,
  };
};

const handleItemDropped: NotificationHandler = (notification) => {
  return {
    title: <Trans i18nKey="notifications.itemDropped" />,
    content: <ItemDroppedNotification notification={notification} />,
    acceptText: <Trans i18nKey="notifications.actionOk" />,
    onAccept: () => doAcknowledge(notification),
  };
};

const handleTicketCreated: NotificationHandler = (notification) => {
  const acknowledge = () => doAcknowledge(notification);
  return {
    title: <Trans i18nKey="notifications.ticketCreatedTitle" />,
    content: (
      <>
        <Trans i18nKey="notifications.ticketCreatedContent" />{" "}
        <PageLink
          link={
            AppRouter.forum.ticket.ticket(notification.thread!.externalId).link
          }
          onClick={acknowledge}
        >
          <Trans i18nKey="notifications.ticketCreatedLink" />
        </PageLink>
      </>
    ),
    acceptText: <Trans i18nKey="notifications.actionOk" />,
    onAccept: acknowledge,
  };
};

const handleTicketNewMessage: NotificationHandler = (notification) => {
  const acknowledge = () => doAcknowledge(notification);
  const threadType = notification.thread!.externalId.split(
    "_",
    2,
  )[0] as ThreadType;
  const threadId = notification.thread!.externalId.split("_", 2)[1];

  return {
    title: <Trans i18nKey="notifications.ticketNewMessageTitle" />,
    content: (
      <PageLink
        link={AppRouter.forum.thread(threadId, threadType).link}
        onClick={acknowledge}
      >
        <Trans i18nKey="notifications.ticketNewMessageLink" />
      </PageLink>
    ),
    acceptText: <Trans i18nKey="notifications.actionOk" />,
    onAccept: acknowledge,
  };
};

const handleTradeOfferExpired: NotificationHandler = (notification) => {
  const acknowledge = () => doAcknowledge(notification);
  return {
    title: <Trans i18nKey="notifications.tradeOfferExpiredTitle" />,
    content: (
      <>
        <Trans i18nKey="notifications.tradeOfferExpiredContent" />{" "}
        <PageLink
          className="link"
          link={AppRouter.players.player.drops(notification.entityId).link}
          onClick={acknowledge}
        >
          <Trans i18nKey="notifications.tradeOfferExpiredLink" />
        </PageLink>
      </>
    ),
    acceptText: <Trans i18nKey="notifications.actionOk" />,
    onAccept: acknowledge,
  };
};

const handleTournamentReadyCheck: NotificationHandler = (notification) => {
  const acknowledge = () => doAcknowledge(notification);
  return {
    title: <Trans i18nKey="notifications.tournamentReadyCheckTitle" />,
    content: (
      <>
        <Trans i18nKey="notifications.tournamentReadyCheckContent" />
        <br />
        <PageLink
          className="link"
          link={
            AppRouter.tournament.tournament(
              (notification.params as { tournamentId: number }).tournamentId,
            ).link
          }
          onClick={acknowledge}
        >
          <Trans i18nKey="notifications.tournamentReadyCheckLink" />
        </PageLink>
      </>
    ),
    acceptText: <Trans i18nKey="notifications.actionOk" />,
    onAccept: acknowledge,
  };
};

const handleTournamentInvitationResolved: NotificationHandler = (
  notification,
) => {
  const p = notification.params as {
    steamId: string;
    accept: boolean;
  };
  return {
    title: <Trans i18nKey="notifications.tournamentInvitationResolvedTitle" />,
    content: (
      <>
        <ForumUserEmbed steamId={p.steamId} />{" "}
        <Trans
          i18nKey={
            p.accept
              ? "notifications.tournamentInvitationAccepted"
              : "notifications.tournamentInvitationDeclined"
          }
        />{" "}
        <Trans i18nKey="notifications.tournamentInvitationResolvedContent" />
      </>
    ),
    acceptText: <Trans i18nKey="notifications.actionOk" />,
    onAccept: () => doAcknowledge(notification),
  };
};

const handleTournamentRegistrationInvitation: NotificationHandler = (
  notification,
) => {
  const params = notification.params as {
    invitationId: string;
    tournamentId: number;
  };

  const onAccept = async () => {
    try {
      await doAcknowledge(notification);
      await getApi().tournament.tournamentControllerReplyToRegistrationInvitationR(
        params.tournamentId,
        {
          accept: true,
          id: params.invitationId,
        },
      );
    } catch (e) {
      await handleException(
        <Trans i18nKey="notifications.processingError" />,
        e,
      );
    }
  };

  const onDecline = async () => {
    try {
      await doAcknowledge(notification);
      await getApi().tournament.tournamentControllerReplyToRegistrationInvitationR(
        params.tournamentId,
        {
          accept: false,
          id: params.invitationId,
        },
      );
    } catch (e) {
      await handleException(
        <Trans i18nKey="notifications.processingError" />,
        e,
      );
    }
  };

  return {
    title: <Trans i18nKey="notifications.tournamentInvitationTitle" />,
    content: (
      <>
        <ForumUserEmbed steamId={notification.entityId} />{" "}
        <Trans i18nKey="notifications.tournamentInvitationContent" />
      </>
    ),
    acceptText: <Trans i18nKey="notifications.actionAccept" />,
    declineText: <Trans i18nKey="notifications.actionDecline" />,
    onAccept,
    onDecline,
  };
};

// ============================================================================
// NOTIFICATION HANDLER REGISTRY
// ============================================================================

const notificationHandlers: Partial<
  Record<NotificationType, NotificationHandler>
> = {
  [NotificationType.REPORTCREATED]: handleReportCreated,
  [NotificationType.ACHIEVEMENTCOMPLETE]: handleAchievementComplete,
  [NotificationType.FEEDBACKCREATED]: handleFeedbackCreated,
  [NotificationType.PLAYERFEEDBACK]: handlePlayerFeedback,
  [NotificationType.ITEMDROPPED]: handleItemDropped,
  [NotificationType.TICKETCREATED]: handleTicketCreated,
  [NotificationType.TICKETNEWMESSAGE]: handleTicketNewMessage,
  [NotificationType.TRADEOFFEREXPIRED]: handleTradeOfferExpired,
  [NotificationType.TOURNAMENTREADYCHECKSTARTED]: handleTournamentReadyCheck,
  [NotificationType.TOURNAMENTREGISTRATIONINVITATIONCREATED]:
    handleTournamentRegistrationInvitation,
  [NotificationType.TOURNAMENTREGISTRATIONINVITATIONRESOLVED]:
    handleTournamentInvitationResolved,
};

// ============================================================================
// MAIN NOTIFICATION HANDLER
// ============================================================================

export const handleNotification = (notification: NotificationDto) => {
  console.log(`Handle notification of type ${notification.notificationType}`);

  // Handle subscription purchased silently (no toast)
  if (
    notification.notificationType === NotificationType.SUBSCRIPTIONPURCHASED
  ) {
    clientStoreManager.getRootStore()!.claim.claimSubscription(notification);
    clientStoreManager.getRootStore()!.auth.forceRefreshToken().then();
    return;
  }

  // Get handler for this notification type
  const handler = notificationHandlers[notification.notificationType];
  if (!handler) {
    console.warn(
      `No handler for notification type: ${notification.notificationType}`,
    );
    return;
  }

  // Execute handler to get configuration
  const config = handler(notification);
  if (!config) return;

  // Render toast
  const ttl = new Date(notification.expiresAt).getTime() - Date.now();
  const Toast: React.FunctionComponent<ToastContentProps<unknown>> = (
    props,
  ) => <GenericToast {...props} {...config} />;

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
  title: ReactNode,
  content: string,
  time: number = 5000,
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
