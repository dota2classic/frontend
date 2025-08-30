import { action, makeObservable, observable } from "mobx";
import {
  MarketItemDtoFromJSON,
  NotificationDto,
  NotificationType,
} from "@/api/back";
import { AppRouter, NextLinkProp } from "@/route";
import { ReactNode } from "react";
import cx from "clsx";
import { TranslationKey } from "@/TranslationKey";

export enum ClaimType {
  SUBSCRIPTION = "SUBSCRIPTION",
  ITEM_DROP = "ITEM_DROP",
}

interface ClaimSubscription {
  notificationId: string;
  type: ClaimType;
  title: ReactNode;
  item: {
    label: ReactNode;
    image: string;
    className?: string;
  };
  action: {
    label: TranslationKey;
    link: NextLinkProp;
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

  @action claimDroppedItem = (notification: NotificationDto) => {
    this.enqueue(notification);
  };

  @action
  private enqueue(notification: NotificationDto) {
    if (
      notification.notificationType === NotificationType.SUBSCRIPTIONPURCHASED
    ) {
      this.claimQueue.push({
        notificationId: notification.id,
        type: ClaimType.SUBSCRIPTION,
        title: "Подписка приобретена!",
        item: {
          image: "/maskot/present.png",
          label: "claim_container.dotaclassicPlus",
        },
        action: {
          label: "claim_container.customizeProfile",
          link: AppRouter.players.player.settings(notification.steamId).link,
        },
      } satisfies ClaimSubscription);
    } else {
      const marketItem = MarketItemDtoFromJSON(
        JSON.parse(notification.entityId),
      );

      this.claimQueue.push({
        notificationId: notification.id,
        type: ClaimType.ITEM_DROP,
        title: "Получена награда!",
        item: {
          image: marketItem.image,
          label: marketItem.marketHashName,
          className: cx("rarity", marketItem.rarity.toString()),
        },
        action: {
          label: "claim_container.claim",
          link: AppRouter.players.player.drops(notification.steamId).link,
        },
      } satisfies ClaimSubscription);
    }
  }

  @action pop = () => {
    this.claimQueue.splice(0, 1);
  };
}
