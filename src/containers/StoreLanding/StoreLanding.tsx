import React, { useCallback, useState } from "react";
import { Button, BuySubscriptionModal, EmbedProps } from "@/components";
import { observer } from "mobx-react-lite";
import { createPortal } from "react-dom";
import { StoreLandingSlide } from "@/containers/StoreLanding/StoreLandingSlide";
import cx from "clsx";
import { TrajanPro } from "@/const/fonts";
import c from "./StoreLanding.module.scss";

export const StoreLanding = observer(() => {
  const [checkoutVisible, setCheckoutVisible] = useState(false);

  const startPayment = useCallback(() => {
    setCheckoutVisible(true);
  }, []);

  return (
    <>
      {checkoutVisible &&
        createPortal(
          <BuySubscriptionModal onClose={() => setCheckoutVisible(false)} />,
          document.body,
        )}
      <EmbedProps
        title={"dotaclassic plus"}
        description={"Страница подписки dotaclassic plus"}
      />
      {/*<div className={cx(c.root, NotoSans.className)}>*/}
      {/*<h1 className={cx(c.title, c.shinyText, TrajanPro.className)}>*/}
      {/*  DOTACLASSIC PLUS*/}
      {/*</h1>*/}
      {/*<h2 className={cx(c.subTitle, TrajanPro.className)}>*/}
      {/*  Для истинных ценителей классики*/}
      {/*</h2>*/}
      {/*<p className={c.description}>*/}
      {/*  Огромная поддержка в развитии старой доты - помогая проекту, ты*/}
      {/*  напрямую влияешь на повышение онлайна, качества игр и разработку*/}
      {/*  нового функционала.*/}
      {/*</p>*/}

      <Button
        onClick={startPayment}
        className={cx(TrajanPro.className, c.payButton)}
        mega
      >
        Подписаться на месяц 300p
      </Button>

      {/*<div className={cx(c.sectionHeader, TrajanPro.className)}>*/}
      {/*  <h2 className={c.shinyTextLight}>Кастомизация профиля</h2>*/}
      {/*</div>*/}
      {/*<div className={c.imageInfo}>*/}
      {/*  <p>*/}
      {/*    Декорация профиля на сайте - подбери идеальную шапку, иконку*/}
      {/*    подписчика и титул!*/}
      {/*  </p>*/}
      {/*  <img*/}
      {/*    src="https://cdn.dotaclassic.ru/public/upload/9d959f25afbff49333ff4cd49f0183d04c2def9b4690cd70e3da4ef12d55b40a.webp"*/}
      {/*    alt=""*/}
      {/*  />*/}
      {/*</div>*/}

      {/*<div className={cx(c.sectionHeader, TrajanPro.className)}>*/}
      {/*  <h2 className={c.shinyTextLight}>Похвала и разбан героя</h2>*/}
      {/*</div>*/}
      {/*<div className={cx(c.imageInfo)}>*/}
      {/*  <p>*/}
      {/*    Очень хотел поиграть на герое, а он как раз в бане? Ты можешь*/}
      {/*    разбанить одного героя для всех.*/}
      {/*  </p>*/}
      {/*  <img*/}
      {/*    src="https://cdn.dotaclassic.ru/public/upload/6ddab40d2e5ee22cea922abfba1eeee7d7f460d5dfe2dcdec40f03a9150dfa5c.webp"*/}
      {/*    alt=""*/}
      {/*  />*/}
      {/*</div>*/}
      <StoreLandingSlide
        image="/splash/mute.png"
        title="Блокировка"
        text="Больше не хочешь читать сообщения, получать инвайты или видеть чужие комменты в своём профиле? Блокируй игрока — и он исчезнет из твоего игрового пространства. Спокойствие гарантировано."
        imageOffset="0 20%"
      />
      <StoreLandingSlide
        image="/splash/dodge.png"
        title="Додж лист"
        text="Кажется, вы снова вместе? Не сегодня. Добавь игрока в додж-лист — и больше не окажетесь в одной команде. Устал от одних и тех же «героев матча»? Собери свой идеальный состав хотя бы с одной стороны экрана."
        imageOffset="0 20%"
        light
      />
      <StoreLandingSlide
        image="/splash/cm_lina.png"
        title="Похвалы в игре"
        text="Можно поддержать тиммейта за старательную игру — или тонко подколоть
        соперника за фейл. Всё как в актуальной версии. Добавили, чтобы и в
        классике было чуть больше эмоций."
      />
      <StoreLandingSlide
        image="/splash/recalibration.png"
        title="Перекалибровка"
        text="Один раз за сезон можно сбросить рейтинг до 2500 и пройти 10 калибровочных игр заново. Вдруг на этот раз система поймёт, кто тут настоящий боец за MMR?"
        imageOffset="0 40%"
      />
      <StoreLandingSlide
        image="/splash/lobby.png"
        title="Лобби"
        text="Собери друзей, выбери карту, включи (или выключи) ботов и решай сам, как будет проходить матч. Приватная игра — твои правила, твой ритм, твоя команда."
        imageOffset="0 40%"
      />

      <Button
        className={cx(TrajanPro.className, c.payButton)}
        mega
        onClick={startPayment}
      >
        Подписаться на месяц 300p
      </Button>
      {/*</div>*/}
    </>
  );
});
