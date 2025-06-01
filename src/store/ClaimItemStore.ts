import { action, makeObservable, observable } from "mobx";
import { NotificationDto } from "@/api/back";

export enum ClaimType {
  SUBSCRIPTION = "SUBSCRIPTION",
}

interface ClaimSubscription {
  notificationId: string;
  type: ClaimType;
  item: {
    label: string;
    image: string;
  };
  action: {
    label: string;
  };
}

// type Claimable = ClaimSubscription;

export class ClaimItemStore {
  @observable
  claimQueue: ClaimSubscription[] = [];

  constructor() {
    makeObservable(this);
  }

  @action claimSubscription = (notification: NotificationDto) => {
    this.enqueue(notification);
  };

  @action
  private enqueue(notification: NotificationDto) {
    this.claimQueue.push({
      notificationId: notification.id,
      type: ClaimType.SUBSCRIPTION,
      item: {
        image: "/maskot/present.png",
        label: "dotaclassic plus",
      },
      action: {
        label: "Настроить профиль",
      },
    } satisfies ClaimSubscription);
  }

  @action pop = () => {
    this.claimQueue.splice(0, 1);
  };
}
