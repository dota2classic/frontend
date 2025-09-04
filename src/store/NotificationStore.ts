import { action, makeObservable, observable, runInAction } from "mobx";
import { ReactNode } from "react";
import { HydratableStore } from "@/store/HydratableStore";
import { urlBase64ToUint8Array } from "@/util/urlBase64ToUint8Array";
import { getApi } from "@/api/hooks";
import { FeedbackDto, NotificationDto, SubscriptionDto } from "@/api/back";
import Queue from "queue";
import { createDateComparator } from "@/util/dates";
import { handleNotification, makeSimpleToast } from "@/components/Toast/toasts";
import { AppRouter } from "@/route";
import { toast } from "react-toastify";

export class PopupNotificationDto {
  constructor(
    public readonly text: ReactNode,
    public readonly id?: string,
  ) {}
}

export class NotificationStore implements HydratableStore<unknown> {
  public static readonly NOTIFICATION_LIFETIME = 60_000;

  @observable
  public permanentQueue: PopupNotificationDto[] = [];
  @observable
  public currentPendingNotification: PopupNotificationDto | undefined =
    undefined;

  @observable
  public isPushSupported: boolean = false;

  @observable
  public subscription: PushSubscription | undefined = undefined;

  @observable
  public registration: ServiceWorkerRegistration | undefined = undefined;

  @observable
  public currentFeedback: FeedbackDto | undefined = undefined;

  private queue!: Queue;

  constructor() {
    makeObservable(this);
    if (typeof window === "undefined") return;

    this.queue = new Queue({
      autostart: true,
      concurrency: 1,
    });

    if ("serviceWorker" in navigator && "PushManager" in window) {
      runInAction(() => {
        this.isPushSupported = true;
      });
      // For a good measure
      setTimeout(() => {
        this.registerServiceWorker();
      }, 1000);
    }

    this.fetchNotifications().then();

    // Here we should implement tasking?
  }

  private async fetchNotifications() {
    getApi()
      .notificationApi.notificationControllerGetNotifications()
      .then((notifications) =>
        runInAction(() => {
          notifications
            .sort(
              createDateComparator<NotificationDto>(
                (it) => new Date(it.createdAt),
              ),
            )
            .forEach(this.addNotification);
        }),
      );
  }

  @action
  public async registerServiceWorker() {
    const registration = await navigator.serviceWorker.register(
      `/service-worker.js`,
      {
        scope: "/",
        updateViaCache: "none",
      },
    );

    await registration.update();

    window.registration = registration;

    await runInAction(async () => {
      this.registration = registration;
    });

    this.setSubscription(
      (await registration.pushManager.getSubscription()) || undefined,
    );
  }

  public subscribeToPush = async () => {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      ),
    });
    this.setSubscription(sub);
  };

  public unsubscribe = async () => {
    if (!this.subscription) return;
    await this.subscription.unsubscribe();
    await getApi().notificationApi.notificationControllerUnsubscribe();

    runInAction(() => {
      this.subscription = undefined;
    });
  };

  private setSubscription(s: PushSubscription | undefined) {
    runInAction(() => (this.subscription = s));
    if (s) {
      getApi().notificationApi.notificationControllerSubscribe(
        s.toJSON() as SubscriptionDto,
      );
    }
  }

  @action
  public dequeue(id: string) {
    const idx = this.permanentQueue.findIndex((t) => t.id === id);
    if (idx !== -1) {
      this.permanentQueue.splice(idx, 1);
    }
  }

  @action
  public enqueueNotification(notif: PopupNotificationDto) {
    if (notif.id !== undefined) {
      this.permanentQueue.push(notif);
    } else {
      this.queue.push((callback) => {
        console.log("Start notification", callback);
        runInAction(() => {
          this.currentPendingNotification = notif;
        });

        setTimeout(() => {
          console.log("Finishing notification");
          runInAction(() => (this.currentPendingNotification = undefined));
          if (callback) {
            callback(undefined);
          }
        }, NotificationStore.NOTIFICATION_LIFETIME);
      });
    }
  }

  @action closeCurrent = () => {
    this.currentPendingNotification = undefined;
  };

  hydrate(): void {}

  @action startFeedback = (feedback: FeedbackDto) => {
    this.currentFeedback = feedback;
  };

  @action finishFeedback = async (feedback?: FeedbackDto) => {
    if (feedback) {
      const feedbackResponse =
        await getApi().feedback.feedbackControllerSubmitFeedbackResult(
          feedback.id,
          {
            comment: feedback.comment,
            options: feedback.options,
          },
        );
      makeSimpleToast(
        "Обратная связь сохранена",
        "Спасибо, что помогаешь стать нам лучше",
        10000,
      );

      if (feedbackResponse.ticketId) {
        AppRouter.forum.ticket.ticket(feedbackResponse.ticketId).open();
      }
    }
    this.currentFeedback = undefined;
  };

  @action addNotification = (notificationDto: NotificationDto) => {
    if (notificationDto.acknowledged) return;
    handleNotification(notificationDto);
  };

  acknowledge = async (notificationId: string) => {
    await getApi()
      .notificationApi.notificationControllerAcknowledge(notificationId)
      .then(() => toast.dismiss(notificationId));
  };
}
