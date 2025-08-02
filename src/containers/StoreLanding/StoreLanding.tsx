import React, { useCallback } from "react";
import { BuySubscriptionModal, ClientPortal, EmbedProps } from "@/components";
import { observer } from "mobx-react-lite";
import { StoreLandingSlide } from "@/containers/StoreLanding/StoreLandingSlide";
import { SubscriptionProductDto } from "@/api/back";
import { useRouter } from "next/router";

interface Props {
  products: SubscriptionProductDto[];
}
export const StoreLanding = observer(({ products }: Props) => {
  const router = useRouter();

  const startPayment = useCallback(() => {
    return router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        checkout: "true",
      },
    });
  }, [router]);

  const endPayment = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { checkout, ...rest } = router.query;
    return router.push({
      pathname: router.pathname,
      query: {
        ...rest,
      },
    });
  }, [router]);

  const isCheckout = router.query["checkout"] === "true";

  return (
    <>
      <ClientPortal visible={isCheckout}>
        <BuySubscriptionModal
          products={products}
          onClose={endPayment}
          onPurchase={(product, steamId) => {
            window.open(
              `https://t.me/dotaclassic_payments_bot?start=${steamId}`,
              "__blank",
            );
          }}
        />
      </ClientPortal>

      <EmbedProps
        title={"dotaclassic plus"}
        description={"Страница подписки dotaclassic plus"}
      />
      <StoreLandingSlide
        heading="h1"
        image="/splash/subscription.webp"
        title="dotaclassic plus"
        text="Ты помогаешь развивать старую доту: растёт онлайн, улучшаются матчи, появляется новый функционал. А ещё получаешь приятные привилегии и эксклюзивные фичи — в знак благодарности за поддержку."
        onPurchase={startPayment}
      />
      <StoreLandingSlide
        heading="h2"
        image="/splash/decoration.webp"
        title="Декорации профиля"
        text="Выбирай из множества стилей, рамок и эффектов, чтобы подчеркнуть свой характер и выделиться среди других. Пусть твой профиль говорит за тебя даже без слов."
      />
      <StoreLandingSlide
        heading="h2"
        image="/splash/dodge.webp"
        title="Додж лист"
        text="Кажется, вы снова вместе? Не сегодня. Добавь игрока в додж-лист — и больше не окажетесь в одной команде. Устал от одних и тех же «героев матча»? Собери свой идеальный состав хотя бы с одной стороны экрана."
        light
      />
      <StoreLandingSlide
        heading="h2"
        image="/splash/unban.webp"
        title="Разбан героя"
        text="Забанили героя? Это не повод отказываться от любимого персонажа. Подписчики dotaclassic plus могут выбирать запрещенных героев."
      />
      <StoreLandingSlide
        heading="h2"
        image="/splash/cm_lina.webp"
        title="Похвалы в игре"
        text="Можно поддержать тиммейта за старательную игру — или тонко подколоть
        соперника за фейл. Всё как в актуальной версии. Добавили, чтобы и в
        классике было чуть больше эмоций."
      />
      <StoreLandingSlide
        heading="h2"
        image="/splash/mute.webp"
        title="Блокировка"
        text="Больше не хочешь читать сообщения, получать инвайты или видеть чужие комменты в своём профиле? Блокируй игрока — и он исчезнет из твоего игрового пространства. Спокойствие гарантировано."
      />
      <StoreLandingSlide
        heading="h2"
        image="/splash/lobby.webp"
        title="Лобби"
        text="Собери друзей, выбери карту, включи (или выключи) ботов и решай сам, как будет проходить матч. Приватная игра — твои правила, твой ритм, твоя команда."
      />
      <StoreLandingSlide
        heading="h2"
        image="/splash/recalibration.webp"
        title="Перекалибровка"
        text="Один раз за сезон можно сбросить рейтинг до стартового и пройти 10 калибровочных игр заново. Вдруг на этот раз система поймёт, кто тут настоящий боец за MMR?"
        onPurchase={startPayment}
      />
    </>
  );
});
