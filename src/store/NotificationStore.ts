import { action, makeObservable, observable } from "mobx";
import { ReactNode } from "react";
import { HydratableStore } from "@/store/HydratableStore";

export class NotificationDto {
  constructor(
    public readonly text: ReactNode,
    public readonly id?: string,
  ) {}
}

export class NotificationStore implements HydratableStore<unknown> {
  public static readonly NOTIFICATION_LIFETIME = 3000;

  @observable
  public permanentQueue: NotificationDto[] = [];
  @observable
  public currentPendingNotification?: NotificationDto;
  @observable
  private notificationQueue: NotificationDto[] = [];

  constructor() {
    makeObservable(this);
    setInterval(
      () => this.processQueue(),
      NotificationStore.NOTIFICATION_LIFETIME,
    );
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
      if (this.currentPendingNotification === undefined)
        this.currentPendingNotification = notif;
    }
  }

  @action
  private processQueue() {
    this.currentPendingNotification = this.notificationQueue.shift();
  }

  hydrate(): void {}
}
