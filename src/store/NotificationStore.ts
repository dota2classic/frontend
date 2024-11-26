import { action, makeObservable, observable, runInAction } from "mobx";
import { ReactNode } from "react";
import { HydratableStore } from "@/store/HydratableStore";
import { urlBase64ToUint8Array } from "@/util/math";
import { getApi } from "@/api/hooks";
import { SubscriptionDto } from "@/api/back";

export class NotificationDto {
  constructor(
    public readonly text: ReactNode,
    public readonly id?: string,
  ) {}
}

export class NotificationStore implements HydratableStore<unknown> {
  public static readonly NOTIFICATION_LIFETIME = 10_000;

  @observable
  public permanentQueue: NotificationDto[] = [];
  @observable
  public currentPendingNotification: NotificationDto | undefined = undefined;
  @observable
  private notificationQueue: NotificationDto[] = [];

  @observable
  public isPushSupported: boolean = false;

  @observable
  public subscription: PushSubscription | undefined = undefined;

  @observable
  public registration: ServiceWorkerRegistration | undefined = undefined;

  constructor() {
    makeObservable(this);
    if (typeof window !== "undefined") {
      setInterval(
        () => this.processQueue(),
        NotificationStore.NOTIFICATION_LIFETIME,
      );
    }
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window
    ) {
      runInAction(() => {
        this.isPushSupported = true;
      });
      // For a good measure
      setTimeout(() => {
        this.registerServiceWorker();
      }, 1000);
    }
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
  public enqueueNotification(notif: NotificationDto) {
    if (notif.id !== undefined) {
      this.permanentQueue.push(notif);
    } else {
      this.notificationQueue.push(notif);
      if (this.currentPendingNotification === undefined) this.processQueue();
    }
  }

  @action
  private processQueue() {
    this.currentPendingNotification = this.notificationQueue.shift();
  }

  @action closeCurrent = () => {
    this.currentPendingNotification = undefined;
  };

  hydrate(): void {}
}
