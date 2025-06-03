import React from "react";
import { Button, GenericModal } from "@/components";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { AppRouter } from "@/route";

export const PaidFeatureModal: React.FC = observer(({}) => {
  const { sub } = useStore();

  if (!sub.subscriptionVisible) return null;
  return (
    <GenericModal title={"Подписка dotaclassic plus"} onClose={sub.hide}>
      <p>
        Эта и многие другие функция доступна только подписчикам dotaclassic
        plus.
      </p>
      <div className={"nicerow"}>
        <Button mega small pageLink={AppRouter.store.index.link}>
          Интересно
        </Button>
        <Button small onClick={sub.hide}>
          Нет, спасибо
        </Button>
      </div>
    </GenericModal>
  );
});
