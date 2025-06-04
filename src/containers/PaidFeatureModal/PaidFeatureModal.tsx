import React from "react";
import { Button, GenericModal } from "@/components";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { AppRouter } from "@/route";
import c from "./PaidFeatureModal.module.scss";
import { NotoSans } from "@/const/notosans";
import cx from "clsx";
import { TrajanPro } from "@/const/fonts";

export const PaidFeatureModal: React.FC = observer(({}) => {
  const { sub } = useStore();

  if (!sub.subscriptionVisible) return null;
  return (
    <GenericModal
      className={cx(c.paywall, NotoSans.className)}
      title={"Подписка dotaclassic plus"}
      onClose={sub.hide}
      header={() => <img src="/paywall2.png" alt="" className={c.logo} />}
    >
      <h2 className={TrajanPro.className}>dotaclassic plus</h2>
      <ul>
        <li>Декорации для профиля</li>
        <li>Создание лобби</li>
        <li>Список избегаемых игроков</li>
        <li>Перекалибровка</li>
        <li>...и другие новые функции</li>
      </ul>
      <div className={c.buttons}>
        <Button onClick={sub.hide} mega pageLink={AppRouter.store.index.link}>
          Это интересно
        </Button>
      </div>
    </GenericModal>
  );
});
